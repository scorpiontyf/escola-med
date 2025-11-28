import { CORES } from "@utils/constants";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { iniciarMockServer } from "mocks";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "@/global.css";
import { GluestackUIProvider } from "@components/ui/gluestack-ui-provider";


SplashScreen.preventAutoHideAsync();

iniciarMockServer();

export default function RootLayout() {
  useEffect(() => {
    const prepare = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await SplashScreen.hideAsync();
    };

    prepare();
  }, []);

  return (
    <GluestackUIProvider mode="dark">
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="light" backgroundColor={CORES.primaria} />

        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: CORES.primaria,
            },
            headerTintColor: CORES.branco,
            headerTitleStyle: {
              fontWeight: "600",
            },
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="escola/create"
            options={{
              title: "Nova Escola",
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="escola/[id]"
            options={{
              title: "Detalhes da Escola",
            }}
          />
          <Stack.Screen
            name="escola/edit/[id]"
            options={{
              title: "Editar Escola",
              presentation: "modal",
            }}
          />

          <Stack.Screen
            name="turma/create"
            options={{
              title: "Nova Turma",
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="turma/[id]"
            options={{
              title: "Detalhes da Turma",
            }}
          />
          <Stack.Screen
            name="turma/edit/[id]"
            options={{
              title: "Editar Turma",
              presentation: "modal",
            }}
          />
        </Stack>
      </GestureHandlerRootView>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
});
