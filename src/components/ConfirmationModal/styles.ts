import { styled } from '@/styles'

export const ModalOverlay = styled('div', {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '$4',
})

export const ModalContent = styled('div', {
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.28)',
  width: '100%',
  maxWidth: '460px',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  padding: '20px 20px 18px 20px',

  '@media (max-width: 640px)': {
    padding: '18px 16px 16px 16px',
    maxWidth: '90%',
    borderRadius: '12px',
  },
})

export const ModalHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  position: 'relative',
  marginBottom: '16px',
  textAlign: 'left',
  paddingRight: '40px',
})

export const ModalIcon = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '32px',
  height: '32px',
})

export const ModalTitle = styled('h2', {
  fontSize: '22px',
  fontWeight: '700',
  color: '$darkGray',
  margin: 0,
  lineHeight: '1.2',
})

export const CloseButton = styled('button', {
  position: 'absolute',
  top: '16px',
  right: '16px',
  background: 'transparent',
  border: 'none',
  color: '#9CA3AF',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px',
  borderRadius: '$card',
  transition: 'all 0.2s',
  flexShrink: 0,
  width: '40px',
  height: '40px',
  zIndex: 10,

  '&:hover': {
    backgroundColor: '#F3F4F6',
    color: '$darkGray',
  },

  '&:active': {
    transform: 'scale(0.95)',
  },

  svg: {
    width: '24px',
    height: '24px',
  },
})

export const ModalBody = styled('div', {
  marginTop: '4px',
  marginBottom: '24px',
  textAlign: 'left',
})

export const ModalMessage = styled('p', {
  fontSize: '16px',
  color: '$lightGray',
  lineHeight: '1.6',
  margin: 0,
})

export const ModalFooter = styled('div', {
  display: 'flex',
  gap: '16px',
  justifyContent: 'center',

  '@media (max-width: 640px)': {
    flexDirection: 'column-reverse',
    gap: '12px',
  },
})

export const CancelButton = styled('button', {
  padding: '14px 24px',
  fontSize: '16px',
  fontWeight: '600',
  borderRadius: '$card',
  border: '1.5px solid #D1D5DB',
  backgroundColor: '#FFFFFF',
  color: '#374151',
  cursor: 'pointer',
  transition: 'all 0.2s',
  minHeight: '52px',
  minWidth: '160px',

  '&:hover': {
    backgroundColor: '#F9FAFB',
    borderColor: '#C7CCD1',
  },

  '&:active': {
    transform: 'scale(0.98)',
  },

  '@media (max-width: 640px)': {
    width: '100%',
    padding: '14px 20px',
    fontSize: '16px',
    minHeight: '48px',
  },
})

export const ConfirmButton = styled('button', {
  padding: '14px 24px',
  fontSize: '16px',
  fontWeight: '600',
  borderRadius: '$card',
  border: 'none',
  color: '#FFFFFF',
  cursor: 'pointer',
  transition: 'all 0.2s',
  minHeight: '52px',
  minWidth: '200px',

  '&:active': {
    transform: 'scale(0.98)',
  },

  '@media (max-width: 640px)': {
    width: '100%',
    padding: '14px 20px',
    fontSize: '16px',
    minHeight: '48px',
  },

  variants: {
    variant: {
      warning: {
        backgroundColor: '#F59E0B',
        '&:hover': {
          backgroundColor: '#EA8A07',
        },
      },
      danger: {
        backgroundColor: '#DC2626',
        '&:hover': {
          backgroundColor: '#B91C1C',
        },
      },
    },
  },

  defaultVariants: {
    variant: 'warning',
  },
})
