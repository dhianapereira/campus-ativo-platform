import { styled } from '@/styles'
import { Button, Text } from '@/components'

export const ModalOverlay = styled('div', {
  position: 'fixed',
  inset: 0,
  background: 'rgba(18, 18, 20, 0.56)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$4',
  zIndex: 1400,
})

export const ModalContent = styled('div', {
  width: '100%',
  maxWidth: '980px',
  maxHeight: 'min(88vh, 920px)',
  overflow: 'hidden',
  borderRadius: '$card',
  background: '$surfaceBase',
  boxShadow: '0 24px 64px rgba(18, 18, 20, 0.18)',
  display: 'flex',
  flexDirection: 'column',
})

export const PanelContent = styled('section', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
})

export const ModalHeader = styled('div', {
  padding: '$6',
  borderBottom: '1px solid $borderSoft',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '$4',
})

export const ModalHeaderText = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
})

export const ModalTitle = styled('h2', {
  margin: 0,
  fontSize: '$xl',
  color: '$textStrong',
  lineHeight: 1.2,
})

export const ModalSubtitle = styled(Text, {
  color: '$textSecondary',
  maxWidth: '680px',
})

export const CloseButton = styled('button', {
  all: 'unset',
  cursor: 'pointer',
  color: '$textSecondary',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$sm',
  padding: '$1',

  '&:hover': {
    color: '$textStrong',
    background: '$surfaceMuted',
  },
})

export const ModalBody = styled('div', {
  padding: '$6',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '$5',
})

export const PanelBody = styled('div', {
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '$5',
})

export const InfoPanel = styled('section', {
  display: 'grid',
  gridTemplateColumns: '1.2fr 0.8fr',
  gap: '$4',

  '@media(max-width: 900px)': {
    gridTemplateColumns: '1fr',
  },
})

export const InfoCard = styled('div', {
  border: '1px solid $borderSoft',
  borderRadius: '$card',
  background: '$surfaceSubtle',
  padding: '$5',
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
})

export const CardTitle = styled('h3', {
  margin: 0,
  fontSize: '$md',
  color: '$textStrong',
})

export const ColumnExample = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '$2',
})

export const ColumnChip = styled('span', {
  padding: '$1 $2',
  borderRadius: '$pill',
  background: '$surfaceInfo',
  color: '$textInfo',
  fontSize: '$xs',
  fontWeight: 600,
})

export const FileCard = styled('div', {
  border: '1px dashed $borderDefault',
  borderRadius: '$card',
  background: '$surfaceBase',
  padding: '$5',
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
})

export const FileActions = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '$3',
  alignItems: 'center',
})

export const HiddenInput = styled('input', {
  display: 'none',
})

export const FileName = styled(Text, {
  color: '$textStrong',
  fontWeight: 600,
})

export const ErrorBanner = styled('div', {
  border: '1px solid $borderDangerLight',
  background: '$surfaceDanger',
  color: '$textDanger',
  borderRadius: '$md',
  padding: '$3 $4',
})

export const SummaryGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: '$3',

  '@media(max-width: 900px)': {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },

  '@media(max-width: 560px)': {
    gridTemplateColumns: '1fr',
  },
})

export const SummaryCard = styled('div', {
  borderRadius: '$card',
  border: '1px solid $borderSoft',
  background: '$surfaceBase',
  padding: '$4',
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
})

export const SummaryLabel = styled(Text, {
  color: '$textSecondary',
})

export const SummaryValue = styled('strong', {
  fontSize: '$2xl',
  lineHeight: 1,
  color: '$textStrong',
})

export const ResultsPanel = styled('section', {
  border: '1px solid $borderSoft',
  borderRadius: '$card',
  overflow: 'hidden',
  background: '$surfaceBase',
})

export const ResultsHeader = styled('div', {
  padding: '$4 $5',
  borderBottom: '1px solid $borderSoft',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$3',
})

export const ResultsMeta = styled(Text, {
  color: '$textSecondary',
})

export const ResultsList = styled('div', {
  maxHeight: '320px',
  overflowY: 'auto',
})

export const ResultRow = styled('div', {
  display: 'grid',
  gridTemplateColumns: '84px minmax(0, 1fr) auto',
  gap: '$3',
  alignItems: 'center',
  padding: '$3 $5',
  borderBottom: '1px solid $borderSoft',

  '&:last-child': {
    borderBottom: 'none',
  },

  '@media(max-width: 640px)': {
    gridTemplateColumns: '1fr',
  },
})

export const RowNumber = styled(Text, {
  color: '$textSecondary',
  fontWeight: 600,
})

export const RowContent = styled('div', {
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
})

export const RowTitle = styled(Text, {
  color: '$textStrong',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export const RowMessage = styled(Text, {
  color: '$textSecondary',
})

export const StatusBadge = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'fit-content',
  minHeight: '24px',
  padding: '0 $2',
  borderRadius: '$full',
  border: '1px solid transparent',
  fontSize: '$xs',
  fontWeight: '$bold',
  lineHeight: 1.2,
  letterSpacing: '0.02em',
  whiteSpace: 'nowrap',

  variants: {
    status: {
      ready: {
        backgroundColor: '$blue12Bg',
        color: '$blue',
      },
      imported: {
        backgroundColor: '$surfaceSuccess',
        color: '$textSuccess',
      },
      duplicate: {
        backgroundColor: '$surfaceWarning',
        color: '$textWarningAccent',
      },
      invalid: {
        backgroundColor: '$surfaceDanger',
        color: '$textDangerStrong',
      },
    },
  },
})

export const ModalFooter = styled('div', {
  paddingTop: '$1',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '$3',

  '@media(max-width: 640px)': {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
})

export const FooterHint = styled(Text, {
  color: '$textSecondary',
})

export const FooterActions = styled('div', {
  display: 'flex',
  gap: '$3',

  '@media(max-width: 640px)': {
    width: '100%',

    '& > button': {
      flex: 1,
    },
  },
})

export const SecondaryButton = styled(Button, {})

export const PrimaryButton = styled(Button, {})
