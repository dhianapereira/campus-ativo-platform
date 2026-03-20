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

export const PageTitle = styled('h1', {
  fontSize: '2rem',
  fontWeight: 600,
  color: '$darkGray',
  margin: '0 0 1.5rem 0',

  '@media(max-width: 640px)': {
    fontSize: '1.5rem',
    margin: '0 0 1rem 0',
  },
})

export const SearchActionsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginBottom: '2rem',
})

export const FiltersAndActionRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  justifyContent: 'space-between',
})

export const FiltersContainer = styled('div', {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap',
  flex: 1,
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
  border: '1px solid #d1d5db',

  variants: {
    isActive: {
      true: {
        backgroundColor: '#00875F',
        color: 'white',
        border: '1px solid #00875F',
      },
      false: {
        backgroundColor: 'white',
        color: '$lightGray',
        border: '1px solid #d1d5db',
        '&:hover': {
          backgroundColor: '#f3f4f6',
          color: '#374151',
        },
      },
    },
  },
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
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  transition: 'all 0.2s ease',
  maxWidth: '100%',
  borderRadius: '$md',

  '&:focus-within': {
    borderColor: '#4a9960',
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
  color: '#6c757d',
  paddingLeft: '1rem',
  marginRight: '0.75rem',
  flexShrink: 0,
})

export const SearchInput = styled('input', {
  all: 'unset',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  fontSize: '$4',
  color: '#212529',
  width: '100%',
  height: '46px',
  padding: '$3',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',

  '&::placeholder': {
    color: '#6c757d',
    fontWeight: 'normal',
  },

  '@media(max-width: 640px)': {
    fontSize: '$3',
    height: '48px',
    padding: '$2',
  },
})

export const ActionsContainer = styled('div', {
  display: 'none',
  gap: '0.5rem',
  justifyContent: 'center',
  flexWrap: 'wrap',
  marginBottom: '1.5rem',

  '@media(max-width: 768px)': {
    display: 'flex',
  },
})

export const ActionButton = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.625rem 1.25rem',
  borderRadius: '$card',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap',

  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  '@media(max-width: 768px)': {
    padding: '0.625rem',
    minWidth: '44px',
    minHeight: '44px',
    borderRadius: '$card',

    '& svg': {
      margin: 0,
    },

    '& span': {
      display: 'none',
    },
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: '#00875F',
        color: 'white',
        '&:hover:not(:disabled)': {
          backgroundColor: '#00a66f',
        },
      },
      danger: {
        backgroundColor: 'white',
        color: '#dc2626',
        border: '2px solid #dc2626',
        '&:hover:not(:disabled)': {
          backgroundColor: '#fef2f2',
        },

        '@media(max-width: 768px)': {
          border: '1.5px solid #dc2626',
        },
      },
    },
  },

  defaultVariants: {
    variant: 'primary',
  },
})

export const ItemsCount = styled('p', {
  fontSize: '0.875rem',
  color: '$lightGray',
  marginBottom: '1rem',
})

export const SelectedCount = styled('p', {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '$darkGray',
  marginBottom: '1rem',
})

export const DesktopTableWrapper = styled('div', {
  width: '100%',
  '@media (max-width: 640px)': {
    display: 'none',
  },
})

