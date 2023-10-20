import React from 'react';
import { styled } from 'nativewind';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const StyledContainer = styled(View, 'bg-primary h-full p-4');

export const ScreenLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
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
    </TouchableWithoutFeedback>
  );
};
