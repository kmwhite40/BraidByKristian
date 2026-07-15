import { services, type Service } from '@/lib/content'
import type { CategorySlug } from '@/lib/content/schema'

/**
 * Style finder.
 *
 * Scores the REAL catalog — it can never recommend a style Kristian does not
 * offer, because it only ever ranks and filters `services`. There is no
 * hand-written mapping table to drift out of sync.
 *
 * Age is a hard filter, not a score: Lil Krownz is 12-and-under only, and
 * everything else is the adult menu. Mixing them would be worse than useless.
 */

export type Answers = {
  age: 'adult' | 'child'
  look: 'knotless' | 'boho' | 'twists' | 'cornrows' | 'locs' | 'natural' | 'unsure'
  size: 'small' | 'medium' | 'large' | 'unsure'
  sitting: 'short' | 'medium' | 'any'
  hair: 'bring' | 'own-hair' | 'unsure'
}

export type Question = {
  id: keyof Answers
  question: string
  help?: string
  options: { value: string; label: string; detail?: string }[]
}

export const questions: Question[] = [
  {
    id: 'age',
    question: 'Who is the appointment for?',
    options: [
      { value: 'adult', label: 'Me, or another adult' },
      { value: 'child', label: 'A child', detail: 'Ages 12 and under — the Lil Krownz menu' },
    ],
  },
  {
    id: 'look',
    question: 'What look are you after?',
    options: [
      { value: 'knotless', label: 'Knotless braids', detail: 'Clean, classic, flat at the root' },
      { value: 'boho', label: 'Bohemian', detail: 'Braids with curls left loose through them' },
      { value: 'twists', label: 'Twists', detail: 'Senegalese, mini, island' },
      { value: 'cornrows', label: 'Cornrows', detail: 'Straight backs or a freestyle pattern' },
      { value: 'locs', label: 'Locs', detail: 'Soft locs, or a re-twist' },
      { value: 'natural', label: 'No added hair', detail: 'Styled on my own hair' },
      { value: 'unsure', label: 'Not sure yet', detail: 'Show me a range' },
    ],
  },
  {
    id: 'size',
    question: 'How small do you want the braids?',
    help: 'Smaller braids take longer and cost more, but they last longer too.',
    options: [
      { value: 'small', label: 'Small', detail: 'The longest sit, the most detail' },
      { value: 'medium', label: 'Medium', detail: 'The middle ground' },
      { value: 'large', label: 'Large', detail: 'Quickest, and easiest on your scalp' },
      { value: 'unsure', label: 'No preference' },
    ],
  },
  {
    id: 'sitting',
    question: 'How long can you sit?',
    help: 'Be honest with yourself here — these appointments are long.',
    options: [
      { value: 'short', label: 'Up to 4 hours' },
      { value: 'medium', label: 'Up to 6 hours' },
      { value: 'any', label: 'As long as it takes' },
    ],
  },
  {
    id: 'hair',
    question: 'Braiding hair?',
    options: [
      { value: 'bring', label: 'I can bring my own', detail: 'What most styles need' },
      { value: 'own-hair', label: 'I want no added hair' },
      { value: 'unsure', label: 'Not sure' },
    ],
  },
]

const LOOK_CATEGORIES: Record<string, CategorySlug[]> = {
  knotless: ['knotless'],
  boho: ['bohemian', 'bora-bora'],
  twists: ['twists'],
  cornrows: ['cornrows', 'fulani'],
  locs: ['locs'],
  natural: ['natural-hair'],
}

const SITTING_MAX: Record<Answers['sitting'], number> = {
  short: 240,
  medium: 360,
  any: Number.POSITIVE_INFINITY,
}

export type Recommendation = { service: Service; score: number; why: string[] }

export function recommend(answers: Answers): Recommendation[] {
  // Hard filter: age decides which menu you are even looking at.
  const pool = services.filter((s) =>
    answers.age === 'child'
      ? s.category === 'lil-krownz'
      : s.category !== 'lil-krownz' && s.category !== 'touch-ups',
  )

  const scored = pool.map((s) => {
    let score = 0
    const why: string[] = []

    // Look
    if (answers.look !== 'unsure') {
      const wanted = LOOK_CATEGORIES[answers.look] ?? []
      if (wanted.includes(s.category)) {
        score += 5
        why.push('Matches the look you picked')
      }
    } else {
      score += 1
    }

    // Size
    if (answers.size !== 'unsure') {
      if (s.size === answers.size) {
        score += 3
        why.push(`${answers.size[0]!.toUpperCase()}${answers.size.slice(1)} size`)
      } else if (s.size === 'choice') {
        score += 2
        why.push('You choose the size when you book')
      }
    } else {
      score += 1
    }

    // Sitting time
    const max = SITTING_MAX[answers.sitting]
    if (s.durationMinutes <= max) {
      score += 2
      if (answers.sitting !== 'any') why.push('Fits the time you have')
    } else {
      // Not disqualifying — Kristian's shortest adult styles are still 3 hours,
      // and hiding everything would leave an empty result.
      score -= 3
    }

    // Hair
    if (answers.hair === 'own-hair' && s.hairProvidedBy === 'not-applicable') {
      score += 4
      why.push('No added hair')
    }
    if (answers.hair === 'own-hair' && s.hairProvidedBy === 'client') score -= 4
    if (answers.hair === 'bring' && s.hairProvidedBy === 'client') {
      score += 1
      why.push('You bring the braiding hair')
    }

    // Nudge quoted-price services down: they need a conversation first, so they
    // are a poor top recommendation for someone still deciding.
    if (s.priceMode === 'quoted') score -= 2

    return { service: s, score, why }
  })

  return scored
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.service.price - b.service.price)
    .slice(0, 6)
}
