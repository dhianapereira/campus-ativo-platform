import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSyncExternalStore } from 'react'
import { NotFoundState } from '@/components'
import { useAuth } from '@/contexts/auth-context'
import PlatformLayout from '@/layouts/platform/layout'
import { PageContainer } from '@/pages/error-page.styles'

function NotFoundContent({ withLayout }: { withLayout: boolean }) {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <PageContainer withLayout={withLayout}>
      <NotFoundState
        message="O recurso que você tentou acessar pode ter sido removido ou o endereço informado não existe mais."
        onBack={handleBack}
        onGoToProblems={() => void router.replace('/problems')}
      />
    </PageContainer>
  )
}

export default function NotFoundPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  if (!mounted || isLoading) {
    return (
      <>
        <Head>
          <title>Página não encontrada • Campus Ativo</title>
        </Head>
        <NotFoundContent withLayout={false} />
      </>
    )
  }

  if (isAuthenticated) {
    return (
      <PlatformLayout>
        <Head>
          <title>Página não encontrada • Campus Ativo</title>
        </Head>
        <NotFoundContent withLayout={true} />
      </PlatformLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Página não encontrada • Campus Ativo</title>
      </Head>
      <NotFoundContent withLayout={false} />
    </>
  )
}
