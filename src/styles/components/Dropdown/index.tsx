import React from 'react'
import {
  Container,
  Label,
  SelectWrapper,
  Select,
  Icon,
  ErrorMessage,
} from './styles'
import { CaretDown } from 'phosphor-react'

export interface DropdownItem {
  value: string
  name: string
  disabled?: boolean
}

export interface DropdownProps {
  id: string
  label: string
  hint: string
  itemSelected?: string | null
  items: DropdownItem[]
  onChange?: (
    value: string,
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => void
  hasError?: boolean
  errorMessage?: string
  disabled?: boolean
  required?: boolean
  className?: string
  style?: React.CSSProperties
}

export const Dropdown = ({
  id,
  label,
  hint,
  itemSelected,
  items,
  onChange,
  hasError,
  errorMessage,
  disabled,
  required,
  className,
  style,
}: DropdownProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    onChange?.(value, event)
  }

  return (
    <Container>
      <Label htmlFor={id} hasError={hasError}>
        {label}
        {required && <span aria-label="obrigatório"> *</span>}
      </Label>

      <SelectWrapper>
        <Select
          id={id}
          value={itemSelected || ''}
          onChange={handleChange}
          hasError={hasError}
          disabled={disabled}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className={className}
          style={style}
        >
          <option value="" disabled hidden>
            {hint}
          </option>
          {items.map((item) => (
            <option
              key={item.value}
              value={item.value}
              disabled={item.disabled}
            >
              {item.name}
            </option>
          ))}
        </Select>

        <Icon disabled={disabled}>
          <CaretDown weight="bold" />
        </Icon>
      </SelectWrapper>

      {hasError && errorMessage && (
        <ErrorMessage id={`${id}-error`}>{errorMessage}</ErrorMessage>
      )}
    </Container>
  )
}

Dropdown.displayName = 'Dropdown'
