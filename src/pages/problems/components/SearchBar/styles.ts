import { styled } from '@/styles'

export const SearchContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  gap: '$0',
})

export const SearchInputContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  flex: 1,
  position: 'relative',

  backgroundColor: '$white',
  border: '1px solid $gray200',
  transition: 'all 0.2s ease',
  maxWidth: '33.5rem',
  borderRadius: '$md',

  '&:focus-within': {
    borderColor: '$greenBorder',
  },
})

export const SearchIcon = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$gray600',
  paddingLeft: '$4',
  marginRight: '$3',
  flexShrink: 0,
})

export const SearchInput = styled('input', {
  all: 'unset',
  boxSizing: 'border-box',
  fontFamily: '$default',
  fontSize: '$md',
  color: '$gray900',
  width: '100%',
  height: '46px',
  padding: '$3 0',

  '&::placeholder': {
    color: '$gray600',
    fontWeight: '$normal',
  },
})

export const FilterButton = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  fontFamily: '$default',
  fontSize: '$md',
  fontWeight: '$medium',
  color: '$gray600',
  backgroundColor: '$white',
  padding: '$3 $4',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$2',
  height: '48px',
  borderRadius: '$md',
  border: '1px solid $gray200',
  transition: 'all 0.2s ease',

  marginLeft: '$3',

  '&:hover': {
    backgroundColor: '$graySurface',
    borderColor: '$gray250',
  },

  '&:focus': {
    outline: '2px solid $greenBorder',
    outlineOffset: '2px',
  },
})
