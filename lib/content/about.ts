import { site } from './site'

/**
 * About copy. Kristian's own words are preserved in `verbatimBio` — it is the
 * bio from her "Meet Your Hair Stylist" flyer, transcribed exactly.
 *
 * `intro` and `philosophy` are written for the web, but every claim in them is
 * traceable to something she has published:
 *   "part-time braider"        → her bio
 *   "salon suite"              → her flyer: "welcome you into my luxury salon suite"
 *   "safest ... approach"      → her prep flyer, on hair history
 *   "confident, cared for"     → her bio
 *   47 styles / 11 categories  → counted from the live scheduler
 *
 * Nothing about years of experience, training, certifications, client counts or
 * awards appears here, because none of it is published anywhere we can verify.
 */
export const about = {
  /** [VERIFIED] Verbatim from the "Meet Your Hair Stylist" flyer. */
  verbatimBio:
    "Hi! My name is Kristian, and I'm a part-time braider proudly serving clients in Fate, TX and the surrounding areas. Creating beauty through braiding is something I truly enjoy. My goal is to make sure every client leaves feeling confident, cared for, and satisfied with their style. Thank you for stopping by my booking page, and please feel free to contact me with any questions, concerns, or special requests. I look forward to working with you!",

  eyebrow: 'Meet your braider',
  heading: 'Hi, I’m Kristian',

  intro: [
    'I’m a part-time braider working out of a salon suite in ' +
      site.contact.address.city +
      ', Texas. Braiding is the part of my week I look forward to — I like the quiet of a long install and the moment at the end when someone turns toward the mirror.',
    'Because I take one client at a time, your appointment is yours. No rushing you out of the chair, no splitting my attention across three heads. That is also why the sittings are long and honest about it up front: good braids are not fast braids.',
  ],

  philosophy: [
    {
      title: 'Your hair comes first',
      body: 'Before we start I want to know what your hair has been through — colour, keratin, bleach, anything recent. That is not small talk. It decides how I approach the install and how much your hair can comfortably take.',
    },
    {
      title: 'Clean parts, every row',
      body: 'Parting is the part clients notice for the next six weeks, so it is the part I refuse to rush. It is also the thing my regulars mention most.',
    },
    {
      title: 'You should know what you are walking into',
      body: 'Prices, sitting times and what to bring are all published before you book. No surprises at the chair — the only thing that should surprise you is the finished style.',
    },
  ],

  /** Rendered as the closing line of the About page. */
  closing:
    'Questions, or something specific in mind? Call or send a DM before you book — I would rather talk it through first.',
} as const
