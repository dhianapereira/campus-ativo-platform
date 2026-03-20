import type { NextApiRequest, NextApiResponse } from "next";
import { CreateAccountRequest } from "../../../server/client/models";
import { createAccountControllerHandle } from "../../../server/client/authentication/authentication";

interface RegisterResponse {
  success: boolean;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponse>,
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const { name, position, email, password }: CreateAccountRequest = req.body;

    if (!name || !position || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Todos os campos são obrigatórios",
      });
    }

    await createAccountControllerHandle({
      name,
      position,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
    });
  } catch (error: unknown) {
    const err = error as {
      code?: string;
      response?: {
        status?: number;
        data?: { error?: string; message?: string; errors?: unknown };
      };
      message?: string;
    };
    const status = err?.response?.status ?? 500;
    const backendError =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message;

    const genericMessage =
      "Não foi possível completar o cadastro. Verifique suas informações.";
    let message = backendError || "Erro interno do servidor";

    // Não revelar detalhes (ex.: e-mail já cadastrado) por segurança
    if (status === 400 || status === 409) {
      message = genericMessage;
    }

    console.error("Erro no proxy de cadastro", {
      status,
      code: err?.code,
      message: err?.message,
      backendData: err?.response?.data,
    });

    return res.status(status).json({
      success: false,
      error: message,
    });
  }
}
