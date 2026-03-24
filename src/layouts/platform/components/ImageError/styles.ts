import { styled } from '@/styles'

export const ErrorContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '331px',
  width: '100%',
  backgroundColor: '$graySurface',
  borderRadius: '$md',
  border: '2px dashed $gray250',
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
  color: '$redStrong',
  flexShrink: 0,
  border: '1px solid $redLightBorder',
})

export const ErrorTitle = styled('h3', {
  fontFamily: '$default',
  fontSize: '$lg',
  fontWeight: '$semibold',
  color: '$gray900',
  margin: 0,
  textAlign: 'center',
})

export const ErrorDescription = styled('p', {
  fontFamily: '$default',
  fontSize: '$sm',
  color: '$gray600',
  margin: 0,
  textAlign: 'center',
  lineHeight: '$relaxed',
  maxWidth: '320px',
})
