import Head from "next/head";
import type { NextPageContext } from "next";
import NotFoundPage from "./404.page";
import { styled } from "@/styles";

type ErrorPageProps = {
  statusCode?: number;
};

const ErrorContainer = styled("div", {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#FFFFFF",
  padding: "32px",
  textAlign: "center",
});

const ErrorTitle = styled("h1", {
  margin: 0,
  fontSize: "28px",
  fontWeight: 700,
  color: "#44403C",
});

const ErrorMessage = styled("p", {
  margin: "16px 0 0",
  fontSize: "16px",
  color: "#6B7280",
});

export default function ErrorPage({ statusCode }: ErrorPageProps) {
  if (statusCode === 404) {
    return <NotFoundPage />;
  }

  return (
    <>
      <Head>
        <title>Erro • Campus Ativo</title>
      </Head>
      <ErrorContainer>
        <div>
          <ErrorTitle>Ocorreu um erro</ErrorTitle>
          <ErrorMessage>
            Não foi possível carregar a página agora. Tente novamente mais
            tarde.
          </ErrorMessage>
        </div>
      </ErrorContainer>
    </>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 500;
  return { statusCode };
};
