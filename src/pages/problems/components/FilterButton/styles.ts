import { styled } from '@/styles'

export const FilterBtn = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  fontFamily: '$default',
  fontSize: '$md',
  fontWeight: '$medium',
  color: '#00875F',
  backgroundColor: '#ffffff',
  padding: '$3 $4',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$2',
  height: '48px',
  borderRadius: '$xs',
  border: '2px solid #00875F',
  transition: 'all 0.2s ease',
  minWidth: '120px',

  '&:hover': {
    backgroundColor: '#00875F',
    color: '#ffffff',
  },

  '&:focus': {
    outline: '2px solid #00875F',
    outlineOffset: '2px',
  },

  '&:active': {
    transform: 'translateY(1px)',
  },
})
