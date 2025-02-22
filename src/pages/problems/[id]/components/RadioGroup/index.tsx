import { Container, Title } from './styles'
import { IProps } from './index.d'
import { RadioButton } from '@/pages/problems/[id]/components/RadioButton'
import { maintenanceTypes } from '@/data/static/maintenance-types'

export function RadioGroup({ title, name, onChange }: IProps) {
  return (
    <>
      <Title>{title}</Title>
      <Container>
        {maintenanceTypes.map(({ id, label, isActive }) => (
          <RadioButton
            key={id}
            label={label}
            isActive={isActive}
            name={name}
            value={id}
            onChange={onChange}
          />
        ))}
      </Container>
    </>
  )
}
