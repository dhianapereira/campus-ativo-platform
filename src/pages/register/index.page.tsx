import { Button, Heading, Text, TextInput } from '@/components'
import PasswordIcon from '@/components/PasswordIcon'
import {
  PageWrapper,
  Container,
  Form,
  FormError,
  IllustrationContainer,
} from './styles'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { RegisterFormData } from '@/@types/form'
import { registerFormSchema } from '@/validators/register-form'
import Image from 'next/image'
import illustrationLogin from '../../assets/illustration-login.png'
import ifalLogo from '../../assets/ifal-logo.png'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { colors } from '@/styles/tokens'

export default function Register() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const [name, position, email, password, confirmPassword] = useWatch({
    control,
    name: ['name', 'position', 'email', 'password', 'confirmPassword'],
  })

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
          message:
            result.error ||
            'Não foi possível completar o cadastro. Verifique suas informações.',
        })
        return
      }

      router.push('/register/pending')
    } catch (_error: unknown) {
      setError('confirmPassword', {
        type: 'manual',
        message:
          'Não foi possível completar o cadastro. Verifique suas informações.',
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
              style={{ color: colors.green, fontWeight: 'bold' }}
            >
              Fazer login
            </Link>
          </Text>
        </Form>
      </Container>
    </PageWrapper>
  )
}
