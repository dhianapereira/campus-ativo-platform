import React, { useEffect, useState } from 'react'
import {
  Container,
  Body,
  Header,
  Title,
  ImageContainer,
  InfoContainer,
  EditButton,
} from './styles'
import { ArrowLeft, NotePencil } from 'phosphor-react'
import { useRouter } from 'next/router'
import { IProps } from './index.d'
import { Button, Text } from '@campusativo-ui/react'
import { Actions } from './components/Actions'
import { Status } from '@/data/static/status-data'
import { ImageError } from '@/app/platform/components/Error'

export default function ProblemDetails() {
  const router = useRouter()
  const { id } = router.query

  const [problemData, setProblemData] = useState<IProps | null>(null)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    async function fetchProblemData() {
      if (id) {
        const response = {
          id,
          title: 'Ar-condicionado',
          location: 'Sala 05232',
          description:
            'Problemas no ar-condicionado foram identificados na sala 05232. Verificar com urgência.',
          imageUrl:
            'https://imgs.search.brave.com/XR7WZESq-wVfAbqa2Yno-_e1JWAGEyfpnWId1P3oH9s/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9maWxl/cy50ZWNub2Jsb2cu/bmV0L3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIyLzAzL2NvbmRl/bnNhZG9yLWFjLTEt/NzAweDUyNS5qcGc',
          rapporteur: 'email@email.com',
          createdAt: '14 de Março de 2024',
          updatedAt: '14 de Março de 2024 as 15h41min',
          status: 'toAnalysis',
          category: null,
          maintenanceType: null,
        }
        setProblemData(response)
      }
    }

    fetchProblemData()
  }, [id])

  if (!problemData) {
    return <p>Carregando...</p>
  }

  async function goToEditPage() {
    await router.push(`/problems/${id}/edit`)
  }

  return (
    <Container>
      <Header>
        <div className="first-component">
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
            {problemData.title}
          </Title>
        </div>
        {problemData.status === Status.ToAnalysis && (
          <>
            <Button
              className="desktop"
              variant="secondary"
              onClick={goToEditPage}
              aria-label="Editar problema"
              tabIndex={0}
            >
              <>
                <NotePencil weight="bold" size={24} />
                Editar
              </>
            </Button>
            <EditButton
              className="mobile"
              onClick={goToEditPage}
              aria-label="Editar problema"
              tabIndex={0}
              role="button"
            >
              <NotePencil weight="bold" size={24} />
            </EditButton>
          </>
        )}
      </Header>
      <Body>
        {problemData.imageUrl && !imageError ? (
          <ImageContainer
            src={problemData.imageUrl}
            height={331}
            width={839}
            alt={problemData.title}
            onError={() => setImageError(true)}
          />
        ) : (
          <ImageError />
        )}
        <InfoContainer>
          <Text className="label" size="md">
            Título:
          </Text>
          <Text size="md">{problemData.title}</Text>
        </InfoContainer>
        <InfoContainer>
          <Text className="label" size="md">
            Local:
          </Text>
          <Text size="md">{problemData.location}</Text>
        </InfoContainer>
        <InfoContainer>
          <Text className="label" size="md">
            Descrição:
          </Text>
          <Text size="md">{problemData.description}</Text>
        </InfoContainer>
        <InfoContainer>
          <Text className="label" size="md">
            Relator:
          </Text>
          <Text size="md">{problemData.rapporteur}</Text>
        </InfoContainer>
        <InfoContainer>
          <Text className="label" size="md">
            Cadastrado em:
          </Text>
          <Text size="md">{problemData.createdAt}</Text>
        </InfoContainer>
        {problemData.updatedAt && (
          <InfoContainer>
            <Text className="label" size="md">
              Última atualização:
            </Text>
            <Text size="md">{problemData.updatedAt}</Text>
          </InfoContainer>
        )}
        <Actions
          initialStatus={problemData.status}
          initialCategory={problemData.category}
          initialMaintenanceType={problemData.maintenanceType}
        />
      </Body>
    </Container>
  )
}
