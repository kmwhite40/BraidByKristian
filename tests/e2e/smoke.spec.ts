import { expect, test } from '@playwright/test'

const ROUTES = [
  '/',
  '/services',
  '/services/medium-knotless',
  '/gallery',
  '/about',
  '/book',
  '/policies',
  '/faq',
  '/contact',
  '/privacy',
  '/accessibility',
  '/style-finder',
]

test.describe('routes', () => {
  for (const route of ROUTES) {
    test(`${route} renders with one h1 and no console errors`, async ({ page }) => {
      const errors: string[] = []
      page.on('console', (m) => {
        if (m.type() === 'error') errors.push(m.text())
      })
      page.on('pageerror', (e) => errors.push(e.message))

      const res = await page.goto(route)
      expect(res?.status(), `${route} status`).toBe(200)

      // Exactly one h1 per page — the single most common heading-order bug.
      await expect(page.locator('h1')).toHaveCount(1)

      // Nothing should overflow horizontally at any viewport.
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      )
      expect(overflow, `${route} scrolls horizontally`).toBe(false)

      expect(errors, `${route} console errors`).toEqual([])
    })
  }

  test('unknown route renders the custom 404', async ({ page }) => {
    const res = await page.goto('/definitely-not-a-page')
    expect(res?.status()).toBe(404)
    await expect(page.getByRole('heading', { name: /this one.s not here/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /browse styles/i })).toBeVisible()
  })
})

const SCHEDULER = 'https://braidsbykristian.as.me/schedule/b36fc416'

/**
 * `booking.mode` is 'external': every Book CTA goes straight to Kristian's
 * Acuity scheduler rather than to /book. These assert the href rather than
 * following it — clicking would navigate off-site to a live third party, which
 * would make the suite slow, flaky and dependent on Acuity being up.
 */
test.describe('booking links', () => {
  test('header book CTA points at the live scheduler', async ({ page, isMobile }) => {
    await page.goto('/')
    if (isMobile) {
      await page.getByRole('button', { name: /open menu/i }).click()
    }
    const cta = page.getByRole('link', { name: /^book/i }).first()
    await expect(cta).toHaveAttribute('href', new RegExp(SCHEDULER.replace(/\//g, '\\/')))
    await expect(cta).toHaveAttribute('target', '_blank')
    await expect(cta).toHaveAttribute('rel', /noopener/)
  })

  test('a service CTA deep-links the scheduler to that exact style', async ({ page }) => {
    await page.goto('/services/medium-knotless')
    // 75443741 is Medium Knotless's Acuity appointmentType. Without it the
    // client lands on the full 47-item menu.
    await expect(page.getByRole('link', { name: /book this style/i })).toHaveAttribute(
      'href',
      `${SCHEDULER}?appointmentType=75443741`,
    )
  })

  test('every service page books its own appointmentType', async ({ page }) => {
    const cases: [string, number][] = [
      ['freestyle', 75584906],
      ['braid-removal', 81228932],
      ['natural-hair-box-braids', 75445496],
    ]
    for (const [slug, id] of cases) {
      await page.goto(`/services/${slug}`)
      await expect(
        page.getByRole('link', { name: /book this style/i }),
        slug,
      ).toHaveAttribute('href', `${SCHEDULER}?appointmentType=${id}`)
    }
  })

  test('/book still works as a fallback and is still reachable', async ({ page }) => {
    // The prep-gated embed remains — the policies and accessibility pages link
    // to it, and flipping booking.mode back to 'embed' must keep working.
    await page.goto('/book')
    await expect(page.getByRole('heading', { name: /save your seat/i })).toBeVisible()
  })
})

test.describe('scheduler', () => {
  test('the calendar is gated on the prep acknowledgement, then embeds', async ({ page }) => {
    await page.goto('/book?style=medium-knotless')

    // Gate first — no iframe until acknowledged.
    await expect(page.locator('iframe')).toHaveCount(0)
    await expect(page.getByText(/two requirements, then the calendar/i)).toBeVisible()

    await page.locator('input[type=checkbox]').click()

    const frame = page.locator('iframe')
    await expect(frame).toHaveCount(1)
    // Pinned to Acuity, and carrying the appointmentType deep link.
    await expect(frame).toHaveAttribute('src', /app\.acuityscheduling\.com/)
    await expect(frame).toHaveAttribute('src', /appointmentType=75443741/)
    // Named, so it is announced and listed by screen readers.
    await expect(frame).toHaveAttribute('title', /Medium Knotless/i)
  })

  test('offers a fallback link out to the secure Acuity page', async ({ page }) => {
    await page.goto('/book')
    await page.locator('input[type=checkbox]').click()
    const fallback = page.getByRole('link', { name: /open the secure booking page/i })
    await expect(fallback).toHaveAttribute('href', /braidsbykristian\.as\.me/)
    await expect(fallback).toHaveAttribute('target', '_blank')
    await expect(fallback).toHaveAttribute('rel', /noopener/)
  })

  test('an unknown style falls back to the full menu instead of breaking', async ({ page }) => {
    await page.goto('/book?style=not-a-real-style')
    await expect(page.getByText(/not one we recognise/i)).toBeVisible()
    await page.locator('input[type=checkbox]').click()
    await expect(page.locator('iframe')).toHaveAttribute('src', /owner=35089723/)
  })
})
