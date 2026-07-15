'use client'

import Link from 'next/link'
import { useState } from 'react'
import { X } from 'lucide-react'
import { site } from '@/lib/content/site'
import { useLocalList } from '@/lib/hooks/use-local-list'

const KEY = 'bbk:announcement-dismissed'

/**
 * Announcement bar.
 *
 * Disable it entirely with `announcement.enabled: false` in lib/content/site.ts.
 * Bumping `announcement.version` brings it back for people who dismissed the
 * previous message — dismissal is stored against the version, not a boolean.
 *
 * Rendered server-side and hidden on dismissal rather than mounted after a
 * check, so it does not shift the header down on first paint.
 */
export function AnnouncementBar() {
  const a = site.announcement
  // Stores the dismissed version, so bumping `announcement.version` in
  // site.ts brings the bar back for everyone who dismissed the last message.
  const { items, add, ready } = useLocalList(KEY, 1)
  const [justDismissed, setJustDismissed] = useState(false)
  const dismissed = justDismissed || (ready && items[0] === a.version)

  if (!a.enabled || dismissed) return null

  return (
    <div className="relative bg-espresso-800 text-canvas print:hidden">
      <div className="mx-auto flex max-w-[80rem] items-center justify-center gap-3 px-10 py-2.5 sm:px-12">
        <p className="text-center text-[0.8125rem] leading-snug">
          {a.message}{' '}
          <Link
            href={a.href}
            className="font-medium whitespace-nowrap underline decoration-clay-500 underline-offset-4 transition-colors hover:decoration-canvas"
          >
            {a.linkLabel}
          </Link>
        </p>
        <button
          type="button"
          onClick={() => {
            setJustDismissed(true)
            add(a.version)
          }}
          className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-clay-200 transition-colors hover:bg-espresso-900 hover:text-canvas"
        >
          <X aria-hidden="true" className="size-4 stroke-[1.5]" />
          <span className="sr-only">Dismiss announcement</span>
        </button>
      </div>
    </div>
  )
}
