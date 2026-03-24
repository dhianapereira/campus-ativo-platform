import { styled } from '@/styles'

export const ModalOverlay = styled('div', {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '1rem',

  '@media (max-width: 48rem)': {
    padding: '1rem',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export const ModalContent = styled('div', {
  backgroundColor: 'white',
  borderRadius: '24px',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '600px',
  maxHeight: '90vh',
  overflow: 'hidden',

  '@media (max-width: 48rem)': {
    width: 'calc(100vw - 2rem)',
    maxWidth: 'calc(100vw - 2rem)',
    borderRadius: '1rem',
    maxHeight: 'none',
    height: 'auto',
  },
})

export const ModalHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '2rem 2rem 1rem 2rem',

  '@media (max-width: 48rem)': {
    padding: '1.5rem 1.5rem 1rem 1.5rem',
  },
})

export const ModalTitle = styled('h2', {
  fontSize: '1.5rem',
  fontWeight: 600,
  color: '$darkGray',
  margin: 0,

  '@media (max-width: 48rem)': {
    fontSize: '1.375rem',
    fontWeight: 700,
  },
})

export const ModalCloseButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: '0.5rem',
  border: 'none',
  backgroundColor: 'transparent',
  color: '$lightGray',
  cursor: 'pointer',
  transition: 'all 0.2s',
  padding: '0.5rem',
  flexShrink: 0,

  '&:hover:not(:disabled)': {
    color: '$gray700',
    backgroundColor: '$gray100',
  },

  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },

  svg: {
    width: '24px',
    height: '24px',
  },
})

export const ModalBody = styled('div', {
  padding: '0 2rem',
  maxHeight: '60vh',
  overflow: 'auto',

  '@media (max-width: 48rem)': {
    padding: '0 1.5rem',
    maxHeight: 'none',
  },
})

export const ModalFooter = styled('div', {
  padding: '2rem',
  borderTop: 'none',
  backgroundColor: 'white',

  '@media (max-width: 48rem)': {
    padding: '1rem 1.5rem 1.5rem 1.5rem',
  },
})

export const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
})

export const FormField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
})

export const Label = styled('label', {
  fontSize: '1rem',
  fontWeight: 500,
  color: '$darkGray',
})

export const Input = styled('input', {
  padding: '0.875rem 1rem',
  border: '1px solid $gray300',
  borderRadius: '0.5rem',
  fontSize: '1rem',
  transition: 'border-color 0.2s',
  backgroundColor: 'white',
  color: '$darkGray',

  '&:focus': {
    outline: 'none',
    borderColor: '$greenBorder',
    boxShadow: '0 0 0 3px rgba(74, 153, 96, 0.1)',
  },

  '&::placeholder': {
    color: '$gray400',
  },

  '&:disabled': {
    backgroundColor: '$gray50',
    color: '$lightGray',
    cursor: 'not-allowed',
  },
})

export const TextArea = styled('textarea', {
  padding: '0.875rem 1rem',
  border: '1px solid $gray300',
  borderRadius: '0.5rem',
  fontSize: '1rem',
  transition: 'border-color 0.2s',
  backgroundColor: 'white',
  color: '$darkGray',
  fontFamily: 'inherit',
  resize: 'vertical',
  minHeight: '120px',

  '&:focus': {
    outline: 'none',
    borderColor: '$greenBorder',
    boxShadow: '0 0 0 3px rgba(74, 153, 96, 0.1)',
  },

  '&::placeholder': {
    color: '$gray400',
  },

  '&:disabled': {
    backgroundColor: '$gray50',
    color: '$lightGray',
    cursor: 'not-allowed',
  },

  '@media (max-width: 48rem)': {
    padding: '1rem',
    fontSize: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid rgba(0, 0, 0, 0.07)',
    minHeight: '4.5rem',
    maxHeight: '4.5rem',
    height: '4.5rem',
    resize: 'none',
  },
})

export const ErrorMessage = styled('span', {
  fontSize: '0.875rem',
  color: '$red',
})

export const ButtonGroup = styled('div', {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'flex-end',

  '@media (max-width: 48rem)': {
    flexDirection: 'row',
    gap: '0.75rem',
    justifyContent: 'space-between',
  },
})

export const CancelButton = styled('button', {
  padding: '0.875rem 2rem',
  border: '1px solid $gray300',
  borderRadius: '$card',
  backgroundColor: 'white',
  color: '$gray700',
  fontSize: '0.875rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.2s',
  minWidth: '120px',

  '&:hover:not(:disabled)': {
    backgroundColor: '$gray50',
    borderColor: '$gray400',
  },

  '&:disabled': {
    backgroundColor: '$gray50',
    color: '$gray400',
    cursor: 'not-allowed',
  },

  '@media (max-width: 48rem)': {
    flex: 1,
    justifyContent: 'center',
    padding: '0.875rem 1.5rem',
    fontSize: '1rem',
    fontWeight: 500,
    borderRadius: '0.5rem',
    border: '1px solid $gray300',
    color: '$gray700',
  },
})

export const SubmitButton = styled('button', {
  padding: '0.875rem 2rem',
  border: '1px solid $green',
  borderRadius: '$card',
  backgroundColor: '$green',
  color: 'white',
  fontSize: '0.875rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.2s',
  minWidth: '140px',

  '&:hover:not(:disabled)': {
    backgroundColor: '$greenPressed',
    borderColor: '$greenPressed',
  },

  '&:disabled': {
    backgroundColor: '$gray300',
    color: '$gray400',
    borderColor: '$gray300',
    cursor: 'not-allowed',
  },

  '@media (max-width: 48rem)': {
    flex: 1,
    justifyContent: 'center',
    padding: '0.875rem 1.5rem',
    fontSize: '1rem',
    fontWeight: 500,
    borderRadius: '0.5rem',
    backgroundColor: '$green',
    border: '1px solid $green',
  },
})
