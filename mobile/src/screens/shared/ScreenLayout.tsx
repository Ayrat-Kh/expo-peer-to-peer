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

const StyledKeyboardAvoidingView = styled(
  KeyboardAvoidingView,
  'bg-primary flex-1 h-full'
);

const StyledContainer = styled(SafeAreaView, 'p-4');

export const ScreenLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <StyledKeyboardAvoidingView
      behavior={Platform.select({
        ios: 'padding',
        default: undefined,
      })}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <StyledContainer>
          <ScrollView>{children}</ScrollView>
        </StyledContainer>
      </TouchableWithoutFeedback>
    </StyledKeyboardAvoidingView>
  );
};
