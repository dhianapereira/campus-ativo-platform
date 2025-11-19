import { StatusBadge } from "@/styles";
import { IProps } from "./index.d";
import { Container, Description, Location, Title } from "./styles";
import { ReactElement } from "react";
import { useRouter } from "next/router";

export default function ProblemCard({
  id,
  title,
  location,
  description,
  badgeId,
}: IProps) {
  const router = useRouter();

  async function goToDetails() {
    await router.push(`/problems/${id}/`);
  }

  return (
    <Container
      onClick={() => goToDetails()}
      role="card"
      tabIndex={0}
      aria-label={`Card do problema: ${title}`}
    >
      <Title size="sm">{title}</Title>
      <Location size="sm">{location}</Location>
      <Description size="sm">{description}</Description>
      {badges[badgeId]}
    </Container>
  );
}

type BadgeMapProps = {
  [key: string]: ReactElement;
};

const badges: BadgeMapProps = {
  toAnalysis: <StatusBadge variant="toAnalysis">Para análise</StatusBadge>,
  inAnalysis: <StatusBadge variant="inAnalysis">Em análise</StatusBadge>,
  accepted: <StatusBadge variant="accepted">Aceito</StatusBadge>,
  rejected: <StatusBadge variant="rejected">Recusado</StatusBadge>,
  inProgress: <StatusBadge variant="inProgress">Em andamento</StatusBadge>,
  finished: <StatusBadge variant="finished">Concluído</StatusBadge>,
};
