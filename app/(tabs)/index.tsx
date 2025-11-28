import { useCallback, useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CORES, ESPACAMENTO, FONTE, RAIO, MENSAGENS } from "@utils/constants";
import { Escola } from "../../src/types/index";

import {
  useSchools,
  useResponsive,
  useOffline,
  useNetworkStatus,
} from "@hooks/index";

import { CampoBusca } from "@components/CampoBusca";
import { LoadingTela } from "@components/Loading";
import { ErroTela } from "@components/Erro";
import { EstadoVazio } from "@components/EstadoVazio";
import { FAB } from "@components/FAB";
import { SafeAreaView } from "react-native-safe-area-context";
import { Chip } from "@components/Chip";
import { Card } from "@components/Card";
import { Badge } from "@components/Badge";

type Ordenacao = "nome" | "turmas" | "recente";

function EscolaCard({ escola }: { escola: Escola }) {
  const router = useRouter();
  const { isMobile } = useResponsive();

  const handlePress = () => {
    router.push(`/escola/${escola.id}`);
  };

  return (
    <Card pressionavel onPress={handlePress} style={styles.card}>
      <View style={styles.cardContent}>
        <View
          style={[styles.iconContainer, !isMobile && styles.iconContainerLarge]}
        >
          <Ionicons
            name="school"
            size={isMobile ? 28 : 32}
            color={CORES.primaria}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.nome} numberOfLines={1}>
            {escola.nome}
          </Text>
          <Text style={styles.endereco} numberOfLines={1}>
            <Ionicons name="location" size={14} color={CORES.textoSecundario} />{" "}
            {escola.endereco}
          </Text>
          <Text style={styles.turmas}>
            <Ionicons name="people" size={14} color={CORES.textoSecundario} />{" "}
            {escola.turmas?.length || 0} turma(s)
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={24} color={CORES.borda} />
      </View>
    </Card>
  );
}

function HeaderBusca({
  busca,
  onBuscaChange,
  ordenacao,
  onOrdenacaoChange,
  stats,
  isOnline,
  lastSync,
}: {
  busca: string;
  onBuscaChange: (valor: string) => void;
  ordenacao: Ordenacao;
  onOrdenacaoChange: (valor: Ordenacao) => void;
  stats: { total: number; filtered: number; totalClasses: number };
  isOnline: boolean;
  lastSync: Date | null;
}) {
  return (
    <View style={styles.headerBusca}>
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline" size={16} color={CORES.alerta} />
          <Text style={styles.offlineTexto}>
            Modo offline - dados podem estar desatualizados
          </Text>
        </View>
      )}

      <CampoBusca
        valor={busca}
        onChange={onBuscaChange}
        placeholder="Buscar escola por nome ou endereço..."
      />

      <View style={styles.ordenacaoContainer}>
        <Text style={styles.ordenacaoLabel}>Ordenar por:</Text>
        <View style={styles.ordenacaoChips}>
          <Chip
            label="Nome"
            icone="text"
            selecionado={ordenacao === "nome"}
            onPress={() => onOrdenacaoChange("nome")}
          />
          <Chip
            label="Turmas"
            icone="people"
            selecionado={ordenacao === "turmas"}
            onPress={() => onOrdenacaoChange("turmas")}
          />
          <Chip
            label="Recente"
            icone="time"
            selecionado={ordenacao === "recente"}
            onPress={() => onOrdenacaoChange("recente")}
          />
        </View>
      </View>

      <View style={styles.contador}>
        <View style={styles.contadorEsquerda}>
          <Ionicons
            name="school-outline"
            size={16}
            color={CORES.textoSecundario}
          />
          <Text style={styles.contadorTexto}>
            {busca
              ? `${stats.filtered} de ${stats.total} escola(s)`
              : `${stats.total} escola(s) • ${stats.totalClasses} turma(s)`}
          </Text>
        </View>
        {isOnline && (
          <Badge variante="sucesso" tamanho="sm">
            <Ionicons name="cloud-done" size={12} color={CORES.sucesso} />{" "}
            Online
          </Badge>
        )}
      </View>
    </View>
  );
}

