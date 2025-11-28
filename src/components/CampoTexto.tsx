import { Ionicons } from "@expo/vector-icons";
import { CORES, ESPACAMENTO, FONTE, RAIO } from "@utils/constants";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface CampoTextoProps extends Omit<TextInputProps, "style"> {
  label?: string;
  erro?: string;
  obrigatorio?: boolean;
  icone?: keyof typeof Ionicons.glyphMap;
  dica?: string;
}

export function CampoTexto({
  label,
  erro,
  obrigatorio = false,
  icone,
  dica,
  secureTextEntry,
  ...props
}: CampoTextoProps) {
  const [focado, setFocado] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const temErro = !!erro;
  const ehSenha = secureTextEntry;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {obrigatorio && <Text style={styles.obrigatorio}> *</Text>}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          focado && styles.inputFocado,
          temErro && styles.inputErro,
        ]}
      >
        {icone && (
          <Ionicons
            name={icone}
            size={20}
            color={
              temErro
                ? CORES.erro
                : focado
                  ? CORES.primaria
                  : CORES.textoSecundario
            }
            style={styles.icone}
          />
        )}

        <TextInput
          style={[styles.input, icone && styles.inputComIcone]}
          placeholderTextColor={CORES.textoSecundario}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
          secureTextEntry={ehSenha && !senhaVisivel}
          {...props}
        />

        {ehSenha && (
          <TouchableOpacity
            onPress={() => setSenhaVisivel(!senhaVisivel)}
            style={styles.botaoSenha}
          >
            <Ionicons
              name={senhaVisivel ? "eye-off" : "eye"}
              size={20}
              color={CORES.textoSecundario}
            />
          </TouchableOpacity>
        )}
      </View>

      {temErro && (
        <View style={styles.erroContainer}>
          <Ionicons name="alert-circle" size={14} color={CORES.erro} />
          <Text style={styles.erroTexto}>{erro}</Text>
        </View>
      )}

      {dica && !temErro && <Text style={styles.dica}>{dica}</Text>}
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CORES.fundo,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: RAIO.md,
    paddingHorizontal: ESPACAMENTO.md,
  },
  inputFocado: {
    borderColor: CORES.primaria,
    borderWidth: 2,
  },
  inputErro: {
    borderColor: CORES.erro,
    backgroundColor: CORES.erroClaro,
  },
  icone: {
    marginRight: ESPACAMENTO.sm,
  },
  input: {
    flex: 1,
    paddingVertical: ESPACAMENTO.sm + 4,
    fontSize: FONTE.md,
    color: CORES.texto,
  },
  inputComIcone: {
    paddingLeft: 0,
  },
  botaoSenha: {
    padding: ESPACAMENTO.xs,
  },
  erroContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: ESPACAMENTO.xs,
  },
  erroTexto: {
    fontSize: FONTE.xs,
    color: CORES.erro,
    marginLeft: ESPACAMENTO.xs,
  },
  dica: {
    fontSize: FONTE.xs,
    color: CORES.textoSecundario,
    marginTop: ESPACAMENTO.xs,
  },
});
