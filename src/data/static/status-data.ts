import { Item } from "@/@types/basic-types";

export enum Status {
  ToAnalysis = "toAnalysis",
  InAnalysis = "inAnalysis",
  Accepted = "accepted",
  Rejected = "rejected",
  InProgress = "inProgress",
  Finished = "finished",
}

export const StatusDataList: Item[] = [
  {
    name: "Para análise",
    value: Status.ToAnalysis,
  },
  {
    name: "Em análise",
    value: Status.InAnalysis,
  },
  {
    name: "Aceito",
    value: Status.Accepted,
  },
  {
    name: "Recusado",
    value: Status.Rejected,
  },
  {
    name: "Em andamento",
    value: Status.InProgress,
  },
  {
    name: "Concluído",
    value: Status.Finished,
  },
];
