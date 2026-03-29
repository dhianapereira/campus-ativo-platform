import { styled } from '@/styles'

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

  '@keyframes fadeIn': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },

  animation: 'fadeIn 0.2s ease-out',
})

export const DialogContent = styled('div', {
  backgroundColor: '$white',
  borderRadius: '$card',
  padding: '$6',
  maxWidth: '400px',
  width: '100%',
  position: 'relative',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

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

  animation: 'slideIn 0.2s ease-out',
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
    outline: '2px solid $red',
    outlineOffset: '2px',
  },
})

export const DialogHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
  marginBottom: '$4',
  paddingRight: '$10',
})

export const DialogIcon = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '$10',
  height: '$10',
  borderRadius: '$full',
  backgroundColor: '$red12Bg',
  color: '$red',
  flexShrink: 0,
})

export const DialogTitle = styled('h2', {
  fontFamily: '$default',
  fontSize: '$xl',
  fontWeight: '$bold',
  color: '$darkGray',
  margin: 0,
})

export const DialogDescription = styled('p', {
  fontFamily: '$default',
  fontSize: '$md',
  color: '$gray',
  margin: 0,
  marginBottom: '$6',
  lineHeight: '$relaxed',
})

export const ButtonGroup = styled('div', {
  display: 'flex',
  gap: '$3',
  justifyContent: 'flex-end',
  paddingTop: '$4',

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
    outline: '2px solid',
    outlineOffset: '2px',
  },

  '&:active:not(:disabled)': {
    transform: 'scale(0.98)',
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

  '&:focus': {
    outlineColor: '$gray',
  },
})

export const ConfirmButton = styled(BaseButton, {
  color: '$white',
  backgroundColor: '$red',
  border: '1px solid $red',

  '&:hover:not(:disabled)': {
    backgroundColor: '$red',
    borderColor: '$red',
    filter: 'brightness(0.95)',
  },

  '&:focus': {
    outlineColor: '$red',
  },
})

export const CompactDialogContent = styled(DialogContent, {
  padding: '$4',
  maxWidth: '320px',

  '@media (max-width: 480px)': {
    margin: '$4',
    width: 'calc(100% - 2rem)',
  },
})

export const DangerDialogContent = styled(DialogContent, {
  border: '2px solid $borderDangerSoft',

  [`& ${DialogTitle}`]: {
    color: '$red',
  },
})

export const DialogContentExiting = styled(DialogContent, {
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

  animation: 'slideOut 0.15s ease-in',
})

export const DialogOverlayExiting = styled(DialogOverlay, {
  '@keyframes fadeOut': {
    from: {
      opacity: 1,
    },
    to: {
      opacity: 0,
    },
  },

  animation: 'fadeOut 0.15s ease-in',
})
