import { ReactElement } from "react";

export interface IOption {
  id: string;
  name: string;
  icon: ReactElement;
  onClick: () => void;
}
