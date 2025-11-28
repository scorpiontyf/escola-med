import { CORES, ESPACAMENTO, FONTE, RAIO } from "@utils/constants";
import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

type Variante = "padrao" | "primario" | "sucesso" | "erro" | "alerta" | "info";

interface BadgeProps {
  children: React.ReactNode;
  variante?: Variante;
  tamanho?: "sm" | "md";
}

export function Badge({
  children,
  variante = "padrao",
  tamanho = "md",
}: BadgeProps) {
  const estilosVariante = obterEstilosVariante(variante);
  const estilosTamanho = obterEstilosTamanho(tamanho);

  return (
    <View
      style={[
        styles.badge,
        estilosVariante.container,
        estilosTamanho.container,
      ]}
    >
      <Text style={[styles.texto, estilosVariante.texto, estilosTamanho.texto]}>
        {children}
      </Text>
    </View>
  );
}

function obterEstilosVariante(variante: Variante): {
  container: ViewStyle;
  texto: TextStyle;
} {
  const variantes: Record<
    Variante,
    { container: ViewStyle; texto: TextStyle }
  > = {
    padrao: {
      container: { backgroundColor: CORES.fundo },
      texto: { color: CORES.textoSecundario },
    },
    primario: {
      container: { backgroundColor: CORES.infoClaro },
      texto: { color: CORES.primaria },
    },
    sucesso: {
      container: { backgroundColor: CORES.sucessoClaro },
      texto: { color: CORES.sucesso },
    },
    erro: {
      container: { backgroundColor: CORES.erroClaro },
      texto: { color: CORES.erro },
    },
    alerta: {
      container: { backgroundColor: CORES.alertaClaro },
      texto: { color: CORES.alerta },
    },
    info: {
      container: { backgroundColor: CORES.infoClaro },
      texto: { color: CORES.info },
    },
  };
  return variantes[variante];
}

function obterEstilosTamanho(tamanho: "sm" | "md"): {
  container: ViewStyle;
  texto: TextStyle;
} {
  const tamanhos = {
    sm: {
      container: {
        paddingHorizontal: ESPACAMENTO.xs,
        paddingVertical: 2,
        borderRadius: RAIO.sm,
      },
      texto: { fontSize: FONTE.xs },
    },
    md: {
      container: {
        paddingHorizontal: ESPACAMENTO.sm,
        paddingVertical: ESPACAMENTO.xs,
        borderRadius: RAIO.md,
      },
      texto: { fontSize: FONTE.sm },
    },
  };
  return tamanhos[tamanho];
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
  },
  texto: {
    fontWeight: "600",
  },
});
