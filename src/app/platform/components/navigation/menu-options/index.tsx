import { Warning, SignOut } from 'phosphor-react'
import { NextRouter } from 'next/router'
import { IOption } from './index.d'

export const getMenuOptions = (router: NextRouter): IOption[] => [
  {
    id: 'problems',
    name: 'Problemas',
    icon: <Warning weight="bold" />,
    onClick: () => {
      router.push('/problems')
    },
  },
  {
    id: 'logout',
    name: 'Sair da plataforma',
    icon: <SignOut weight="bold" />,
    onClick: () => {
      //* TODO: Executar função para sair da plataforma*
    },
  },
]
