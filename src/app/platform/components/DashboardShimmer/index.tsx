import { styled, keyframes } from '@/styles'

const shimmer = keyframes({
  '0%': { backgroundPosition: '-200% 0' },
  '100%': { backgroundPosition: '200% 0' },
})

export const ShimmerBox = styled('div', {
  borderRadius: '$card',
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s ease-in-out infinite`,
})

export const MetricCardShimmer = styled(ShimmerBox, {
  height: '120px',
  width: '100%',
})

export const TopCardShimmer = styled(ShimmerBox, {
  height: '200px',
  width: '100%',
})

export const ChartShimmer = styled(ShimmerBox, {
  height: '280px',
  width: '100%',
})

export function DashboardShimmer() {
  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <MetricCardShimmer />
        <MetricCardShimmer />
        <MetricCardShimmer />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <TopCardShimmer />
        <TopCardShimmer />
      </div>
      <ChartShimmer />
    </>
  )
}
