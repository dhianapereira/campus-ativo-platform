import { Eye, EyeSlash } from 'phosphor-react'
import type { PasswordIconProps } from './types'

export default function PasswordIcon({
  isVisible,
  onTap,
  'aria-label': ariaLabel,
  ...props
}: PasswordIconProps) {
  const IconComponent = isVisible ? EyeSlash : Eye

  return (
    <button
      aria-label={ariaLabel || (isVisible ? 'Ocultar senha' : 'Mostrar senha')}
      onClick={onTap}
      {...props}
      type="button"
      style={{
        all: 'unset',
        alignItems: 'center',
        cursor: 'pointer',
        display: 'inline-flex',
        height: 24,
        justifyContent: 'center',
        width: 24,
        ...props.style,
      }}
    >
      <IconComponent size={24} />
    </button>
  )
}
