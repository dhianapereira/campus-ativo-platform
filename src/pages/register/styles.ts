import { Heading, LinkButton, Text, styled } from '@/styles'

export const PageWrapper = styled('div', {
  width: '100vw',
  height: '100vh',
  overflow: 'auto',
  position: 'relative',
})

export const Container = styled('main', {
  display: 'flex',
  flexDirection: 'row',

  maxWidth: 1440,
  margin: '$10 auto $4',
  padding: '0 $8',
  minHeight: '100vh',
  height: 'auto',
  overflowY: 'auto',

  '@media(max-width: 820px)': {
    margin: '$4 auto $4',
    padding: '$4',
  },
})

export const IllustrationContainer = styled('div', {
  paddingRight: '$8',
  maxWidth: '100%',
  marginTop: '$10',
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '@media(max-width: 820px)': {
    display: 'none',
  },

  '@media(max-width: 1024px)': {
    marginTop: '$4',
    img: {
      width: '100%',
      height: 'auto',
    },
  },
})

export const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
  maxWidth: '100%',
  flex: 1,
  padding: '$2 0',

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
    gap: '$2',
  },

  [`> ${LinkButton}`]: {
    alignSelf: 'end',
    marginBottom: '$4',
  },

  '@media(max-width: 820px)': {
    gap: '$2',
    padding: 0,
  },
})

export const FormError = styled(Text, {
  color: '$red',
})
