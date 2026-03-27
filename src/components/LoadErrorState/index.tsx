import { ReactNode } from 'react'
import { ArrowClockwise, WarningCircle } from 'phosphor-react'
import { Button } from '@/components/Button'
import {
  Actions,
  Badge,
  Card,
  Container,
  Description,
  Header,
  IconWrap,
  Tip,
  Tips,
  Title,
} from './styles'

interface LoadErrorStateProps {
  title: string
  description: ReactNode
  badge?: string
  retryLabel?: string
  isRetrying?: boolean
  onRetry?: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
  tips?: string[]
}

const DEFAULT_TIPS = [
  'Confira se o servidor e a conexão já voltaram ao normal.',
  'Se a instabilidade acabou de passar, tente novamente em alguns segundos.',
]

export function LoadErrorState({
  title,
  description,
  badge = 'Conexão indisponível',
  retryLabel = 'Tentar novamente',
  isRetrying = false,
  onRetry,
  secondaryActionLabel,
  onSecondaryAction,
  tips = DEFAULT_TIPS,
}: LoadErrorStateProps) {
  return (
    <Container aria-live="polite">
      <Card role="region" aria-label={title}>
        <Header>
          <IconWrap aria-hidden>
            <WarningCircle size={28} weight="duotone" />
          </IconWrap>
          <Badge>{badge}</Badge>
        </Header>

        <Title>{title}</Title>
        <Description>{description}</Description>

        {tips.length > 0 ? (
          <Tips>
            {tips.map((tip) => (
              <Tip key={tip}>{tip}</Tip>
            ))}
          </Tips>
        ) : null}

        {(onRetry || (secondaryActionLabel && onSecondaryAction)) && (
          <Actions>
            {onRetry ? (
              <Button
                type="button"
                variant="primary"
                onClick={onRetry}
                disabled={isRetrying}
              >
                {isRetrying ? (
                  <>
                    <ArrowClockwise size={18} weight="bold" />
                    Tentando novamente...
                  </>
                ) : (
                  retryLabel
                )}
              </Button>
            ) : null}

            {secondaryActionLabel && onSecondaryAction ? (
              <Button
                type="button"
                variant="secondary"
                onClick={onSecondaryAction}
              >
                {secondaryActionLabel}
              </Button>
            ) : null}
          </Actions>
        )}
      </Card>
    </Container>
  )
}
