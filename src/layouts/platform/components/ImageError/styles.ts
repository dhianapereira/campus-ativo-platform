import { styled } from '@/styles'

export const ErrorContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '331px',
  width: '100%',
  backgroundColor: '$surfaceNeutral',
  borderRadius: '$md',
  border: '2px dashed $borderSubtle',
  padding: '$6',
  gap: '$4',
})

export const ErrorIcon = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '56px',
  height: '56px',
  borderRadius: '$full',
  backgroundColor: '$white',
  color: '$textDangerStrong',
  flexShrink: 0,
  border: '1px solid $borderDangerLight',
})

export const ErrorTitle = styled('h3', {
  fontFamily: '$default',
  fontSize: '$lg',
  fontWeight: '$semibold',
  color: '$textBody',
  margin: 0,
  textAlign: 'center',
})

export const ErrorDescription = styled('p', {
  fontFamily: '$default',
  fontSize: '$sm',
  color: '$textSecondary',
  margin: 0,
  textAlign: 'center',
  lineHeight: '$relaxed',
  maxWidth: '320px',
})
