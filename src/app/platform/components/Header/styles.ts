import { Heading, styled } from '@campusativo-ui/react'

export const HeaderContainer = styled('header', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '$12 $8 $8',

  '@media(max-width: 820px)': {
    [`> ${Heading}`]: {
      display: 'none',
    },
  },
})

export const UserInfoContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
})

export const Info = styled('div', {
  marginLeft: '$3',
  display: 'flex',
  flexDirection: 'column',

  '& .name': {
    fontWeight: 'bold',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    maxWidth: 180,
  },

  '& .position': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: 180,
  },
})
