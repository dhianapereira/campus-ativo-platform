import { styled } from '@/styles'
import { Heading } from '@/components'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100vh',
  backgroundColor: '$greenishWhite',
  overflowY: 'hidden',

  '@supports (height: 100dvh)': {
    height: '100dvh',
  },
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

export const MobileActionsMenuContainer = styled('div', {
  position: 'relative',
  display: 'none',
  zIndex: 30,

  '@media (max-width: 768px)': {
    display: 'flex',
    alignItems: 'center',
  },
})

export const MobileActionsMenuTrigger = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '44px',
  height: '44px',
  borderRadius: '$card',
  color: '$darkGray',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',

  '&:hover': {
    backgroundColor: 'rgba(18, 90, 57, 0.08)',
  },

  '&:focus-visible': {
    boxShadow: '0 0 0 2px $colors$greenAccent',
  },
})

export const MobileActionsMenu = styled('div', {
  position: 'absolute',
  top: 'calc(100% + 0.5rem)',
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  minWidth: '210px',
  padding: '0.5rem',
  borderRadius: '$card',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  backgroundColor: '$white',
  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
  zIndex: 40,

  '& svg': {
    flexShrink: 0,
  },
})

export const MobileActionsMenuItem = styled('button', {
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
    color: '$red',
  },

  '& svg': {
    width: '1.125rem',
    height: '1.125rem',
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
  overflow: 'visible',
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

    [`> ${MobileActionsMenuContainer} > ${MobileActionsMenu}`]: {
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

export const ImageButton = styled('div', {
  width: '100%',
  display: 'block',
  position: 'relative',
  borderRadius: '$sm',
  boxShadow: '0 10px 30px rgba(18, 90, 57, 0.08)',

  '&:hover .image-hint': {
    opacity: 1,
    transform: 'translateY(0)',
  },
})

export const ImageActionArea = styled('button', {
  all: 'unset',
  position: 'absolute',
  inset: 0,
  cursor: 'zoom-in',

  '&:focus-visible': {
    boxShadow: 'inset 0 0 0 3px rgba(18, 90, 57, 0.18)',
  },
})

export const ImageContainer = styled('img', {
  width: '100%',
  height: 331,
  display: 'block',
  objectFit: 'cover',

  '@media (max-width: 768px)': {
    height: 242,
  },
})

export const ImageHint = styled('div', {
  position: 'absolute',
  right: '$3',
  bottom: '$3',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '$2',
  padding: '$2 $3',
  borderRadius: '$full',
  backgroundColor: 'rgba(15, 23, 42, 0.82)',
  color: '$white',
  backdropFilter: 'blur(4px)',
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.28)',
  opacity: 0.94,
  transform: 'translateY(0)',
  transition: 'opacity 0.2s ease, transform 0.2s ease',

  '@media (hover: hover)': {
    opacity: 0,
    transform: 'translateY(6px)',
  },

  '@media (max-width: 768px)': {
    opacity: 1,
    transform: 'translateY(0)',
  },

  '& span': {
    color: '$white',
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
    color: '$green',
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
  ...detailCardBase,
  gap: '$4',

  '& .label': {
    fontWeight: '$bold',
  },
})

export const HistoryHeader = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$3',
  flexWrap: 'wrap',
  cursor: 'pointer',

  '&:focus-visible': {
    boxShadow: '0 0 0 2px $colors $greenAccent',
    borderRadius: '$sm',
  },

  '& .history-title': {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '$2',
    minWidth: 0,
    flex: 1,
  },

  '& .history-icon': {
    color: '$green',
    flexShrink: 0,
    marginTop: '2px',
  },

  '& .history-header-actions': {
    display: 'flex',
    alignItems: 'center',
    gap: '$2',
    flexShrink: 0,
  },

  '& .history-chevron': {
    color: '$green',
    transition: 'transform 0.2s ease',
  },

  '&[aria-expanded="true"] .history-chevron': {
    transform: 'rotate(180deg)',
  },
})

export const HistorySummary = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
  alignItems: 'flex-start',
})

export const HistoryPanel = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  paddingTop: '$1',
  borderTop: '1px solid rgba(0, 0, 0, 0.06)',
})

export const HistoryList = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
})

export const HistoryTimelineItem = styled('article', {
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: '20px 1fr',
  gap: '$3',
  alignItems: 'start',

  '&::before': {
    content: '',
    position: 'absolute',
    left: '9px',
    top: 0,
    bottom: '-$3',
    width: '2px',
    backgroundColor: 'rgba(18, 90, 57, 0.12)',
  },

  '&:last-child::before': {
    bottom: 'calc(100% - 20px)',
  },
})

export const HistoryMarker = styled('span', {
  position: 'relative',
  zIndex: 1,
  display: 'block',
  width: '20px',
  height: '20px',
  marginTop: '$4',
  flexShrink: 0,
  borderRadius: '$full',
  backgroundColor: '$white',
  border: '2px solid $green',
  boxShadow: '0 0 0 4px rgba(18, 90, 57, 0.08)',
})

