import { styled } from '@/styles'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  overflow: 'hidden',

  '@media (max-width: 768px)': {
    flexDirection: 'column',
  },
})

export const Body = styled('main', {
  display: 'flex',
  flexDirection: 'column',
  width: '100vw',
  height: '100vh',
  overflow: 'auto',
})

export const Content = styled('div', {
  padding: '$4 $3 $3 $4',
})
