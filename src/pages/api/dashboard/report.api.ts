import type { NextApiRequest, NextApiResponse } from "next";
import type { DashboardReportData } from "@/@types/dashboard";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3333";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardReportData | { message: string }>,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const authToken = req.cookies["auth-token"];
  if (!authToken) {
    return res.status(401).json({ message: "Não autenticado" });
  }

  const { startDate, endDate } = req.query as {
    startDate?: string;
    endDate?: string;
  };

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "startDate e endDate são obrigatórios" });
  }

  try {
    const url = new URL("/dashboard/report", BACKEND_URL);
    url.searchParams.set("startDate", startDate);
    url.searchParams.set("endDate", endDate);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const message =
        (err as { message?: string }).message || "Erro ao gerar relatório";
      return res.status(response.status).json({ message });
    }

    const data = (await response.json()) as DashboardReportData;
    return res.status(200).json(data);
  } catch (error) {
    console.error("[API /dashboard/report]", error);
    return res
      .status(500)
      .json({ message: "Erro ao buscar dados do relatório. Tente novamente." });
  }
}
