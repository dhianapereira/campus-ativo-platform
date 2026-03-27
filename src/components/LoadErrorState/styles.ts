import { styled } from '@/styles'

export const Container = styled('section', {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  padding: '12px 0 24px',
})

export const Card = styled('div', {
  position: 'relative',
  width: 'min(760px, 100%)',
  padding: '32px',
  borderRadius: '24px',
  backgroundColor: '$white',
  border: '1px solid $borderLight',
  boxShadow: '0 24px 60px rgba(31, 41, 55, 0.08)',

  '@media (max-width: 768px)': {
    padding: '24px',
    borderRadius: '20px',
  },
})

export const Header = styled('div', {
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '20px',
})

export const IconWrap = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '56px',
  height: '56px',
  borderRadius: '18px',
  backgroundColor: '$surfaceWarning',
  color: '$textWarningAccent',
  boxShadow: 'inset 0 0 0 1px rgba(217, 119, 6, 0.14)',
  flexShrink: 0,
})

export const Badge = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
  width: 'fit-content',
  padding: '8px 14px',
  borderRadius: '$full',
  backgroundColor: '$gray50',
  border: '1px solid $gray200',
  color: '$textSecondary',
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
})

export const Title = styled('h2', {
  position: 'relative',
  zIndex: 1,
  margin: 0,
  fontSize: 'clamp(1.5rem, 2vw, 2rem)',
  lineHeight: 1.15,
  letterSpacing: '-0.03em',
  color: '$textHeadline',
})

export const Description = styled('p', {
  position: 'relative',
  zIndex: 1,
  margin: '14px 0 0',
  maxWidth: '58ch',
  fontSize: '1rem',
  lineHeight: 1.7,
  color: '$textMuted',
})

export const Tips = styled('ul', {
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  margin: '20px 0 0',
  padding: 0,
  listStyle: 'none',
})

export const Tip = styled('li', {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 14px',
  borderRadius: '999px',
  backgroundColor: '$surfaceSubtle',
  border: '1px solid $borderSoft',
  color: '$textNeutral',
  fontSize: '0.9375rem',
  lineHeight: 1.4,

  '&::before': {
    content: '""',
    width: '7px',
    height: '7px',
    borderRadius: '$full',
    backgroundColor: '$brandPrimary',
    flexShrink: 0,
  },
})

export const Actions = styled('div', {
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  marginTop: '24px',
})
