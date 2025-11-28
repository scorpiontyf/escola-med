import { Ionicons } from "@expo/vector-icons";
import { CORES, ESPACAMENTO, FONTE, RAIO } from "@utils/constants";
import { ScrollView, StyleSheet, Text, View } from "react-native";

function InfoItem({
  icon,
  titulo,
  valor,
}: {
  icon: string;
  titulo: string;
  valor: string;
}) {
  return (
    <View style={styles.infoItem}>
      <Ionicons name={icon as any} size={20} color={CORES.primaria} />
      <View style={styles.infoText}>
        <Text style={styles.infoTitle}>{titulo}</Text>
        <Text style={styles.infoValue}>{valor}</Text>
      </View>
    </View>
  );
}

export default function SobreScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Ionicons name="school" size={48} color={CORES.branco} />
        </View>
        <Text style={styles.appName}>Gestão Escolar</Text>
        <Text style={styles.appVersion}>Versão 1.0.0</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre o Aplicativo</Text>
        <Text style={styles.description}>
          Aplicativo desenvolvido para centralizar o cadastro de escolas
          públicas e suas turmas, substituindo controles manuais em planilhas
          Excel.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Funcionalidades</Text>
        <View style={styles.features}>
          <View style={styles.funcItem}>
            <Ionicons name="checkmark-circle" size={20} color={CORES.sucesso} />
            <Text style={styles.funcText}>Cadastro de escolas</Text>
          </View>
          <View style={styles.funcItem}>
            <Ionicons name="checkmark-circle" size={20} color={CORES.sucesso} />
            <Text style={styles.funcText}>Gerenciamento de turmas</Text>
          </View>
          <View style={styles.funcItem}>
            <Ionicons name="checkmark-circle" size={20} color={CORES.sucesso} />
            <Text style={styles.funcText}>Busca e filtros</Text>
          </View>
          <View style={styles.funcItem}>
            <Ionicons name="checkmark-circle" size={20} color={CORES.sucesso} />
            <Text style={styles.funcText}>Interface responsiva</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tecnologias</Text>
        <InfoItem icon="logo-react" titulo="React Native" valor="0.81.5" />
        <InfoItem icon="phone-portrait" titulo="Expo SDK" valor="54.0.25" />
        <InfoItem icon="code-slash" titulo="TypeScript" valor="5.9.2" />
        <InfoItem icon="navigate" titulo="Expo Router" valor="6.0.15" />
        <InfoItem icon="layers" titulo="Zustand" valor="5.0.8" />
        <InfoItem icon="logo-react" titulo="React" valor="19.1.0" />
      </View>

    </ScrollView>
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
  logoContainer: {
    alignItems: "center",
    paddingVertical: ESPACAMENTO.xl,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: CORES.primaria,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: ESPACAMENTO.md,
  },
  appName: {
    fontSize: FONTE.titulo,
    fontWeight: "bold",
    color: CORES.texto,
  },
  appVersion: {
    fontSize: FONTE.sm,
    color: CORES.textoSecundario,
    marginTop: ESPACAMENTO.xs,
  },
  section: {
    backgroundColor: CORES.fundoCard,
    borderRadius: RAIO.lg,
    padding: ESPACAMENTO.md,
    marginBottom: ESPACAMENTO.md,
  },
  sectionTitle: {
    fontSize: FONTE.lg,
    fontWeight: "600",
    color: CORES.texto,
    marginBottom: ESPACAMENTO.sm,
  },
  description: {
    fontSize: FONTE.md,
    color: CORES.textoSecundario,
    lineHeight: 22,
  },
  features: {
    gap: ESPACAMENTO.sm,
  },
  funcItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: ESPACAMENTO.sm,
  },
  funcText: {
    fontSize: FONTE.md,
    color: CORES.texto,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: ESPACAMENTO.sm,
    borderBottomWidth: 1,
    borderBottomColor: CORES.divisor,
  },
  infoText: {
    marginLeft: ESPACAMENTO.md,
  },
  infoTitle: {
    fontSize: FONTE.sm,
    color: CORES.textoSecundario,
  },
  infoValue: {
    fontSize: FONTE.md,
    color: CORES.texto,
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
    paddingVertical: ESPACAMENTO.xl,
  },
  footerText: {
    fontSize: FONTE.sm,
    color: CORES.textoSecundario,
  },
});
