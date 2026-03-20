import { ComponentProps } from 'react'
import { styled } from '@/styles/stitches'

export const StatusBadge = styled('div', {
  fontFamily: '$default',
  fontSize: '$sm',
  fontWeight: '$medium',
  borderRadius: '$xs',
  display: 'inline-flex',
  padding: '$1 $3',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',

  variants: {
    variant: {
      toAnalysis: {
        color: '$darkBlue',
        backgroundColor: '$darkBlue12Bg',
      },
      inAnalysis: {
        color: '$blue',
        backgroundColor: '$blue12Bg',
      },
      accepted: {
        color: '$orange',
        backgroundColor: '$orange12Bg',
      },
      rejected: {
        color: '$red',
        backgroundColor: '$red12Bg',
      },
      inProgress: {
        color: '$yellow',
        backgroundColor: '$yellow12Bg',
      },
      finished: {
        color: '$lightGreen',
        backgroundColor: '$lightGreen12Bg',
      },
    },
  },

  defaultVariants: {
    variant: 'toAnalysis',
  },
})

export type StatusBadgeProps = ComponentProps<typeof StatusBadge>
StatusBadge.displayName = 'StatusBadge'
