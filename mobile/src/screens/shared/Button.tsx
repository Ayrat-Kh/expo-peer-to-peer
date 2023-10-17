import React from "react";
import { Pressable, ViewProps, StyleSheet, Text, View } from "react-native";

export interface ButtonProps {
  style?: ViewProps["style"];
  label: React.ReactNode;
  onPress: VoidFunction;
}

export const Button: React.FC<ButtonProps> = ({ style, onPress, label }) => {
  return (
    <Pressable style={style} onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.labelStyle}>{label}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#48295C",
    borderRadius: 4,

    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
  },
  labelStyle: {
    color: "#D19DFF",
    fontWeight: "500",
  },
});
