import { ReactNode } from 'react'

export interface IOption {
  id: string
  name: string
  icon: ReactNode
  onClick: () => void
}
