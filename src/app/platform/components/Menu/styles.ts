import { LinkButton, styled } from '@campusativo-ui/react'

export const MenuContainer = styled('div', {
  width: 250,
  height: '100vh',
  display: 'block',
  background: '$green',
  padding: '$12 $4',

  '@media (max-width: 820px)': {
    display: 'none',
  },
})

export const MenuOptions = styled('div', {
  paddingTop: '$12',

  [`> ${LinkButton}`]: {
    paddingBottom: '$8',
  },
})
