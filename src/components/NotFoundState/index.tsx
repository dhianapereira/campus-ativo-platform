import Image from 'next/image'
import notFound404 from '@/assets/404.svg'
import {
  ActionRow,
  Card,
  Code,
  Message,
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  Title,
} from './styles'

interface NotFoundStateProps {
  message: string
  onBack: () => void
  onGoToProblems: () => void
}

export function NotFoundState({
  message,
  onBack,
  onGoToProblems,
}: NotFoundStateProps) {
  return (
    <Card role="region" aria-label="Página não encontrada">
      <StatusBadge>Recurso indisponível</StatusBadge>
      <Code>
        <Image
          src={notFound404}
          alt="404"
          priority
          style={{ width: '180px', height: 'auto' }}
        />
      </Code>
      <Title>Página não encontrada</Title>
      <Message>{message}</Message>
      <ActionRow>
        <PrimaryButton type="button" onClick={onBack}>
          Voltar
        </PrimaryButton>
        <SecondaryButton type="button" onClick={onGoToProblems}>
          Ir para problemas
        </SecondaryButton>
      </ActionRow>
    </Card>
  )
}
