import React, { useState } from 'react'
import { Container, Title, ErrorMessage } from './styles'
import { RadioButton } from '../RadioButton'

export interface RadioGroupOption {
  id: string
  label: string
  isActive?: boolean
  disabled?: boolean
}

export interface RadioGroupProps {
  title: string
  name: string
  options: RadioGroupOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void
  hasError?: boolean
  errorMessage?: string
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical'
}

export const RadioGroup = ({
  title,
  name,
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  hasError,
  errorMessage,
  disabled,
  orientation = 'horizontal',
}: RadioGroupProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '')

  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : internalValue

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value

    if (!isControlled) {
      setInternalValue(newValue)
    }

    onChange?.(newValue, event)
  }

  return (
    <>
      <Title hasError={hasError}>{title}</Title>
      <Container orientation={orientation}>
        {options.map((option) => (
          <RadioButton
            key={option.id}
            label={option.label}
            isActive={currentValue === option.id}
            name={name}
            value={option.id}
            onChange={handleChange}
            disabled={disabled || option.disabled}
            hasError={hasError}
          />
        ))}
      </Container>
      {hasError && errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </>
  )
}

RadioGroup.displayName = 'RadioGroup'
