import { ReactNode } from 'react'
import {
  ActionRow,
  Card,
  Message,
  PageContainer,
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  Title,
} from '@/pages/error-page.styles'

interface AuthGuardFeedbackProps {
  badge: string
  title: string
  message: ReactNode
  primaryActionLabel?: string
  onPrimaryAction?: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
}

export function AuthGuardFeedback({
  badge,
  title,
  message,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
}: AuthGuardFeedbackProps) {
  return (
    <PageContainer>
      <Card role="region" aria-label={title}>
        <StatusBadge>{badge}</StatusBadge>
        <Title>{title}</Title>
        <Message>{message}</Message>
        {(primaryActionLabel || secondaryActionLabel) && (
          <ActionRow>
            {primaryActionLabel && onPrimaryAction && (
              <PrimaryButton type="button" onClick={onPrimaryAction}>
                {primaryActionLabel}
              </PrimaryButton>
            )}
            {secondaryActionLabel && onSecondaryAction && (
              <SecondaryButton type="button" onClick={onSecondaryAction}>
                {secondaryActionLabel}
              </SecondaryButton>
            )}
          </ActionRow>
        )}
      </Card>
    </PageContainer>
  )
}
