import { useCallback, useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import {
  useLocalSearchParams,
  useRouter,
  Stack,
  useFocusEffect,
} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CORES, ESPACAMENTO, FONTE, RAIO, MENSAGENS } from "@utils/constants";
import { Turma, TurnoLabels, Turno } from "../../src/types/index";
import { formatarData } from "@utils/index";

import { useSchools, useResponsive } from "@hooks/index";

import { Button, ButtonText } from "@components/ui/button";
import { Card } from "@components/Card";
import { Badge } from "@components/Badge";
import { LoadingTela } from "@components/Loading";
import { ErroTela } from "@components/Erro";
import { Divisor } from "@components/Divisor";
import { Chip } from "@components/Chip";
import { EstadoVazio } from "@components/EstadoVazio";

function InfoItem({
  icone,
  label,
  valor,
}: {
  icone: keyof typeof Ionicons.glyphMap;
  label: string;
  valor?: string | null;
}) {
  if (!valor) return null;

  return (
    <View style={styles.infoItem}>
      <Ionicons name={icone} size={20} color={CORES.primaria} />
      <View style={styles.infoTexto}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValor}>{valor}</Text>
      </View>
    </View>
  );
}

function TurmaCard({ turma, onPress }: { turma: Turma; onPress: () => void }) {
  return (
    <Card pressionavel onPress={onPress} style={styles.turmaCard}>
      <View style={styles.turmaContent}>
        <View style={styles.turmaIconContainer}>
          <Ionicons name="people" size={20} color={CORES.secundaria} />
        </View>
        <View style={styles.turmaInfo}>
          <Text style={styles.turmaNome}>{turma.nome}</Text>
          <View style={styles.turmaDetalhes}>
            <Badge variante="primario" tamanho="sm">
              {TurnoLabels[turma.turno]}
            </Badge>
            <Text style={styles.turmaAno}>{turma.anoLetivo}</Text>
            {turma.capacidade && (
              <Text style={styles.turmaCapacidade}>
                {turma.capacidade} alunos
              </Text>
            )}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={CORES.borda} />
      </View>
    </Card>
  );
}

