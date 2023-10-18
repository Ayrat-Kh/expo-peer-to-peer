import React from 'react';
import { TouchableOpacity, ViewProps, Text, View } from 'react-native';
import { styled } from 'nativewind';

export interface ButtonProps {
  style?: ViewProps['style'];
  label: React.ReactNode;
  onPress: VoidFunction;
}

const StyledView = styled(
  View,
  'rounded-md bg-componentPrimary py-2 px-3 active:bg-componentPrimary-hover'
);

const StyledText = styled(
  Text,
  'text-secondaryContrast font-semibold text-center'
);

const ButtonInner: React.FC<ButtonProps> = ({ style, onPress, label }) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <StyledView>
        <StyledText>{label}</StyledText>
      </StyledView>
    </TouchableOpacity>
  );
};

export const Button = styled(ButtonInner);
