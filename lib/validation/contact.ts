import { z } from 'zod'

/**
 * Shared by the client form (via react-hook-form) and the server route, so the
 * browser and the API can never disagree about what is valid. The server always
 * re-validates — client validation is a convenience, not a control.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your name.')
    .max(80, 'That name is too long.'),
  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email so Kristian can reply.')
    .email('That does not look like an email address.')
    .max(160),
  phone: z
    .string()
    .trim()
    .max(32)
    .optional()
    .or(z.literal(''))
    .refine((v) => !v || v.replace(/\D/g, '').length >= 10, {
      message: 'Please enter a 10-digit phone number, or leave it blank.',
    }),
  /** Optional: which style they are asking about. Free text, not an enum, so
      the form keeps working if the catalog changes. */
  service: z.string().trim().max(120).optional().or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(10, 'Please add a little more detail — at least 10 characters.')
    .max(2000, 'Please keep your message under 2000 characters.'),
  /**
   * Honeypot. Real people never fill this; bots usually do. Must be empty.
   * It is visually hidden and marked aria-hidden + tabIndex -1, so it never
   * reaches a screen reader or the keyboard tab order.
   */
  company: z.string().max(0, 'Something went wrong. Please try again.').optional(),
})

export type ContactInput = z.infer<typeof contactSchema>

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }
