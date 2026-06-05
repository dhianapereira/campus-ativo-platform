import type { ButtonHTMLAttributes } from 'react'

export interface PasswordIconProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick'
> {
  isVisible: boolean
  onTap?: ButtonHTMLAttributes<HTMLButtonElement>['onClick']
}
