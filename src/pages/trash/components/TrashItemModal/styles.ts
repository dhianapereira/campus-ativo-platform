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
  padding: '0 2rem',
  maxHeight: '60vh',
  overflow: 'auto',

  '@media (max-width: 48rem)': {
    padding: '0 1.5rem',
    maxHeight: 'none',
  },
})

export const InfoGroup = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  marginBottom: '1.5rem',
})

export const InfoItem = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
})

export const Label = styled('span', {
  fontSize: '0.875rem',
  fontWeight: 500,
  color: '$lightGray',
})

export const Value = styled('span', {
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

export const WarningMessage = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '1rem',
  backgroundColor: '$surfaceWarning',
  borderRadius: '$card',
  marginBottom: '1.5rem',

  svg: {
    color: '$textWarningAccent',
    flexShrink: 0,
  },

  span: {
    fontSize: '0.875rem',
    color: '$textWarning',
    lineHeight: 1.5,
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
    alignItems: 'center',
    gap: '1rem',
  },

  '@media (max-width: 48rem)': {
    flexDirection: 'column-reverse',
    alignItems: 'stretch',
    gap: '0.75rem',

    '& .action-buttons': {
      width: '100%',
      gap: '0.75rem',
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
    minWidth: 'auto',
    flex: 1,
  },
})

export const RestoreButton = styled('button', {
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
    fontWeight: 500,
    borderRadius: '0.5rem',
    flex: 1,
  },
})

export const DeleteButton = styled('button', {
  backgroundColor: '$white',
  color: '$red',
  border: '1px solid $red',
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
    backgroundColor: '$red',
    borderColor: '$red',
    color: '$white',
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
    flex: 1,
  },
})
