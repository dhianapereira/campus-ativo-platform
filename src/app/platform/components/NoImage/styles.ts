import { styled } from '@campusativo-ui/react'

export const NoImageContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '331px',
  width: '100%',
  backgroundColor: '#f8f9fa',
  borderRadius: '$md',
  border: '2px dashed #adb5bd',
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
  backgroundColor: '#ffffff',
  color: '#6c757d',
  flexShrink: 0,
  border: '1px solid #e9ecef',
})

export const NoImageTitle = styled('h3', {
  fontFamily: '$default',
  fontSize: '$lg',
  fontWeight: '$semibold',
  color: '#495057',
  margin: 0,
  textAlign: 'center',
})

export const NoImageDescription = styled('p', {
  fontFamily: '$default',
  fontSize: '$sm',
  color: '#6c757d',
  margin: 0,
  textAlign: 'center',
  lineHeight: '$relaxed',
  maxWidth: '320px',
})
