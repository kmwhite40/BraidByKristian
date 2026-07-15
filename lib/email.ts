import type { ContactInput } from '@/lib/validation/contact'

/**
 * Transactional email adapter.
 *
 * Talks to Resend over plain fetch rather than pulling in the SDK — it is one
 * POST, and it keeps the dependency tree (and the bundle) smaller.
 *
 * Without RESEND_API_KEY the adapter reports `skipped`, the API route still
 * returns success to the client, and the submission is logged server-side. That
 * keeps the site deployable with no secrets while making it obvious in the logs
 * that mail is not wired up yet. See docs/CONTACT.md.
 */

export type SendResult = { ok: true } | { ok: false; reason: string } | { ok: 'skipped' }

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL && process.env.CONTACT_FROM_EMAIL,
  )
}

export async function sendContactEmail(input: ContactInput): Promise<SendResult> {
  if (!isEmailConfigured()) return { ok: 'skipped' }

  const to = process.env.CONTACT_TO_EMAIL!
  const from = process.env.CONTACT_FROM_EMAIL!

  // Every interpolated value is user-controlled, so all of it is escaped before
  // it reaches the HTML body.
  const rows: [string, string][] = [
    ['Name', input.name],
    ['Email', input.email],
    ['Phone', input.phone || '—'],
    ['Style', input.service || '—'],
  ]

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:640px">
      <h2 style="margin:0 0 16px">New message from braidsbykristian.com</h2>
      <table style="border-collapse:collapse;width:100%;margin-bottom:16px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr>
                 <td style="padding:6px 12px 6px 0;color:#6f625a;white-space:nowrap">${escapeHtml(k)}</td>
                 <td style="padding:6px 0">${escapeHtml(v)}</td>
               </tr>`,
          )
          .join('')}
      </table>
      <div style="padding:16px;background:#faf6f1;border-left:3px solid #73442d;white-space:pre-wrap">${escapeHtml(
        input.message,
      )}</div>
    </div>`

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        // reply_to means Kristian can just hit reply.
        reply_to: input.email,
        subject: `Website enquiry — ${input.name}${input.service ? ` (${input.service})` : ''}`,
        html,
      }),
    })

    if (!res.ok) {
      return { ok: false, reason: `Resend responded ${res.status}` }
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : 'Unknown error' }
  }
}
