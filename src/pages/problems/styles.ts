import { styled } from '@/styles'
import { Button, Text } from '@/components'
import { SearchBar } from './components/SearchBar'

export const GridView = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  gridColumnGap: '$5',
  gridRowGap: '$6',

  '@media(min-width: 853px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },

  '@media(min-width: 1280px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
})

export const ActionsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  marginBottom: '$8',
  justifyContent: 'end',
})

export const HeaderContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',
  marginBottom: '$8',

  '@media(max-width: 640px)': {
    gap: '$4',
    marginBottom: '$6',
  },

  '@media(max-width: 480px)': {
    gap: '$3',
    marginBottom: '$4',
  },
})

export const SearchContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  gap: '$2',
  '@media(max-width: 1024px)': {
    flexDirection: 'column',
    gap: '$10',
  },
  '@media(max-width: 640px)': {
    gap: '$10',
    flexDirection: 'column',
  },

  '@media(max-width: 480px)': {
    gap: '$10',
    flexDirection: 'column',
  },
})

export const ControlsContainer = styled('div', {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '$4',
  flexWrap: 'nowrap',
  flex: '0 0 auto',

  '@media(max-width: 1024px)': {
    width: '100%',
    flexWrap: 'nowrap',
  },

  '@media(max-width: 853px)': {
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '$4',
    width: '100%',
    flexWrap: 'wrap',
  },

  '@media(max-width: 640px)': {
    gap: '$4',
    width: '100%',
    flexWrap: 'wrap',
  },

  '@media(max-width: 480px)': {
    gap: '$3',
    width: '100%',
  },
})

export const FilterGroup = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
  flex: '0 0 auto',

  '@media(max-width: 1024px)': {
    flex: '0 0 auto',
  },

  '@media(max-width: 853px)': {
    flex: '0 0 auto',
    width: 'auto',
  },

  '@media(max-width: 640px)': {
    gap: '$2',
    flex: '1 1 100%',
    width: '100%',
  },

  '@media(max-width: 480px)': {
    gap: '$1',
    flex: '1 1 100%',
    width: '100%',
  },
})

export const AddButton = styled(Button, {
  whiteSpace: 'nowrap',
  minWidth: 'fit-content',
  fontSize: '$4',
  padding: '$3 $5',
  flex: '0 0 auto',

  '@media(max-width: 1024px)': {
    padding: '$3 $4',
    flex: '0 0 auto',
  },

  '@media(max-width: 853px)': {
    flex: '0 0 auto',
    width: 'auto',
  },

  '@media(max-width: 640px)': {
    padding: '$2 $3',
    fontSize: '$3',
    flex: '1 1 calc(50% - $2)',
    minWidth: 0,
  },

  '@media(max-width: 480px)': {
    padding: '$2',
    fontSize: '$2',
    flex: '1 1 100%',
  },
})

export const ResultsCounter = styled('div', {
  marginBottom: '$6',
  color: '$textSecondary',
  fontSize: '$4',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '$2',

  '@media(max-width: 640px)': {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '$1',
    marginBottom: '$4',
    fontSize: '$3',
  },

  '@media(max-width: 480px)': {
    fontSize: '$2',
    marginBottom: '$3',
  },
})

export const FilterBadge = styled(Text, {
  background: '$surfaceInfoMuted',
  color: '$textInfoMuted',
  padding: '$1 $2',
  borderRadius: '$3',
  display: 'inline-flex',
  alignItems: 'center',

  '@media(max-width: 640px)': {
    padding: '$1',
  },

  '@media(max-width: 480px)': {
    padding: '2px 4px',
  },
})

export const ResponsiveGridView = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  gridColumnGap: '$4',
  gridRowGap: '$5',

  '@media(min-width: 640px)': {
    gridColumnGap: '$5',
    gridRowGap: '$6',
  },

  '@media(min-width: 853px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },

  '@media(min-width: 1280px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },

  '@media(min-width: 1600px)': {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
})

export const ResponsiveSearchBar = styled(SearchBar, {
  width: '100%',
  flex: '1 1 auto',
  minWidth: 0,

  '& input': {
    fontSize: '$4',
    padding: '$3',
    width: '100%',
  },

  '@media(max-width: 640px)': {
    '& input': {
      fontSize: '$3',
      padding: '$2',
    },
  },

  '@media(max-width: 480px)': {
    '& input': {
      fontSize: '$2',
      padding: '$1 $2',
    },
  },
})

export const MainContainer = styled('div', {
  width: '100%',
  maxWidth: '100%',
  margin: '0 auto',
  padding: '0 $4',

  '@media(min-width: 1400px)': {
    maxWidth: '1200px',
  },

  '@media(max-width: 640px)': {
    padding: '0 $2',
  },

  '@media(max-width: 480px)': {
    padding: '0 $1',
  },
})

export const EmptyStateContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$10 $4',
  minHeight: '400px',

  '@media(max-width: 640px)': {
    padding: '$8 $2',
    minHeight: '300px',
  },
})

export const EmptyStateImage = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '$4',

  '& img': {
    maxWidth: '100%',
    height: 'auto',
  },

  '@media(max-width: 640px)': {
    '& img': {
      width: '280px',
    },
  },

  '@media(max-width: 480px)': {
    '& img': {
      width: '240px',
    },
  },
})

export const PaginationContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '0.5rem',
  marginTop: '2rem',
  padding: '1rem 0',

  '@media (max-width: 768px)': {
    gap: '0.25rem',
    marginTop: '1.5rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
})

export const PaginationButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '2.5rem',
  height: '2.5rem',
  padding: '0.5rem',
  border: 'none',
  borderRadius: '0.375rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.2s',

  variants: {
    variant: {
      text: {
        color: '$lightGray',
        backgroundColor: 'transparent',

        '&:hover:not(:disabled)': {
          color: '$textNeutral',
          backgroundColor: '$surfaceMuted',
        },

        '&:disabled': {
          color: '$textDisabled',
          cursor: 'not-allowed',
        },
      },
      nav: {
        background: 'transparent',
        color: '$textStrong',
        fontSize: '1.05rem',
        fontWeight: 600,
        minWidth: 'auto',
        height: 'auto',
        padding: '0.25rem 0.5rem',
        borderRadius: 0,
        gap: '0.5rem',
        '&:hover:not(:disabled)': {
          color: '$darkGray',
        },
        '&:disabled': {
          opacity: 0.35,
          cursor: 'not-allowed',
        },
      },
      number: {
        color: '$textNeutral',
        backgroundColor: 'white',
        border: '1px solid $borderDefault',

        '&:hover': {
          backgroundColor: '$surfaceMuted',
        },
      },
    },
    isActive: {
      true: {
        backgroundColor: '$green',
        color: 'white',
        border: '1px solid $green',
      },
    },
  },

  '@media (max-width: 768px)': {
    minWidth: '2rem',
    height: '2rem',
    fontSize: '0.75rem',
  },
})

export const PaginationDots = styled('span', {
  display: 'flex',
  alignItems: 'center',
  padding: '0.5rem',
  color: '$textDisabled',
  fontSize: '0.875rem',

  '@media (max-width: 768px)': {
    fontSize: '0.75rem',
    padding: '0.25rem',
  },
})
