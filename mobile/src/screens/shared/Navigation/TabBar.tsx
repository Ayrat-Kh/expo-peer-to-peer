import React from 'react';
import { styled } from 'nativewind';
import { Text, TouchableHighlight } from 'react-native';
import type {
  LabelPosition,
  BottomTabBarButtonProps,
} from '@react-navigation/bottom-tabs/src/types';

const StyledTabBarLabel = styled(Text, 'text-center text-primary left-4 ');

export const TabBarLabel: React.FC<{
  focused: boolean;
  color: string;
  position: LabelPosition;
  children: string;
}> = ({ focused, children }) => {
  return (
    <StyledTabBarLabel tw={focused ? 'font-semibold' : ''}>
      {children}
    </StyledTabBarLabel>
  );
};

const StyledTabBarButtonContainer = styled(
  TouchableHighlight,
  'flex-1 flex-row bg-secondary items-center justify-center h-full w-full'
);

export const TabBarButton: React.FC<BottomTabBarButtonProps> = ({
  onPress,
  children,
}) => {
  return (
    <StyledTabBarButtonContainer onPress={onPress}>
      {children}
    </StyledTabBarButtonContainer>
  );
};
