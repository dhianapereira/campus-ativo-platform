import { Container, Body, Header, Input, Title } from './styles'
import { ArrowLeft } from 'phosphor-react'
import { Button, Text, TextArea, TextInput } from '@campusativo-ui/react'
import { ProblemFormData } from '@/@types/form.d'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { problemFormSchema } from '@/validators/problem-form'

export default function AddProblem() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProblemFormData>({
    resolver: zodResolver(problemFormSchema),
  })

  async function handleRegisterProblem(data: ProblemFormData) {
    console.log(data)
  }

  return (
    <Container>
      <Header>
        <ArrowLeft
          className="back-icon"
          onClick={() => window.history.back()}
          weight="bold"
          size={24}
          aria-label="Voltar para a página anterior"
          tabIndex={0}
          role="button"
        />
        <Title as="h2" size="md">
          Cadastrar problema
        </Title>
      </Header>
      <Body onSubmit={handleSubmit(handleRegisterProblem)}>
        <Input>
          <Text size="md">Título</Text>
          <TextInput
            placeholder="Descreva brevemente o problema"
            {...register('title')}
            aria-label="Título do problema"
            tabIndex={0}
          />
          {errors.title && (
            <Text className="error-message" size="sm">
              {errors.title.message}
            </Text>
          )}
        </Input>
        <Input>
          <Text size="md">Local</Text>
          <TextInput
            placeholder="Informe o local do problema (ex: sala 101, bloco A)"
            {...register('location')}
            aria-label="Local do problema"
            tabIndex={0}
          />
          {errors.location && (
            <Text className="error-message" size="sm">
              {errors.location.message}
            </Text>
          )}
        </Input>
        <Input>
          <Text size="md">Descrição</Text>
          <TextArea
            placeholder="Detalhe o problema com o máximo de informações possível"
            {...register('description')}
            aria-label="Descrição do problema"
            tabIndex={0}
          />
          {errors.description && (
            <Text className="error-message" size="sm">
              {errors.description.message}
            </Text>
          )}
        </Input>
        <Button
          variant="primary"
          type="submit"
          disabled={isSubmitting}
          aria-label="Cadastrar problema"
          tabIndex={0}
        >
          Cadastrar
        </Button>
      </Body>
    </Container>
  )
}
