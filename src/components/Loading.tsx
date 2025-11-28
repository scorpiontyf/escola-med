/**
 * Componente de Loading (Carregando)
 *
 * Indicador de carregamento com mensagem opcional.
 *
 * Uso:
 * <Loading />
 * <Loading mensagem="Carregando escolas..." />
 */

import { CORES, ESPACAMENTO, FONTE } from "@utils/constants";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface LoadingProps {
  mensagem?: string;
  tamanho?: "small" | "large";
  cor?: string;
}

export function Loading({
  mensagem,
  tamanho = "large",
  cor = CORES.primaria,
}: LoadingProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={tamanho} color={cor} />
      {mensagem && <Text style={styles.mensagem}>{mensagem}</Text>}
    </View>
  );
}

/**
 * Loading em tela cheia
 */
export function LoadingTela({ mensagem }: { mensagem?: string }) {
  return (
    <View style={styles.telaCheia}>
      <Loading mensagem={mensagem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: ESPACAMENTO.lg,
  },
  mensagem: {
    fontSize: FONTE.md,
    color: CORES.textoSecundario,
    marginTop: ESPACAMENTO.md,
  },
  telaCheia: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CORES.fundo,
  },
});
