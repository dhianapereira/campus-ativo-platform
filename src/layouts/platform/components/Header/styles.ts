import { styled, Heading } from '@/styles'

export const HeaderContainer = styled('header', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '$6 $8 $4',

  '@media(max-width: 820px)': {
    [`> ${Heading}`]: {
      display: 'none',
    },
  },
})

export const DrawerIcon = styled('div', {
  '@media(min-width: 821px)': {
    display: 'none',
  },
})

export const UserInfoContainer = styled('div', {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
})

export const UserMenuTrigger = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  padding: '$2 $3',
  borderRadius: '$card',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',

  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },

  '&:focus-visible': {
    boxShadow: '0 0 0 2px $colors$greenAccent',
  },
})

export const Info = styled('div', {
  marginLeft: '$3',
  display: 'flex',
  flexDirection: 'column',

  '& .name': {
    fontWeight: 'bold',
  },
})

export const UserMenu = styled('div', {
  position: 'absolute',
  top: 'calc(100% + 0.5rem)',
  right: 0,
  minWidth: '220px',
  backgroundColor: '$white',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  borderRadius: '$card',
  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
  padding: '0.5rem',
  zIndex: 20,
})

export const UserMenuItem = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.75rem',
  borderRadius: '$card',
  color: '$gray',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 500,

  '&:hover': {
    backgroundColor: '$blue12Bg',
  },

  '&[data-variant="danger"]': {
    color: '#dc2626',
  },
})
