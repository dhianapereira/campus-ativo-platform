import { globalStyles } from '@/styles/tokens/global'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/auth-context'
import { useState } from 'react'

globalStyles()

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error: unknown) => {
              // Don't retry on authentication errors
              const errorStatus = (error as { status?: number })?.status
              if (errorStatus === 401 || errorStatus === 403) {
                return false
              }
              // Retry up to 2 times for other errors
              return failureCount < 2
            },
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
          },
          mutations: {
            retry: (failureCount, error: unknown) => {
              // Don't retry authentication/authorization errors
              const errorStatus = (error as { status?: number })?.status
              if (errorStatus === 401 || errorStatus === 403) {
                return false
              }
              // Don't retry client errors (4xx) except for rate limiting
              if (
                errorStatus &&
                errorStatus >= 400 &&
                errorStatus < 500 &&
                errorStatus !== 429
              ) {
                return false
              }
              // Retry up to 1 time for server errors
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

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Component {...pageProps} />
        <Toaster richColors position="top-center" />
      </AuthProvider>
    </QueryClientProvider>
  )
}
