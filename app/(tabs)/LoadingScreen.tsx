import { CORES } from "@utils/constants";
import { Text, View } from "react-native";
import { Spinner } from "@components/ui/spinner";

export function LoadingScreen({ mensagem }: { mensagem: string }) {
  return (
    <View>
      <Spinner size="large" color={CORES.primaria} />
      <Text>{mensagem}</Text>
    </View>
  );
}
