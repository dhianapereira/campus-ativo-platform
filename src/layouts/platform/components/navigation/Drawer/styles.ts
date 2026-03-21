import { styled } from '@/styles'

export const DrawerContainer = styled('div', {
  width: 250,
  height: '100vh',
  display: 'block',
  background: '$green',
  padding: '$12 $4',
  position: 'fixed',
  top: 0,
  right: 0,
  zIndex: 999,
  overflowY: 'auto',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
})

export const DrawerOptions = styled('div', {
  paddingTop: '$12',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '$8',
})

export const CloseButton = styled('button', {
  position: 'absolute',
  top: '$4',
  right: '$4',
  background: 'none',
  border: 'none',
  fontSize: '$lg',
  cursor: 'pointer',

  '& .close-icon': {
    color: '$greenishWhite',
  },
})

export const Overlay = styled('div', {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  zIndex: 998,
})
