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

export const SectionTitle = styled('h2', {
  margin: 0,
  color: '#111827',
  fontWeight: 700,
  lineHeight: 1.3,
  fontSize: '1.5rem',

  '@media(max-width: 768px)': {
    fontSize: '1.375rem',
  },

  '@media(max-width: 480px)': {
    fontSize: '1.25rem',
  },
})

export const SearchContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  maxWidth: '640px', // largura reduzida em desktop
  gap: 0,
  '@media(max-width: 768px)': {
    maxWidth: '100%', // mobile ocupa toda a largura
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

  '@media(max-width: 480px)': {
    fontSize: '$2',
    height: '44px',
    padding: '$2',
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
  '@media (max-width: 640px)': {
    display: 'none',
  },
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

export const DesktopTableWrapper = styled('div', {
  width: '100%',
  '@media (max-width: 640px)': {
    display: 'none',
  },
})

export const MobileCardsWrapper = styled('div', {
  display: 'none',
  '@media (max-width: 640px)': {
    display: 'flex',
    flexDirection: 'column',
    gap: '$4',
  },
})

export const MemberCard = styled('div', {
  background: '#FFFFFF',
  borderRadius: '16px',
  padding: '$6 $6 $6 $6',
  boxShadow:
    '0 10px 22px -10px rgba(0,0,0,0.18), 0 4px 10px -6px rgba(0,0,0,0.10)',
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',

  '&:hover': {
    backgroundColor: '#f3f4f6',
  },
})

export const MemberCardName = styled('h3', {
  margin: 0,
  fontSize: '1.25rem',
  lineHeight: 1.3,
  fontWeight: 700,
  color: '#111827',
})

export const MemberCardEmail = styled('p', {
  margin: 0,
  fontSize: '1rem',
  lineHeight: 1.4,
  fontWeight: 400,
  color: '#374151',
  wordBreak: 'break-word',
})

export const MemberCardPosition = styled('p', {
  margin: 0,
  fontSize: '1.05rem',
  lineHeight: 1.4,
  fontWeight: 500,
  color: '#111827',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5ch',
  '& span.label': {
    fontWeight: 700,
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
  '&:first-child': { width: '33%' },
  '&:nth-child(2)': { width: '37%' },
  '&:nth-child(3)': { width: '30%' },
  '@media (max-width: 768px)': {
    padding: '1rem 0',
    fontSize: '0.9rem',
  },
})

export const SearchBar = styled('div', {
  display: 'flex',
  alignItems: 'center',
  padding: '0.5rem',
  border: '1px solid #E5E5E5',
  borderRadius: '0.375rem',
  background: '#FFFFFF',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  '&:focus-within': {
    borderColor: '#00875F',
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
        cursor: 'pointer',
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
  '@media (max-width: 768px)': {
    padding: '1rem 0',
    fontSize: '0.85rem',
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
        color: '#6b7280',
        backgroundColor: 'transparent',

        '&:hover:not(:disabled)': {
          color: '#374151',
          backgroundColor: '#f3f4f6',
        },

        '&:disabled': {
          color: '#d1d5db',
          cursor: 'not-allowed',
        },
      },
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

export const FiltersContainer = styled('div', {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap',
  marginBottom: '1.5rem',

  '@media(max-width: 640px)': {
    marginBottom: '1rem',
  },
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
