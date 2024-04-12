import { styled } from '@campusativo-ui/react'

export const GridView = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  gridColumnGap: '$5',
  gridRowGap: '$6',

  '@media(min-width: 853px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },

  '@media(min-width: 1280px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
})
