import React from 'react'
import { Container, Label, SelectWrapper, Select, Icon } from './styles'
import { IProps } from './index.d'
import { CaretDown } from 'phosphor-react'

export function Dropdown({
  id,
  label,
  hint,
  onChange,
  itemSelected,
  items,
}: IProps) {
  return (
    <Container>
      <Label htmlFor={id}>{label}</Label>
      <SelectWrapper>
        <Select
          as="select"
          id={id}
          defaultValue={itemSelected || ''}
          onChange={onChange}
        >
          <option value="" disabled hidden>
            {hint}
          </option>
          {items.map((item) => (
            <option key={item.value} value={item.value}>
              {item.name}
            </option>
          ))}
        </Select>
        <Icon>
          <CaretDown weight="bold" />
        </Icon>
      </SelectWrapper>
    </Container>
  )
}
