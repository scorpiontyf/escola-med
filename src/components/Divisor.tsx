import { CORES, ESPACAMENTO } from "@utils/constants";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface DivisorProps {
  espacamento?: "sm" | "md" | "lg";
  cor?: string;
  style?: ViewStyle;
}

export function Divisor({
  espacamento = "md",
  cor = CORES.divisor,
  style,
}: DivisorProps) {
  const espacamentoStyle = obterEspacamento(espacamento);

  return (
    <View
      style={[
        styles.divisor,
        { backgroundColor: cor },
        espacamentoStyle,
        style,
      ]}
    />
  );
}

function obterEspacamento(espacamento: "sm" | "md" | "lg"): ViewStyle {
  const espacamentos: Record<string, ViewStyle> = {
    sm: { marginVertical: ESPACAMENTO.sm },
    md: { marginVertical: ESPACAMENTO.md },
    lg: { marginVertical: ESPACAMENTO.lg },
  };
  return espacamentos[espacamento];
}

const styles = StyleSheet.create({
  divisor: {
    height: 1,
    width: "100%",
  },
});
