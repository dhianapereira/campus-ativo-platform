import { Heading, styled } from '@/styles'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100vh',
  backgroundColor: '$greenishWhite',
  overflowY: 'hidden',
})

export const EditButton = styled('button', {
  all: 'unset',
  borderRadius: '$sm',
  fontSize: '$sm',
  fontWeight: '$medium',
  fontFamily: '$default',
  textAlign: 'center',
  padding: '$4',
  boxSizing: 'border-box',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$2',

  cursor: 'pointer',

  '&:disabled': {
    cursor: 'not-allowed',
    color: '$lightGray',
    borderColor: '$lightGray',
  },

  '&:focus': {
    boxShadow: '0 0 0 2px $colors $greenAccent',
  },

  variants: {
    tone: {
      default: {
        color: '$green',
        border: '2px solid $green',

        '&:not(:disabled):hover': {
          backgroundColor: '$green',
          color: '$white',
        },
      },
      danger: {
        color: '#b91c1c',
        border: '2px solid #b91c1c',

        '&:not(:disabled):hover': {
          backgroundColor: '#b91c1c',
          color: '$white',
        },
      },
    },
  },

  defaultVariants: {
    tone: 'default',
  },
})

export const Header = styled('header', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0 $4',
  height: 'clamp(80px, 12vh, 112px)',
  minHeight: '80px',
  justifyContent: 'space-between',
  borderBottom: '1px solid $lightGray',
  overflow: 'hidden',
  flexShrink: 0,

  '& .first-component': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: '$1',

    '& .back-icon': {
      cursor: 'pointer',
    },
  },

  '& .mobile': {
    display: 'none',
  },

  '& .desktop': {
    display: 'flex',
  },

  '@media (max-width: 768px)': {
    height: '80px',
    minHeight: '80px',

    '& .desktop': {
      display: 'none',
    },

    '& .mobile': {
      display: 'flex',
    },
  },

  '@media (max-width: 480px)': {
    height: '72px',
    minHeight: '72px',
  },
})

export const Title = styled(Heading, {
  marginLeft: '$4',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
  overflow: 'hidden',
})

export const Body = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '$6',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '$6',
  width: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
  alignSelf: 'center',

  '> *': {
    width: '100%',
    maxWidth: '839px',
  },

  '@media (max-width: 768px)': {
    padding: '$4',
    gap: '$4',
  },
})

export const ImageContainer = styled('img', {
  width: '100%',
  height: 331,
  margin: '0 $4',
  objectFit: 'cover',

  '@media (max-width: 768px)': {
    height: 242,
  },
})

export const InfoContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  gap: '$1',

  '& .label': {
    fontWeight: '$bold',
  },
})

export const HistorySection = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
})

export const HistoryList = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
})

export const HistoryCard = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  padding: '$4',
  borderRadius: '$sm',
  backgroundColor: '$white',
  border: '1px solid $lightGray',
})
