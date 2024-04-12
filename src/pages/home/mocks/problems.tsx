import { IProps } from '../components/ProblemCard/index.d'

export const problems: IProps[] = [
  {
    id: 'problem1',
    title: 'Ar-condicionado',
    location: 'Sala 05232',
    description:
      'Problemas no ar-condicionado foram identificados na sala 05232. Verificar com urgência.',
    badgeId: 'toAnalysis',
  },
  {
    id: 'problem2',
    title: 'Porta com defeito',
    location: 'Laboratório de Informática',
    description:
      'A porta do laboratorio não está trancando. Por favor, verificar urgentemente.',
    badgeId: 'rejected',
  },
  {
    id: 'problem3',
    title: 'Infiltração no banheiro feminino do lado dos laboratórios',
    location: 'Banheiro feminino',
    description:
      'Há uma infiltração no banheiro feminino do lado dos laboratórios. Por favor, verificar com urgência.Há uma infiltração no banheiro feminino do lado dos laboratórios. Por favor, verificar com urgência.',
    badgeId: 'inProgress',
  },
]
