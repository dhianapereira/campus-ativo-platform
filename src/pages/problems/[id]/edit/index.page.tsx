import { useEffect, useState } from 'react'
import { Container, Body, Header, Input, Title } from './styles'
import { ArrowLeft } from 'phosphor-react'
import { Button, Text, TextArea, TextInput } from '@campusativo-ui/react'
import { ProblemFormData } from '@/@types/form.d'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { problemFormSchema } from '@/validators/problem-form'
import { useRouter } from 'next/router'
import { IProps } from './index.d'

export default function EditProblem() {
  const router = useRouter()
  const { id } = router.query

  const [problemData, setProblemData] = useState<IProps | null>(null)

  useEffect(() => {
    async function fetchProblemData() {
      if (id) {
        const response = {
          id,
          title: 'Ar-condicionado',
          location: 'Sala 05232',
          description:
            'Problemas no ar-condicionado foram identificados na sala 05232. Verificar com urgência.',
        }
        setProblemData(response)
      }
    }

    fetchProblemData()
  }, [id])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProblemFormData>({
    resolver: zodResolver(problemFormSchema),
  })

  useEffect(() => {
    if (problemData) {
      reset(problemData)
    }
  }, [problemData, reset])

  async function handleEditProblem(data: ProblemFormData) {
    console.log(data)
  }

  if (!problemData) {
    return <p>Carregando...</p>
  }

  return (
    <Container>
      <Header>
        <ArrowLeft
          className="back-icon"
          onClick={() => window.history.back()}
          weight="bold"
          size={24}
        />
        <Title as="h2" size="md">
          Editar problema
        </Title>
      </Header>
      <Body onSubmit={handleSubmit(handleEditProblem)}>
        <Input>
          <Text size="md">Título</Text>
          <TextInput
            placeholder="Descreva brevemente o problema"
            {...register('title')}
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
          />
          {errors.description && (
            <Text className="error-message" size="sm">
              {errors.description.message}
            </Text>
          )}
        </Input>
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          Editar
        </Button>
      </Body>
    </Container>
  )
}
