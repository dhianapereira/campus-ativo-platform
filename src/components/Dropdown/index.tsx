import React from 'react'
import {
  Container,
  Label,
  SelectWrapper,
  Select,
  Icon,
  ErrorMessage,
  SelectedInfo,
  SelectedHeader,
  SelectedName,
  SelectedCode,
  SelectedDescription,
} from './styles'
import { CaretDown } from 'phosphor-react'

export interface DropdownItem {
  value: string
  name: string
  code?: string
  description?: string
  label?: string
  disabled?: boolean
}

export interface DropdownProps {
  id: string
  label?: string
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
  const selectedItem = items.find((item) => item.value === itemSelected) ?? null

  const getItemLabel = (item: DropdownItem) => {
    if (item.label?.trim()) {
      return item.label
    }

    return item.code?.trim()
      ? `[${item.code.trim()}] ${item.name.trim()}`
      : item.name.trim()
  }

  const helperIds = [
    selectedItem ? `${id}-details` : null,
    hasError ? `${id}-error` : null,
  ]
    .filter(Boolean)
    .join(' ')

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    onChange?.(value, event)
  }

  return (
    <Container>
      {label && (
        <Label htmlFor={id} hasError={hasError}>
          {label}
        </Label>
      )}

      <SelectWrapper>
        <Select
          id={id}
          value={itemSelected || ''}
          onChange={handleChange}
          hasError={hasError}
          disabled={disabled}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={helperIds || undefined}
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
              {getItemLabel(item)}
            </option>
          ))}
        </Select>

        <Icon disabled={disabled}>
          <CaretDown weight="bold" />
        </Icon>
      </SelectWrapper>

      {selectedItem &&
        (selectedItem.code?.trim() || selectedItem.description?.trim()) && (
          <SelectedInfo id={`${id}-details`}>
            <SelectedHeader>
              <SelectedName>{selectedItem.name}</SelectedName>
              {selectedItem.code?.trim() && (
                <SelectedCode>{selectedItem.code.trim()}</SelectedCode>
              )}
            </SelectedHeader>

            {selectedItem.description?.trim() && (
              <SelectedDescription>
                {selectedItem.description.trim()}
              </SelectedDescription>
            )}
          </SelectedInfo>
        )}

      {hasError && errorMessage && (
        <ErrorMessage id={`${id}-error`}>{errorMessage}</ErrorMessage>
      )}
    </Container>
  )
}

Dropdown.displayName = 'Dropdown'