export const HistoryCard = styled('article', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
  padding: '$4',
  borderRadius: '$sm',
  border: '1px solid rgba(18, 90, 57, 0.12)',
  backgroundColor: 'rgba(245, 250, 247, 0.95)',

  '& .history-card-title': {
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',
  },

  '& .history-card-heading': {
    display: 'flex',
    alignItems: 'center',
    gap: '$2',
    flexWrap: 'wrap',
    color: '$gray700',
    lineHeight: 1.4,
  },

  '& .history-actor': {
    fontWeight: '$bold',
    color: '$darkGray',
  },

  '& .history-action-text': {
    color: '$gray700',
  },

  '& .history-date-inline': {
    color: '$gray',
    fontSize: '$sm',
  },
})

export const HistoryCardHeader = styled('div', {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '$3',
  flexWrap: 'wrap',
})

export const HistoryCardBody = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  minWidth: 0,
})

export const HistoryMeta = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
  minWidth: 0,
})

export const HistoryBadge = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '32px',
  padding: '$1 $3',
  borderRadius: '$full',
  backgroundColor: 'rgba(18, 90, 57, 0.08)',
  color: '$green',
  fontSize: '$xs',
  fontWeight: '$bold',
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
})

export const HistoryChangeList = styled('div', {
  margin: 0,
  paddingLeft: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',

  '& .history-change-item': {
    display: 'flex',
    color: '$darkGray',
    paddingLeft: '$1',

    '& p': {
      whiteSpace: 'pre-wrap',
      lineHeight: '$base',
    },
  },

  '& .history-change-prefix': {
    fontWeight: '$bold',
  },

  '& .history-inline-chip': {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: '24px',
    padding: '0 $2',
    borderRadius: '$full',
    fontSize: '$xs',
    fontWeight: '$bold',
    letterSpacing: '0.02em',
    verticalAlign: 'middle',
    backgroundColor: 'rgba(18, 90, 57, 0.08)',
    color: '$green',
  },

  '& .history-inline-chip[data-tone="toAnalysis"]': {
    backgroundColor: '$darkBlue12Bg',
    color: '$darkBlue',
  },

  '& .history-inline-chip[data-tone="inAnalysis"]': {
    backgroundColor: '$blue12Bg',
    color: '$blue',
  },

  '& .history-inline-chip[data-tone="accepted"]': {
    backgroundColor: '$orange12Bg',
    color: '$orange',
  },

  '& .history-inline-chip[data-tone="rejected"]': {
    backgroundColor: '$red12Bg',
    color: '$red',
  },

  '& .history-inline-chip[data-tone="inProgress"]': {
    backgroundColor: '$yellow12Bg',
    color: '$yellow',
  },

  '& .history-inline-chip[data-tone="finished"]': {
    backgroundColor: '$lightGreen12Bg',
    color: '$lightGreen',
  },

  '& .history-inline-chip[data-tone="maintenance-preventive"]': {
    backgroundColor: '$lightGreen12Bg',
    color: '$green',
  },

  '& .history-inline-chip[data-tone="maintenance-corrective"]': {
    backgroundColor: '$orange12Bg',
    color: '$orangeText',
  },

  '& .history-inline-chip[data-tone="maintenance-unset"]': {
    backgroundColor: '$gray100',
    color: '$gray600',
  },
})

export const HistoryNote = styled('div', {
  padding: '$2 $3',
  borderRadius: '$sm',
  backgroundColor: '$gray50',
  borderLeft: '3px solid rgba(56, 61, 59, 0.18)',

  '& p': {
    color: '$darkGray',
    whiteSpace: 'pre-wrap',
    lineHeight: '$base',
  },
})

export const ImageViewerOverlay = styled('div', {
  position: 'fixed',
  inset: 0,
  zIndex: 1100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$4',
  backgroundColor: 'rgba(15, 23, 42, 0.72)',
  backdropFilter: 'blur(2px)',
})

export const ImageViewerContent = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
  width: '100%',
  maxWidth: 'min(1120px, 100%)',
  maxHeight: '100%',
  padding: '$4',
  borderRadius: '$card',
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.28)',

  '@media (max-width: 768px)': {
    padding: '$3',
  },
})

export const ImageViewerHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$3',
})

export const ImageViewerTitle = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
  minWidth: 0,
})

export const ImageViewerCloseButton = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '44px',
  height: '44px',
  borderRadius: '$full',
  color: '$darkGray',
  cursor: 'pointer',
  flexShrink: 0,

  '&:hover': {
    backgroundColor: 'rgba(18, 90, 57, 0.08)',
  },

  '&:focus-visible': {
    boxShadow: '0 0 0 3px rgba(18, 90, 57, 0.18)',
  },
})

export const ImageViewerFrame = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 0,
  overflow: 'auto',
  borderRadius: '$sm',
  backgroundColor: 'rgba(248, 250, 252, 0.96)',
})

export const ImageViewerImage = styled('img', {
  display: 'block',
  width: 'auto',
  maxWidth: '100%',
  maxHeight: 'calc(100vh - 180px)',
  height: 'auto',
  objectFit: 'contain',
  borderRadius: '$sm',
})
