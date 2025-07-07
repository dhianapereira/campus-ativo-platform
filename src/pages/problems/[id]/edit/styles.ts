import {
  Heading,
  Text,
  styled,
  TextArea,
  TextInput,
} from '@campusativo-ui/react'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  backgroundColor: '$greenishWhite',
})

export const Header = styled('header', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0 $4',
  height: '12vh',
  minHeight: '80px',
  maxHeight: '120px',
  borderBottom: '1px solid $lightGray',
  gap: '$2',

  '& .back-icon': {
    cursor: 'pointer',
    flexShrink: 0,
  },

  '@media (max-width: 768px)': {
    padding: '0 $3',
    height: '10vh',
    minHeight: '70px',
  },

  '@media (max-width: 480px)': {
    padding: '0 $2',
    height: '8vh',
    minHeight: '60px',
  },
})

export const Title = styled(Heading, {
  marginLeft: '$4',
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',

  '@media (max-width: 640px)': {
    marginLeft: '$3',
    fontSize: '$4',
  },

  '@media (max-width: 480px)': {
    marginLeft: '$2',
    fontSize: '$3',
  },
})

export const Body = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  padding: '$6',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '$6',
  width: '100%',
  overflowY: 'auto',
  flexGrow: 1,
  alignSelf: 'center',
  minHeight: '70vh',
  maxWidth: '600px',
  margin: '0 auto',

  '> *': {
    width: '100%',
    boxSizing: 'border-box',
  },

  '@media (max-width: 768px)': {
    padding: '$4',
    gap: '$4',
    maxWidth: '100%',
  },

  '@media (max-width: 640px)': {
    padding: '$3',
    gap: '$3',
  },

  '@media (max-width: 480px)': {
    padding: '$2',
    gap: '$2',
    minHeight: '60vh',
  },
})

export const Input = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '$4',
  width: '100%',
  boxSizing: 'border-box',

  [`> ${Text}`]: {
    color: '$darkGray',
    fontWeight: '$medium',
  },

  '> *': {
    width: '100%',
    boxSizing: 'border-box',
  },

  [`> ${TextInput}`]: {
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
  },

  [`> ${TextArea}`]: {
    width: '100% !important',
    minWidth: 0,
    maxWidth: '100%',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: '120px',
  },

  '& .error-message': {
    color: '$red',
    fontWeight: '$medium',
  },

  '@media (max-width: 640px)': {
    gap: '$3',

    [`> ${TextArea}`]: {
      minHeight: '100px',
    },
  },

  '@media (max-width: 480px)': {
    gap: '$2',

    [`> ${TextArea}`]: {
      minHeight: '80px',
    },
  },
})
