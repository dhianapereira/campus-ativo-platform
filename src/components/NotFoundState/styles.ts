import { styled } from '@/styles'

export const Card = styled('section', {
  position: 'relative',
  zIndex: 1,
  width: 'min(720px, 100%)',
  backgroundColor: '$white',
  border: '1px solid rgba(17, 24, 39, 0.08)',
  borderRadius: '28px',
  boxShadow: '0 28px 80px rgba(31, 41, 55, 0.12)',
  padding: '52px 48px',

  '@media (max-width: 900px)': {
    padding: '32px 24px',
    borderRadius: '24px',
  },
})

export const StatusBadge = styled('div', {
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
  marginBottom: '18px',
})

export const Code = styled('div', {
  marginBottom: '12px',
})

export const Title = styled('h1', {
  margin: 0,
  fontSize: '34px',
  lineHeight: 1.1,
  letterSpacing: '-0.03em',
  color: '$textHeadline',

  '@media (max-width: 900px)': {
    fontSize: '28px',
  },
})

export const Message = styled('p', {
  margin: '16px 0 0',
  maxWidth: '520px',
  fontSize: '17px',
  lineHeight: 1.65,
  color: '$textMuted',

  '@media (max-width: 900px)': {
    fontSize: '16px',
    maxWidth: 'unset',
  },
})

export const ActionRow = styled('div', {
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap',
  marginTop: '28px',
})

const baseButtonStyles = {
  appearance: 'none' as const,
  borderRadius: '14px',
  padding: '12px 18px',
  fontSize: '15px',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
}

export const PrimaryButton = styled('button', {
  ...baseButtonStyles,
  border: '1px solid $green',
  backgroundColor: '$green',
  color: '$white',

  '&:hover': {
    backgroundColor: '$lightGreen',
    borderColor: '$lightGreen',
  },
})

export const SecondaryButton = styled('button', {
  ...baseButtonStyles,
  border: '1px solid $gray200',
  backgroundColor: '$white',
  color: '$textNeutral',

  '&:hover': {
    backgroundColor: '$gray50',
    borderColor: '$gray300',
  },
})
