import { styled } from '@campusativo-ui/react'

export const RadioContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
})

export const RadioInput = styled('input', {
  all: 'unset',
  width: '$5',
  height: '$5',
  backgroundColor: '$white',
  borderRadius: '50%',
  lineHeight: 0,
  cursor: 'pointer',
  overflow: 'hidden',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '3px solid $lightGray',
  position: 'relative',

  '&::before': {
    content: '""',
    display: 'block',
    width: '65%',
    height: '65%',
    borderRadius: '50%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },

  '&:checked': {
    borderColor: '$green',
    '&::before': {
      backgroundColor: '$green',
    },
  },

  '&:focus': {
    borderColor: '$green',
  },
})

export const RadioLabel = styled('label', {
  fontFamily: '$default',
  cursor: 'pointer',
})
