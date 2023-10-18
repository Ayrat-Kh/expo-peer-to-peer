import React from 'react';
import { View, type ViewProps, TextInput } from 'react-native';
import { styled } from 'nativewind';

import { Label } from './Label';

export interface InputProps {
  label?: React.ReactNode;
  value: string;
  style?: ViewProps['style'];
  onChange: (v: string) => void;
}

const StyledContainer = styled(View, '');
const StyledInput = styled(
  TextInput,
  'bg-secondary rounded-md text-primaryContrast border border-primary focus:border-primary-active py-1 px-2 text-sm'
);

const InputInner: React.FC<InputProps> = ({
  label,
  style,
  value,
  onChange,
}) => {
  return (
    <StyledContainer style={style}>
      {label && <Label>{label}</Label>}
      <StyledInput
        className={label ? 'mt-2' : ''}
        value={value}
        onChangeText={onChange}
      />
    </StyledContainer>
  );
};

export const Input = styled(InputInner);
