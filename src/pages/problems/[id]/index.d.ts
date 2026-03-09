export interface IProps {
  title: string;
  location: string;
  description: string;
  status: string;
  category: string | null;
  maintenanceType: string | null;
  imageUrl: string | null;
  reporter: string;
  createdAt: string;
  updatedAt: string | null;
}

/** Status do backend (TO_ANALYSIS) mapeado para valor do frontend (toAnalysis) */
export const BACKEND_STATUS_TO_FRONTEND: Record<string, string> = {
  TO_ANALYSIS: "toAnalysis",
  IN_ANALYSIS: "inAnalysis",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  IN_PROGRESS: "inProgress",
  FINISHED: "finished",
};
