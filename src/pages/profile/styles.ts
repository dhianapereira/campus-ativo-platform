import { styled } from '@/styles'

export const MainContainer = styled('div', {
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '2rem 1.5rem',

  '@media(max-width: 768px)': {
    padding: '1.5rem 1rem',
  },
})

export const HeaderContainer = styled('div', {
  marginBottom: '2rem',
})

export const PageTitle = styled('h1', {
  fontSize: '1.875rem',
  fontWeight: 700,
  color: '#1f2937',
  marginBottom: '0.5rem',

  '@media(max-width: 768px)': {
    fontSize: '1.5rem',
  },
})

export const PageSubtitle = styled('p', {
  fontSize: '1rem',
  color: '#6b7280',
})

export const SectionsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
})

export const Section = styled('div', {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '1.5rem',
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',

  '@media(max-width: 768px)': {
    padding: '1.25rem',
  },
})

export const SectionHeader = styled('div', {
  marginBottom: '1.5rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #e5e7eb',
})

export const SectionTitle = styled('h2', {
  fontSize: '1.25rem',
  fontWeight: 600,
  color: '#1f2937',
  marginBottom: '0.25rem',
})

export const SectionDescription = styled('p', {
  fontSize: '0.875rem',
  color: '#6b7280',
})

export const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
})

export const FormGroup = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
})

export const Label = styled('label', {
  fontSize: '0.875rem',
  fontWeight: 500,
  color: '#374151',
})

export const Input = styled('input', {
  width: '100%',
  padding: '0.625rem 0.875rem',
  fontSize: '0.875rem',
  color: '#1f2937',
  backgroundColor: 'white',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  outline: 'none',
  transition: 'border-color 0.2s',

  '&:focus': {
    borderColor: '#00875F',
  },

  '&:disabled': {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
    cursor: 'not-allowed',
  },

  '&::placeholder': {
    color: '#9ca3af',
  },
})

export const FormRow = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',

  '@media(max-width: 768px)': {
    gridTemplateColumns: '1fr',
  },
})

export const ButtonsContainer = styled('div', {
  display: 'flex',
  gap: '0.75rem',
  justifyContent: 'flex-end',
  marginTop: '0.5rem',

  '@media(max-width: 768px)': {
    flexDirection: 'column-reverse',
  },
})

export const Button = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.625rem 1.25rem',
  borderRadius: '8px',
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
    width: '100%',
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
      secondary: {
        backgroundColor: 'white',
        color: '#374151',
        border: '1px solid #d1d5db',
        '&:hover:not(:disabled)': {
          backgroundColor: '#f9fafb',
        },
      },
      danger: {
        backgroundColor: '#dc2626',
        color: 'white',
        '&:hover:not(:disabled)': {
          backgroundColor: '#b91c1c',
        },
      },
    },
  },

  defaultVariants: {
    variant: 'primary',
  },
})

export const ErrorMessage = styled('span', {
  fontSize: '0.75rem',
  color: '#dc2626',
})

export const DangerZone = styled('div', {
  marginTop: '0.5rem',
  padding: '1rem',
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '8px',
})

export const DangerText = styled('p', {
  fontSize: '0.875rem',
  color: '#991b1b',
  marginBottom: '1rem',
  lineHeight: 1.5,
})

export const InfoBox = styled('div', {
  padding: '1rem',
  backgroundColor: '#f0fdf4',
  border: '1px solid #bbf7d0',
  borderRadius: '8px',
  marginBottom: '1rem',
})

export const InfoText = styled('p', {
  fontSize: '0.875rem',
  color: '#166534',
  lineHeight: 1.5,
})
