import { styled } from '@/styles'

export const ErrorContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '331px',
  width: '100%',
  backgroundColor: '#f8f9fa',
  borderRadius: '$md',
  border: '2px dashed #dee2e6',
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
  backgroundColor: '#ffffff',
  color: '#dc3545',
  flexShrink: 0,
  border: '1px solid #f8d7da',
})

export const ErrorTitle = styled('h3', {
  fontFamily: '$default',
  fontSize: '$lg',
  fontWeight: '$semibold',
  color: '#212529',
  margin: 0,
  textAlign: 'center',
})

export const ErrorDescription = styled('p', {
  fontFamily: '$default',
  fontSize: '$sm',
  color: '#6c757d',
  margin: 0,
  textAlign: 'center',
  lineHeight: '$relaxed',
  maxWidth: '320px',
})
