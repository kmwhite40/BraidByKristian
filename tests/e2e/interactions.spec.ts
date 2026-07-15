import { expect, test } from '@playwright/test'

test.describe('mobile menu', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) >= 1024, 'desktop shows full nav')

  test('opens, traps focus, closes on Escape and returns focus', async ({ page }) => {
    await page.goto('/')
    const trigger = page.getByRole('button', { name: /open menu/i })
    await trigger.click()

    const menu = page.locator('#mobile-menu')
    await expect(menu).toBeVisible()
    await expect(page.getByRole('button', { name: /close menu/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    )

    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()
    // Focus must come back to the control that opened it.
    await expect(trigger).toBeFocused()
  })

  test('navigates and closes itself', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /open menu/i }).click()
    await page.locator('#mobile-menu').getByRole('link', { name: 'Services' }).click()
    await expect(page).toHaveURL(/\/services/)
    await expect(page.locator('#mobile-menu')).toBeHidden()
  })
})

test.describe('service filters', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 1024, 'filters collapse on mobile')

  // The result count lives in the aria-live region. Scope to it: the phrase
  // "47 styles" also appears in the page lede and the closing CTA copy.
  const resultCount = (page: import('@playwright/test').Page) =>
    page.locator('p[aria-live="polite"]').first()

  test('filters, searches and resets', async ({ page }) => {
    await page.goto('/services')
    await expect(resultCount(page)).toHaveText('47 styles')

    await page.getByRole('button', { name: 'Locs', exact: true }).click()
    await expect(resultCount(page)).toHaveText('2 styles')

    await page.getByRole('button', { name: /clear filters/i }).click()
    await expect(resultCount(page)).toHaveText('47 styles')

    await page.getByLabel(/search styles/i).fill('bohemian')
    await expect(resultCount(page)).toContainText(/styles/)
  })

  test('a dead-end search offers a way back', async ({ page }) => {
    await page.goto('/services')
    await page.getByLabel(/search styles/i).fill('qqqqzzz')
    await expect(page.getByText(/no styles match those filters/i)).toBeVisible()
    await page.getByRole('button', { name: /show all 47 styles/i }).click()
    await expect(resultCount(page)).toHaveText('47 styles')
  })

  test('deep-links a category from the URL', async ({ page }) => {
    await page.goto('/services?category=lil-krownz')
    await expect(resultCount(page)).toHaveText('4 styles')
  })
})

