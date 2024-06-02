import { Box, styled } from '@campusativo-ui/react'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
})

export const Label = styled('label', {
  marginBottom: '$2',
  color: '$gray',
  fontSize: '$md',
  fontFamily: '$default',
  fontWeight: '$bold',
})

export const Icon = styled('div', {
  position: 'absolute',
  top: '50%',
  right: '$4',
  pointerEvents: 'none',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const SelectWrapper = styled('div', {
  position: 'relative',
  display: 'inline-block',
  width: 280,
  height: 60,
})

export const Select = styled(Box, {
  width: '100%',
  height: '100%',
  appearance: 'none',
  padding: '$4',
  backgroundColor: '$white',
  color: '$darkGray',
  fontFamily: '$default',
  fontSize: '$md',
  borderRadius: '$md',
  border: '1px solid #ccc',
  boxSizing: 'border-box',
  cursor: 'pointer',

  '&:focus': {
    outline: 'none',
    borderColor: '$green',
    borderWidth: '2px',
  },

  '& option': {
    color: '$darkGray',
    background: '$white',
    borderRadius: '$md',
  },
})
