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

interface ForbiddenStateProps {
  message: string
  onBack: () => void
  onGoToProblems: () => void
}

export function ForbiddenState({
  message,
  onBack,
  onGoToProblems,
}: ForbiddenStateProps) {
  return (
    <Card role="region" aria-label="Acesso negado">
      <StatusBadge>Permissão restrita</StatusBadge>
      <Code>403</Code>
      <Title>Acesso negado</Title>
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
