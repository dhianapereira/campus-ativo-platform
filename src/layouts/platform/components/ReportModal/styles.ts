import { styled } from '@/styles'

export const Overlay = styled('div', {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '$4',
})

export const Content = styled('div', {
  backgroundColor: '$white',
  borderRadius: '$card',
  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.28)',
  width: '100%',
  maxWidth: '420px',
  padding: '$6',
  position: 'relative',
})

export const Title = styled('h2', {
  margin: '0 0 $4',
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '$darkGray',
})

export const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
})

export const Field = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
})

export const Label = styled('label', {
  fontSize: '0.875rem',
  fontWeight: 500,
  color: '$gray',
})

export const Input = styled('input', {
  padding: '$2 $3',
  borderRadius: '$card',
  border: '1px solid rgba(0, 0, 0, 0.07)',
  fontSize: '0.875rem',
  color: '$darkGray',

  '&:focus': {
    outline: 'none',
    borderColor: '$green',
  },
})

export const Presets = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '$2',
})

export const PresetButton = styled('button', {
  padding: '$1 $3',
  borderRadius: '$card',
  border: '1px solid $green',
  backgroundColor: 'transparent',
  color: '$green',
  fontSize: '0.8125rem',
  fontWeight: 500,
  cursor: 'pointer',

  '&:hover': {
    backgroundColor: '$greenishWhite',
  },
})

export const ErrorMessage = styled('p', {
  margin: 0,
  fontSize: '0.875rem',
  color: '$red',
})

export const Footer = styled('div', {
  display: 'flex',
  gap: '$3',
  justifyContent: 'flex-end',
  marginTop: '$4',
})

export const CloseButton = styled('button', {
  padding: '$2 $4',
  borderRadius: '$card',
  border: '1px solid rgba(0, 0, 0, 0.07)',
  backgroundColor: 'transparent',
  color: '$gray',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',

  '&:hover': {
    backgroundColor: '$greenishWhite',
  },
})

export const SubmitButton = styled('button', {
  padding: '$2 $4',
  borderRadius: '$card',
  border: 'none',
  backgroundColor: '$green',
  color: '$white',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',

  '&:hover:not(:disabled)': {
    backgroundColor: '$lightGreen',
  },

  '&:disabled': {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
})
