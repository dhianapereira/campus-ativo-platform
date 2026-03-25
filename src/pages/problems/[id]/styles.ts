import { styled } from '@/styles'
import { Heading } from '@/components'

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
        color: '$red',
        border: '2px solid $red',

        '&:not(:disabled):hover': {
          backgroundColor: '$red',
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

const detailCardBase = {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
  width: '100%',
  padding: '$4',
  borderRadius: '$sm',
  border: '1px solid rgba(18, 90, 57, 0.12)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
} as const

export const CategoryInfo = styled('div', {
  ...detailCardBase,

  '& .category-header': {
    display: 'flex',
    alignItems: 'center',
    gap: '$2',
    width: '100%',
  },

  '& .category-icon': {
    color: '$orange',
    flexShrink: 0,
  },

  '& .category-name': {
    fontWeight: '$medium',
    color: '$darkGray',
  },

  '& .category-description': {
    display: 'flex',
    flexDirection: 'column',
    gap: '$1',
    paddingTop: '$1',
    borderTop: '1px solid rgba(0, 0, 0, 0.06)',
  },

  '& .category-description-label': {
    color: '$gray',
    fontWeight: '$bold',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },

  '& .category-description-text': {
    color: '$darkGray',
    lineHeight: '$base',
    whiteSpace: 'pre-wrap',
  },
})

export const LocationInfo = styled('div', {
  ...detailCardBase,

  '& .location-header': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '$3',
    flexWrap: 'wrap',
    width: '100%',
  },

  '& .location-title': {
    display: 'flex',
    alignItems: 'center',
    gap: '$2',
    minWidth: 0,
  },

  '& .location-icon': {
    color: '$green',
    flexShrink: 0,
  },

  '& .location-name': {
    fontWeight: '$medium',
    color: '$darkGray',
  },

  '& .location-code': {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '$1 $2',
    borderRadius: '$full',
    backgroundColor: 'rgba(18, 90, 57, 0.08)',
    color: '$green',
    fontSize: '$xs',
    fontWeight: '$bold',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  },

  '& .location-description': {
    display: 'flex',
    flexDirection: 'column',
    gap: '$1',
    paddingTop: '$1',
    borderTop: '1px solid rgba(0, 0, 0, 0.06)',
  },

  '& .location-description-label': {
    color: '$gray',
    fontWeight: '$bold',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },

  '& .location-description-text': {
    color: '$darkGray',
    lineHeight: '$base',
    whiteSpace: 'pre-wrap',
  },
})

export const HistorySection = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '$sm',
  border: '1px solid $lightGray',
  backgroundColor: '$white',

  '& .label': {
    fontWeight: '$bold',
  },
})

export const HistoryToggle = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$3',
  padding: '$4',
  backgroundColor: '$white',
  cursor: 'pointer',

  '&:focus': {
    boxShadow: 'inset 0 0 0 2px $colors $greenAccent',
  },
})

export const HistoryPanel = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
  padding: '$1 $4 $4',
  borderTop: '1px solid $lightGray',
  backgroundColor: '$greenishWhite',
})

export const HistoryTimeline = styled('div', {
  display: 'flex',
  flexDirection: 'column',
})

export const HistoryEntry = styled('article', {
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: '20px 1fr',
  gap: '$3',
  padding: '$4 0',

  '&:not(:last-child)': {
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
  },

  '&::before': {
    content: '',
    position: 'absolute',
    left: '9px',
    top: 0,
    bottom: 0,
    width: '2px',
    backgroundColor: '$lightGray',
  },

  '&:first-child::before': {
    top: '$4',
  },

  '&:last-child::before': {
    bottom: 'calc(100% - 20px)',
  },
})

export const HistoryEntryMarker = styled('span', {
  position: 'relative',
  zIndex: 1,
  width: '20px',
  height: '20px',
  borderRadius: '$full',
  backgroundColor: '$white',
  border: '2px solid $green',
  marginTop: '$1',
})

export const HistoryEntryBody = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  minWidth: 0,
})

export const HistoryEntryHeader = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
})

export const HistoryChangeList = styled('ul', {
  margin: 0,
  paddingLeft: '$5',
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
})