export default function EscolaDetalheScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { padding, isMobile } = useResponsive();

  const {
    selectedSchool: escola,
    loading,
    error,
    executing,
    loadSchoolById,
    deleteSchool,
    clearError,
  } = useSchools();

  const [filtroTurno, setFiltroTurno] = useState<Turno | "todos">("todos");
  const [filtroAno, setFiltroAno] = useState<number | "todos">("todos");

  const turmasFiltradas = useMemo(() => {
    if (!escola?.turmas) return [];

    return escola.turmas.filter((turma) => {
      const passaTurno = filtroTurno === "todos" || turma.turno === filtroTurno;
      const passaAno = filtroAno === "todos" || turma.anoLetivo === filtroAno;
      return passaTurno && passaAno;
    });
  }, [escola?.turmas, filtroTurno, filtroAno]);

  const anosDisponiveis = useMemo(() => {
    if (!escola?.turmas) return [];
    const anos = [...new Set(escola.turmas.map((t) => t.anoLetivo))];
    return anos.sort((a, b) => b - a);
  }, [escola?.turmas]);

  const estatisticas = useMemo(() => {
    if (!escola?.turmas) return { total: 0, capacidade: 0, turnos: 0 };
    return {
      total: escola.turmas.length,
      capacidade: escola.turmas.reduce(
        (acc, t) => acc + (t.capacidade || 0),
        0,
      ),
      turnos: [...new Set(escola.turmas.map((t) => t.turno))].length,
    };
  }, [escola?.turmas]);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        loadSchoolById(id);
      }
    }, [id, loadSchoolById]),
  );

  const handleEditar = () => {
    router.push(`/escola/edit/${id}`);
  };

  const handleExcluir = () => {
    Alert.alert("Excluir Escola", MENSAGENS.confirmarExclusaoEscola, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteSchool(id!);
            Alert.alert("Sucesso", MENSAGENS.escolaExcluida, [
              { text: "OK", onPress: () => router.back() },
            ]);
          } catch (error: any) {
            Alert.alert("Erro", error.message || MENSAGENS.erroExcluir);
          }
        },
      },
    ]);
  };

  const handleNovaTurma = () => {
    router.push(`/turma/create?escolaId=${id}`);
  };

  const handleTurmaPress = (turmaId: string) => {
    router.push(`/turma/${turmaId}`);
  };

  const limparFiltros = () => {
    setFiltroTurno("todos");
    setFiltroAno("todos");
  };

  if (loading && !escola) {
    return <LoadingTela mensagem="Carregando escola..." />;
  }

  if (error && !escola) {
    return (
      <ErroTela
        mensagem={error}
        onRetry={() => {
          clearError();
          if (id) loadSchoolById(id);
        }}
      />
    );
  }

  if (!escola && !loading) {
    return (
      <ErroTela
        mensagem="Escola não encontrada"
        onRetry={() => router.back()}
        botaoTexto="Voltar"
      />
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: escola.nome }} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { padding }]}
      >
        <Card style={styles.cardPrincipal}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.escolaIconContainer,
                !isMobile && { width: 64, height: 64 },
              ]}
            >
              <Ionicons
                name="school"
                size={isMobile ? 32 : 36}
                color={CORES.primaria}
              />
            </View>
            <View style={styles.escolaHeaderInfo}>
              <Text style={styles.escolaNome}>{escola.nome}</Text>
              <Text style={styles.escolaData}>
                Cadastrada em {formatarData(escola.criadoEm)}
              </Text>
            </View>
          </View>

          <Divisor espacamento="md" />

          <InfoItem icone="location" label="Endereço" valor={escola.endereco} />
          <InfoItem icone="call" label="Telefone" valor={escola.telefone} />
          <InfoItem icone="mail" label="E-mail" valor={escola.email} />

          <Divisor espacamento="md" />

          <View style={styles.acoes}>
            <Button
              onPress={handleEditar}
              variant="outline"
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
              variant="outline"
              action="negative"
              size="sm"
              disabled={executing}
              className="flex-1"
            >
              <View className="flex-row items-center gap-1">
                <Ionicons name="trash" size={16} color={CORES.erro} />
                <ButtonText>
                  {executing ? "Excluindo..." : "Excluir"}
                </ButtonText>
              </View>
            </Button>
          </View>
        </Card>

        <View style={styles.secaoHeader}>
          <View style={styles.secaoTituloContainer}>
            <Ionicons name="people" size={24} color={CORES.secundaria} />
            <Text style={styles.secaoTitulo}>
              Turmas ({estatisticas.total})
            </Text>
          </View>

          <Button onPress={handleNovaTurma} action="primary" size="sm">
            <View className="flex-row items-center gap-1">
              <Ionicons name="add" size={16} color="#fff" />
              <ButtonText>Nova Turma</ButtonText>
            </View>
          </Button>
        </View>

        {escola.turmas && escola.turmas.length > 0 && (
          <Card style={styles.filtrosCard}>
            <View style={styles.filtroGrupo}>
              <Text style={styles.filtroLabel}>Filtrar por turno:</Text>
              <View style={styles.filtroChips}>
                <Chip
                  label="Todos"
                  selecionado={filtroTurno === "todos"}
                  onPress={() => setFiltroTurno("todos")}
                  contador={escola.turmas.length}
                />
                {Object.entries(TurnoLabels).map(([key, label]) => {
                  const count =
                    escola.turmas?.filter((t) => t.turno === key).length || 0;
                  if (count === 0) return null;
                  return (
                    <Chip
                      key={key}
                      label={label}
                      selecionado={filtroTurno === key}
                      onPress={() => setFiltroTurno(key as Turno)}
                      contador={count}
                    />
                  );
                })}
              </View>
            </View>

            {anosDisponiveis.length > 1 && (
              <View style={styles.filtroGrupo}>
                <Text style={styles.filtroLabel}>Filtrar por ano:</Text>
                <View style={styles.filtroChips}>
                  <Chip
                    label="Todos"
                    selecionado={filtroAno === "todos"}
                    onPress={() => setFiltroAno("todos")}
                  />
                  {anosDisponiveis.map((ano) => (
                    <Chip
                      key={ano}
                      label={String(ano)}
                      selecionado={filtroAno === ano}
                      onPress={() => setFiltroAno(ano)}
                    />
                  ))}
                </View>
              </View>
            )}

            {(filtroTurno !== "todos" || filtroAno !== "todos") && (
              <View style={styles.filtroResultado}>
                <Text style={styles.filtroResultadoTexto}>
                  Mostrando {turmasFiltradas.length} de {escola.turmas.length}{" "}
                  turma(s)
                </Text>
                <Button onPress={limparFiltros} variant="link" size="sm">
                  <ButtonText>Limpar filtros</ButtonText>
                </Button>
              </View>
            )}
          </Card>
        )}

        {!escola.turmas || escola.turmas.length === 0 ? (
          <Card>
            <EstadoVazio
              icone="people-outline"
              titulo={MENSAGENS.nenhumaTurma}
              subtitulo="Adicione turmas para esta escola"
              botaoTexto="Adicionar Turma"
              onBotaoPress={handleNovaTurma}
            />
          </Card>
        ) : turmasFiltradas.length === 0 ? (
          <Card>
            <EstadoVazio
              icone="filter-outline"
              titulo="Nenhuma turma encontrada"
              subtitulo="Altere os filtros para ver outras turmas"
              botaoTexto="Limpar filtros"
              onBotaoPress={limparFiltros}
            />
          </Card>
        ) : (
          <View style={styles.turmasLista}>
            {turmasFiltradas.map((turma) => (
              <TurmaCard
                key={turma.id}
                turma={turma}
                onPress={() => handleTurmaPress(turma.id)}
              />
            ))}
          </View>
        )}

        {estatisticas.total > 0 && (
          <Card style={styles.estatisticas}>
            <Text style={styles.estatisticasTitulo}>Resumo</Text>
            <View style={styles.estatisticasGrid}>
              <View style={styles.estatisticaItem}>
                <Text style={styles.estatisticaValor}>
                  {estatisticas.total}
                </Text>
                <Text style={styles.estatisticaLabel}>Turmas</Text>
              </View>
              <View style={styles.estatisticaItem}>
                <Text style={styles.estatisticaValor}>
                  {estatisticas.capacidade}
                </Text>
                <Text style={styles.estatisticaLabel}>Capacidade Total</Text>
              </View>
              <View style={styles.estatisticaItem}>
                <Text style={styles.estatisticaValor}>
                  {estatisticas.turnos}
                </Text>
                <Text style={styles.estatisticaLabel}>Turnos</Text>
              </View>
            </View>
          </Card>
        )}
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
    marginBottom: ESPACAMENTO.lg,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  escolaIconContainer: {
    width: 56,
    height: 56,
    borderRadius: RAIO.lg,
    backgroundColor: CORES.infoClaro,
    justifyContent: "center",
    alignItems: "center",
    marginRight: ESPACAMENTO.md,
  },
  escolaHeaderInfo: {
    flex: 1,
  },
  escolaNome: {
    fontSize: FONTE.lg,
    fontWeight: "bold",
    color: CORES.texto,
  },
  escolaData: {
    fontSize: FONTE.sm,
    color: CORES.textoSecundario,
    marginTop: 2,
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
  secaoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ESPACAMENTO.md,
  },
  secaoTituloContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: ESPACAMENTO.sm,
  },
  secaoTitulo: {
    fontSize: FONTE.lg,
    fontWeight: "600",
    color: CORES.texto,
  },
  turmasLista: {
    gap: ESPACAMENTO.sm,
  },
  turmaCard: {
    padding: ESPACAMENTO.sm,
  },
  turmaContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  turmaIconContainer: {
    width: 40,
    height: 40,
    borderRadius: RAIO.md,
    backgroundColor: CORES.sucessoClaro,
    justifyContent: "center",
    alignItems: "center",
    marginRight: ESPACAMENTO.md,
  },
  turmaInfo: {
    flex: 1,
  },
  turmaNome: {
    fontSize: FONTE.md,
    fontWeight: "600",
    color: CORES.texto,
    marginBottom: 4,
  },
  turmaDetalhes: {
    flexDirection: "row",
    alignItems: "center",
    gap: ESPACAMENTO.sm,
  },
  turmaAno: {
    fontSize: FONTE.sm,
    color: CORES.textoSecundario,
  },
  turmaCapacidade: {
    fontSize: FONTE.sm,
    color: CORES.textoSecundario,
  },
  estatisticas: {
    marginTop: ESPACAMENTO.lg,
  },
  estatisticasTitulo: {
    fontSize: FONTE.md,
    fontWeight: "600",
    color: CORES.texto,
    marginBottom: ESPACAMENTO.md,
  },
  estatisticasGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  estatisticaItem: {
    alignItems: "center",
  },
  estatisticaValor: {
    fontSize: FONTE.titulo,
    fontWeight: "bold",
    color: CORES.primaria,
  },
  estatisticaLabel: {
    fontSize: FONTE.xs,
    color: CORES.textoSecundario,
    marginTop: 2,
  },
  filtrosCard: {
    marginBottom: ESPACAMENTO.md,
  },
  filtroGrupo: {
    marginBottom: ESPACAMENTO.md,
  },
  filtroLabel: {
    fontSize: FONTE.sm,
    color: CORES.textoSecundario,
    marginBottom: ESPACAMENTO.xs,
  },
  filtroChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ESPACAMENTO.sm,
  },
  filtroResultado: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: ESPACAMENTO.sm,
    borderTopWidth: 1,
    borderTopColor: CORES.divisor,
  },
  filtroResultadoTexto: {
    fontSize: FONTE.sm,
    color: CORES.textoSecundario,
  },
});
