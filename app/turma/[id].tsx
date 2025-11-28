import { useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import {
  useLocalSearchParams,
  useRouter,
  Stack,
  useFocusEffect,
} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CORES, ESPACAMENTO, FONTE, RAIO, MENSAGENS } from "@utils/constants";
import { TurnoLabels } from "../../src/types/turno";
import { formatarData } from "@utils/index";

import { useClasses, useResponsive } from "@hooks/index";

import { Button, ButtonText } from "@components/ui/button";

import { ErroTela } from "@components/Erro";
import { Card } from "@components/Card";
import { Divisor } from "@components/Divisor";
import { Badge } from "@components/Badge";
import { LoadingTela } from "@components/Loading";

function InfoItem({
  icone,
  label,
  valor,
}: {
  icone: keyof typeof Ionicons.glyphMap;
  label: string;
  valor?: string | number | null;
}) {
  if (valor === undefined || valor === null) return null;

  return (
    <View style={styles.infoItem}>
      <Ionicons name={icone} size={20} color={CORES.secundaria} />
      <View style={styles.infoTexto}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValor}>{valor}</Text>
      </View>
    </View>
  );
}

export default function TurmaDetalheScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { padding, isMobile } = useResponsive();

  const {
    selectedClass: turma,
    loading,
    error,
    executing,
    loadClassById,
    deleteClass,
    clearError,
  } = useClasses();

  useFocusEffect(
    useCallback(() => {
      if (id) {
        loadClassById(id);
      }
    }, [id, loadClassById]),
  );

  const handleEditar = () => {
    router.push(`/turma/edit/${id}`);
  };

  const handleExcluir = () => {
    Alert.alert("Excluir Turma", MENSAGENS.confirmarExclusaoTurma, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteClass(id!);
            Alert.alert("Sucesso", MENSAGENS.turmaExcluida, [
              { text: "OK", onPress: () => router.back() },
            ]);
          } catch (error: any) {
            Alert.alert("Erro", error.message || MENSAGENS.erroExcluir);
          }
        },
      },
    ]);
  };


  if (error && !turma) {
    return (
      <ErroTela
        mensagem={error}
        onRetry={() => {
          clearError();
          if (id) loadClassById(id);
        }}
      />
    );
  }

    if (!turma) {
    return <LoadingTela mensagem="Carregando turma..." />;
  }


  return (
    <>
      <Stack.Screen options={{ title: turma.nome }} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { padding }]}
      >
        <Card style={styles.cardPrincipal}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.turmaIconContainer,
                !isMobile && { width: 64, height: 64 },
              ]}
            >
              <Ionicons
                name="people"
                size={isMobile ? 32 : 36}
                color={CORES.secundaria}
              />
            </View>
            <View style={styles.turmaHeaderInfo}>
              <Text style={styles.turmaNome}>{turma.nome}</Text>
              <Text style={styles.turmaData}>
                Cadastrada em {formatarData(turma.criadoEm)}
              </Text>
            </View>
          </View>

          <Divisor espacamento="md" />

          <View style={styles.badges}>
            <Badge variante="primario">{TurnoLabels[turma.turno]}</Badge>
            <Badge variante="info">{turma.anoLetivo}</Badge>
            {turma.capacidade && (
              <Badge variante="sucesso">{turma.capacidade} alunos</Badge>
            )}
          </View>

          <Divisor espacamento="md" />

          <InfoItem
            icone="sunny"
            label="Turno"
            valor={TurnoLabels[turma.turno]}
          />
          <InfoItem
            icone="calendar"
            label="Ano Letivo"
            valor={turma.anoLetivo}
          />
          <InfoItem
            icone="people"
            label="Capacidade"
            valor={turma.capacidade ? `${turma.capacidade} alunos` : null}
          />
          <InfoItem
            icone="time"
            label="Última atualização"
            valor={formatarData(turma.atualizadoEm)}
          />

          <Divisor espacamento="md" />

          <View style={styles.acoes}>
            <Button
              onPress={handleEditar}
              action="primary"
              size="sm"
              className="flex-1"
            >
              <View className="flex-row items-center gap-1">
                <Ionicons name="create" size={16} color={CORES.primaria} />
                <ButtonText>Editar</ButtonText>
              </View>
            </Button>

            <Button
              onPress={handleExcluir}
              variant="solid"
              action="negative"
              size="sm"
              disabled={executing}
              className="flex-1"
            >
              <View className="flex-row items-center gap-1">
                <Ionicons name="trash" size={16} color={CORES.preto} />
                <ButtonText>
                  {executing ? "Excluindo..." : "Excluir"}
                </ButtonText>
              </View>
            </Button>
          </View>
        </Card>

        <Card style={styles.infoCard}>
          <View style={styles.infoCardContent}>
            <Ionicons name="information-circle" size={24} color={CORES.info} />
            <View style={styles.infoCardTexto}>
              <Text style={styles.infoCardTitulo}>Sobre esta turma</Text>
              <Text style={styles.infoCardDescricao}>
                Esta turma pertence a uma escola específica. Para alterar a
                escola, você precisará excluir esta turma e criar uma nova na
                escola desejada.
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  content: {
    paddingBottom: ESPACAMENTO.xxl,
  },
  cardPrincipal: {
    marginBottom: ESPACAMENTO.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  turmaIconContainer: {
    width: 56,
    height: 56,
    borderRadius: RAIO.lg,
    backgroundColor: CORES.sucessoClaro,
    justifyContent: "center",
    alignItems: "center",
    marginRight: ESPACAMENTO.md,
  },
  turmaHeaderInfo: {
    flex: 1,
  },
  turmaNome: {
    fontSize: FONTE.lg,
    fontWeight: "bold",
    color: CORES.texto,
  },
  turmaData: {
    fontSize: FONTE.sm,
    color: CORES.textoSecundario,
    marginTop: 2,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ESPACAMENTO.sm,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: ESPACAMENTO.sm,
  },
  infoTexto: {
    marginLeft: ESPACAMENTO.sm,
    flex: 1,
  },
  infoLabel: {
    fontSize: FONTE.xs,
    color: CORES.textoSecundario,
  },
  infoValor: {
    fontSize: FONTE.md,
    color: CORES.texto,
    marginTop: 2,
  },
  acoes: {
    flexDirection: "row",
    gap: ESPACAMENTO.md,
  },
  infoCard: {
    backgroundColor: CORES.infoClaro,
  },
  infoCardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoCardTexto: {
    flex: 1,
    marginLeft: ESPACAMENTO.sm,
  },
  infoCardTitulo: {
    fontSize: FONTE.sm,
    fontWeight: "600",
    color: CORES.texto,
    marginBottom: 4,
  },
  infoCardDescricao: {
    fontSize: FONTE.sm,
    color: CORES.textoSecundario,
    lineHeight: 20,
  },
});
