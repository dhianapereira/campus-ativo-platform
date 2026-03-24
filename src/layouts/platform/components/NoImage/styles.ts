import { styled } from '@/styles'

export const NoImageContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '331px',
  width: '100%',
  backgroundColor: '$graySurface',
  borderRadius: '$md',
  border: '2px dashed $grayDashed',
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
  color: '$gray600',
  flexShrink: 0,
  border: '1px solid $gray200',
})

export const NoImageTitle = styled('h3', {
  fontFamily: '$default',
  fontSize: '$lg',
  fontWeight: '$semibold',
  color: '$gray750',
  margin: 0,
  textAlign: 'center',
})

export const NoImageDescription = styled('p', {
  fontFamily: '$default',
  fontSize: '$sm',
  color: '$gray600',
  margin: 0,
  textAlign: 'center',
  lineHeight: '$relaxed',
  maxWidth: '320px',
})