export default function EscolasScreen() {
  const router = useRouter();
  const { padding } = useResponsive();
  const isOnline = useNetworkStatus();

  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("nome");
  const [atualizando, setAtualizando] = useState(false);

  const {
    schools,
    allSchools,
    stats,
    loading,
    error,
    loadSchools,
    clearError,
  } = useSchools({ busca, ordenacao });

  const { lastSync, escolasCache, saveEscolasToCache } = useOffline();

  useFocusEffect(
    useCallback(() => {
      loadSchools();
    }, [loadSchools]),
  );

  useEffect(() => {
    if (allSchools.length > 0 && isOnline) {
      saveEscolasToCache(allSchools);
    }
  }, [allSchools, isOnline, saveEscolasToCache]);

  const handleRefresh = async () => {
    setAtualizando(true);
    await loadSchools();
    setAtualizando(false);
  };

  const handleNovaEscola = () => {
    router.push("/escola/create");
  };

  const dadosExibir = isOnline || schools.length > 0 ? schools : escolasCache;

  if (loading && dadosExibir.length === 0) {
    return <LoadingTela mensagem="Carregando escolas..." />;
  }

  if (error && dadosExibir.length === 0) {
    return (
      <ErroTela
        mensagem={error}
        onRetry={() => {
          clearError();
          loadSchools();
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={dadosExibir}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EscolaCard escola={item} />}
        contentContainerStyle={[styles.listContent, { padding }]}
        ListHeaderComponent={
          <HeaderBusca
            busca={busca}
            onBuscaChange={setBusca}
            ordenacao={ordenacao}
            onOrdenacaoChange={setOrdenacao}
            stats={stats}
            isOnline={isOnline}
            lastSync={lastSync}
          />
        }
        ListEmptyComponent={
          busca ? (
            <EstadoVazio
              icone="search-outline"
              titulo="Nenhuma escola encontrada"
              subtitulo={`Não encontramos escolas para "${busca}"`}
              botaoTexto="Limpar busca"
              onBotaoPress={() => setBusca("")}
            />
          ) : (
            <EstadoVazio
              icone="school-outline"
              titulo={MENSAGENS.nenhumaEscola}
              subtitulo="Toque no botão + para cadastrar"
            />
          )
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={handleRefresh}
            colors={[CORES.primaria]}
            tintColor={CORES.primaria}
          />
        }
      />

      <FAB onPress={handleNovaEscola} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  listContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },

  headerBusca: {
    marginBottom: ESPACAMENTO.md,
  },
  offlineBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CORES.branco,
    padding: ESPACAMENTO.sm,
    borderRadius: RAIO.sm,
    marginBottom: ESPACAMENTO.md,
    gap: ESPACAMENTO.xs,
  },
  offlineTexto: {
    fontSize: FONTE.sm,
    color: CORES.alerta,
    flex: 1,
  },
  ordenacaoContainer: {
    marginTop: ESPACAMENTO.md,
  },
  ordenacaoLabel: {
    fontSize: FONTE.sm,
    color: CORES.textoSecundario,
    marginBottom: ESPACAMENTO.xs,
  },
  ordenacaoChips: {
    flexDirection: "row",
    gap: ESPACAMENTO.sm,
  },
  contador: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: ESPACAMENTO.md,
    paddingTop: ESPACAMENTO.md,
    borderTopWidth: 1,
    borderTopColor: CORES.divisor,
  },
  contadorEsquerda: {
    flexDirection: "row",
    alignItems: "center",
  },
  contadorTexto: {
    fontSize: FONTE.sm,
    color: CORES.textoSecundario,
    marginLeft: ESPACAMENTO.xs,
  },

  card: {
    marginBottom: ESPACAMENTO.md,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: RAIO.md,
    backgroundColor: CORES.infoClaro,
    justifyContent: "center",
    alignItems: "center",
    marginRight: ESPACAMENTO.md,
  },
  iconContainerLarge: {
    width: 56,
    height: 56,
  },
  infoContainer: {
    flex: 1,
    marginRight: ESPACAMENTO.sm,
  },
  nome: {
    fontSize: FONTE.md,
    fontWeight: "600",
    color: CORES.texto,
    marginBottom: 4,
  },
  endereco: {
    fontSize: FONTE.sm,
    color: CORES.textoSecundario,
    marginBottom: 2,
  },
  turmas: {
    fontSize: FONTE.sm,
    color: CORES.textoSecundario,
  },
});
