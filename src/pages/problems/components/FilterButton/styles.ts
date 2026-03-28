import { styled } from '@/styles'

export const FilterBtn = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  fontFamily: '$default',
  fontSize: '$md',
  fontWeight: '$medium',
  color: '$green',
  backgroundColor: '$white',
  padding: '$3 $4',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$2',
  height: '48px',
  borderRadius: '$xs',
  border: '2px solid $green',
  transition: 'all 0.2s ease',
  minWidth: '120px',

  '&:hover': {
    backgroundColor: '$green',
    color: '$white',
  },

  '&:focus': {
    outline: '2px solid $green',
    outlineOffset: '2px',
  },

  '&:active': {
    transform: 'translateY(1px)',
  },

  '@media(max-width: 640px)': {
    width: '100%',
    minWidth: 0,
  },
})
