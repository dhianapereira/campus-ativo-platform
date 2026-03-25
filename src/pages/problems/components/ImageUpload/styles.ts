import { styled } from '@/styles'

export const UploadContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '$4',
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
})

export const UploadArea = styled('div', {
  width: '130px',
  minWidth: '130px',
  maxWidth: '130px',
  height: '100px',
  overflow: 'hidden',
  border: '2px dashed $borderDefault',
  borderRadius: '$lg',
  backgroundColor: '$surfaceMuted',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  transition: 'all 0.2s ease',
  flexShrink: 0,

  '&:hover': {
    borderColor: '$feedbackSuccess',
    backgroundColor: '$surfaceSuccess',
  },

  variants: {
    hasError: {
      true: {
        borderColor: '$red',
        backgroundColor: '$red12Bg',

        '&:hover': {
          borderColor: '$red',
          backgroundColor: '$red12Bg',
        },
      },
    },
    hasImage: {
      true: {
        border: '2px solid $feedbackSuccess',
        backgroundColor: '$surfaceSuccess',

        '&:hover': {
          borderColor: '$feedbackSuccessHover',
          backgroundColor: '$surfaceSuccessHover',
        },
      },
    },
  },
})

export const IconContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$textDisabled',

  '& svg': {
    width: '32px',
    height: '32px',
  },
})

export const ContentWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flexGrow: 1,
})

export const InfoText = styled('div', {
  textAlign: 'left',
  lineHeight: '$relaxed',
  marginBottom: '$2',
})

export const UploadControls = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$4',
  justifyContent: 'flex-start',
  marginTop: 'auto',

  '@media (max-width: 480px)': {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '$2',
  },
})

export const StatusText = styled('div', {
  textAlign: 'left',
  '@media (max-width: 480px)': {
    textAlign: 'center',
    minWidth: 'auto',
  },
})

export const ErrorText = styled('div', {
  textAlign: 'left',
  width: '100%',
  marginTop: '$2',
})

export const HiddenInput = styled('input', {
  display: 'none',
})

export const ImagePreview = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',
  borderRadius: '$md',
  overflow: 'hidden',

  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '$md',
  },
})

export const RemoveButton = styled('button', {
  position: 'absolute',
  top: '$2',
  right: '$2',
  width: '24px',
  height: '24px',
  borderRadius: '$full',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  fontWeight: 'bold',
  transition: 'all 0.2s ease',

  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    transform: 'scale(1.1)',
  },

  '&:active': {
    transform: 'scale(0.95)',
  },
})
