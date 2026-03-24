import { styled } from '@/styles/stitches'

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
    outline: '2px solid $green',
    outlineOffset: '2px',
  },

  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
    '&:checked': {
      borderColor: '$lightGray',
      '&::before': {
        backgroundColor: '$lightGray',
      },
    },
  },

  variants: {
    hasError: {
      true: {
        borderColor: '$red',
        '&:checked': {
          borderColor: '$red',
          '&::before': {
            backgroundColor: '$red',
          },
        },
        '&:focus': {
          borderColor: '$red',
          outline: '2px solid $red',
        },
      },
    },
  },
})

export const RadioLabel = styled('label', {
  fontFamily: '$default',
  fontSize: '$sm',
  color: '$gray',
  cursor: 'pointer',

  '&:has(input:disabled)': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
})
