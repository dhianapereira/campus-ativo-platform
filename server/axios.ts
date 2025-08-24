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

AXIOS_INSTANCE.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/profile")
    ) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
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
