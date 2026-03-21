import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useSyncExternalStore } from 'react'
import notFoundBg from '@/assets/not-found-bg.svg'
import notFound404 from '@/assets/404.svg'
import { styled } from '@/styles'
import { useAuth } from '@/contexts/auth-context'
import PlatformLayout from '@/layouts/platform/layout'

const PageContainer = styled('div', {
  position: 'relative',
  minHeight: '100vh',
  backgroundColor: '$greenishWhite',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  variants: {
    withLayout: {
      true: {
        minHeight: 'calc(100vh - 80px)',
      },
    },
  },
})

const BackgroundWrapper = styled('div', {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '1200px',
  width: '100%',
  height: '700px',
  pointerEvents: 'none',
  zIndex: 0,

  '@media (max-width: 820px)': {
    maxWidth: '800px',
    height: '600px',
  },
})

const Card = styled('div', {
  position: 'relative',
  zIndex: 10,
  width: 'min(560px, 86vw)',
  backgroundColor: '$white',
  border: '1px solid rgba(0, 0, 0, 0.07)',
  borderRadius: '$card',
  boxShadow:
    '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
  padding: '48px 40px',
  textAlign: 'center',

  '@media (max-width: 820px)': {
    width: 'min(540px, 90vw)',
    padding: '40px 32px',
  },
})

const CodeWrapper = styled('div', {
  marginBottom: '12px',

  '& img': {
    width: '240px',
    height: 'auto',
  },

  '@media (max-width: 820px)': {
    marginBottom: '10px',

    '& img': {
      width: '180px',
    },
  },
})

const Underline = styled('div', {
  width: '120px',
  height: '4px',
  backgroundColor: 'rgba(0, 0, 0, 0.07)',
  margin: '0 auto 20px',
  borderRadius: '2px',

  '@media (max-width: 820px)': {
    width: '100px',
    marginBottom: '16px',
  },
})

const Title = styled('h1', {
  fontSize: '28px',
  fontWeight: 700,
  color: '$gray',
  margin: 0,
  marginBottom: '20px',

  '@media (max-width: 820px)': {
    fontSize: '24px',
    marginBottom: '16px',
  },
})

const Message = styled('p', {
  fontSize: '16px',
  fontWeight: 400,
  color: '$lightGray',
  margin: 0,
  lineHeight: 1.6,
  maxWidth: '400px',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginBottom: '28px',

  '@media (max-width: 820px)': {
    fontSize: '15px',
    maxWidth: '380px',
    marginBottom: '24px',
  },
})

const BackButton = styled('button', {
  appearance: 'none',
  border: 'none',
  borderRadius: '$card',
  padding: '12px 32px',
  backgroundColor: '$green',
  color: '$white',
  fontSize: '16px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',

  '&:hover': {
    backgroundColor: '$lightGreen',
  },

  '&:focus': {
    outline: '2px solid $green',
    outlineOffset: '2px',
  },

  '@media (max-width: 820px)': {
    padding: '14px 36px',
  },
})

function NotFoundContent({ withLayout }: { withLayout: boolean }) {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <PageContainer withLayout={withLayout}>
      <BackgroundWrapper aria-hidden="true">
        <Image
          src={notFoundBg}
          alt=""
          fill
          priority
          style={{ objectFit: 'contain' }}
        />
      </BackgroundWrapper>

      <Card role="region" aria-label="Página não encontrada">
        <CodeWrapper>
          <Image src={notFound404} alt="404" priority />
        </CodeWrapper>
        <Underline />
        <Title>Página não encontrada</Title>
        <Message>
          O recurso que você tentou acessar pode ter sido removido ou o endereço
          foi digitado incorretamente.
        </Message>
        <BackButton onClick={handleBack}>Voltar</BackButton>
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
