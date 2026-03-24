import { styled } from '@/styles'

export const NoImageContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '331px',
  width: '100%',
  backgroundColor: '$surfaceNeutral',
  borderRadius: '$md',
  border: '2px dashed $borderDashed',
  padding: '$6',
  gap: '$4',
})

export const NoImageIcon = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '56px',
  height: '56px',
  borderRadius: '$full',
  backgroundColor: '$white',
  color: '$textSecondary',
  flexShrink: 0,
  border: '1px solid $borderSoft',
})

export const NoImageTitle = styled('h3', {
  fontFamily: '$default',
  fontSize: '$lg',
  fontWeight: '$semibold',
  color: '$textTertiary',
  margin: 0,
  textAlign: 'center',
})

export const NoImageDescription = styled('p', {
  fontFamily: '$default',
  fontSize: '$sm',
  color: '$textSecondary',
  margin: 0,
  textAlign: 'center',
  lineHeight: '$relaxed',
  maxWidth: '320px',
})
