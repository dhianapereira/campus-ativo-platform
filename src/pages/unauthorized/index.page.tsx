import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import PlatformLayout from '@/app/platform/layout'
import unauthorizedBg from '@/assets/unauthorized.svg'
import { styled } from '@campusativo-ui/react'

const PageContainer = styled('div', {
  position: 'relative',
  minHeight: 'calc(100vh - 80px)', // Account for header height
  backgroundColor: '#FFFFFF',
})

const BackgroundWrapper = styled('div', {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: '10vh',
  top: '18vh',
  margin: '0 auto',
  maxWidth: '1200px',
  pointerEvents: 'none',

  '@media (max-width: 820px)': {
    top: '22vh',
    bottom: '8vh',
    maxWidth: '680px',
  },
})

const Card = styled('div', {
  position: 'relative',
  zIndex: 1,
  width: 'min(560px, 86vw)',
  margin: '0 auto',
  marginTop: '14vh',
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  boxShadow:
    '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
  padding: '40px',
  textAlign: 'center',

  '@media (max-width: 820px)': {
    width: 'min(540px, 90vw)',
    padding: '32px',
    marginTop: '22vh',
    borderRadius: '10px',
  },
})

const Code = styled('div', {
  fontSize: '64px',
  lineHeight: 1,
  fontWeight: 700,
  color: '#44403C',
  textShadow: '0 6px 0 rgba(0,0,0,0.08)',
  marginBottom: '8px',

  '@media (max-width: 820px)': {
    fontSize: '56px',
    marginBottom: '6px',
  },
})

const Title = styled('h1', {
  fontSize: '28px',
  fontWeight: 700,
  color: '#44403C',
  margin: 0,
  marginBottom: '16px',

  '@media (max-width: 820px)': {
    fontSize: '24px',
    marginBottom: '14px',
  },
})

const Message = styled('p', {
  fontSize: '18px',
  fontWeight: 500,
  color: '#4B5563',
  margin: 0,
  lineHeight: 1.6,
  maxWidth: '440px',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginBottom: '24px',

  '@media (max-width: 820px)': {
    fontSize: '18px',
    maxWidth: '480px',
    marginBottom: '20px',
  },
})

const BackButton = styled('button', {
  appearance: 'none',
  border: 'none',
  borderRadius: '8px',
  padding: '10px 22px',
  backgroundColor: '#00875F',
  color: '#FFFFFF',
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',

  '&:hover': {
    backgroundColor: '#0A6A50',
  },

  '@media (max-width: 820px)': {
    padding: '12px 26px',
    fontSize: '16px',
  },
})

export default function UnauthorizedPage() {
  const router = useRouter()

  const back =
    typeof router.query.back === 'string' ? router.query.back : '/problems'

  const handleBack = () => {
    if (back) {
      router.replace('/')
    } else {
      router.replace('/problems')
    }
  }

  return (
    <PlatformLayout>
      <Head>
        <title>Acesso negado • Campus Ativo</title>
      </Head>
      <PageContainer>
        <BackgroundWrapper aria-hidden="true">
          <Image
            src={unauthorizedBg}
            alt=""
            fill
            priority
            style={{ objectFit: 'contain' }}
          />
        </BackgroundWrapper>

        <Card role="region" aria-label="Acesso negado">
          <Code>403</Code>
          <Title>Acesso negado</Title>
          <Message>
            Você não possui as permissões necessárias para acessar esta página.
          </Message>
          <BackButton onClick={handleBack}>Voltar</BackButton>
        </Card>
      </PageContainer>
    </PlatformLayout>
  )
}
