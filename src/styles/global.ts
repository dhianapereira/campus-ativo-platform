import { globalCss } from '@campusativo-ui/react'

export const globalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
  },

  body: {
    backgroundColor: '$greenishWhite',
    color: '$gray',
    '-webkit-font-smoothing': 'antialiased',
    overflow: 'hidden',
  },
})
