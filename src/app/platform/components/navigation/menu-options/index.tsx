import {
  ChartLineUp,
  Warning,
  SignOut,
  ArrowClockwise,
  Users,
  Gear,
  Trash,
} from "phosphor-react";
import { NextRouter } from "next/router";
import { IOption } from "./index.d";

interface MenuOptionsConfig {
  router: NextRouter;
  onLogoutClick: () => Promise<void>;
  onClose?: () => void;
  openLogoutModal?: () => void;
  onRetryProfile?: () => void;
  canAccessUserManagement?: boolean;
  canAccessSettings?: boolean;
}

export const createMenuOptions = ({
  router,
  onLogoutClick,
  onClose,
  openLogoutModal,
  onRetryProfile,
  canAccessUserManagement = false,
  canAccessSettings = false,
}: MenuOptionsConfig): IOption[] => {
  const options: IOption[] = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: <ChartLineUp weight="bold" />,
      onClick: () => {
        router.push("/home");
        onClose?.();
      },
    },
    {
      id: "problems",
      name: "Problemas",
      icon: <Warning weight="bold" />,
      onClick: () => {
        router.push("/problems");
        onClose?.();
      },
    },
  ];

  if (canAccessUserManagement) {
    options.push({
      id: "members",
      name: "Membros",
      icon: <Users weight="bold" />,
      onClick: () => {
        router.push("/members");
        onClose?.();
      },
    });
  }

  if (canAccessSettings) {
    options.push({
      id: "settings",
      name: "Configurações",
      icon: <Gear weight="bold" />,
      onClick: () => {
        router.push("/settings");
        onClose?.();
      },
    });

    options.push({
      id: "trash",
      name: "Lixeira",
      icon: <Trash weight="bold" />,
      onClick: () => {
        router.push("/trash");
        onClose?.();
      },
    });
  }

  if (onRetryProfile) {
    options.push({
      id: "retry-profile",
      name: "Recarregar perfil",
      icon: <ArrowClockwise weight="bold" />,
      onClick: () => {
        onRetryProfile();
        onClose?.();
      },
    });
  }

  options.push({
    id: "logout",
    name: "Sair do sistema",
    icon: <SignOut weight="bold" />,
    onClick: () => {
      if (openLogoutModal) {
        openLogoutModal();
      } else {
        onLogoutClick();
        onClose?.();
      }
    },
  });

  return options;
};

/** Path associado a cada item do menu (para estado ativo) */
export const MENU_OPTION_PATHS: Record<string, string> = {
  dashboard: "/home",
  problems: "/problems",
  members: "/members",
  settings: "/settings",
  trash: "/trash",
};
