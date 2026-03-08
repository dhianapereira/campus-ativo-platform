import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ButtonGroup,
  CancelButton,
  RestoreButton,
  InfoGroup,
  InfoItem,
  Label,
  Value,
  DescriptionValue,
  WarningMessage,
} from "./styles";
import { X, ArrowCounterClockwise, Warning } from "phosphor-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

interface ProblemData {
  id: string;
  title: string;
  description?: string;
  locationName?: string;
  categoryName?: string;
  authorId?: string;
  authorName?: string;
  createdAt?: string;
  deletedAt?: string;
}

interface ViewProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  problem: ProblemData | null;
}

export function ViewProblemModal({
  isOpen,
  onClose,
  onSuccess,
  problem,
}: ViewProblemModalProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const isAuthor = user?.id === problem?.authorId;

  const restoreProblemMutation = useMutation({
    mutationFn: async () => {
      if (!problem?.id) throw new Error("ID do problema não encontrado");

      const response = await fetch("/api/trash", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          action: "restore",
          ids: [problem.id],
          type: "problem",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Falha ao restaurar problema");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      queryClient.invalidateQueries({ queryKey: ["trash"] });
      toast.success("Problema restaurado com sucesso");
      onSuccess();
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Falha ao restaurar problema");
    },
  });

  const handleRestore = () => {
    restoreProblemMutation.mutate();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (!isOpen || !problem) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Problema na Lixeira</ModalTitle>
          <ModalCloseButton onClick={onClose}>
            <X size={24} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <p style={{ margin: "0 0 1rem", fontSize: "0.875rem", color: "#7C7C8A" }}>
            Visualização somente. Não é possível editar; apenas restaurar (se você for o autor).
          </p>
          {!isAuthor && problem.authorId && (
            <WarningMessage>
              <Warning size={20} weight="fill" />
              <span>
                Apenas quem cadastrou este problema pode restaurá-lo.
              </span>
            </WarningMessage>
          )}

          <InfoGroup>
            <InfoItem>
              <Label>Título</Label>
              <Value>{problem.title}</Value>
            </InfoItem>

            {problem.locationName && (
              <InfoItem>
                <Label>Local</Label>
                <Value>{problem.locationName}</Value>
              </InfoItem>
            )}

            {problem.categoryName && (
              <InfoItem>
                <Label>Categoria</Label>
                <Value>{problem.categoryName}</Value>
              </InfoItem>
            )}

            {problem.description && (
              <InfoItem>
                <Label>Descrição</Label>
                <DescriptionValue>{problem.description}</DescriptionValue>
              </InfoItem>
            )}

            {problem.createdAt && (
              <InfoItem>
                <Label>Cadastrado em</Label>
                <Value>{formatDate(problem.createdAt)}</Value>
              </InfoItem>
            )}

            {problem.deletedAt && (
              <InfoItem>
                <Label>Movido para lixeira em</Label>
                <Value>{formatDate(problem.deletedAt)}</Value>
              </InfoItem>
            )}
          </InfoGroup>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup>
            <CancelButton onClick={onClose}>Fechar</CancelButton>
            {isAuthor && (
              <RestoreButton
                onClick={handleRestore}
                disabled={restoreProblemMutation.isPending}
              >
                <ArrowCounterClockwise size={20} weight="bold" />
                {restoreProblemMutation.isPending
                  ? "Restaurando..."
                  : "Restaurar"}
              </RestoreButton>
            )}
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}
