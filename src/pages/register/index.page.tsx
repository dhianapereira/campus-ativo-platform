import { Button, Heading, Text, TextInput } from '@/styles'
import PasswordIcon from '../login/components/PasswordIcon'
import {
  PageWrapper,
  Container,
  Form,
  FormError,
  IllustrationContainer,
} from './styles'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { RegisterFormData } from '@/@types/form.d'
import { registerFormSchema } from '@/validators/register-form'
import Image from 'next/image'
import illustrationLogin from '../../assets/illustration-login.png'
import ifalLogo from '../../assets/ifal-logo.png'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Register() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const name = watch('name')
  const position = watch('position')
  const email = watch('email')
  const password = watch('password')
  const confirmPassword = watch('confirmPassword')

  const isFormValid =
    name &&
    position &&
    email &&
    password &&
    confirmPassword &&
    name.trim() !== '' &&
    position.trim() !== '' &&
    email.trim() !== '' &&
    password.trim() !== '' &&
    confirmPassword.trim() !== ''

  async function handleRegister(data: RegisterFormData) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          position: data.position,
          email: data.email,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setError('confirmPassword', {
          type: 'manual',
          message: result.error || 'Erro ao criar conta. Tente novamente.',
        })
        return
      }

      // Redirecionar para o login após cadastro bem-sucedido
      router.push('/login?registered=true')
    } catch (error: unknown) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Erro ao criar conta. Tente novamente.',
      })
    }
  }

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
  }

  return (
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
        <Form onSubmit={handleSubmit(handleRegister)}>
          <Image
            src={ifalLogo}
            height={104}
            width={291}
            quality={100}
            alt="Logo do Instituto Federal de Alagoas."
          />
          <Heading size="3xl">Criar Conta</Heading>
          <Text size="md">
            Cadastre-se para acessar o Campus Ativo e reportar problemas de
            infraestrutura.
          </Text>
          <label>
            <Text size="md">Nome Completo</Text>
            <TextInput
              type="text"
              {...register('name')}
              aria-label="Digite seu nome completo"
              tabIndex={0}
            />
            {errors.name && (
              <FormError size="sm">{errors.name.message}</FormError>
            )}
          </label>
          <label>
            <Text size="md">Cargo</Text>
            <TextInput
              type="text"
              {...register('position')}
              aria-label="Digite seu cargo"
              tabIndex={0}
            />
            {errors.position && (
              <FormError size="sm">{errors.position.message}</FormError>
            )}
          </label>
          <label>
            <Text size="md">E-mail</Text>
            <TextInput
              type="email"
              {...register('email')}
              aria-label="Digite seu e-mail institucional"
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
          <label>
            <Text size="md">Confirmar Senha</Text>
            <TextInput
              {...register('confirmPassword')}
              type={isConfirmPasswordVisible ? 'text' : 'password'}
              suffix={
                <PasswordIcon
                  isVisible={isConfirmPasswordVisible}
                  onTap={toggleConfirmPasswordVisibility}
                  aria-label="Alternar visibilidade da confirmação de senha"
                />
              }
              aria-label="Digite sua senha novamente"
              tabIndex={0}
            />
            {errors.confirmPassword && (
              <FormError size="sm">{errors.confirmPassword.message}</FormError>
            )}
          </label>
          <Button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            tabIndex={0}
            aria-label="Criar conta"
          >
            {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
          </Button>
          <Text size="sm" style={{ textAlign: 'center', marginTop: '8px' }}>
            Já possui uma conta?{' '}
            <Link
              href="/login"
              style={{ color: '#00875F', fontWeight: 'bold' }}
            >
              Fazer login
            </Link>
          </Text>
        </Form>
      </Container>
    </PageWrapper>
  )
}
