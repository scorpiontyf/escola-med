import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  CORES,
  ESPACAMENTO,
  FONTE,
  MENSAGENS,
  ANOS_LETIVOS,
} from "@utils/constants";
import { TurmaInput, Turno, TurnoLabels } from "../../../src/types/index";

import { useClasses, useForm } from "@hooks/index";

import { getTurmaFactory } from "../../../src/patterns/index";
import { Button, ButtonText } from "@components/ui/button";
import { Box } from "@components/ui/box";
import { LoadingTela } from "@components/Loading";
import { CampoTexto } from "@components/CampoTexto";
import { Seletor } from "@components/Seletor";

const OPCOES_TURNO = Object.entries(TurnoLabels).map(([valor, label]) => ({
  valor: valor as Turno,
  label,
}));

const OPCOES_ANO = ANOS_LETIVOS.map((ano) => ({
  valor: ano,
  label: String(ano),
}));

const turmaFactory = getTurmaFactory();

const initialValues = {
  nome: "",
  turno: "matutino" as Turno,
  anoLetivo: new Date().getFullYear(),
  capacidade: "",
};

export default function EditarTurmaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [carregouDados, setCarregouDados] = useState(false);

  const { selectedClass, loading, executing, loadClassById, updateClass } =
    useClasses();

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setFormValues,
    isSubmitting,
  } = useForm({
    initialValues,
    validationRules: {
      nome: [
        {
          validate: (value) => value.trim().length > 0,
          message: MENSAGENS.campoObrigatorio,
        },
        {
          validate: (value) => value.trim().length >= 2,
          message: "Nome deve ter pelo menos 2 caracteres",
        },
      ],
    },
    onSubmit: async (formValues) => {
      try {
        const dados: Partial<TurmaInput> = {
          nome: formValues.nome.trim(),
          turno: formValues.turno,
          anoLetivo: formValues.anoLetivo,
          capacidade: formValues.capacidade
            ? parseInt(formValues.capacidade, 10)
            : null,
        };

        const validacao = turmaFactory.validate({
          ...dados,
          escolaId: selectedClass?.escolaId || "",
        } as TurmaInput);

        if (!validacao.isValid) {
          const primeiroErro = Object.values(validacao.errors)[0];
          throw new Error(primeiroErro);
        }

        await updateClass(id!, dados);

        Alert.alert("Sucesso", MENSAGENS.turmaAtualizada, [
          { text: "OK", onPress: () => router.back() },
        ]);
      } catch (error: any) {
        Alert.alert("Erro", error.message || MENSAGENS.erroSalvar);
      }
    },
  });

  useEffect(() => {
    if (id) {
      loadClassById(id);
    }
  }, [id, loadClassById]);

  useEffect(() => {
    if (selectedClass && !carregouDados) {
      setFormValues({
        nome: selectedClass.nome,
        turno: selectedClass.turno,
        anoLetivo: selectedClass.anoLetivo,
        capacidade: selectedClass.capacidade?.toString() || "",
      });
      setCarregouDados(true);
    }
  }, [selectedClass, carregouDados, setFormValues]);

  const handleCancelar = () => {
    router.back();
  };

  const carregando = isSubmitting || executing;

  if (loading && !carregouDados) {
    return <LoadingTela mensagem="Carregando turma..." />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="create" size={32} color={CORES.secundaria} />
          </View>
          <Text style={styles.titulo}>Editar Turma</Text>
          <Text style={styles.subtitulo}>Altere os dados da turma</Text>
        </View>

        <Box className="mb-4 gap-4">
          <CampoTexto
            label="Nome da Turma"
            value={values.nome}
            onChangeText={(text) => handleChange("nome", text)}
            onBlur={() => handleBlur("nome")}
            placeholder="Ex: 5º Ano A"
            erro={errors.nome}
            obrigatorio
            icone="school"
          />

          <Seletor
            label="Turno"
            opcoes={OPCOES_TURNO}
            valor={values.turno}
            onChange={(value) => handleChange("turno", value)}
            obrigatorio
          />

          <Seletor
            label="Ano Letivo"
            opcoes={OPCOES_ANO}
            valor={values.anoLetivo}
            onChange={(value) => handleChange("anoLetivo", value)}
            obrigatorio
          />

          <CampoTexto
            label="Capacidade de Alunos"
            value={values.capacidade}
            onChangeText={(text) => handleChange("capacidade", text)}
            placeholder="Ex: 30"
            icone="people"
            keyboardType="numeric"
          />
        </Box>

        <View style={styles.botoes}>
          <Button
            onPress={handleCancelar}
            variant="outline"
            action="secondary"
            disabled={carregando}
            className="flex-1"
          >
            <ButtonText>Cancelar</ButtonText>
          </Button>

          <Button
            onPress={handleSubmit}
            action="positive"
            disabled={carregando}
            className="flex-1"
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="checkmark" size={18} color="#fff" />
              <ButtonText>{carregando ? "Salvando..." : "Salvar"}</ButtonText>
            </View>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  content: {
    padding: ESPACAMENTO.md,
  },
  header: {
    alignItems: "center",
    paddingVertical: ESPACAMENTO.lg,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: CORES.sucessoClaro,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: ESPACAMENTO.md,
  },
  titulo: {
    fontSize: FONTE.xl,
    fontWeight: "bold",
    color: CORES.texto,
  },
  subtitulo: {
    fontSize: FONTE.sm,
    color: CORES.textoSecundario,
    marginTop: ESPACAMENTO.xs,
  },
  botoes: {
    gap: ESPACAMENTO.md,
  },
});
