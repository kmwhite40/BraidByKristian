import { site } from './site'

/**
 * About copy.
 *
 * `intro` and `philosophy` are written for the web, but every claim in them is
 * traceable to something Kristian has published:
 *   "part-time braider"        → her booking-site bio
 *   "salon suite"              → her flyer: "welcome you into my luxury salon suite"
 *   "safest ... approach"      → her prep flyer, on hair history
 *   "confident, cared for"     → her bio
 *   47 styles / 11 categories  → counted from the live scheduler
 *
 * Nothing about years of experience, training, certifications, client counts or
 * awards appears here, because none of it is published anywhere we can verify.
 *
 * NOTE — the removed `verbatimBio`
 * The About page used to quote the bio from her "Meet Your Hair Stylist" flyer
 * word for word. That bio says she serves "Fate, TX", which Kristian has since
 * confirmed is out of date — she works out of Garland. The quote is gone rather
 * than edited: rewriting someone's words and still presenting them as "in her
 * own words" would put a sentence in her mouth she never said. If she supplies
 * a current bio, add it back as a real quote.
 */
export const about = {
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
