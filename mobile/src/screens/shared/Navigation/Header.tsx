import React from 'react';
import { Text, View } from 'react-native';
import { styled } from 'nativewind';
import type { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';

const Container = styled(
  View,
  'w-full p-4 bg-secondary justify-center items-center'
);

const Title = styled(Text, 'text-primary font-semibold text-2xl');

export const HeaderBar: React.FC<BottomTabHeaderProps> = ({ route }) => {
  return (
    <Container>
      <Title>{route.name}</Title>
    </Container>
  );
};