export const TableWrapper = styled('div', {
  width: '100%',
  backgroundColor: '#FFFFFF',
  borderRadius: '14px',
  boxShadow:
    '0 10px 24px -12px rgba(0,0,0,0.18), 0 6px 12px -6px rgba(0,0,0,0.10)',
  overflow: 'hidden',
  padding: '0 2rem',

  '@media (max-width: 768px)': {
    padding: '0 1.25rem',
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
  background: '#FFFFFF',
  padding: '1.25rem 0',
  textAlign: 'left',
  fontWeight: 600,
  fontSize: '1rem',
  color: '#1f2937',
  position: 'relative',
  borderBottom: '2px solid #00875F',

  '&:first-child': {
    width: '60px',
    minWidth: '60px',
    maxWidth: '60px',
  },

  '@media (max-width: 768px)': {
    padding: '1rem 0',
    fontSize: '0.9rem',
  },
})

export const TableRow = styled('tr', {
  background: '#FFFFFF',
  borderBottom: '1px solid rgba(0, 0, 0, 0.07)',
  transition: 'background-color 0.2s ease',

  variants: {
    isHeader: {
      true: {
        borderBottom: 'none',
      },
      false: {
        '&:hover': {
          backgroundColor: '#f3f4f6',
        },
        '&:last-child': {
          borderBottom: 'none',
        },
      },
    },
  },
})

export const TableCell = styled('td', {
  padding: '1.25rem 0',
  color: '#374151',
  fontSize: '0.95rem',
  lineHeight: 1.5,
  verticalAlign: 'middle',
  fontWeight: 400,

  '&:first-child': {
    width: '60px',
    minWidth: '60px',
    maxWidth: '60px',
  },

  '@media (max-width: 768px)': {
    padding: '1rem 0',
    fontSize: '0.85rem',
  },
})

export const Checkbox = styled('input', {
  width: '1.125rem',
  height: '1.125rem',
  borderRadius: '0.25rem',
  border: '1px solid #d1d5db',
  cursor: 'pointer',
  accentColor: '#00875F',

  '&:focus': {
    outline: '2px solid #00875F',
    outlineOffset: '2px',
  },
})

export const MobileCardsWrapper = styled('div', {
  display: 'none',

  '@media(max-width: 768px)': {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
})

export const ItemCard = styled('div', {
  backgroundColor: 'white',
  borderRadius: '0.75rem',
  padding: '1rem',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  position: 'relative',

  '&:hover': {
    boxShadow:
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },

  '& input[type="checkbox"]': {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
  },
})

export const CardTitle = styled('h3', {
  fontSize: '1rem',
  fontWeight: 600,
  color: '$darkGray',
  marginBottom: '0.5rem',
  paddingRight: '2rem',
})

export const CardInfo = styled('p', {
  fontSize: '0.875rem',
  color: '$lightGray',
  marginBottom: '0.25rem',
})

export const CardDescription = styled('p', {
  fontSize: '0.875rem',
  color: '#9ca3af',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  marginBottom: '0.75rem',
})

export const CardStatus = styled('span', {
  display: 'inline-block',
  padding: '0.375rem 0.75rem',
  borderRadius: '1rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  backgroundColor: '#dbeafe',
  color: '#1e40af',
  marginTop: '0.5rem',
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
        color: '#2F2F2F',
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
        color: '#374151',
        backgroundColor: 'white',
        border: '1px solid #d1d5db',

        '&:hover': {
          backgroundColor: '#f3f4f6',
        },
      },
    },
    isActive: {
      true: {
        backgroundColor: '#00875F',
        color: 'white',
        border: '1px solid #00875F',
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
  color: '#9ca3af',
  fontSize: '0.875rem',

  '@media (max-width: 768px)': {
    fontSize: '0.75rem',
    padding: '0.25rem',
  },
})

export const EmptyState = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem 2rem',
  textAlign: 'center',
})

export const EmptyStateIcon = styled('div', {
  color: '#d1d5db',
  marginBottom: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const EmptyStateTitle = styled('h3', {
  fontSize: '1.25rem',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '0.5rem',
})

export const EmptyStateMessage = styled('p', {
  fontSize: '0.875rem',
  color: '$lightGray',
  maxWidth: '400px',
})

export const ErrorState = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem 2rem',
  textAlign: 'center',
})

export const ErrorStateIcon = styled('div', {
  color: '#ef4444',
  marginBottom: '1rem',
})

export const ErrorStateTitle = styled('h3', {
  fontSize: '1.25rem',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '0.5rem',
})

export const ErrorStateMessage = styled('p', {
  fontSize: '0.875rem',
  color: '$lightGray',
  maxWidth: '400px',
  marginBottom: '1.5rem',
})

export const RetryButton = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  padding: '0.75rem 1.5rem',
  borderRadius: '2rem',
  backgroundColor: '#00875F',
  color: 'white',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',

  '&:hover': {
    backgroundColor: '#00a66f',
  },

  '&:active': {
    transform: 'scale(0.98)',
  },
})
