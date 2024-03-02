import { Warning, SignOut } from 'phosphor-react'
import { IOption } from './index.d'

export const menuOptions: IOption[] = [
  {
    id: 'problems',
    name: 'Problemas',
    icon: <Warning weight="bold" />,
    onClick: () => {
      // TODO: Adicionar a chamada para a tela de problemas
    },
  },
  {
    id: 'logout',
    name: 'Sair da plataforma',
    icon: <SignOut weight="bold" />,
    onClick: () => {
      // TODO: Executar função para sair da plataforma
    },
  },
]
