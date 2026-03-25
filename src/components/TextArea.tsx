import { ComponentProps, ElementRef, forwardRef } from 'react'
import { styled } from '@/styles/stitches'

const TextAreaStyled = styled('textarea', {
  width: '100%',
  backgroundColor: '$white',
  padding: '$3 $4',
  borderRadius: '$sm',
  boxSizing: 'border-box',
  border: '1px solid $lightGray',
  fontFamily: '$default',
  fontSize: '$md',
  color: '$gray',
  fontWeight: '$regular',
  resize: 'vertical',
  minHeight: 80,

  '&:focus': {
    outline: 0,
    border: '2px solid $green',
  },

  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  '&::placeholder': {
    color: '$lightGray',
  },

  variants: {
    hasError: {
      true: {
        border: '2px solid $red',
        '&:focus': {
          border: '2px solid $red',
        },
      },
    },
    isAutocomplete: {
      true: {
        backgroundColor: 'transparent',
      },
    },
  },
})

export interface TextAreaProps extends ComponentProps<typeof TextAreaStyled> {
  hasError?: boolean
  isAutocomplete?: boolean
  maxLength?: number
  showCounter?: boolean
}

export const TextArea = forwardRef<
  ElementRef<typeof TextAreaStyled>,
  TextAreaProps
>(({ hasError, isAutocomplete, maxLength, showCounter, ...props }, ref) => {
  const isControlled = 'value' in props
  const displayValue = isControlled
    ? ((props.value as string) ?? '')
    : undefined
  const currentLength = (displayValue ?? '').toString().length

  return (
    <div style={{ width: '100%' }}>
      <TextAreaStyled
        ref={ref}
        hasError={hasError}
        isAutocomplete={isAutocomplete}
        maxLength={maxLength}
        {...props}
        {...(isControlled
          ? {
              value: displayValue,
              onChange: props.onChange,
            }
          : {})}
      />
      {showCounter && maxLength && (
        <TextAreaCounter>
          {currentLength}/{maxLength}
        </TextAreaCounter>
      )}
    </div>
  )
})

const TextAreaCounter = styled('div', {
  fontSize: '$xs',
  color: '$lightGray',
  textAlign: 'right',
  marginTop: '$1',
})

TextArea.displayName = 'TextArea'
