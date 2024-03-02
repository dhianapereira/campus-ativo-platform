import { Heading, LinkButton, Text, styled } from '@campusativo-ui/react'

export const Container = styled('main', {
  display: 'flex',
  flexDirection: 'row',

  maxWidth: 1440,
  margin: '$20 auto $4',
  padding: '0 $8',
})

export const IllustrationContainer = styled('div', {
  paddingRight: '$8',
  maxWidth: '100%',
  marginTop: '$20',

  '@media(max-width: 820px)': {
    display: 'none',
  },

  '@media(max-width: 1024px)': {
    img: {
      width: '100%',
      height: 'auto',
    },
  },
})

export const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  maxWidth: '100%',

  [`> ${Heading}`]: {
    lineHeight: '$short',
    color: '$darkGray',
  },

  [`> ${Text}`]: {
    color: '$gray',
  },

  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '$4',
  },

  [`> ${LinkButton}`]: {
    alignSelf: 'end',
    marginBottom: '$4',
  },
})

export const FormError = styled(Text, {
  color: '$red',
})
