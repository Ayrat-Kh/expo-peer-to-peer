import React from "react";
import { View, type ViewProps, StyleSheet, TextInput } from "react-native";

import { Label } from "./Label";

export interface InputProps {
  label?: React.ReactNode;
  value: string;
  style?: ViewProps["style"];
  onChange: (v: string) => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  style,
  value,
  onChange,
}) => {
  return (
    <View style={style}>
      {label && <Label>{label}</Label>}
      <TextInput
        style={[styles.input, label ? styles.inputWithMargin : null]}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {},
  input: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderColor: "#8457AA",
    borderWidth: 1,
    color: "#D19DFF",
  },
  inputWithMargin: {
    marginTop: 2,
  },
});
