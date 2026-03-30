import * as Checkbox from '@radix-ui/react-checkbox'
import { styled } from '@/styles/stitches'
import { keyframes } from '@stitches/react'

export const CheckboxContainer = styled(Checkbox.Root, {
  all: 'unset',
  width: '1.125rem',
  height: '1.125rem',
  backgroundColor: '$white',
  borderRadius: '0.25rem',
  lineHeight: 0,
  cursor: 'pointer',
  overflow: 'hidden',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid $borderDefault',

  '&[data-state="checked"]': {
    backgroundColor: '$green',
    color: '$white',
    borderColor: '$green',
  },

  '&[data-state="unchecked"]:focus': {
    borderColor: '$borderDefault',
  },

  '&:focus': {
    outline: '2px solid $green',
    outlineOffset: '2px',
  },
})

const slideIn = keyframes({
  from: {
    transform: 'translateY(-100%)',
  },
  to: {
    transform: 'translateY(0)',
  },
})

const slideOut = keyframes({
  from: {
    transform: 'translateY(0)',
  },
  to: {
    transform: 'translateY(-100%)',
  },
})

export const CheckboxIndicator = styled(Checkbox.Indicator, {
  color: '$white',
  width: '0.875rem',
  height: '0.875rem',

  '&[data-state="checked"]': {
    animation: `${slideIn} 200ms ease-out`,
  },

  '&[data-state="unchecked"]': {
    animation: `${slideOut} 200ms ease-out`,
  },
})
