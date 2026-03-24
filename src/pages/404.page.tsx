import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useSyncExternalStore } from 'react'
import notFound404 from '@/assets/404.svg'
import { useAuth } from '@/contexts/auth-context'
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

function NotFoundContent({ withLayout }: { withLayout: boolean }) {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <PageContainer withLayout={withLayout}>
      <Card role="region" aria-label="Página não encontrada">
        <StatusBadge>Recurso indisponível</StatusBadge>
        <Code>
          <Image
            src={notFound404}
            alt="404"
            priority
            style={{ width: '180px', height: 'auto' }}
          />
        </Code>
        <Title>Página não encontrada</Title>
        <Message>
          O recurso que você tentou acessar pode ter sido removido ou o endereço
          informado não existe mais.
        </Message>
        <ActionRow>
          <PrimaryButton type="button" onClick={handleBack}>
            Voltar
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
