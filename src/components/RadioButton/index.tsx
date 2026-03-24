import { ComponentProps, useId } from 'react'
import { RadioContainer, RadioInput, RadioLabel } from './styles'

export interface RadioButtonProps extends ComponentProps<typeof RadioInput> {
  label: string
  isActive?: boolean
  hasError?: boolean
}

export const RadioButton = ({
  label,
  isActive,
  hasError,
  ...props
}: RadioButtonProps) => {
  const id = useId()

  return (
    <RadioContainer>
      <RadioInput
        type="radio"
        id={id}
        defaultChecked={isActive}
        hasError={hasError}
        {...props}
      />
      <RadioLabel htmlFor={id}>{label}</RadioLabel>
    </RadioContainer>
  )
}

RadioButton.displayName = 'RadioButton'
