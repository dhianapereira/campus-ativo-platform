import Head from 'next/head'
import type { NextPageContext } from 'next'
import { useRouter } from 'next/router'
import NotFoundPage from './404.page'
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
} from './error-page.styles'

type ErrorPageProps = {
  statusCode?: number
}

export default function ErrorPage({ statusCode }: ErrorPageProps) {
  const router = useRouter()

  if (statusCode === 404) {
    return <NotFoundPage />
  }

  const errorCode = statusCode ?? 500

  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <>
      <Head>
        <title>Erro • Campus Ativo</title>
      </Head>
      <PageContainer>
        <Card role="region" aria-label="Erro ao carregar página">
          <StatusBadge>Erro inesperado</StatusBadge>
          <Code>{errorCode}</Code>
          <Title>Ocorreu um erro</Title>
          <Message>
            Não foi possível carregar a página agora. Tente novamente em
            instantes ou volte para uma área segura da aplicação.
          </Message>
          <ActionRow>
            <PrimaryButton type="button" onClick={handleReload}>
              Tentar novamente
            </PrimaryButton>
            <SecondaryButton
              type="button"
              onClick={() => router.replace('/problems')}
            >
              Ir para problemas
            </SecondaryButton>
          </ActionRow>
        </Card>
      </PageContainer>
    </>
  )
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 500
  return { statusCode }
}
