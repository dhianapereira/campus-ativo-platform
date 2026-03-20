import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import PlatformLayout from '@/app/platform/layout'
import unauthorizedBg from '@/assets/unauthorized.svg'
import { styled } from '@/styles'

const PageContainer = styled('div', {
  position: 'relative',
  minHeight: 'calc(100vh - 80px)',
  backgroundColor: '$greenishWhite',
})

const BackgroundWrapper = styled('div', {
  position: 'absolute',
  left: '50%',
  top: '-15vh',
  transform: 'translateX(-50%)',
  maxWidth: '1200px',
  width: '100%',
  height: '600px',
  pointerEvents: 'none',
  zIndex: 0,

  '@media (max-width: 820px)': {
    top: '-10vh',
    maxWidth: '800px',
    height: '600px',
  },
})

const Card = styled('div', {
  position: 'relative',
  zIndex: 10,
  width: 'min(560px, 86vw)',
  margin: '0 auto',
  marginTop: '14vh',
  backgroundColor: '$white',
  border: '1px solid rgba(0, 0, 0, 0.07)',
  borderRadius: '$card',
  boxShadow:
    '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
  padding: '40px',
  textAlign: 'center',

  '@media (max-width: 820px)': {
    width: 'min(540px, 90vw)',
    padding: '32px',
    marginTop: '22vh',
  },
})

const Code = styled('div', {
  fontSize: '64px',
  lineHeight: 1,
  fontWeight: 700,
  color: '$gray',
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
  color: '$gray',
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
  color: '$lightGray',
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
  borderRadius: '$card',
  padding: '10px 22px',
  backgroundColor: '$green',
  color: '$white',
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',

  '&:hover': {
    backgroundColor: '$lightGreen',
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
