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
})

export const ModalContent = styled('div', {
  backgroundColor: 'white',
  borderRadius: '$card',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '600px',
  maxHeight: '90vh',
  overflow: 'hidden',
  '@media (max-width: 48rem)': {
    width: 'calc(100vw - 2rem)',
    maxWidth: 'calc(100vw - 2rem)',
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
    backgroundColor: '$surfaceMuted',
    color: '$textNeutral',
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
  padding: '1.5rem 2rem 2rem 2rem',
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

export const InfoGroup = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
})

export const InfoItem = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
})

export const InfoLabel = styled('span', {
  fontSize: '0.875rem',
  fontWeight: 500,
  color: '$lightGray',
})

export const InfoValue = styled('span', {
  fontSize: '1rem',
  color: '$darkGray',
  lineHeight: 1.5,
})

export const DescriptionValue = styled('p', {
  fontSize: '1rem',
  color: '$darkGray',
  lineHeight: 1.6,
  margin: 0,
  whiteSpace: 'pre-wrap',
})

export const Label = styled('label', {
  fontSize: '1rem',
  fontWeight: 500,
  color: '$darkGray',
})

export const Input = styled('input', {
  padding: '0.875rem 1rem',
  border: '1px solid $borderDefault',
  borderRadius: '0.5rem',
  fontSize: '1rem',
  transition: 'border-color 0.2s',
  backgroundColor: 'white',
  width: '100%',

  '&:focus': {
    outline: 'none',
    borderColor: '$green',
    boxShadow: '0 0 0 3px rgba(0, 135, 95, 0.1)',
  },

  '&:disabled': {
    backgroundColor: '$surfaceSubtle',
    color: '$lightGray',
    border: '1px solid rgba(0, 0, 0, 0.07)',
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
    borderTop: '0.25rem solid $lightGray',
    pointerEvents: 'none',
  },
})

export const Select = styled('select', {
  padding: '0.875rem 2.5rem 0.875rem 1rem',
  border: '1px solid $borderDefault',
  borderRadius: '0.5rem',
  fontSize: '1rem',
  transition: 'border-color 0.2s',
  backgroundColor: 'white',
  width: '100%',
  appearance: 'none',
  cursor: 'pointer',

  '&:focus': {
    outline: 'none',
    borderColor: '$green',
    boxShadow: '0 0 0 3px rgba(0, 135, 95, 0.1)',
  },

  '&:disabled': {
    backgroundColor: '$surfaceSubtle',
    color: '$lightGray',
    border: '1px solid rgba(0, 0, 0, 0.07)',
    cursor: 'not-allowed',
  },
})

export const ErrorMessage = styled('span', {
  fontSize: '0.875rem',
  color: '$red',
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

  '@media (max-width: 48rem)': {
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'stretch',

    '& > div:first-child': {
      flex: 'none',
    },
  },
})

export const StatusContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  minWidth: '120px',
  alignItems: 'flex-start',
  paddingBottom: 0,
  '@media (max-width: 48rem)': {
    minWidth: 'auto',
    width: '100%',
  },
})

export const StatusLabel = styled('span', {
  fontSize: '1rem',
  fontWeight: 500,
  color: '$darkGray',
})

export const StatusToggle = styled('button', {
  position: 'relative',
  width: '3.5rem',
  height: '1.75rem',
  borderRadius: '0.875rem',
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  backgroundColor: '$borderDefault',

  variants: {
    isActive: {
      true: {
        backgroundColor: '$green',
      },
      false: {
        backgroundColor: '$borderDefault',
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
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '1rem',

  '@media (max-width: 48rem)': {
    flexDirection: 'column-reverse',
    alignItems: 'stretch',
    gap: '0.75rem',
  },
})

export const CancelButton = styled('button', {
  backgroundColor: '$white',
  color: '$textNeutral',
  border: '1px solid $borderDefault',
  padding: '0.875rem 2rem',
  borderRadius: '$card',
  fontSize: '0.875rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.2s',
  minWidth: '120px',

  '&:hover:not(:disabled)': {
    backgroundColor: '$surfaceSubtle',
    borderColor: '$textDisabled',
  },

  '&:disabled': {
    backgroundColor: '$surfaceSubtle',
    color: '$textDisabled',
    cursor: 'not-allowed',
  },

  '@media (max-width: 48rem)': {
    padding: '0.875rem 1.5rem',
    fontSize: '1rem',
    borderRadius: '0.5rem',
    minWidth: 'auto',
    flex: 1,
  },
})

export const SubmitButton = styled('button', {
  backgroundColor: '$green',
  color: 'white',
  border: '1px solid $green',
  padding: '0.875rem 1.5rem',
  borderRadius: '$card',
  fontSize: '0.875rem',
  fontWeight: 500,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  transition: 'all 0.2s',

  '&:hover:not(:disabled)': {
    backgroundColor: '$brandPrimaryPressed',
    borderColor: '$brandPrimaryPressed',
  },

  '&:disabled': {
    backgroundColor: '$borderDefault',
    color: '$textDisabled',
    borderColor: '$borderDefault',
    cursor: 'not-allowed',
  },

  '@media (max-width: 48rem)': {
    padding: '0.875rem 1.5rem',
    fontSize: '1rem',
    borderRadius: '0.5rem',
    flex: 1,
  },
})
