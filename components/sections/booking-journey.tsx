import { Container, Section } from '@/components/ui/section'
import { BookButton } from '@/components/ui/book-button'
import { site } from '@/lib/content'
import { formatPrice } from '@/lib/utils'

/**
 * How booking actually works — mirrored from Kristian's real Acuity flow, not a
 * generic "1. Choose 2. Relax 3. Enjoy".
 *
 * The real sequence, per her booking-policies flyer:
 *   book via the scheduler → send the $25 deposit by Cash App/Zelle →
 *   receive confirmation → reminder the day before → pay the balance in cash.
 *
 * Note the deposit is NOT taken inside Acuity: the account has no payment
 * processor connected and every service is flagged
 * `isOnlinePaymentNotAllowed`. So step 3 is a separate, manual step, and saying
 * so here prevents people assuming the booking is done when it is not.
 */
const steps = [
  {
    n: '1',
    title: 'Pick your style',
    body: 'Browse the menu and check the sitting time and what you need to bring. Not sure? Use the style finder or send a DM first.',
  },
  {
    n: '2',
    title: 'Choose a date',
    body: 'The scheduler shows Kristian’s real availability. Pick a time and add the hair colour you are bringing.',
  },
  {
    n: '3',
    title: `Send the ${formatPrice(site.deposit.amount)} deposit`,
    body: `Your spot is held once the deposit arrives by ${site.deposit.methods.join(' or ')}. It is non-refundable and comes off your total.`,
  },
  {
    n: '4',
    title: 'Get confirmed',
    body: 'A confirmation follows the deposit, and a reminder lands the day before. The balance is cash at the appointment.',
  },
]

export function BookingJourney() {
  return (
    <Section tone="espresso">
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow text-clay-300">How it works</p>
            <h2 className="mt-5 text-[length:var(--text-display-md)] leading-[1.05] text-canvas">
              Four steps, no guesswork
            </h2>
          </div>
          <BookButton placement="booking-journey" variant="inverse" size="lg">
            Start booking
          </BookButton>
        </div>

        <ol className="mt-14 grid gap-px bg-espresso-700 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.n} className="flex flex-col bg-espresso-800 p-6 sm:p-7">
              <span
                aria-hidden="true"
                className="font-[family-name:var(--font-display)] text-4xl leading-none text-clay-500"
              >
                {s.n}
              </span>
              <h3 className="mt-5 text-lg leading-tight text-canvas">{s.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-clay-200">{s.body}</p>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-sm text-clay-300">
          Need to move it? Cancelling or rescheduling needs{' '}
          {site.cancellationNoticeHours} hours’ notice — use the link in your
          confirmation email.
        </p>
      </Container>
    </Section>
  )
}
