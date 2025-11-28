/**
 * Componente de Erro
 *
 * Exibe mensagem de erro com opção de retry.
 *
 * Uso:
 * <Erro
 *   mensagem="Erro ao carregar dados"
 *   onRetry={handleRetry}
 * />
 */

import { Ionicons } from "@expo/vector-icons";
import { CORES, ESPACAMENTO, FONTE } from "@utils/constants";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, ButtonIcon, ButtonText } from "@components/ui/button/index";
interface ErroProps {
  mensagem: string;
  onRetry?: () => void;
  botaoTexto?: string;
}

export function Erro({
  mensagem,
  onRetry,
  botaoTexto = "Tentar novamente",
}: ErroProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle" size={64} color={CORES.erro} />

      <Text style={styles.mensagem}>{mensagem}</Text>

      {onRetry && (
        <Button onPress={onRetry} action="primary" style={styles.botao}>
          <ButtonIcon
            as={() => <Ionicons name="refresh" size={16} color="white" />}
          />
          <ButtonText style={{ color: CORES.branco }}>{botaoTexto}</ButtonText>
        </Button>
      )}
    </View>
  );
}

/**
 * Erro em tela cheia
 */
export function ErroTela({ mensagem, onRetry }: ErroProps) {
  return (
    <View style={styles.telaCheia}>
      <Erro mensagem={mensagem} onRetry={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: ESPACAMENTO.xl,
  },
  mensagem: {
    fontSize: FONTE.md,
    color: CORES.erro,
    textAlign: "center",
    marginTop: ESPACAMENTO.md,
    marginBottom: ESPACAMENTO.lg,
  },
  botao: {
    marginTop: ESPACAMENTO.sm,
  },
  telaCheia: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CORES.fundo,
  },
});
