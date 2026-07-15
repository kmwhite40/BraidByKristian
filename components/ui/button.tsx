import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Buttons are letterspaced uppercase in the geometric sans, with square-ish
 * corners — the flyers have no pill buttons and no rounded-2xl cards, and the
 * default shadcn look would fight the editorial type.
 *
 * Every variant clears the 44×44 CSS-pixel touch target (WCAG 2.2 §2.5.8) at
 * `md` and above; `sm` is only used inline next to body text where the
 * exception applies.
 */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-[family-name:var(--font-sans)] font-medium uppercase',
    'tracking-[0.14em] text-xs',
    'transition-[background-color,color,border-color,transform] duration-200',
    'ease-[cubic-bezier(0.16,1,0.3,1)]',
    'disabled:pointer-events-none disabled:opacity-45',
    'active:translate-y-px',
    "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:stroke-[1.5]",
  ].join(' '),
  {
    variants: {
      variant: {
        /** The booking action. Espresso on ivory — 7.4:1. */
        primary:
          'bg-espresso-600 text-canvas hover:bg-espresso-800 border border-espresso-600 hover:border-espresso-800',
        /** Quiet companion to primary. */
        secondary:
          'bg-transparent text-ink border border-rule-strong hover:border-ink hover:bg-clay-50',
        /** On top of a clay or espresso field. */
        inverse:
          'bg-canvas text-ink border border-canvas hover:bg-clay-100 hover:border-clay-100',
        ghost: 'bg-transparent text-ink hover:bg-clay-100 border border-transparent',
        /** Text-like, for tertiary actions. Underline is the affordance. */
        link: 'bg-transparent text-espresso-600 underline decoration-clay-500 underline-offset-4 hover:decoration-espresso-600 tracking-[0.08em] normal-case',
      },
      size: {
        sm: 'h-9 px-3.5',
        md: 'h-11 px-6',
        lg: 'h-13 px-8 text-[0.8125rem]',
        icon: 'size-11',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { buttonVariants }
