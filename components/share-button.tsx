'use client'

import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'
import { site } from '@/lib/content/site'
import { cn } from '@/lib/utils'

/**
 * Share a style. Uses the native share sheet where it exists (which is where it
 * matters — someone showing a friend a style on their phone), and falls back to
 * copying the link.
 *
 * The result is announced politely rather than only shown as a colour change.
 */
export function ShareButton({
  title,
  path,
  className,
}: {
  title: string
  path: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  const url = `${site.url}${path}`

  return (
    <>
      <button
        type="button"
        onClick={async () => {
          try {
            if (navigator.share) {
              await navigator.share({ title, url })
              return
            }
            await navigator.clipboard.writeText(url)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 2400)
          } catch {
            // The user dismissed the share sheet, or the clipboard is blocked.
            // Neither is an error worth surfacing.
          }
        }}
        className={cn(
          'inline-flex h-13 items-center gap-2 border border-rule-strong px-6',
          'text-[0.8125rem] font-medium tracking-[0.14em] text-ink uppercase',
          'transition-colors hover:border-ink hover:bg-clay-50',
          className,
        )}
      >
        {copied ? (
          <Check aria-hidden="true" className="size-4 stroke-[1.5]" />
        ) : (
          <Share2 aria-hidden="true" className="size-4 stroke-[1.5]" />
        )}
        {copied ? 'Link copied' : 'Share'}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </>
  )
}
