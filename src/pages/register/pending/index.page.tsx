import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { styled } from '@/styles'
import ifalLogo from '@/assets/ifal-logo.png'
import illustrationLogin from '@/assets/illustration-login.png'

const PageWrapper = styled('div', {
  width: '100vw',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$greenishWhite',
  padding: '$4',
})

const Container = styled('main', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  maxWidth: 1200,
  width: '100%',
  gap: '$8',

  '@media(max-width: 820px)': {
    flexDirection: 'column',
  },
})

const IllustrationContainer = styled('div', {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '@media(max-width: 820px)': {
    display: 'none',
  },

  '@media(max-width: 1024px)': {
    img: {
      width: '100%',
      height: 'auto',
    },
  },
})

const Card = styled('div', {
  flex: 1,
  backgroundColor: '$white',
  border: '1px solid rgba(0, 0, 0, 0.07)',
  borderRadius: '$card',
  boxShadow:
    '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
  padding: '40px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '$4',

  '@media (max-width: 820px)': {
    padding: '32px',
  },
})

const Title = styled('h1', {
  fontSize: '28px',
  fontWeight: 700,
  color: '$gray',
  margin: 0,

  '@media (max-width: 820px)': {
    fontSize: '24px',
  },
})

const Message = styled('p', {
  fontSize: '16px',
  fontWeight: 500,
  color: '$lightGray',
  margin: 0,
  lineHeight: 1.6,
  maxWidth: '440px',

  '@media (max-width: 820px)': {
    fontSize: '15px',
  },
})

const BackLink = styled(Link, {
  appearance: 'none',
  border: 'none',
  borderRadius: '$card',
  padding: '12px 24px',
  backgroundColor: '$green',
  color: '$white',
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',
  textDecoration: 'none',
  marginTop: '$2',

  '&:hover': {
    backgroundColor: '$lightGreen',
  },
})

export default function RegisterPendingPage() {
  return (
    <>
      <Head>
        <title>Cadastro realizado - Campus Ativo</title>
      </Head>
      <PageWrapper>
        <Container>
          <IllustrationContainer>
            <Image
              src={illustrationLogin}
              height={391}
              width={665}
              quality={100}
              priority
              alt="Uma ilustração de um homem abrindo uma porta."
            />
          </IllustrationContainer>

          <Card role="region" aria-label="Cadastro realizado">
            <Image
              src={ifalLogo}
              height={80}
              width={224}
              quality={100}
              alt="Logo do Instituto Federal de Alagoas."
            />
            <Title>Cadastro realizado com sucesso!</Title>
            <Message>
              Seu cadastro foi realizado com sucesso. Para acessar a plataforma,
              é necessária uma autorização prévia. Assim que essa autorização
              for concedida, você receberá uma notificação por e-mail e poderá
              acessar normalmente.
            </Message>
            <BackLink href="/login">Voltar para o login</BackLink>
          </Card>
        </Container>
      </PageWrapper>
    </>
  )
}
