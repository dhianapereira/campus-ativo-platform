import { styled } from '@/styles'

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

export const HeaderContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  marginBottom: '$6',

  '@media(max-width: 640px)': {
    gap: '$3',
    marginBottom: '$4',
  },
})

export const TabsContainer = styled('div', {
  display: 'flex',
  gap: '0.5rem',
})

export const Tab = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  padding: '0.75rem 1.5rem',
  borderRadius: '2rem',
  fontSize: '1rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: '1px solid $borderDefault',

  variants: {
    isActive: {
      true: {
        backgroundColor: '$green',
        color: 'white',
        border: '1px solid $green',
      },
      false: {
        backgroundColor: 'white',
        color: '$lightGray',
        border: '1px solid $borderDefault',
        '&:hover': {
          backgroundColor: '$surfaceMuted',
          color: '$textNeutral',
        },
      },
    },
  },
})

export const PageTitle = styled('h1', {
  fontSize: '1.25rem',
  fontWeight: 600,
  color: '$darkGray',
  margin: '0 0 1.5rem 0',
})

export const SearchActionsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginBottom: '2rem',
})

export const SearchAndFiltersRow = styled('div', {
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: '2rem',

  '@media(max-width: 1024px)': {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '1.5rem',
  },
})

export const FiltersContainer = styled('div', {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap',
})

export const FilterButton = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  padding: '0.5rem 1rem',
  borderRadius: '1.5rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: '1px solid $borderDefault',

  variants: {
    isActive: {
      true: {
        backgroundColor: '$green',
        color: 'white',
        border: '1px solid $green',
      },
      false: {
        backgroundColor: 'white',
        color: '$lightGray',
        border: '1px solid $borderDefault',
        '&:hover': {
          backgroundColor: '$surfaceMuted',
          color: '$textNeutral',
        },
      },
    },
  },
})

export const SearchContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  maxWidth: '640px',
  gap: 0,
  alignItems: 'stretch',

  '@media(max-width: 768px)': {
    maxWidth: '100%',
  },

  '@media(max-width: 640px)': {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: '48px',
  },
})

export const SearchInputContainer = styled('div', {
  position: 'relative',
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '$white',
  border: '1px solid $borderLight',
  transition: 'all 0.2s ease',
  maxWidth: '100%',
  borderRadius: '$md',

  '&:focus-within': {
    borderColor: '$borderSuccess',
  },

  '@media(max-width: 640px)': {
    flex: '1 1 auto',
    minWidth: 0,
  },
})

export const SearchIcon = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$textSecondary',
  paddingLeft: '1rem',
  marginRight: '0.75rem',
  flexShrink: 0,
})

export const SearchInput = styled('input', {
  all: 'unset',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  fontSize: '$4',
  color: '$textBody',
  width: '100%',
  height: '46px',
  padding: '$3',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',

  '&::placeholder': {
    color: '$textSecondary',
    fontWeight: 'normal',
  },

  '@media(max-width: 640px)': {
    fontSize: '$3',
    height: '48px',
    padding: '$2',
  },
})

export const ActionsContainer = styled('div', {
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',

  '@media(max-width: 640px)': {
    display: 'none',
  },
})

export const ActionButton = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  padding: '0.625rem 1.25rem',
  borderRadius: '$card',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap',

  variants: {
    variant: {
      delete: {
        backgroundColor: '$white',
        color: '$red',
        border: '2px solid $red',

        '&:hover:not(:disabled)': {
          backgroundColor: '$red',
          color: '$white',
        },
      },
      add: {
        backgroundColor: '$green',
        color: '$white',
        border: '1px solid $green',

        '&:hover': {
          backgroundColor: '$brandPrimaryPressed',
        },
      },
      'mobile-add': {
        display: 'none',
        backgroundColor: '$green',
        color: '$white',
        border: '1px solid $green',
        borderLeft: '1px solid $green',
        borderRadius: '$card',
        padding: '0',
        minWidth: '48px',
        width: '48px',
        height: '46px',
        flex: '0 0 48px',
        marginLeft: '0.5rem',

        '&:hover': {
          backgroundColor: '$brandPrimaryPressed',
        },

        '@media(max-width: 640px)': {
          display: 'flex',
          height: '48px',
          alignItems: 'center',
          justifyContent: 'center',
        },
      },
    },
  },

  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  '@media(max-width: 640px)': {
    width: '100%',
    justifyContent: 'center',
  },
})

export const DesktopTableWrapper = styled('div', {
  width: '100%',

  '@media(max-width: 640px)': {
    display: 'none',
  },
})

export const TableWrapper = styled('div', {
  width: '100%',
  backgroundColor: '$white',
  borderRadius: '14px',
  boxShadow:
    '0 10px 24px -12px rgba(0,0,0,0.18), 0 6px 12px -6px rgba(0,0,0,0.10)',
  overflow: 'hidden',

  '@media (max-width: 640px)': {
    display: 'none',
  },
})

export const Table = styled('table', {
  width: '100%',
  borderCollapse: 'collapse',
  background: 'transparent',
  fontSize: '0.95rem',

  '@media (max-width: 768px)': {
    fontSize: '0.875rem',
  },
})

export const TableHeader = styled('th', {
  background: '$white',
  textAlign: 'left',
  padding: '1.25rem 2rem',
  fontWeight: 600,
  fontSize: '1rem',
  color: '$textPrimary',
  position: 'relative',
  borderBottom: '2px solid $green',

  '&:first-child': { width: '18%' },
  '&:nth-child(2)': { width: '28%' },
  '&:nth-child(3)': { width: '18%' },
  '&:nth-child(4)': { width: '36%' },

  '@media (max-width: 768px)': {
    padding: '1rem 1.25rem',
    fontSize: '0.9rem',
  },
})

export const TableRow = styled('tr', {
  background: '$white',
  borderBottom: '1px solid rgba(0, 0, 0, 0.07)',
  transition: 'background-color 0.2s ease',

  variants: {
    isHeader: {
      true: {
        borderBottom: 'none',
      },
      false: {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '$surfaceMuted',
        },
        '&:last-child': {
          borderBottom: 'none',
        },
      },
    },
  },
})

export const TableCell = styled('td', {
  padding: '1.25rem 2rem',
  color: '$textNeutral',
  fontSize: '0.95rem',
  lineHeight: 1.5,
  verticalAlign: 'middle',

  '@media (max-width: 768px)': {
    padding: '1rem 1.25rem',
    fontSize: '0.85rem',
  },
})

export const Checkbox = styled('input', {
  width: '1rem',
  height: '1rem',
  cursor: 'pointer',
})

export const MobileCardsWrapper = styled('div', {
  display: 'none',
  gap: '$3',

  '@media(max-width: 768px)': {
    display: 'grid',
  },
})

export const LocationCard = styled('article', {
  backgroundColor: '$white',
  border: '1px solid $borderLight',
  borderRadius: '$lg',
  padding: '$4',
  display: 'grid',
  gap: '$2',
})

export const CardTitle = styled('h2', {
  margin: 0,
  fontSize: '$4',
  fontWeight: '$medium',
  color: '$textBody',
})

export const CardInfo = styled('p', {
  margin: 0,
  fontSize: '$2',
  color: '$textSecondary',
})

export const CardDescription = styled('p', {
  margin: 0,
  fontSize: '$3',
  color: '$textBody',
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
