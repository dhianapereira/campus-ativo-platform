import { styled } from '@/styles'
import { Box, Text } from '@/components'

export const Container = styled(Box, {
  width: 324,
  height: 195,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  cursor: 'pointer',
})

export const Title = styled(Text, {
  fontWeight: '$bold',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  marginBottom: 10,
  maxWidth: 276,
  lineHeight: '130%',
})

export const Location = styled(Text, {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: 276,
  lineHeight: '130%',
  marginBottom: 10,

  '&:before': {
    content: 'Local: ',
    fontWeight: '$bold',
  },
})

export const Description = styled(Text, {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitLineClamp: 3,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  lineHeight: '130%',
  maxWidth: 276,
  marginBottom: 10,
})
