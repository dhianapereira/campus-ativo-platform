import { StatusBadge } from '@campusativo-ui/react'
import { IProps } from './index.d'
import { Container, Description, Location, Title } from './styles'
import { ReactElement } from 'react'

export default function ProblemCard({
  id,
  title,
  location,
  description,
  badgeId,
}: IProps) {
  return (
    <Container onClick={() => handleClick(id)}>
      <Title size="sm">{title}</Title>
      <Location size="sm">{location}</Location>
      <Description size="sm">{description}</Description>
      {badges[badgeId]}
    </Container>
  )
}

function handleClick(id: string) {
  console.log(id)
}

type BadgeMapProps = {
  [key: string]: ReactElement
}

const badges: BadgeMapProps = {
  toAnalysis: <StatusBadge variant="toAnalysis">Para análise</StatusBadge>,
  inAnalysis: <StatusBadge variant="inAnalysis">Em análise</StatusBadge>,
  accepted: <StatusBadge variant="accepted">Aceito</StatusBadge>,
  rejected: <StatusBadge variant="rejected">Recusado</StatusBadge>,
  inProgress: <StatusBadge variant="inProgress">Em andamento</StatusBadge>,
  finished: <StatusBadge variant="finished">Concluído</StatusBadge>,
}
