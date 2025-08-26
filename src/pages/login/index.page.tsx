import { Button, Heading, Text, TextInput } from '@campusativo-ui/react'
import PasswordIcon from './components/PasswordIcon'
import { Container, Form, FormError, IllustrationContainer } from './styles'
import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { LoginFormData } from '@/@types/form.d'
import { loginFormSchema } from '@/validators/login-form'
import Image from 'next/image'
import illustrationLogin from '../../assets/illustration-login.png'
import ifalLogo from '../../assets/ifal-logo.png'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/router'

export default function Login() {
  const { signIn, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  })

  const email = watch('email')
  const password = watch('password')

  const isFormValid =
    email && password && email.trim() !== '' && password.trim() !== ''

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/problems')
    }
  }, [isAuthenticated, isLoading, router])

  async function handleLogin(data: LoginFormData) {
    try {
      await signIn({
        email: data.email,
        password: data.password,
      })
    } catch (error: unknown) {
      if (error instanceof Error) {
        const status = (error as Error & { status?: number }).status
        if (status === 400 || status === 401) {
          setError('password', {
            type: 'manual',
            message: 'E-mail ou senha incorretos',
          })
        } else {
          setError('password', {
            type: 'manual',
            message:
              error.message || 'Erro interno do servidor. Tente novamente.',
          })
        }
      } else {
        setError('password', {
          type: 'manual',
          message: 'Erro interno do servidor. Tente novamente.',
        })
      }
    }
  }

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
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
      <Form onSubmit={handleSubmit(handleLogin)}>
        <Image
          src={ifalLogo}
          height={104}
          width={291}
          quality={100}
          alt="Logo do Instituto Federal de Alagoas."
        />
        <Heading size="3xl">Campus Ativo</Heading>
        <Text size="md">
          Uma ferramenta para o auxílio na identificação e execução de ações de
          manutenção em Instituições de Ensino.
        </Text>
        <label>
          <Text size="md">E-mail</Text>
          <TextInput
            type="email"
            {...register('email')}
            aria-label="Digite seu e-mail"
            tabIndex={0}
          />
          {errors.email && (
            <FormError size="sm">{errors.email.message}</FormError>
          )}
        </label>
        <label>
          <Text size="md">Senha</Text>
          <TextInput
            {...register('password')}
            type={isPasswordVisible ? 'text' : 'password'}
            suffix={
              <PasswordIcon
                isVisible={isPasswordVisible}
                onTap={togglePasswordVisibility}
                aria-label="Alternar visibilidade da senha"
              />
            }
            aria-label="Digite sua senha"
            tabIndex={0}
          />
          {errors.password && (
            <FormError size="sm">{errors.password.message}</FormError>
          )}
        </label>
        <Button
          type="submit"
          disabled={isSubmitting || !isFormValid}
          tabIndex={0}
          aria-label="Entrar na plataforma"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>
      </Form>
    </Container>
  )
}
