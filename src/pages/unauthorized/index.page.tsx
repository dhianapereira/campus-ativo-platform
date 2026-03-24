import Head from 'next/head'
import { useRouter } from 'next/router'
import PlatformLayout from '@/layouts/platform/layout'
import {
  ActionRow,
  Card,
  Code,
  Message,
  PageContainer,
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  Title,
} from '@/pages/error-page.styles'

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
        <Card role="region" aria-label="Acesso negado">
          <StatusBadge>Permissão restrita</StatusBadge>
          <Code>403</Code>
          <Title>Acesso negado</Title>
          <Message>
            Você não possui as permissões necessárias para acessar esta página.
            Volte para a tela anterior ou siga para a lista de problemas.
          </Message>
          <ActionRow>
            <PrimaryButton type="button" onClick={handleBack}>
              Voltar
            </PrimaryButton>
            <SecondaryButton type="button" onClick={handleGoToProblems}>
              Ir para problemas
            </SecondaryButton>
          </ActionRow>
        </Card>
      </PageContainer>
    </PlatformLayout>
  )
}
