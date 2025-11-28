/**
 * Componente de Botão Customizado
 *
 * Botão reutilizável com variantes (primário, secundário, perigo, etc.)
 *
 * Uso:
 * <Botao onPress={handlePress}>Salvar</Botao>
 * <Botao variante="secundario" onPress={handlePress}>Cancelar</Botao>
 * <Botao variante="perigo" onPress={handleDelete}>Excluir</Botao>
 */

import { Ionicons } from "@expo/vector-icons";
import { CORES, ESPACAMENTO, FONTE, RAIO } from "@utils/constants";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

// Variantes disponíveis
type Variante = "primario" | "secundario" | "perigo" | "outline" | "ghost";
type Tamanho = "sm" | "md" | "lg";

interface BotaoProps {
  children: React.ReactNode;
  onPress: () => void;
  variante?: Variante;
  tamanho?: Tamanho;
  icone?: keyof typeof Ionicons.glyphMap;
  carregando?: boolean;
  desabilitado?: boolean;
  larguraTotal?: boolean;
  style?: ViewStyle;
}

export function Botao({
  children,
  onPress,
  variante = "primario",
  tamanho = "md",
  icone,
  carregando = false,
  desabilitado = false,
  larguraTotal = false,
  style,
}: BotaoProps) {
  const estilosVariante = obterEstilosVariante(variante);
  const estilosTamanho = obterEstilosTamanho(tamanho);

  const estaDesabilitado = desabilitado || carregando;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        estilosVariante.container,
        estilosTamanho.container,
        larguraTotal && styles.larguraTotal,
        estaDesabilitado && styles.desabilitado,
        style,
      ]}
      onPress={onPress}
      disabled={estaDesabilitado}
      activeOpacity={0.7}
    >
      {carregando ? (
        <ActivityIndicator size="small" color={estilosVariante.textoColor} />
      ) : (
        <>
          {icone && (
            <Ionicons
              name={icone}
              size={estilosTamanho.iconeSize}
              color={estilosVariante.textoColor}
              style={styles.icone}
            />
          )}
          <Text
            style={[
              styles.texto,
              { color: estilosVariante.textoColor },
              estilosTamanho.texto,
            ]}
          >
            {children}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

function obterEstilosVariante(variante: Variante) {
  const variantes: Record<
    Variante,
    { container: ViewStyle; textoColor: string }
  > = {
    primario: {
      container: {
        backgroundColor: CORES.primaria,
        borderWidth: 0,
      },
      textoColor: CORES.branco,
    },
    secundario: {
      container: {
        backgroundColor: CORES.secundaria,
        borderWidth: 0,
      },
      textoColor: CORES.branco,
    },
    perigo: {
      container: {
        backgroundColor: CORES.erro,
        borderWidth: 0,
      },
      textoColor: CORES.branco,
    },
    outline: {
      container: {
        backgroundColor: CORES.transparente,
        borderWidth: 1,
        borderColor: CORES.primaria,
      },
      textoColor: CORES.primaria,
    },
    ghost: {
      container: {
        backgroundColor: CORES.transparente,
        borderWidth: 0,
      },
      textoColor: CORES.primaria,
    },
  };

  return variantes[variante];
}

function obterEstilosTamanho(tamanho: Tamanho) {
  const tamanhos: Record<
    Tamanho,
    { container: ViewStyle; texto: TextStyle; iconeSize: number }
  > = {
    sm: {
      container: {
        paddingVertical: ESPACAMENTO.xs,
        paddingHorizontal: ESPACAMENTO.sm,
        borderRadius: RAIO.sm,
      },
      texto: {
        fontSize: FONTE.sm,
      },
      iconeSize: 16,
    },
    md: {
      container: {
        paddingVertical: ESPACAMENTO.sm + 2,
        paddingHorizontal: ESPACAMENTO.md,
        borderRadius: RAIO.md,
      },
      texto: {
        fontSize: FONTE.md,
      },
      iconeSize: 20,
    },
    lg: {
      container: {
        paddingVertical: ESPACAMENTO.md,
        paddingHorizontal: ESPACAMENTO.lg,
        borderRadius: RAIO.md,
      },
      texto: {
        fontSize: FONTE.lg,
      },
      iconeSize: 24,
    },
  };

  return tamanhos[tamanho];
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  texto: {
    fontWeight: "600",
  },
  icone: {
    marginRight: ESPACAMENTO.xs,
  },
  larguraTotal: {
    width: "100%",
  },
  desabilitado: {
    opacity: 0.5,
  },
});
