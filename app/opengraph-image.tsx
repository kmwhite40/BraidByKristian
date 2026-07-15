import { ImageResponse } from 'next/og'
import { site } from '@/lib/content/site'

/**
 * The social card, generated at build time.
 *
 * Typographic rather than photographic: it renders reliably at any size, needs
 * no photo we do not have the rights to, and echoes the wordmark. Uses system
 * fonts via ImageResponse rather than shipping a font binary for one image.
 */
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = `${site.name} — protective styling in ${site.contact.address.city}, ${site.contact.address.region}`

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#faf6f1',
          padding: '72px 80px',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span style={{ fontSize: 44, color: '#120e0d', letterSpacing: '0.02em' }}>
            braids
          </span>
          <span style={{ width: 32, height: 1, background: '#8c6449' }} />
          <span style={{ fontSize: 26, color: '#120e0d', fontStyle: 'italic' }}>
            by kristian
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 22,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#73442d',
              fontFamily: 'Helvetica, sans-serif',
            }}
          >
            {site.contact.address.city}, Texas
          </span>
          <span
            style={{
              fontSize: 108,
              lineHeight: 1.0,
              color: '#120e0d',
              marginTop: 22,
              letterSpacing: '-0.015em',
            }}
          >
            Braids worth the sit.
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: '1px solid #e0d2c4',
            paddingTop: 28,
          }}
        >
          <span
            style={{
              fontSize: 24,
              color: '#4a3f39',
              fontFamily: 'Helvetica, sans-serif',
            }}
          >
            Knotless · Bohemian · Twists · Locs · Cornrows
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 92,
              height: 92,
              border: '1px solid #c9b5a3',
              borderRadius: '999px 999px 6px 6px',
            }}
          >
            <span style={{ fontSize: 40, color: '#120e0d' }}>K</span>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
