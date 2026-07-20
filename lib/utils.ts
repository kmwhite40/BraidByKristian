import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 420 -> "7 hr" · 450 -> "7 hr 30 min" · 90 -> "1 hr 30 min" */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} hr`
  return `${h} hr ${m} min`
}

/** ISO-8601 duration for Schema.org (PT7H30M). */
export function durationToIso(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}` || 'PT0M'
}

/** 165 -> "$165". Whole dollars only; the catalog has no cents. */
export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

/** "(469) 653-1923" from "4696531923" */
export function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').replace(/^1/, '')
  if (d.length !== 10) return raw
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

export function telHref(raw: string): string {
  const d = raw.replace(/\D/g, '')
  return `tel:+${d.length === 10 ? '1' : ''}${d}`
}

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[‘’‚‛′‵]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\+/g, ' plus ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
