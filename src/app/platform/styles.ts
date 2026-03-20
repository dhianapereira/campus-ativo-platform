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
  backgroundColor: '$greenishWhite',
})

export const Content = styled('div', {
  padding: '$8 $4 $4 $4',

  '@media(max-width: 640px)': {
    padding: '32px $2 $4 $2',
  },
})
