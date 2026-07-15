import { faqSchema, type Faq } from './schema'
import { site } from './site'
import { formatPrice } from '@/lib/utils'

/**
 * Every answer traces to the Acuity booking site via `source`. Questions whose
 * answers cannot be verified are not listed rather than answered vaguely —
 * notably "what payment methods do you accept for the balance" is answerable
 * (cash) but "do you take card" is not, so it is absent.
 */
const data: Faq[] = [
  {
    question: 'Is the braiding hair included?',
    answer:
      'For most styles you bring your own braiding hair. When you book, Acuity asks for the hair colour you are providing (1, 1B, 2, 4…) so Kristian can have everything prepped before you arrive. A few services spell out exactly what to bring: Miracle Knot needs 3–4 bundles of 100% human hair feather crochet bundles for a full look, and the Fulani QuickWeave needs 2–3 bundles for a full look in the back. Natural Hair services use no added hair at all. Each service page states what applies to that style.',
    source: 'acuity-catalog',
    category: 'hair',
  },
  {
    question: 'How should my hair be prepared?',
    answer:
      'Come with clean, dry hair: shampooed, conditioned, fully blow-dried and tangle-free, for every style. Avoid oil-based products beforehand — if oil is present you may be asked to reschedule, or a ' +
      formatPrice(site.fees.washAndBlowDry) +
      ' wash and blow-dry fee is added to your balance.',
    source: 'acuity-prep',
    category: 'preparation',
  },
  {
    question: 'Is a deposit required?',
    answer:
      'Yes. A ' +
      formatPrice(site.deposit.amount) +
      ' deposit secures your appointment. It is non-refundable and it comes off your total rather than being an extra charge. Send it by ' +
      site.deposit.methods.join(' or ') +
      '. The remaining balance is cash only at your appointment.',
    source: 'acuity-policies',
    category: 'booking',
  },
  {
    question: 'Can I reschedule or cancel?',
    answer:
      'Yes, with at least ' +
      site.cancellationNoticeHours +
      ' hours’ notice before your appointment. You can reschedule or cancel yourself from the confirmation the scheduler emails you. The deposit itself is non-refundable.',
    source: 'acuity-policies',
    category: 'policies',
  },
  {
    question: 'What happens if I am running late?',
    answer:
      'There is a ' +
      site.gracePeriodMinutes +
      '-minute grace period. After that a ' +
      formatPrice(site.fees.late) +
      ' late fee is added to your remaining balance. More than ' +
      site.gracePeriodMinutes +
      ' minutes late and the appointment is cancelled and the deposit is lost. No-shows will not be serviced in the future.',
    source: 'acuity-policies',
    category: 'policies',
  },
  {
    question: 'Do you braid children’s hair?',
    answer:
      'Yes. Lil Krownz is the menu for ages 12 and under — braided ponytails, knotless braids and bohemian knotless, with style length kept to no longer than the lower back.',
    source: 'acuity-catalog',
    category: 'appointment',
  },
  {
    question: 'Can I request a custom style?',
    answer:
      'Yes. Book Freestyle (cornrows) or Natural Hair Cornrow Freestyle and contact Kristian with a description of the style you want. For the Fulani QuickWeave, send a description of the front braids you have in mind. Bringing photo references to your appointment helps.',
    source: 'acuity-catalog',
    category: 'appointment',
  },
  {
    question: 'How long will my appointment take?',
    answer:
      'It depends on the style, and these are long appointments — most run 5 to 7 hours, and the smallest sizes run longer. Extra Small Bohemian Knotless is 9 hours and Kristian asks that you not book it unless you are willing to sit for 8+ hours. The shortest services are the 3-hour cornrow and natural-hair options. Every service page lists its scheduled time.',
    source: 'acuity-catalog',
    category: 'appointment',
  },
  {
    question: 'How do I pay the balance?',
    answer:
      'The remaining balance is cash only, paid at your appointment. Only the ' +
      formatPrice(site.deposit.amount) +
      ' deposit is sent ahead by ' +
      site.deposit.methods.join(' or ') +
      '.',
    source: 'acuity-policies',
    category: 'booking',
  },
  {
    question: 'Where is the appointment?',
    answer:
      'Kristian works from a salon suite at ' +
      site.contact.address.street +
      ', ' +
      site.contact.address.unit +
      ', ' +
      site.contact.address.city +
      ', ' +
      site.contact.address.region +
      ' ' +
      site.contact.address.postalCode +
      '. Full details come with your booking confirmation.',
    source: 'acuity-policies',
    category: 'appointment',
  },
  {
    question: 'What are add-ons and what do they cost?',
    answer:
      'Add-ons extend a style and are selected in the scheduler when you book. Butt Length is ' +
      formatPrice(30) +
      ', Thigh Length is ' +
      formatPrice(50) +
      ', Boho is ' +
      formatPrice(40) +
      ', Extra Boho is ' +
      formatPrice(10) +
      ', and Curly Ends is free. Each service page lists only the add-ons available for that style.',
    source: 'acuity-catalog',
    category: 'booking',
  },
  {
    question: 'Do you do take-downs and touch-ups?',
    answer:
      'Yes. Touch-ups cover the perimeter of the head (2–3 rows) and include a take-down and wash. Braid Removal is a separate service for removal only.',
    source: 'acuity-catalog',
    category: 'appointment',
  },
]

export const faqs: Faq[] = data.map((f) => faqSchema.parse(f))

export const faqCategories = [
  { slug: 'booking', label: 'Booking & deposit' },
  { slug: 'preparation', label: 'Preparation' },
  { slug: 'hair', label: 'Braiding hair' },
  { slug: 'appointment', label: 'Your appointment' },
  { slug: 'policies', label: 'Policies' },
] as const
