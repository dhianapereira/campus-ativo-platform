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
        color: '#6b7280',
        border: '1px solid #d1d5db',
        '&:hover': {
          backgroundColor: '#f3f4f6',
          color: '#374151',
        },
      },
    },
  },
})

export const PageTitle = styled('h1', {
  fontSize: '2rem',
  fontWeight: 600,
  color: '#111827',
  margin: '1.5rem 0 2rem 0',

  '@media(max-width: 640px)': {
    fontSize: '1.5rem',
    margin: '1rem 0 1.5rem 0',
  },
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
        color: '#6b7280',
        border: '1px solid #d1d5db',
        '&:hover': {
          backgroundColor: '#f3f4f6',
          color: '#374151',
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
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  transition: 'all 0.2s ease',
  maxWidth: '100%',
  borderRadius: '8px 0 0 8px',
  borderRight: 'none',

  '&:focus-within': {
    borderColor: '#4a9960',
    borderRight: 'none',
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

export const SearchButton = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  fontSize: '$4',
  fontWeight: 500,
  color: '#ffffff',
  backgroundColor: '#00875F',
  padding: '$3 $4',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '46px',
  transition: 'all 0.2s ease',
  borderRadius: '0 8px 8px 0',
  border: '1px solid #00875F',
  borderLeft: 'none',

  '&:hover': {
    backgroundColor: '#5A9B6D',
  },

  '&:focus': {
    outline: '2px solid #4a9960',
    outlineOffset: '2px',
    position: 'relative',
    zIndex: 1,
  },

  '@media(max-width: 640px)': {
    fontSize: '0.875rem',
    height: '48px',
    padding: '0 1.5rem',
    minWidth: '120px',
    flex: '0 0 auto',
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
  padding: '0.75rem 1.25rem',
  borderRadius: '0.5rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap',

  variants: {
    variant: {
      delete: {
        backgroundColor: 'transparent',
        color: '#dc2626',
        border: '1px solid #dc2626',

        '&:hover:not(:disabled)': {
          backgroundColor: '#fef2f2',
        },

        '&:disabled': {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      },
      add: {
        backgroundColor: '#00875F',
        color: 'white',
        border: '1px solid #00875F',

        '&:hover': {
          backgroundColor: '#065f46',
        },
      },
      'mobile-add': {
        display: 'none',
        backgroundColor: '#00875F',
        color: 'white',
        border: '1px solid #00875F',
        borderLeft: '1px solid #00875F',
        borderRadius: '8px',
        padding: '0',
        minWidth: '48px',
        width: '48px',
        height: '46px',
        flex: '0 0 48px',
        marginLeft: '0.5rem',

        '&:hover': {
          backgroundColor: '#065f46',
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

  '@media(max-width: 640px)': {
    width: '100%',
    justifyContent: 'center',
  },
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
  borderBottom: '1px solid #e5e7eb',
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

  '@media (max-width: 640px)': {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
  },
})

export const LocationCard = styled('div', {
  background: '#FFFFFF',
  borderRadius: '16px',
  padding: '1.25rem',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
  display: 'flex',
  gap: '1rem',
  alignItems: 'flex-start',
  transition: 'all 0.2s ease',
  border: '1px solid #f3f4f6',
  width: '100%',
  boxSizing: 'border-box',

  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)',
    transform: 'translateY(-1px)',
  },
})

export const CategoryCard = styled('div', {
  background: '#FFFFFF',
  borderRadius: '16px',
  padding: '1.25rem',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
  display: 'flex',
  gap: '1rem',
  alignItems: 'flex-start',
  transition: 'all 0.2s ease',
  border: '1px solid #f3f4f6',
  width: '100%',
  boxSizing: 'border-box',

  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)',
    transform: 'translateY(-1px)',
  },
})

export const CardTitle = styled('h3', {
  margin: '0 0 0.5rem 0',
  fontSize: '0.875rem',
  lineHeight: 1.4,
  fontWeight: 400,
  color: '#111827',
  '& strong': {
    fontWeight: 700,
    color: '#111827',
  },
})

export const CardInfo = styled('p', {
  margin: '0 0 0.5rem 0',
  fontSize: '0.875rem',
  lineHeight: 1.5,
  fontWeight: 500,
  color: '#374151',
})

export const CardDescription = styled('div', {
  margin: 0,
  fontSize: '0.875rem',
  lineHeight: 1.5,
  fontWeight: 400,
  color: '#111827',

  '& strong': {
    color: '#111827',
    fontWeight: 700,
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
          color: '#111827',
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
