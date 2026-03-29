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
  borderRadius: '$card',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '600px',
  maxHeight: '90vh',
  overflow: 'hidden',

  '@media (max-width: 48rem)': {
    width: 'calc(100vw - 2rem)',
    maxWidth: 'calc(100vw - 2rem)',
    borderRadius: '$card',
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

  '&:hover': {
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
  padding: '0 2rem 1rem 2rem',
  overflowY: 'auto',
  maxHeight: 'calc(90vh - 200px)',

  '@media (max-width: 48rem)': {
    padding: '0 1.5rem',
    maxHeight: 'none',
  },
})

export const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',

  '& .form-row': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    gap: '2rem',

    '& .name-field': {
      flex: 1,
    },

    '@media (max-width: 48rem)': {
      gap: '1rem',
      marginBottom: '1.25rem',

      '& .name-field': {
        flex: 1,
        minWidth: '0',
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
  color: '$darkGray',
})

export const Input = styled('input', {
  padding: '0.875rem 1rem',
  border: '1px solid $borderDefault',
  borderRadius: '6px',
  fontSize: '1rem',
  color: '$darkGray',
  backgroundColor: 'white',

  '&:focus': {
    outline: 'none',
    borderColor: '$borderSuccess',
    boxShadow: '0 0 0 3px rgba(74, 153, 96, 0.1)',
  },

  '&:disabled': {
    backgroundColor: '$surfaceSubtle',
    color: '$lightGray',
    cursor: 'not-allowed',
  },

  '&::placeholder': {
    color: '$textDisabled',
  },
})

export const TextArea = styled('textarea', {
  padding: '0.875rem 1rem',
  border: '1px solid $borderDefault',
  borderRadius: '6px',
  fontSize: '1rem',
  color: '$darkGray',
  backgroundColor: 'white',
  resize: 'vertical',
  minHeight: '160px',
  fontFamily: 'inherit',

  '&:focus': {
    outline: 'none',
    borderColor: '$borderSuccess',
    boxShadow: '0 0 0 3px rgba(74, 153, 96, 0.1)',
  },

  '&:disabled': {
    backgroundColor: '$surfaceSubtle',
    color: '$lightGray',
    cursor: 'not-allowed',
  },

  '&::placeholder': {
    color: '$textDisabled',
  },

  '@media (max-width: 640px)': {
    padding: '1rem',
    fontSize: '1rem',
    borderRadius: '$card',
    border: '1px solid rgba(0, 0, 0, 0.07)',
    minHeight: '70px',
    maxHeight: '70px',
    height: '70px',
    resize: 'none',
  },
})

export const ErrorMessage = styled('span', {
  fontSize: '0.75rem',
  color: '$red',
  marginTop: '0.25rem',
})

export const StatusContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.5rem',
  minWidth: '120px',
  paddingBottom: 0,

  '@media (max-width: 48rem)': {
    alignItems: 'flex-start',
    minWidth: 'auto',
    flexShrink: 0,
  },
})

export const StatusLabel = styled('span', {
  fontSize: '1rem',
  fontWeight: 500,
  color: '$darkGray',
})

export const StatusToggle = styled('button', {
  width: '60px',
  height: '32px',
  border: 'none',
  borderRadius: '12px',
  position: 'relative',
  cursor: 'pointer',
  transition: 'background-color 0.2s',

  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },

  '& > div': {
    width: '28px',
    height: '28px',
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'absolute',
    top: '2px',
    transition: 'left 0.2s',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },

  '@media (max-width: 48rem)': {
    borderRadius: '1rem',
  },

  variants: {
    isActive: {
      true: {
        backgroundColor: '$green',

        '&:hover:not(:disabled)': {
          backgroundColor: '$brandPrimaryPressed',
        },

        '& > div': {
          left: '30px',
        },
      },
      false: {
        backgroundColor: '$borderDefault',

        '&:hover:not(:disabled)': {
          backgroundColor: '$textDisabled',
        },

        '& > div': {
          left: '2px',
        },
      },
    },
  },
})

export const ModalFooter = styled('div', {
  padding: '1.5rem 2rem 2rem 2rem',
  borderTop: 'none',

  '@media (max-width: 48rem)': {
    padding: '1rem 1.5rem 1.5rem 1.5rem',
  },
})

export const ButtonGroup = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1rem',

  '& .action-buttons': {
    display: 'flex',
    gap: '1rem',

    '@media (max-width: 48rem)': {
      gap: '0.75rem',
      flex: 1,

      '& > button': {
        flex: 1,
      },
    },
  },

  '@media (max-width: 48rem)': {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
})

export const DeleteButton = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  backgroundColor: '$white',
  color: '$red',
  border: '2px solid $red',
  padding: '0.625rem 1.25rem',
  borderRadius: '$card',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  transition: 'all 0.2s ease',
  minWidth: 'auto',
  alignSelf: 'flex-start',

  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  '& .label': {
    display: 'inline',
  },

  variants: {
    variant: {
      danger: {
        '&:hover:not(:disabled)': {
          backgroundColor: '$red',
          color: '$white',
        },
      },
      primary: {
        backgroundColor: '$green',
        color: '$white',
        border: '1px solid $green',
        '&:hover:not(:disabled)': {
          backgroundColor: '$brandPrimaryHover',
        },
      },
    },
  },

  defaultVariants: {
    variant: 'danger',
  },

  '@media (max-width: 48rem)': {
    padding: '0.625rem',
    minWidth: '44px',
    minHeight: '44px',
    borderRadius: '$card',
    alignSelf: 'center',
    flexShrink: 0,

    '& .label': {
      display: 'none',
    },
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
    fontWeight: 500,
    borderRadius: '0.5rem',
  },
})

export const SaveButton = styled('button', {
  backgroundColor: '$green',
  color: '$white',
  border: '1px solid $green',
  padding: '0.875rem 2rem',
  borderRadius: '$card',
  fontSize: '0.875rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.2s',
  minWidth: '120px',

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
    fontWeight: 500,
    borderRadius: '0.5rem',
    backgroundColor: '$green',
    border: '1px solid $green',
  },
})
