import { styled } from '@/styles/stitches'

export const DialogOverlay = styled('div', {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '$4',
})

export const DialogContent = styled('div', {
  backgroundColor: '$white',
  borderRadius: '$lg',
  padding: '$6',
  maxWidth: '500px',
  width: '100%',
  maxHeight: '90vh',
  overflowY: 'auto',
  position: 'relative',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Scroll customizado
  '&::-webkit-scrollbar': {
    width: '8px',
  },

  '&::-webkit-scrollbar-track': {
    backgroundColor: '$lightGray',
    borderRadius: '$full',
  },

  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '$gray',
    borderRadius: '$full',

    '&:hover': {
      backgroundColor: '$darkGray',
    },
  },
})

export const CloseButton = styled('button', {
  all: 'unset',
  position: 'absolute',
  top: '$4',
  right: '$4',
  width: '$8',
  height: '$8',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$sm',
  cursor: 'pointer',
  color: '$gray',

  '&:hover': {
    backgroundColor: '$lightGray',
    color: '$darkGray',
  },

  '&:focus': {
    outline: '2px solid $green',
    outlineOffset: '2px',
  },
})

export const DialogTitle = styled('h2', {
  fontFamily: '$default',
  fontSize: '$xl',
  fontWeight: '$bold',
  color: '$darkGray',
  margin: 0,
  marginBottom: '$2',
  paddingRight: '$10',
})

export const DialogDescription = styled('p', {
  fontFamily: '$default',
  fontSize: '$sm',
  color: '$gray',
  margin: 0,
  marginBottom: '$6',
  lineHeight: '$base',
})

export const FilterSection = styled('div', {
  marginBottom: '$6',

  '&:last-of-type': {
    marginBottom: '$8',
  },
})

export const FilterLabel = styled('label', {
  fontFamily: '$default',
  fontSize: '$md',
  fontWeight: '$medium',
  color: '$gray',
  display: 'block',
  marginBottom: '$3',
})

export const CheckboxGroup = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '$3',

  '@media (max-width: 480px)': {
    gridTemplateColumns: '1fr',
  },
})

export const CheckboxItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  padding: '$2',
  borderRadius: '$sm',
  cursor: 'pointer',

  '&:hover': {
    backgroundColor: '$greenishWhite',
  },

  '&:focus-within': {
    backgroundColor: '$greenishWhite',
  },
})

export const CheckboxLabel = styled('span', {
  fontFamily: '$default',
  fontSize: '$sm',
  color: '$gray',
  cursor: 'pointer',
  userSelect: 'none',
  lineHeight: '$base',
})

export const ButtonGroup = styled('div', {
  display: 'flex',
  gap: '$3',
  justifyContent: 'flex-end',
  paddingTop: '$4',
  borderTop: '1px solid $lightGray',

  '@media (max-width: 480px)': {
    flexDirection: 'column-reverse',
    gap: '$2',
  },
})

export const BaseButton = styled('button', {
  all: 'unset',
  fontFamily: '$default',
  fontSize: '$sm',
  fontWeight: '$medium',
  padding: '$3 $6',
  borderRadius: '$sm',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$2',
  minWidth: '120px',
  transition: 'all 0.2s ease',

  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  '&:focus': {
    outline: '2px solid $green',
    outlineOffset: '2px',
  },
})

export const CancelButton = styled(BaseButton, {
  color: '$gray',
  border: '1px solid $lightGray',
  backgroundColor: 'transparent',

  '&:hover:not(:disabled)': {
    backgroundColor: '$lightGray',
    borderColor: '$gray',
  },
})

export const ConfirmButton = styled(BaseButton, {
  color: '$white',
  backgroundColor: '$green',
  border: '1px solid $green',

  '&:hover:not(:disabled)': {
    backgroundColor: '$darkGray',
    borderColor: '$darkGray',
  },

  '&:active:not(:disabled)': {
    transform: 'scale(0.98)',
  },
})

export const CompactDialogContent = styled(DialogContent, {
  maxWidth: '400px',
  padding: '$4',
})

export const LargeDialogContent = styled(DialogContent, {
  maxWidth: '600px',
  padding: '$8',
})

export const FilterSectionVariants = {
  compact: {
    marginBottom: '$4',
  },

  expanded: {
    marginBottom: '$8',
    padding: '$4',
    backgroundColor: '$greenishWhite',
    borderRadius: '$sm',
  },
}

export const DialogContentAnimated = styled(DialogContent, {
  '@keyframes slideIn': {
    from: {
      opacity: 0,
      transform: 'scale(0.95) translateY(-10px)',
    },
    to: {
      opacity: 1,
      transform: 'scale(1) translateY(0)',
    },
  },

  '@keyframes slideOut': {
    from: {
      opacity: 1,
      transform: 'scale(1) translateY(0)',
    },
    to: {
      opacity: 0,
      transform: 'scale(0.95) translateY(-10px)',
    },
  },

  animation: 'slideIn 0.2s ease-out',
})

export const DialogOverlayAnimated = styled(DialogOverlay, {
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },

  '@keyframes fadeOut': {
    from: {
      opacity: 1,
    },
    to: {
      opacity: 0,
    },
  },

  animation: 'fadeIn 0.2s ease-out',
})
