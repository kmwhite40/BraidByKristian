import { testimonialSchema, type Testimonial } from './schema'

/**
 * REAL reviews only.
 *
 * These four are transcribed verbatim from the "Client Testimonials" flyer that
 * Kristian publishes on her own Acuity booking site. Spelling is hers.
 *
 * A fifth tile on that flyer reads "This is where you can type in your awesome
 * client reviews" attributed to "The Carson's" — an unedited Canva template
 * default, not a real review. It is deliberately excluded.
 *
 * `service` is null on every entry because the flyer does not say which service
 * each client received. Do not guess: the UI omits the line when it is null.
 *
 * To add a review: append an object here. The section renders whatever is in
 * this array and hides itself entirely if the array is empty.
 */
const data: Testimonial[] = [
  {
    quote:
      'Krissy is truely one of a kind. She always has my braids looking neat, clean, and exactly how I want them. Beyond her talent, her service is what sets her apart. At this point, shes not just my braider… shes faimly. Highly recommend!',
    author: 'Kay',
    service: null,
    source: 'Booking site',
  },
  {
    quote: 'Parts are always crispy!! Such a perfectionist! will book again.',
    author: 'Sydney V.',
    service: null,
    source: 'Booking site',
  },
  {
    quote:
      'I enjoyed the appointment all around!! She was super sweet and my hair looks so good!!',
    author: 'Jordan H.',
    service: null,
    source: 'Booking site',
  },
  {
    quote: 'Stayed professional even though we are not new to each other and very quick!',
    author: "Ja'Aira F.",
    service: null,
    source: 'Booking site',
  },
]

export const testimonials: Testimonial[] = data.map((t) => testimonialSchema.parse(t))
