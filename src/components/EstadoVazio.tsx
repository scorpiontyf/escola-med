/**
 * Componente de Estado Vazio
 *
 * Exibido quando uma lista não tem itens.
 *
 * Uso:
 * <EstadoVazio
 *   icone="school-outline"
 *   titulo="Nenhuma escola cadastrada"
 *   subtitulo="Toque no botão + para adicionar"
 * />
 */

import { Ionicons } from "@expo/vector-icons";
import { CORES, ESPACAMENTO, FONTE } from "@utils/constants";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, ButtonText } from "./ui/button";

interface EstadoVazioProps {
  icone?: keyof typeof Ionicons.glyphMap;
  titulo: string;
  subtitulo?: string;
  botaoTexto?: string;
  onBotaoPress?: () => void;
}

export function EstadoVazio({
  icone = "document-outline",
  titulo,
  subtitulo,
  botaoTexto,
  onBotaoPress,
}: EstadoVazioProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icone} size={64} color={CORES.borda} />

      <Text style={styles.titulo}>{titulo}</Text>

      {subtitulo && <Text style={styles.subtitulo}>{subtitulo}</Text>}

      {botaoTexto && onBotaoPress && (
        <Button onPress={onBotaoPress} action="primary" style={styles.botao}>
          <ButtonText>{botaoTexto}</ButtonText>
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: ESPACAMENTO.xxl,
    paddingHorizontal: ESPACAMENTO.lg,
  },
  titulo: {
    fontSize: FONTE.lg,
    fontWeight: "600",
    color: CORES.textoSecundario,
    marginTop: ESPACAMENTO.md,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: FONTE.sm,
    color: CORES.textoSecundario,
    marginTop: ESPACAMENTO.xs,
    textAlign: "center",
  },
  botao: {
    marginTop: ESPACAMENTO.lg,
  },
});
