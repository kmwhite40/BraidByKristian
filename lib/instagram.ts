import { z } from 'zod'

/**
 * Instagram ingestion adapter — OPTIONAL, and OFF unless a token is set.
 *
 * WHY THIS EXISTS
 * Kristian's portfolio lives at @braidsbykristian, but Instagram cannot be
 * scraped: the profile HTML is behind a login wall, and the image URLs the
 * /embed/ endpoint exposes are signed to the requesting session — fetching one
 * out of band returns "Bad URL hash". There is no workaround, and building one
 * would break the moment Meta rotated a key. So this uses the supported API.
 *
 * WHAT YOU NEED
 *   INSTAGRAM_ACCESS_TOKEN — an Instagram Graph API token for the
 *   @braidsbykristian account. Long-lived tokens last 60 days and must be
 *   refreshed; see docs/IMAGES.md for how to obtain and refresh one.
 *
 * IMPORTANT — DO NOT HOTLINK
 * `media_url` values from the API are also signed and expire. Rendering them
 * directly would give visitors broken images within days, and would need a CDN
 * host allowlisted in the image config. The intended flow is BUILD-TIME
 * DOWNLOAD: fetch once, write the bytes into /public/images/gallery, and commit
 * them. `fetchRecentMedia` returns the metadata; `scripts/sync-instagram.ts`
 * (see docs/IMAGES.md) does the download.
 *
 * Without a token the site is completely unaffected: nothing calls this, and
 * the gallery renders whatever is committed in lib/content/gallery.ts.
 */

const mediaSchema = z.object({
  id: z.string(),
  caption: z.string().optional(),
  media_type: z.enum(['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM']),
  media_url: z.string().url().optional(),
  thumbnail_url: z.string().url().optional(),
  permalink: z.string().url(),
  timestamp: z.string(),
})

const responseSchema = z.object({
  data: z.array(mediaSchema),
})

export type InstagramMedia = z.infer<typeof mediaSchema>

export function hasInstagramCredentials(): boolean {
  return Boolean(process.env.INSTAGRAM_ACCESS_TOKEN)
}

/**
 * Returns recent media metadata, or [] when unconfigured. Never throws into a
 * page render — a portfolio sync failing must not take the site down.
 */
export async function fetchRecentMedia(limit = 12): Promise<InstagramMedia[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  if (!token) return []

  const url = new URL('https://graph.instagram.com/me/media')
  url.searchParams.set(
    'fields',
    'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp',
  )
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('access_token', token)

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) {
      console.warn(`[instagram] API responded ${res.status}`)
      return []
    }
    const parsed = responseSchema.safeParse(await res.json())
    if (!parsed.success) {
      console.warn('[instagram] Unexpected API response shape')
      return []
    }
    // Photos only — the gallery is a still-image surface.
    return parsed.data.data.filter(
      (m) => m.media_type === 'IMAGE' || m.media_type === 'CAROUSEL_ALBUM',
    )
  } catch (err) {
    console.warn('[instagram] Fetch failed:', err instanceof Error ? err.message : err)
    return []
  }
}

/** First line of a caption, trimmed of hashtags — usable as a photo caption. */
export function captionToTitle(caption: string | undefined): string | null {
  if (!caption) return null
  const firstLine = caption.split('\n')[0]?.replace(/#\w+/g, '').trim()
  return firstLine && firstLine.length > 2 ? firstLine.slice(0, 80) : null
}
