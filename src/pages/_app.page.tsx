import { globalStyles } from '@/styles/tokens/global'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/auth-context'
import { useState } from 'react'
import { useRouter } from 'next/router'
import PlatformLayout from '@/layouts/platform/layout'

globalStyles()

function shouldUsePlatformLayout(pathname: string) {
  if (pathname === '/' || pathname === '/home') {
    return true
  }

  return (
    pathname.startsWith('/members') ||
    pathname === '/problems' ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/trash') ||
    pathname.startsWith('/unauthorized')
  )
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error: unknown) => {
              const errorStatus = (error as { status?: number })?.status
              if (errorStatus === 401 || errorStatus === 403) {
                return false
              }
              return failureCount < 2
            },
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
          },
          mutations: {
            retry: (failureCount, error: unknown) => {
              const errorStatus = (error as { status?: number })?.status
              if (errorStatus === 401 || errorStatus === 403) {
                return false
              }
              if (
                errorStatus &&
                errorStatus >= 400 &&
                errorStatus < 500 &&
                errorStatus !== 429
              ) {
                return false
              }
              return failureCount < 1
            },
            onError: (error: unknown) => {
              const errorStatus = (error as { status?: number })?.status
              if (errorStatus === 401) {
                if (typeof window !== 'undefined') {
                  window.location.href = '/login'
                }
              }
            },
          },
        },
      }),
  )

  const page = <Component {...pageProps} />
  const content = shouldUsePlatformLayout(router.pathname) ? (
    <PlatformLayout>{page}</PlatformLayout>
  ) : (
    page
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {content}
        <Toaster richColors position="top-center" />
      </AuthProvider>
    </QueryClientProvider>
  )
}
