'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * The site's only entrance animation: a short rise + fade, once, on scroll into
 * view. That is the entire motion vocabulary for page content — no parallax, no
 * floating, no staggered letter reveals.
 *
 * With `prefers-reduced-motion: reduce`, the element renders plainly with no
 * transform and no opacity transition. It does not "animate faster" — it does
 * not animate.
 *
 * `once: true` matters: re-animating on every scroll-by is what makes these
 * sites feel cheap.
 *
 * NO-JS SAFETY: motion serialises `initial` into the SSR markup as
 * `style="opacity:0"`. Without the `<noscript>` override in app/layout.tsx that
 * targets [data-reveal], every one of these sections would be permanently
 * invisible to a client with JS disabled or broken. The two must stay together.
 */
export function Reveal({
  children,
  delay = 0,
  distance = 14,
  className,
}: {
  children: ReactNode
  delay?: number
  distance?: number
  className?: string
}) {
  const reduced = useReducedMotion()

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -64px 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
