import React from "react";
import { ImageSquare } from "phosphor-react";
import {
  NoImageContainer,
  NoImageIcon,
  NoImageTitle,
  NoImageDescription,
} from "./styles";

export interface NoImageProps {
  title?: string;
  description?: string;
}

export const NoImage = ({
  title = "Nenhuma imagem disponível",
  description = "Não há imagem para exibir neste momento.",
}: NoImageProps) => {
  return (
    <NoImageContainer>
      <NoImageIcon>
        <ImageSquare size={32} weight="bold" alt="" />
      </NoImageIcon>
      <div>
        <NoImageTitle>{title}</NoImageTitle>
        <NoImageDescription>{description}</NoImageDescription>
      </div>
    </NoImageContainer>
  );
};

NoImage.displayName = "NoImage";
