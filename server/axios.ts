import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export const AXIOS_INSTANCE = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

AXIOS_INSTANCE.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const cookies = document.cookie.split(";");
      const authCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("auth-token="),
      );

      if (authCookie) {
        const token = authCookie.split("=")[1];
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Function to translate axios error messages
function translateAxiosError(error: AxiosError): string {
  if (error.message.includes('Network Error')) {
    return 'Erro de conexão. Verifique sua internet.';
  }

  if (error.message.includes('timeout')) {
    return 'Tempo de resposta excedido. Tente novamente.';
  }

  if (error.message.startsWith('Request failed with status code')) {
    const status = error.response?.status;
    switch (status) {
      case 400:
        return 'Requisição inválida. Verifique os dados enviados.';
      case 401:
        return 'Não autorizado. Faça login novamente.';
      case 403:
        return 'Acesso negado. Você não tem permissão.';
      case 404:
        return 'Recurso não encontrado.';
      case 409:
        return 'Conflito. O recurso já existe.';
      case 422:
        return 'Dados inválidos. Verifique as informações.';
      case 500:
        return 'Erro no servidor. Tente novamente mais tarde.';
      case 502:
      case 503:
        return 'Serviço temporariamente indisponível.';
      default:
        return `Erro na requisição (código ${status}).`;
    }
  }

  return error.message;
}

AXIOS_INSTANCE.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Translate error message
    const translatedMessage = translateAxiosError(error);

    // Create new error with translated message
    const translatedError = new Error(translatedMessage) as AxiosError;
    translatedError.response = error.response;
    translatedError.config = error.config;
    translatedError.code = error.code;
    translatedError.request = error.request;

    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/profile")
    ) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(translatedError);
  },
);

export const axiosInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const { signal, ...configWithoutSignal } = config;
  const response = await AXIOS_INSTANCE({
    ...configWithoutSignal,
    ...options,
  });
  return response.data;
};

export type BodyType<BodyData> = BodyData;
export type ErrorType<Error> = AxiosError<Error>;
