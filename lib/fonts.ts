import { Bodoni_Moda, Jost } from 'next/font/google'

/**
 * Both families are self-hosted by `next/font` at build time: no runtime request
 * to Google, no render-blocking stylesheet, and `font-display: swap` plus an
 * auto-generated size-adjusted fallback so swapping does not shift layout.
 *
 * Bodoni Moda — a high-contrast Didone. Chosen because Kristian's existing
 * flyers already set every display line ("HAIR STYLIST", "BOOKING", "THANK YOU")
 * in a condensed high-contrast serif. This is the closest open-licensed match,
 * and its italic carries the "by kristian" half of the wordmark.
 *
 * Jost — a geometric sans in the Futura lineage, matching the flyers' body and
 * the letterspaced "Based in Garland, TX" treatment.
 */
export const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bodoni',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  fallback: ['Didot', 'Georgia', 'serif'],
})

export const jost = Jost({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jost',
  weight: ['300', '400', '500', '600'],
  fallback: ['system-ui', 'sans-serif'],
})

export const fontVariables = `${bodoni.variable} ${jost.variable}`
