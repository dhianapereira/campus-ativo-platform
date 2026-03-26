import Head from 'next/head'
import { useRouter } from 'next/router'
import { ForbiddenState } from '@/components/ForbiddenState'
import PlatformLayout from '@/layouts/platform/layout'
import { PageContainer } from '@/pages/error-page.styles'

export default function UnauthorizedPage() {
  const router = useRouter()

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
      return
    }

    void router.replace('/problems')
  }

  const handleGoToProblems = () => {
    void router.replace('/problems')
  }

  return (
    <PlatformLayout>
      <Head>
        <title>Acesso negado • Campus Ativo</title>
      </Head>
      <PageContainer withLayout>
        <ForbiddenState
          message="Você não possui as permissões necessárias para acessar esta página. Volte para a tela anterior ou siga para a lista de problemas."
          onBack={handleBack}
          onGoToProblems={handleGoToProblems}
        />
      </PageContainer>
    </PlatformLayout>
  )
}
