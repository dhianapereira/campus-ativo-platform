import { ComponentProps, ElementRef, forwardRef } from 'react'
import { Input, Suffix, TextInputContainer, CharCounter } from './styles'

export interface TextInputProps extends ComponentProps<typeof Input> {
  suffix?: JSX.Element
  hasError?: boolean
  isAutocomplete?: boolean
  maxLength?: number
  showCounter?: boolean
  value?: string
}

export const TextInput = forwardRef<ElementRef<typeof Input>, TextInputProps>(
  (
    {
      suffix,
      hasError,
      isAutocomplete,
      maxLength,
      showCounter,
      value,
      ...props
    },
    ref,
  ) => {
    const currentLength = value?.length || 0

    return (
      <div>
        <TextInputContainer hasError={hasError} isAutocomplete={isAutocomplete}>
          <Input ref={ref} maxLength={maxLength} value={value} {...props} />
          {!!suffix && <Suffix>{suffix}</Suffix>}
        </TextInputContainer>
        {showCounter && maxLength && (
          <CharCounter>
            {currentLength}/{maxLength}
          </CharCounter>
        )}
      </div>
    )
  },
)

TextInput.displayName = 'TextInput'
