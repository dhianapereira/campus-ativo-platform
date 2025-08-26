import { styled } from '@campusativo-ui/react'

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
  padding: '$4',
})

export const ModalContent = styled('div', {
  backgroundColor: 'white',
  borderRadius: '16px',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '600px',
  maxHeight: '90vh',
  overflow: 'hidden',
  '@media (max-width: 768px)': {
    maxWidth: '92vw',
  },
})

export const ModalHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '2rem 2rem 1rem 2rem',
})

export const ModalTitle = styled('h2', {
  fontSize: '1.5rem',
  fontWeight: 600,
  color: '#111827',
  margin: 0,
})

export const ModalCloseButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
  borderRadius: '0.5rem',
  border: 'none',
  backgroundColor: 'transparent',
  color: '#6b7280',
  cursor: 'pointer',
  transition: 'color 0.2s',

  '&:hover:not(:disabled)': {
    color: '#374151',
  },

  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
})

export const ModalBody = styled('div', {
  padding: '0 2rem 1rem 2rem',
  maxHeight: '60vh',
  overflow: 'auto',
  '@media (max-width: 768px)': {
    padding: '0 1.25rem 1rem 1.25rem',
  },
})

export const ModalFooter = styled('div', {
  padding: '1rem 2rem 2rem 2rem',
  borderTop: 'none',
  backgroundColor: 'white',
})

export const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',

  '& .form-row': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: '2rem',

    '& .name-field': {
      flex: 1,
    },

    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '1.25rem',
      alignItems: 'stretch',
      justifyContent: 'flex-start',

      '& .name-field': {
        flex: 'none',
        width: '100%',
      },
    },
  },
})

export const FormField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
})

export const Label = styled('label', {
  fontSize: '1rem',
  fontWeight: 500,
  color: '#111827',
})

export const Input = styled('input', {
  padding: '0.875rem 1rem',
  border: '1px solid #d1d5db',
  borderRadius: '0.5rem',
  fontSize: '1rem',
  transition: 'border-color 0.2s',
  backgroundColor: 'white',
  width: '100%',

  '&:focus': {
    outline: 'none',
    borderColor: '#00875F',
    boxShadow: '0 0 0 3px rgba(0, 135, 95, 0.1)',
  },

  '&:disabled': {
    backgroundColor: '#f9fafb',
    color: '#6b7280',
    border: '1px solid #e5e7eb',
    cursor: 'not-allowed',
  },
})

export const SelectContainer = styled('div', {
  position: 'relative',

  '&::after': {
    content: '',
    position: 'absolute',
    top: '50%',
    right: '1rem',
    transform: 'translateY(-50%)',
    width: 0,
    height: 0,
    borderLeft: '0.25rem solid transparent',
    borderRight: '0.25rem solid transparent',
    borderTop: '0.25rem solid #6b7280',
    pointerEvents: 'none',
  },
})

export const Select = styled('select', {
  padding: '0.875rem 2.5rem 0.875rem 1rem',
  border: '1px solid #d1d5db',
  borderRadius: '0.5rem',
  fontSize: '1rem',
  transition: 'border-color 0.2s',
  backgroundColor: 'white',
  width: '100%',
  appearance: 'none',
  cursor: 'pointer',

  '&:focus': {
    outline: 'none',
    borderColor: '#00875F',
    boxShadow: '0 0 0 3px rgba(0, 135, 95, 0.1)',
  },

  '&:disabled': {
    backgroundColor: '#f9fafb',
    color: '#6b7280',
    border: '1px solid #e5e7eb',
    cursor: 'not-allowed',
  },
})

export const ErrorMessage = styled('span', {
  fontSize: '0.875rem',
  color: '#dc2626',
  fontWeight: 500,
})

export const BottomFieldsContainer = styled('div', {
  display: 'flex',
  gap: '2rem',
  alignItems: 'flex-end',
  justifyContent: 'space-between',

  '& > div:first-child': {
    flex: 1,
  },

  '@media (max-width: 768px)': {
    flexDirection: 'row',
    gap: '1rem',
    alignItems: 'flex-end',
    '& > div:first-child': { flex: 1 },
  },
})

export const StatusContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  minWidth: '120px',
  alignItems: 'flex-start',
  paddingBottom: 0,
  '@media (max-width: 768px)': {
    minWidth: 'auto',
  },
})

export const StatusLabel = styled('span', {
  fontSize: '1rem',
  fontWeight: 500,
  color: '#111827',
})

export const StatusToggle = styled('button', {
  position: 'relative',
  width: '3.5rem',
  height: '1.75rem',
  borderRadius: '0.875rem',
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  backgroundColor: '#d1d5db',

  variants: {
    isActive: {
      true: {
        backgroundColor: '#00875F',
      },
      false: {
        backgroundColor: '#d1d5db',
      },
    },
  },

  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
})

export const StatusIndicator = styled('div', {
  position: 'absolute',
  top: '0.25rem',
  left: '0.25rem',
  width: '1.25rem',
  height: '1.25rem',
  borderRadius: '50%',
  backgroundColor: 'white',
  transition: 'transform 0.2s',

  variants: {
    isActive: {
      true: {
        transform: 'translateX(1.75rem)',
      },
      false: {
        transform: 'translateX(0)',
      },
    },
  },
})

export const ButtonGroup = styled('div', {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'flex-end',
})

export const CancelButton = styled('button', {
  padding: '0.75rem 1.5rem',
  border: '1px solid #d1d5db',
  borderRadius: '0.5rem',
  backgroundColor: 'white',
  color: '#374151',
  fontSize: '1rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background-color 0.2s',

  '&:hover:not(:disabled)': {
    backgroundColor: '#f3f4f6',
  },

  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
})

export const SubmitButton = styled('button', {
  padding: '0.75rem 1.5rem',
  border: 'none',
  borderRadius: '0.5rem',
  backgroundColor: '#00875F',
  color: 'white',
  fontSize: '1rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background-color 0.2s',

  '&:hover:not(:disabled)': {
    backgroundColor: '#065f46',
  },

  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
})
