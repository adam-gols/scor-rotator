/**
 * GOLS Logo — use approved assets from brand/logos/ only.
 */
import primary from '../../brand/logos/gols-logo-primary-red.png'
import secondaryLight from '../../brand/logos/gols-logo-secondary-black-text.png'
import secondaryDark from '../../brand/logos/gols-logo-secondary-white-text.png'
import secondaryWhite from '../../brand/logos/gols-logo-secondary-all-white.png'

const LOGOS = {
  primary,
  'secondary-light': secondaryLight,
  'secondary-dark': secondaryDark,
  'secondary-white': secondaryWhite,
} as const

export type LogoVariant = keyof typeof LOGOS

type LogoProps = {
  variant?: LogoVariant
  alt?: string
  className?: string
  height?: number
}

export function Logo({
  variant = 'secondary-dark',
  alt = 'Game On Live Studio',
  className,
  height = 36,
}: LogoProps) {
  return (
    <img
      src={LOGOS[variant]}
      alt={alt}
      className={className}
      height={height}
      style={{ width: 'auto', objectFit: 'contain' }}
    />
  )
}
