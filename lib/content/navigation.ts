/** Primary navigation. Edit here — the header, footer and mobile menu all read this. */
export const primaryNav = [
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/policies', label: 'Policies' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
] as const

export const footerNav = {
  styles: [
    { href: '/services', label: 'All services' },
    { href: '/services?category=knotless', label: 'Knotless braids' },
    { href: '/services?category=bohemian', label: 'Bohemian' },
    { href: '/services?category=twists', label: 'Twists' },
    { href: '/services?category=lil-krownz', label: 'Lil Krownz' },
    { href: '/style-finder', label: 'Find your style' },
  ],
  visit: [
    { href: '/book', label: 'Book an appointment' },
    { href: '/policies', label: 'Booking policies' },
    { href: '/policies#preparation', label: 'Before your appointment' },
    { href: '/faq', label: 'Questions' },
    { href: '/contact', label: 'Contact' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy' },
    { href: '/accessibility', label: 'Accessibility' },
  ],
} as const
