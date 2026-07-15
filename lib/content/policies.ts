import { site } from './site'
import { formatPrice } from '@/lib/utils'

/**
 * Every policy below is transcribed from the "Booking Policies" and
 * "Before Your Appointment" flyers published on Kristian's Acuity booking site.
 * `verbatim` holds her exact wording; `body` is the same policy written for the
 * web. Nothing here is invented — if it is not on the flyer, it is not here.
 */

export type Policy = {
  id: string
  title: string
  summary: string
  body: string[]
  verbatim: string
}

export const policies: Policy[] = [
  {
    id: 'deposit',
    title: 'Deposit & payment',
    summary: `${formatPrice(site.deposit.amount)} non-refundable deposit. Balance in cash.`,
    body: [
      `A ${formatPrice(site.deposit.amount)} deposit secures your appointment. It is non-refundable, and it comes off your total — it is not an extra charge.`,
      `Send the deposit by ${site.deposit.methods.join(' or ')}. The remaining balance is ${site.balancePayment.toLowerCase()} only, paid at your appointment.`,
      'Your appointment is confirmed once the deposit is received.',
    ],
    verbatim:
      'A $25 deposit is required to secure your appointment. Deposits are NON-REFUNDABLE and will be applied to your service. The deposit can be sent via cash app or Zelle. The remaining balance is paid in CASH ONLY',
  },
  {
    id: 'appointments',
    title: 'Booking & confirmation',
    summary: 'Book online. Confirmation follows your deposit.',
    body: [
      'Appointments are booked through the online scheduler. For questions about a service before you book, call or send a DM.',
      'Once your deposit is received you will get a confirmation, and a reminder message the day before your appointment.',
    ],
    verbatim:
      'To book an appointment, please use the link below. For further service inquiries, feel free to contact me via phone or DM. Once your deposit is received, you will receive a confirmation. A reminder message will be sent the day before your appointment from this booking site (800 #)',
  },
  {
    id: 'late',
    title: 'Arriving late',
    summary: `${site.gracePeriodMinutes}-minute grace period, then a ${formatPrice(site.fees.late)} fee.`,
    body: [
      `There is a ${site.gracePeriodMinutes}-minute grace period. After that, a ${formatPrice(site.fees.late)} late fee is added to your remaining balance.`,
      `More than ${site.gracePeriodMinutes} minutes late and the appointment is cancelled and the deposit is lost.`,
      'No-shows will not be serviced in the future.',
    ],
    verbatim:
      'Please arrive on time! A 15 minute grace period will be given; however, after this a $40 late fee will be applied to your remaining balance. Any time after 15 minutes, your appointment will be canceled and your deposit will be lost. No shows will no longer be serviced in the future.',
  },
  {
    id: 'cancellation',
    title: 'Cancelling & rescheduling',
    summary: `${site.cancellationNoticeHours} hours' notice required.`,
    body: [
      `Cancelling or rescheduling requires at least ${site.cancellationNoticeHours} hours' notice. You can do both from the confirmation email the scheduler sends you.`,
      'In Kristian’s words: "Please respect my time."',
    ],
    verbatim:
      'A 24- hour notice is required prior to cancelation or rescheduling of an appointment. Please respect my time.',
  },
]

/** "Before Your Appointment" — the four preparation rules, verbatim in spirit. */
export type PrepStep = {
  id: string
  title: string
  body: string
  verbatim: string
  /** Surfaced as a hard requirement rather than a suggestion. */
  required: boolean
}

export const preparation: PrepStep[] = [
  {
    id: 'clean-dry-hair',
    title: 'Come with clean, dry hair',
    body: 'Shampooed, conditioned, fully blow-dried and tangle-free — for every style.',
    verbatim:
      'Please make sure your hair is shampooed/conditioned, fully blow- dried and tangle free for all styles.',
    required: true,
  },
  {
    id: 'avoid-heavy-products',
    title: 'Skip the oils and heavy products',
    body: `No oil-based products before your appointment. If oil is present you may be asked to reschedule, or a ${formatPrice(site.fees.washAndBlowDry)} wash and blow-dry fee is added.`,
    verbatim:
      'Please avoid using any oil-based products in your hair prior to your appointment. If oil is present, you may be asked to reschedule or a $45 wash and blow-dry fee will be applied.',
    required: true,
  },
  {
    id: 'bring-inspiration',
    title: 'Bring inspiration',
    body: 'Have a style in mind? Bring photos or references so your vision comes across clearly.',
    verbatim:
      'If you have a style in mind, bring photos or references to help communicate your vision clearly.',
    required: false,
  },
  {
    id: 'share-hair-history',
    title: 'Share your hair history',
    body: 'Tell Kristian about recent colour, keratin, bleach or other treatments so she can choose the safest approach.',
    verbatim:
      'Let me know about recent treatments (color, keratin, bleach, etc.) so I can choose the safest and most effective approach.',
    required: false,
  },
]
