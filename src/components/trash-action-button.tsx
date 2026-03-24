import { styled } from '@/styles'

export const TrashActionButton = styled('button', {
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
      },
    },
    mobileBehavior: {
      full: {},
      iconOnly: {
        '@media(max-width: 768px)': {
          padding: '0.625rem',
          minWidth: '44px',
          minHeight: '44px',
          borderRadius: '$card',

          '& svg': {
            margin: 0,
          },

          '& .label': {
            display: 'none',
          },
        },
      },
    },
  },

  defaultVariants: {
    variant: 'primary',
    mobileBehavior: 'full',
  },
})
