import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CORES } from "@utils/constants";

type IoniconsName = keyof typeof Ionicons.glyphMap;

function TabBarIcon(props: { name: IoniconsName; color: string }) {
  return <Ionicons size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: CORES.primaria,
        tabBarInactiveTintColor: CORES.textoSecundario,
        tabBarStyle: {
          backgroundColor: CORES.branco,
          borderTopColor: CORES.borda,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerStyle: {
          backgroundColor: CORES.primaria,
        },
        headerTintColor: CORES.branco,
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Escolas",
          headerTitle: "Gestão Escolar",
          tabBarIcon: ({ color }) => <TabBarIcon name="school" color={color} />,
        }}
      />

      <Tabs.Screen
        name="sobre"
        options={{
          title: "Sobre",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="information-circle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
