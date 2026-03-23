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
  maxWidth: '480px',
  padding: '$7 $6 $6',
  position: 'relative',
})

export const Title = styled('h2', {
  margin: '0 0 $2',
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '$darkGray',
})

export const Description = styled('p', {
  margin: '0 0 $5',
  fontSize: '0.9375rem',
  lineHeight: 1.5,
  color: '$gray',
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
  minHeight: '44px',
  backgroundColor: '$white',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',

  '&:focus': {
    outline: 'none',
    borderColor: '$green',
    boxShadow: '0 0 0 3px rgba(0, 128, 96, 0.12)',
  },
})

export const Presets = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '$2',
})

export const PresetButton = styled('button', {
  padding: '$2 $3',
  borderRadius: '$card',
  border: '1px solid $green',
  backgroundColor: 'transparent',
  color: '$green',
  fontSize: '0.8125rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition:
    'background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',

  '&:hover': {
    backgroundColor: '$greenishWhite',
  },

  '&:focus-visible': {
    outline: 'none',
    boxShadow: '0 0 0 3px rgba(0, 128, 96, 0.14)',
  },

  '&[data-active="true"]': {
    backgroundColor: '$green',
    color: '$white',
    boxShadow: '0 8px 18px rgba(0, 128, 96, 0.18)',
  },
})

export const PresetHint = styled('span', {
  fontSize: '0.8125rem',
  color: '$gray',
})

export const DateGrid = styled('div', {
  display: 'grid',
  gap: '$3',

  '@media (min-width: 640px)': {
    gridTemplateColumns: '1fr 1fr',
  },
})

export const ErrorMessage = styled('p', {
  margin: 0,
  fontSize: '0.875rem',
  color: '$red',
})

export const Footer = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '$3',
  justifyContent: 'flex-end',
  marginTop: '$4',
})

export const IconButton = styled('button', {
  position: 'absolute',
  top: '$4',
  right: '$4',
  backgroundColor: 'transparent',
  border: 'none',
  color: '$gray',
  cursor: 'pointer',
  padding: '0.25rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$full',
  transition: 'background-color 0.2s ease, color 0.2s ease',

  '&:hover:not(:disabled)': {
    backgroundColor: '$greenishWhite',
    color: '$darkGray',
  },

  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
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

  '&:disabled': {
    opacity: 0.7,
    cursor: 'not-allowed',
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
