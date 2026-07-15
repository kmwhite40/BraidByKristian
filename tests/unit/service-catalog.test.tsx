import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ServiceCatalog } from '@/components/services/service-catalog'
import { ServiceCard } from '@/components/ui/service-card'
import { categories, services, getService } from '@/lib/content'

function renderCatalog() {
  return render(<ServiceCatalog services={services} categories={categories} />)
}

describe('ServiceCard', () => {
  it('shows the price, duration and a working book link', () => {
    const s = getService('medium-knotless')!
    render(<ServiceCard service={s} />)

    expect(screen.getByText('$155')).toBeInTheDocument()
    expect(screen.getByText('6 hr')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /details/i })).toHaveAttribute(
      'href',
      '/services/medium-knotless',
    )
  })

  it('books straight into the scheduler, deep-linked to this exact style', () => {
    // booking.mode is 'external': Book CTAs go to Acuity, not to /book.
    const s = getService('medium-knotless')!
    render(<ServiceCard service={s} />)

    const book = screen.getByRole('link', { name: /^book/i })
    // The appointmentType is what preselects the style — a bare scheduler link
    // would dump the client on the full 47-item menu.
    expect(book).toHaveAttribute(
      'href',
      `https://braidsbykristian.as.me/schedule/b36fc416?appointmentType=${s.id}`,
    )
    // Cross-origin: without rel=noopener the opened page can reach window.opener.
    expect(book).toHaveAttribute('target', '_blank')
    expect(book).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('says "Quoted" instead of "$0" for the freestyle service', () => {
    render(<ServiceCard service={getService('freestyle')!} />)
    expect(screen.getByText('Quoted')).toBeInTheDocument()
    expect(screen.queryByText('$0')).not.toBeInTheDocument()
  })

  it('stays silent about hair when the scheduler does not say', () => {
    const unspecified = services.find((s) => s.hairProvidedBy === 'unspecified')!
    render(<ServiceCard service={unspecified} />)
    expect(screen.queryByText(/you bring the braiding hair/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/no added hair/i)).not.toBeInTheDocument()
  })

  it('says who brings the hair when the scheduler proves it', () => {
    render(<ServiceCard service={getService('medium-knotless')!} />)
    expect(screen.getByText(/you bring the braiding hair/i)).toBeInTheDocument()
  })
})

describe('ServiceCatalog', () => {
  it('renders the whole catalog by default', () => {
    renderCatalog()
    expect(screen.getByText('47 styles')).toBeInTheDocument()
  })

  it('filters by category', async () => {
    const user = userEvent.setup()
    renderCatalog()

    await user.click(screen.getByRole('button', { name: /^locs$/i, pressed: false }))

    // Locs has exactly 2 services in the real catalog.
    expect(screen.getByText('2 styles')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /loc re-twist/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /^medium knotless$/i })).not.toBeInTheDocument()
  })

  it('searches by name', async () => {
    const user = userEvent.setup()
    renderCatalog()

    await user.type(screen.getByLabelText(/search styles/i), 'senegalese')

    expect(screen.getByText('2 styles')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /small senegalese twist/i }),
    ).toBeInTheDocument()
  })

  it('sorts by price, cheapest first', async () => {
    const user = userEvent.setup()
    renderCatalog()

    await user.selectOptions(screen.getByLabelText(/sort styles/i), 'price-asc')

    const headings = screen.getAllByRole('heading', { level: 3 })
    // $75 Natural Hair 2 to 4 Straight Back Cornrow is the cheapest real service.
    expect(headings[0]).toHaveTextContent(/natural hair 2 to 4 straight back cornrow/i)
  })

  it('sorts by longest appointment', async () => {
    const user = userEvent.setup()
    renderCatalog()

    await user.selectOptions(screen.getByLabelText(/sort styles/i), 'duration-desc')

    const headings = screen.getAllByRole('heading', { level: 3 })
    // Extra Small Bora Bora is 9h30 — the longest sit on the menu.
    expect(headings[0]).toHaveTextContent(/extra small bora bora/i)
  })

  it('filters to no-added-hair styles', async () => {
    const user = userEvent.setup()
    renderCatalog()

    await user.click(screen.getByRole('button', { name: /no added hair/i }))

    // All five Natural Hair services, and nothing else.
    expect(screen.getByText('5 styles')).toBeInTheDocument()
  })

  it('offers a way out of an empty result instead of dead-ending', async () => {
    const user = userEvent.setup()
    renderCatalog()

    await user.type(screen.getByLabelText(/search styles/i), 'zzzznotathing')

    expect(screen.getByText(/no styles match those filters/i)).toBeInTheDocument()
    const reset = screen.getByRole('button', { name: /show all 47 styles/i })
    await user.click(reset)
    expect(screen.getByText('47 styles')).toBeInTheDocument()
  })

  it('announces the result count to screen readers', async () => {
    const user = userEvent.setup()
    const { container } = renderCatalog()

    await user.click(screen.getByRole('button', { name: /^locs$/i, pressed: false }))

    const live = container.querySelector('[aria-live="polite"]')
    expect(live).toBeTruthy()
    expect(within(live as HTMLElement).getByText(/2 styles/i)).toBeInTheDocument()
  })
})
