import React from 'react';
import { styled } from 'nativewind';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View,
} from 'react-native';

const StyledContainer = styled(View, 'bg-primary h-full p-4');

export const ScreenLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <StyledContainer>
      <KeyboardAvoidingView
        behavior={Platform.select({
          ios: 'padding',
          default: undefined,
        })}
      >
        <SafeAreaView>{children}</SafeAreaView>
      </KeyboardAvoidingView>
    </StyledContainer>
  );
};
