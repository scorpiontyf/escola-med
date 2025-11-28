import { CORES, ESPACAMENTO, RAIO } from "@utils/constants";
import React from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  pressionavel?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  children,
  pressionavel = false,
  onPress,
  style,
  padding = "md",
}: CardProps) {
  const paddingStyle = obterPadding(padding);

  if (pressionavel && onPress) {
    return (
      <TouchableOpacity
        style={[styles.card, paddingStyle, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.card, paddingStyle, style]}>{children}</View>;
}

function obterPadding(padding: "none" | "sm" | "md" | "lg"): ViewStyle {
  const paddings: Record<string, ViewStyle> = {
    none: { padding: 0 },
    sm: { padding: ESPACAMENTO.sm },
    md: { padding: ESPACAMENTO.md },
    lg: { padding: ESPACAMENTO.lg },
  };
  return paddings[padding];
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: CORES.fundoCard,
    borderRadius: RAIO.lg,
    elevation: 2,
    shadowColor: CORES.preto,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
