import React from 'react';
import { Text } from 'react-native';
import { styled } from 'nativewind';

const StyledLabel = styled(Text, 'text-xs text-secondary');

const LabelInner: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <StyledLabel>{children}</StyledLabel>;
};

export const Label = styled(LabelInner);
