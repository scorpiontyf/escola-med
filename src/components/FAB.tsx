/**
 * Componente FAB (Floating Action Button)
 *
 * Botão flutuante no canto inferior direito.
 *
 * Uso:
 * <FAB onPress={handleAdd} />
 * <FAB icone="add" onPress={handleAdd} />
 */

import { Ionicons } from "@expo/vector-icons";
import { CORES, ESPACAMENTO } from "@utils/constants";
import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

interface FABProps {
  onPress: () => void;
  icone?: keyof typeof Ionicons.glyphMap;
  cor?: string;
  corIcone?: string;
  tamanho?: "md" | "lg";
  posicao?: "direita" | "esquerda" | "centro";
  style?: ViewStyle;
}

export function FAB({
  onPress,
  icone = "add",
  cor = CORES.primaria,
  corIcone = CORES.branco,
  tamanho = "lg",
  posicao = "direita",
  style,
}: FABProps) {
  const tamanhoStyle = obterTamanho(tamanho);
  const posicaoStyle = obterPosicao(posicao);

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        tamanhoStyle.container,
        posicaoStyle,
        { backgroundColor: cor },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icone} size={tamanhoStyle.icone} color={corIcone} />
    </TouchableOpacity>
  );
}

function obterTamanho(tamanho: "md" | "lg") {
  const tamanhos = {
    md: {
      container: { width: 48, height: 48, borderRadius: 24 },
      icone: 24,
    },
    lg: {
      container: { width: 56, height: 56, borderRadius: 28 },
      icone: 28,
    },
  };
  return tamanhos[tamanho];
}

function obterPosicao(posicao: "direita" | "esquerda" | "centro"): ViewStyle {
  const posicoes: Record<string, ViewStyle> = {
    direita: { right: ESPACAMENTO.lg },
    esquerda: { left: ESPACAMENTO.lg },
    centro: { alignSelf: "center", right: undefined, left: undefined },
  };
  return posicoes[posicao];
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: ESPACAMENTO.lg,
    justifyContent: "center",
    alignItems: "center",
    // Sombra
    elevation: 4,
    shadowColor: CORES.preto,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
