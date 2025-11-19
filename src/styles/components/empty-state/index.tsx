import Image from "next/image";
import { styled } from "@/styles";
import bgEllipse from "@/assets/unauthorized.svg";
import notFoundIcon from "@/assets/not-found-icon.svg";

const PageContainer = styled("div", {
  position: "relative",
  backgroundColor: "transparent",
  padding: "8vh 0 10vh",
});

const BackgroundWrapper = styled("div", {
  position: "absolute",
  top: "10vh",
  left: "50%",
  transform: "translateX(-50%)",
  width: "clamp(520px, 88vw, 980px)",
  height: "clamp(360px, 56vw, 720px)",
  pointerEvents: "none",
  zIndex: 0,

  "@media (max-width: 820px)": {
    top: "12vh",
    width: "min(560px, 92vw)",
    height: "min(420px, 70vw)",
  },
});

const Card = styled("div", {
  position: "relative",
  zIndex: 1,
  width: "min(560px, 86vw)",
  margin: "0 auto",
  marginTop: "18vh",
  backgroundColor: "#FFFFFF",
  borderRadius: "8px",
  boxShadow:
    "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)",
  padding: "40px",
  textAlign: "center",

  "@media (max-width: 820px)": {
    width: "min(540px, 90vw)",
    padding: "32px",
    marginTop: "24vh",
    borderRadius: "10px",
  },
});

const Title = styled("h2", {
  fontSize: "28px",
  fontWeight: 700,
  color: "#44403C",
  margin: 0,
  marginTop: "8px",
  marginBottom: "16px",

  "@media (max-width: 820px)": {
    fontSize: "24px",
    marginBottom: "14px",
  },
});

const Message = styled("p", {
  fontSize: "18px",
  fontWeight: 500,
  color: "#4B5563",
  margin: 0,
  lineHeight: 1.6,
  maxWidth: "460px",
  marginLeft: "auto",
  marginRight: "auto",
  marginBottom: "24px",

  "@media (max-width: 820px)": {
    fontSize: "18px",
    maxWidth: "480px",
    marginBottom: "20px",
  },
});

const ActionButton = styled("button", {
  appearance: "none",
  border: "none",
  borderRadius: "8px",
  padding: "10px 22px",
  backgroundColor: "#00875F",
  color: "#FFFFFF",
  fontSize: "16px",
  fontWeight: 700,
  cursor: "pointer",

  "&:hover": {
    backgroundColor: "#0A6A50",
  },

  "@media (max-width: 820px)": {
    padding: "12px 26px",
    fontSize: "16px",
  },
});
interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  mobileActionText?: string;
  onAction?: () => void;
}

const FIXED_TITLE = "Nenhum resultado encontrado";
const FIXED_MESSAGE =
  "Não foi possível buscar as informações no momento. Por favor, tente novamente mais tarde.";
const FIXED_ACTION_LABEL = "Recarregar";

export default function EmptyState({ onAction }: EmptyStateProps) {
  return (
    <PageContainer>
      <BackgroundWrapper aria-hidden="true">
        <Image
          src={bgEllipse}
          alt=""
          fill
          priority
          style={{ objectFit: "contain", objectPosition: "center 20%" }}
        />
      </BackgroundWrapper>

      <Card role="region" aria-label="Nenhum resultado encontrado">
        <Image src={notFoundIcon} alt="" width={96} height={96} />
        <Title>{FIXED_TITLE}</Title>
        <Message>{FIXED_MESSAGE}</Message>
        {onAction && (
          <ActionButton onClick={onAction} aria-label="Recarregar">
            {FIXED_ACTION_LABEL}
          </ActionButton>
        )}
      </Card>
    </PageContainer>
  );
}
