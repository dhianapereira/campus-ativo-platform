import { Eye, EyeSlash } from 'phosphor-react'
import type { PasswordIconProps } from './types'

export default function PasswordIcon({ isVisible, onTap }: PasswordIconProps) {
  const IconComponent = isVisible ? EyeSlash : Eye

  return <IconComponent style={{ cursor: 'pointer' }} onClick={onTap} />
}
