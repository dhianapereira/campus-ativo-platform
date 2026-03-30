import { styled } from '@/styles'
import { Button, Text } from '@/components'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  padding: '$4',
  borderRadius: '$sm',
  border: '1px solid rgba(18, 90, 57, 0.12)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
})

export const Header = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
})

export const Helper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  padding: '$3',
  borderRadius: '$sm',
  backgroundColor: 'rgba(18, 90, 57, 0.06)',

  '& .helper-dot': {
    width: 8,
    height: 8,
    borderRadius: '$full',
    backgroundColor: '$green',
    flexShrink: 0,
  },
})

export const Section = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'minmax(240px, 0.95fr) minmax(320px, 1.35fr)',
  gap: '$4',
  width: '100%',

  '@media(max-width: 620px)': {
    gridTemplateColumns: '1fr',
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
  padding: '$4',
  borderRadius: '$sm',
  backgroundColor: 'rgba(248, 251, 249, 0.9)',
  border: '1px solid rgba(18, 90, 57, 0.12)',
  minHeight: '100%',
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
