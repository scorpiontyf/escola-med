/**
 * Componente de Seletor (Botões de Opção)
 *
 * Grupo de botões para seleção única.
 * Similar a radio buttons.
 *
 * Uso:
 * <Seletor
 *   label="Turno"
 *   opcoes={[
 *     { valor: 'matutino', label: 'Matutino' },
 *     { valor: 'vespertino', label: 'Vespertino' },
 *   ]}
 *   valor={turno}
 *   onChange={setTurno}
 * />
 */

import { CORES, ESPACAMENTO, FONTE, RAIO } from "@utils/constants";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Opcao<T> {
  valor: T;
  label: string;
}

interface SeletorProps<T> {
  label?: string;
  opcoes: Opcao<T>[];
  valor: T;
  onChange: (valor: T) => void;
  obrigatorio?: boolean;
  erro?: string;
}

export function Seletor<T extends string | number>({
  label,
  opcoes,
  valor,
  onChange,
  obrigatorio = false,
  erro,
}: SeletorProps<T>) {
  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <Text style={styles.label}>
          {label}
          {obrigatorio && <Text style={styles.obrigatorio}> *</Text>}
        </Text>
      )}

      {/* Opções */}
      <View style={styles.opcoes}>
        {opcoes.map((opcao) => {
          const selecionado = opcao.valor === valor;

          return (
            <TouchableOpacity
              key={String(opcao.valor)}
              style={[
                styles.opcao,
                selecionado && styles.opcaoSelecionada,
                erro && styles.opcaoErro,
              ]}
              onPress={() => onChange(opcao.valor)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.opcaoTexto,
                  selecionado && styles.opcaoTextoSelecionado,
                ]}
              >
                {opcao.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Erro */}
      {erro && <Text style={styles.erro}>{erro}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: ESPACAMENTO.md,
  },
  label: {
    fontSize: FONTE.sm,
    fontWeight: "600",
    color: CORES.texto,
    marginBottom: ESPACAMENTO.xs,
  },
  obrigatorio: {
    color: CORES.erro,
  },
  opcoes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ESPACAMENTO.sm,
  },
  opcao: {
    paddingHorizontal: ESPACAMENTO.md,
    paddingVertical: ESPACAMENTO.sm,
    borderRadius: RAIO.md,
    backgroundColor: CORES.fundo,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  opcaoSelecionada: {
    backgroundColor: CORES.primaria,
    borderColor: CORES.primaria,
  },
  opcaoErro: {
    borderColor: CORES.erro,
  },
  opcaoTexto: {
    fontSize: FONTE.sm,
    color: CORES.texto,
  },
  opcaoTextoSelecionado: {
    color: CORES.branco,
    fontWeight: "600",
  },
  erro: {
    fontSize: FONTE.xs,
    color: CORES.erro,
    marginTop: ESPACAMENTO.xs,
  },
});
