import React from 'react';
import { styled } from 'nativewind';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';

const StyledContainer = styled(ScrollView, 'bg-primary h-full p-4');

export const ScreenLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.select({
          ios: 'padding',
          default: undefined,
        })}
      >
        <SafeAreaView>
          <StyledContainer>{children}</StyledContainer>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
