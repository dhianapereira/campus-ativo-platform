import React, { useId } from 'react';
import { RadioContainer, RadioInput, RadioLabel } from './styles';
import { IProps } from './index.d';

export function RadioButton({
  label,
  isActive,
  value,
  onChange,
  name,
}: IProps) {
  const id = useId();

  return (
    <RadioContainer>
      <RadioInput
        type="radio"
        id={id}
        defaultChecked={isActive}
        name={name}
        onChange={onChange}
        value={value}
      />
      <RadioLabel htmlFor={id}>{label}</RadioLabel>
    </RadioContainer>
  );
}