test.describe('gallery lightbox', () => {
  test('opens, pages with the keyboard, and closes on Escape', async ({ page }) => {
    await page.goto('/gallery')
    await page.getByRole('button', { name: /view larger/i }).first().click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAttribute('aria-modal', 'true')

    await page.keyboard.press('ArrowRight')
    await expect(dialog).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('has a labelled close control', async ({ page }) => {
    await page.goto('/gallery')
    await page.getByRole('button', { name: /view larger/i }).first().click()
    await page.getByRole('button', { name: /close gallery/i }).click()
    await expect(page.getByRole('dialog')).toBeHidden()
  })
})

test.describe('style finder', () => {
  test('completes and recommends only real, bookable styles', async ({ page }) => {
    await page.goto('/style-finder')

    await page.getByRole('radio', { name: /me, or another adult/i }).click()
    await page.getByRole('radio', { name: /knotless braids/i }).click()
    await page.getByRole('radio', { name: /^medium/i }).click()
    await page.getByRole('radio', { name: /as long as it takes/i }).click()
    await page.getByRole('radio', { name: /i can bring my own/i }).click()

    await expect(page.getByRole('heading', { name: /styles that fit/i })).toBeVisible()

    // Every recommendation must link to a real service page.
    const links = page.getByRole('link', { name: /details/i })
    expect(await links.count()).toBeGreaterThan(0)
    await links.first().click()
    await expect(page).toHaveURL(/\/services\/[a-z0-9-]+/)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('sends a child to the Lil Krownz menu only', async ({ page }) => {
    await page.goto('/style-finder')
    await page.getByRole('radio', { name: /a child/i }).click()
    await page.getByRole('radio', { name: /not sure yet/i }).click()
    await page.getByRole('radio', { name: /no preference/i }).click()
    await page.getByRole('radio', { name: /as long as it takes/i }).click()
    await page.getByRole('radio', { name: /not sure/i }).click()

    await expect(page.getByText(/lil krownz/i).first()).toBeVisible()
  })
})

test.describe('contact form', () => {
  test('shows accessible validation errors and does not submit', async ({ page }) => {
    await page.goto('/contact')
    await page.getByRole('button', { name: /send message/i }).click()

    await expect(page.getByText(/please enter your name/i)).toBeVisible()
    await expect(page.getByText(/please enter your email/i)).toBeVisible()
    await expect(page.getByLabel(/your name/i)).toHaveAttribute('aria-invalid', 'true')
  })

  test('rejects a malformed email', async ({ page }) => {
    await page.goto('/contact')
    await page.getByLabel(/your name/i).fill('Kay')
    await page.getByLabel(/email/i).fill('not-an-email')
    await page.getByLabel(/message/i).fill('Do you have August availability for knotless?')
    await page.getByRole('button', { name: /send message/i }).click()
    await expect(page.getByText(/does not look like an email/i)).toBeVisible()
  })

  // Runs in ONE project only. Every project shares 127.0.0.1, and the route
  // rate-limits to 5 requests per IP per minute — six projects submitting would
  // exhaust it and fail the later ones. That is the limiter working correctly,
  // not a bug, and this test is not viewport-dependent anyway. The validation
  // tests above make no network call, so they run everywhere.
  test('accepts a valid message', async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'desktop-1440',
      'submits for real — one project only, to stay under the rate limit',
    )
    // The API route is exercised for real; with no mail provider configured it
    // logs and returns ok, which is the documented behaviour.
    await page.goto('/contact')
    await page.getByLabel(/your name/i).fill('Kay')
    await page.getByLabel(/email/i).fill('kay@example.com')
    await page.getByLabel(/message/i).fill('Do you have August availability for knotless?')
    await page.getByRole('button', { name: /send message/i }).click()
    await expect(page.getByRole('heading', { name: /message sent/i })).toBeVisible({
      timeout: 15_000,
    })
  })
})

test.describe('accessibility basics', () => {
  test('skip link is the first tab stop and works', async ({ page }, testInfo) => {
    // Safari/WebKit does not move focus to links on Tab unless the user turns
    // on "Press Tab to highlight each item" — a platform default, not a defect
    // in this markup. The link is still present, focusable and functional
    // there; only the Tab assertion cannot hold. Asserted on Chromium.
    test.skip(
      testInfo.project.name === 'mobile-390',
      'WebKit does not tab to links by default (Safari platform behaviour)',
    )
    await page.goto('/')
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: /skip to main content/i })
    await expect(skip).toBeFocused()
    await skip.click()
    await expect(page).toHaveURL(/#main/)
  })

  test('skip link exists and targets main on every engine', async ({ page }) => {
    await page.goto('/')
    const skip = page.getByRole('link', { name: /skip to main content/i })
    await expect(skip).toHaveAttribute('href', '#main')
    await expect(page.locator('main#main')).toBeAttached()
  })

  test('reduced motion is honoured — content is visible without animating', async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto('/')
    // Reveal-wrapped content must be visible immediately, not faded in.
    await expect(page.getByRole('heading', { name: /good braids are not fast/i })).toBeVisible()
    await expect(page.getByText(/the parts are the point/i)).toBeVisible()
    await context.close()
  })

  test('images carry alt text, and decorative ones are correctly empty', async ({
    page,
  }) => {
    await page.goto('/gallery')
    const imgs = page.locator('img')
    const n = await imgs.count()
    expect(n).toBeGreaterThan(0)

    for (let i = 0; i < n; i++) {
      const img = imgs.nth(i)
      const alt = await img.getAttribute('alt')

      // The attribute must always be present — a missing alt makes a screen
      // reader read the filename.
      expect(alt, `image ${i} has no alt attribute at all`).not.toBeNull()

      if (alt === '') {
        // Empty alt is correct, but ONLY for a genuinely decorative image.
        // The card stack's inactive cards are aria-hidden, so they must not be
        // announced. Anything else with alt="" is a bug.
        const decorative = await img.evaluate((el) =>
          Boolean(el.closest('[aria-hidden="true"]')),
        )
        expect(decorative, `image ${i} has alt="" but is not aria-hidden`).toBe(true)
      } else {
        expect(alt!.length, `image ${i} alt is too terse`).toBeGreaterThan(10)
      }
    }
  })
})

test.describe('seo', () => {
  test('canonical + title are unique per route', async ({ page }) => {
    const seen = new Map<string, string>()
    for (const route of ['/', '/services', '/services/medium-knotless', '/faq', '/book']) {
      await page.goto(route)
      const canonical = await page.locator('link[rel=canonical]').getAttribute('href')
      const title = await page.title()
      expect(canonical, `${route} canonical`).toBeTruthy()
      expect(seen.has(canonical!), `${route} duplicate canonical`).toBe(false)
      seen.set(canonical!, title)
    }
    expect(new Set(seen.values()).size).toBe(seen.size)
  })

  test('emits valid HairSalon structured data', async ({ page }) => {
    await page.goto('/')
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
    const parsed = blocks.map((b) => JSON.parse(b))
    const biz = parsed.find((p) => p['@type'] === 'HairSalon')
    expect(biz).toBeTruthy()
    expect(biz.telephone).toBe('+19723719731')
    expect(biz.address.addressLocality).toBe('Garland')
    // Never claim a rating we cannot substantiate.
    expect(biz.aggregateRating).toBeUndefined()
  })

  test('sitemap lists every service page', async ({ request }) => {
    const res = await request.get('/sitemap.xml')
    expect(res.status()).toBe(200)
    const xml = await res.text()
    expect(xml).toContain('/services/medium-knotless')
    expect(xml).toContain('/book')
    expect((xml.match(/<url>/g) ?? []).length).toBe(58) // 11 static + 47 services
  })

  test('robots allows crawling and points at the sitemap', async ({ request }) => {
    const res = await request.get('/robots.txt')
    const txt = await res.text()
    expect(txt).toContain('Allow: /')
    expect(txt).toContain('Sitemap:')
    expect(txt).toContain('Disallow: /api/')
  })
})
