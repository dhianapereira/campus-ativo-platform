import { styled } from '@/styles'
import { Heading, Text, TextArea, TextInput } from '@/components'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100vh',
  overflowY: 'auto',
  overflowX: 'hidden',
  backgroundColor: '$greenishWhite',
})

export const Header = styled('header', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0 $4',
  height: 'clamp(72px, 10vh, 96px)',
  minHeight: '72px',
  borderBottom: '1px solid $lightGray',
  flexShrink: 0,

  '& .back-icon': {
    cursor: 'pointer',
  },
})

export const Title = styled(Heading, {
  marginLeft: '$4',
})

export const Body = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  padding: '$6',
  paddingBottom: '$8',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '$6',
  width: '100%',
  alignSelf: 'center',
  maxWidth: '600px',

  '> *': {
    width: '100%',
  },
})

export const Input = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  gap: '$4',
  width: '100%',

  [`> ${Text}`]: {
    color: '$darkGray',
  },

  '> *': {
    width: '100%',
    boxSizing: 'border-box',
  },

  [`> ${TextInput}`]: {
    width: '100%',
    minWidth: 0,
  },

  [`> ${TextArea}`]: {
    width: '100% !important',
    minWidth: 0,
    maxWidth: '100%',
    boxSizing: 'border-box',
    resize: 'vertical',
  },

  '& .error-message': {
    color: '$red',
  },
})
