import React from 'react'
import { FunnelSimple } from 'phosphor-react'
import { FilterBtn } from './styles'

export interface FilterButtonProps {
  onClick?: () => void
}

export function FilterButton({ onClick }: FilterButtonProps) {
  return (
    <FilterBtn onClick={onClick} aria-label="Filtrar resultados" type="button">
      <FunnelSimple size={16} weight="regular" />
      Filtrar
    </FilterBtn>
  )
}
