import { styled } from '@/styles'
import { Button, Text } from '@/components'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
})

export const Section = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  gap: '$4',
  width: '100%',

  '@media(max-width: 620px)': {
    flexDirection: 'column',
    justifyContent: 'center',
  },
})

export const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  width: '100%',

  [`> ${Button}`]: {
    maxWidth: 120,
  },
})

export const Column = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  width: '100%',
})

export const Input = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  gap: '$2',
  width: '100%',

  [`> ${Text}`]: {
    color: '$gray',
    fontWeight: '$bold',
  },

  '> *': {
    width: '100%',
  },

  '& .error-message': {
    color: '$red',
    fontWeight: '$regular',
  },
})
