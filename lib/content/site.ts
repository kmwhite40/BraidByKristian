import type { BusinessHours } from './schema'

/* ===========================================================================
   THE ONE FILE TO EDIT.

   Everything a non-developer needs to change lives here: contact details,
   hours, the announcement bar, social links, deposit amount, and the booking
   URL. Page components read from this — they never hard-code business facts.

   PROVENANCE
   Every value below carries a tag:
     [VERIFIED]  — taken from Kristian's live Acuity booking site.
     [NEEDS-INPUT] — a placeholder. Search this file for NEEDS-INPUT to find
                     every one of them. They are wired to render nothing (or an
                     honest fallback) until filled in, so an unfilled
                     placeholder can never surface as a fake claim.
   =========================================================================== */

export const site = {
  name: 'Braids by Kristian',
  /** Used in the wordmark and page titles. */
  shortName: 'Braids by Kristian',
  stylist: 'Kristian',

  /**
   * [NEEDS-INPUT] The production domain. Update before launch — it is the base
   * for canonical URLs, the sitemap, and Open Graph images.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://braidsbykristian.com',

  /** [VERIFIED] Acuity flyer: "I'm a part-time braider" */
  tagline: 'Protective styling in Garland, Texas',

  description:
    'Knotless braids, bohemian styles, twists, locs and cornrows by Kristian — ' +
    'a braider in Garland, TX. Clean parts, careful tension, and online booking.',

  /* ------------------------------------------------------------------ */
  /* Contact                                                             */
  /* ------------------------------------------------------------------ */
  contact: {
    /** [VERIFIED] Acuity flyer — "972-371-9731" */
    phone: '9723719731',
    /**
     * [NEEDS-INPUT] No email address is published on the Acuity booking site.
     * Until one is supplied the contact form posts to the API route and the
     * "email us" link stays hidden. Set this and CONTACT_TO_EMAIL in .env.
     */
    email: null as string | null,
    /**
     * [VERIFIED] Acuity flyer — "7050 N Shiloh Rd #100 / Garland, TX 75044 Suite 1"
     * Published publicly by Kristian on her own booking page, so it is safe to
     * show. Acuity still sends the exact suite details on confirmation.
     */
    address: {
      street: '7050 N Shiloh Rd #100',
      unit: 'Suite 1',
      city: 'Garland',
      region: 'TX',
      postalCode: '75044',
      country: 'US',
    },
    /**
     * [VERIFIED] The flyer header reads "Based in Garland, TX".
     *
     * ⚠ CONFLICT TO CONFIRM: the "Meet Your Hair Stylist" flyer says
     * "serving clients in Fate, TX and the surrounding areas", but the address
     * block and the site header both say Garland. Garland is used throughout
     * because it is backed by a concrete street address. If Fate is current,
     * change this and `address` together. See docs/CONTENT.md.
     */
    serviceArea: 'Garland, TX and the surrounding Dallas area',
    timezone: 'America/Chicago',
  },

  /* ------------------------------------------------------------------ */
  /* Social                                                              */
  /* ------------------------------------------------------------------ */
  social: {
    /** [VERIFIED] Acuity flyer — "@braidsbykristian" */
    instagram: {
      handle: '@braidsbykristian',
      url: 'https://www.instagram.com/braidsbykristian/',
    },
    /**
     * [NEEDS-INPUT] No TikTok is published on the booking site. Set `url` to a
     * real profile to make the link appear; while it is null the icon is not
     * rendered anywhere.
     */
    tiktok: null as { handle: string; url: string } | null,
  },

  /* ------------------------------------------------------------------ */
  /* Hours — [VERIFIED] Acuity flyer "Business Hours"                    */
  /* Kristian's own note on the flyer: "*Please note that hours can change*"  */
  /* ------------------------------------------------------------------ */
  hours: [
    {
      label: 'Monday – Friday',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '23:59',
      display: '8:00 AM – 12:00 AM',
    },
    {
      label: 'Saturday',
      days: ['Saturday'],
      opens: '08:00',
      closes: '23:59',
      display: '8:00 AM – 12:00 AM',
    },
    {
      label: 'Sunday',
      days: ['Sunday'],
      opens: '14:00',
      closes: '23:00',
      display: '2:00 PM – 11:00 PM',
    },
  ] satisfies BusinessHours[],
  hoursNote: 'Hours can change — the booking calendar always shows live availability.',

  /* ------------------------------------------------------------------ */
  /* Money — [VERIFIED] Acuity flyer "Booking Policies"                  */
  /* ------------------------------------------------------------------ */
  deposit: {
    amount: 25,
    refundable: false,
    /** "Deposits ... will be applied to your service." */
    appliedToService: true,
    methods: ['Cash App', 'Zelle'],
  },
  /** "The remaining balance is paid in CASH ONLY" */
  balancePayment: 'Cash',
  fees: {
    /** "after this a $40 late fee will be applied to your remaining balance" */
    late: 40,
    /** "If oil is present, you may be asked to reschedule or a $45 wash and blow-dry fee will be applied." */
    washAndBlowDry: 45,
  },
  gracePeriodMinutes: 15,
  cancellationNoticeHours: 24,

  /* ------------------------------------------------------------------ */
  /* Announcement bar                                                    */
  /* Set `enabled: false` to remove it site-wide.                        */
  /* ------------------------------------------------------------------ */
  announcement: {
    enabled: true,
    /** [VERIFIED] From the live catalog: "Lil Krownz Back 2 School Special". */
    message: 'Lil Krownz Back 2 School Special — all styles for ages 12 & under, $100.',
    linkLabel: 'See the special',
    href: '/services/lil-krownz-back-2-school-special',
    /** Bumping this makes the bar reappear for people who dismissed the last one. */
    version: '2026-07-lil-krownz',
  },
} as const

/* ===========================================================================
   Booking — the Acuity scheduler is the single source of truth for
   availability. This site never stores or generates appointment slots.
   =========================================================================== */
export const booking = {
  /** [VERIFIED] The live scheduler. */
  scheduleUrl: 'https://braidsbykristian.as.me/schedule/b36fc416',
  ownerId: '35089723',
  ownerKey: 'b36fc416',

  /**
   * Where every "Book" CTA sends people. One switch — the header, hero, footer,
   * service cards, sticky bar and every other CTA read it.
   *
   * 'external' — straight to Kristian's Acuity scheduler in a new tab. A service
   *   CTA still deep-links to that exact style via ?appointmentType=<id>.
   *
   * 'embed' — to /book on this site, which restates the two hard requirements
   *   (clean dry hair, no oils) behind one checkbox before showing the same
   *   scheduler in-page.
   *
   * TRADE-OFF, so a future reader knows what changed: 'external' is the faster
   * path to the calendar, but it skips the prep gate. Those two requirements are
   * where the $45 wash fee and the reschedules come from. /book still exists
   * either way and is still linked from the policies and accessibility pages, so
   * flipping this back is a one-word change.
   */
  mode: 'external' as 'external' | 'embed',
} as const

export type Site = typeof site
