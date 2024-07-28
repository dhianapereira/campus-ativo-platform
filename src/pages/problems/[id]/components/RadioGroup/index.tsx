import { Container, Title } from './styles'
import { IProps } from './index.d'
import { RadioButton } from '../RadioButton'

export function RadioGroup({ options, title, name, onChange }: IProps) {
    return (
        <>
            <Title>{title}</Title>
            <Container>
                {options.map(({ id, label, isActive }) => (
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
