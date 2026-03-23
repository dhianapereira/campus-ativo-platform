import { styled } from '@/styles'

export const MainContainer = styled('div', {
  width: '100%',
  maxWidth: '100%',
  margin: '0 auto',
  padding: '0 $4',
  backgroundColor: '$greenishWhite',

  '@media(min-width: 1400px)': {
    maxWidth: '1200px',
  },

  '@media(max-width: 640px)': {
    padding: '0 $2',
  },

  '@media(max-width: 480px)': {
    padding: '0 $1',
  },
})

export const DashboardHeader = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  marginBottom: '2rem',

  '@media(max-width: 640px)': {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
})

export const DashboardTitle = styled('h2', {
  margin: 0,
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '$darkGray',
})

export const FilterSelect = styled('select', {
  padding: '6px 12px',
  borderRadius: '$card',
  fontSize: '10px',
  fontWeight: 400,
  border: '1px solid $darkGray',
  backgroundColor: 'white',
  color: '$darkGray',
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23121214' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
})

export const MetricsGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '10px',
  marginBottom: '2rem',

  '@media(min-width: 641px)': {
    gap: '1.5rem',
  },
})

export const MetricCard = styled('div', {
  backgroundColor: 'white',
  border: '1px solid rgba(0, 0, 0, 0.07)',
  borderRadius: '$card',
  padding: '1rem 1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  minHeight: '64px',

  '@media(min-width: 641px)': {
    padding: '1.5rem',
  },
})

export const MetricIconWrapper = styled('div', {
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,

  variants: {
    variant: {
      blue: { backgroundColor: '$blue12Bg', color: '$darkBlue' },
      indigo: { backgroundColor: '$blue12Bg', color: '$blue' },
      orange: { backgroundColor: '$orange12Bg', color: '$orange' },
    },
  },
})

export const MetricValue = styled('span', {
  fontSize: '1.5rem',
  fontWeight: 700,
  color: '$gray',
  display: 'block',
  lineHeight: 1.6,

  '@media(min-width: 641px)': {
    fontSize: '1.75rem',
  },
})

export const MetricLabel = styled('span', {
  fontSize: '0.9375rem',
  color: '$gray',
  display: 'block',
  lineHeight: 1.6,
})

export const TopGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '10px',
  marginBottom: '2rem',

  '@media(min-width: 641px)': {
    gap: '1.5rem',
  },
})

export const Card = styled('div', {
  backgroundColor: 'white',
  border: '1px solid rgba(0, 0, 0, 0.07)',
  borderRadius: '$card',
  padding: '10px 15px',
  minHeight: '79px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',

  '@media(min-width: 641px)': {
    padding: '1.5rem',
    minHeight: 'auto',
  },
})

export const CardTitle = styled('h3', {
  margin: '0 0 0.5rem',
  fontSize: '10px',
  fontWeight: 700,
  color: '$gray',
  textAlign: 'center',

  '@media(min-width: 641px)': {
    fontSize: '1rem',
    textAlign: 'left',
  },
})

export const TopList = styled('ol', {
  margin: 0,
  paddingLeft: '1.25rem',
  listStyle: 'decimal',
})

export const TopListItem = styled('li', {
  fontSize: '9px',
  color: '$gray',
  marginBottom: '0.25rem',
  lineHeight: 1.5,

  '@media(min-width: 641px)': {
    fontSize: '0.9375rem',
    marginBottom: '0.5rem',
  },
})

export const EmptyTopMessage = styled('p', {
  margin: 0,
  fontSize: '0.9375rem',
  color: '$lightGray',
  fontStyle: 'italic',
})

export const ChartCard = styled(Card, {
  marginBottom: '2rem',
  padding: '17px 19px',
  minHeight: 'auto',

  '@media(min-width: 641px)': {
    padding: '1.5rem',
  },
})

export const ChartTitleRow = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  marginBottom: '1rem',
})

export const ChartLegend = styled('div', {
  display: 'flex',
  gap: '1.5rem',
  flexWrap: 'wrap',
})

export const ChartLegendItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '8px',
  color: '$gray',

  '@media(min-width: 641px)': {
    fontSize: '0.875rem',
  },
})

export const ChartLegendColor = styled('span', {
  width: '8px',
  height: '8px',
  borderRadius: '2px',

  '@media(min-width: 641px)': {
    width: '14px',
    height: '14px',
  },
})

export const ChartWrapper = styled('div', {
  display: 'flex',
  gap: '1rem',
  marginTop: '0.5rem',
  minHeight: '200px',
})

export const ChartYAxis = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  paddingRight: '0.5rem',
  fontSize: '8px',
  color: '$gray',
  height: '180px',

  '@media(min-width: 641px)': {
    fontSize: '0.75rem',
  },
})

export const ChartBars = styled('div', {
  display: 'flex',
  alignItems: 'flex-end',
  gap: '1rem',
  flex: 1,
  minHeight: '200px',
})

export const ChartBarGroup = styled('div', {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
})

export const ChartBarWrapper = styled('div', {
  display: 'flex',
  gap: '4px',
  alignItems: 'flex-end',
  height: '180px',
  width: '100%',
  maxWidth: '80px',
})

export const ChartBar = styled('div', {
  flex: 1,
  borderRadius: '4px 4px 0 0',
  minHeight: '4px',
  transition: 'height 0.3s ease',
})

export const ChartMonthLabel = styled('span', {
  fontSize: '8px',
  color: '$gray',

  '@media(min-width: 641px)': {
    fontSize: '0.75rem',
  },
})

export const ErrorState = styled('div', {
  textAlign: 'center',
  padding: '3rem 2rem',
})

export const ErrorTitle = styled('p', {
  margin: '0 0 0.5rem',
  fontSize: '1.125rem',
  fontWeight: 600,
  color: '$darkGray',
})

export const ErrorMessage = styled('p', {
  margin: '0 0 1rem',
  fontSize: '0.9375rem',
  color: '$lightGray',
})
