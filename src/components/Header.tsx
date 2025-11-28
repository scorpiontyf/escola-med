/**
 * Componente Header - Cabeçalho de Tela
 *
 * Header reutilizável com título, subtítulo e ações.
 */

import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Box } from "./ui/box";
import { Heading } from "./ui/heading";
import { HStack } from "./ui/hstack";
import { Icon } from "./ui/icon";
import { VStack } from "./ui/vstack";
import { Text } from "./ui/text";
interface HeaderProps {
  titulo: string;
  subtitulo?: string;
  mostrarVoltar?: boolean;
  onVoltar?: () => void;
  acaoIcone?: keyof typeof Ionicons.glyphMap;
  onAcao?: () => void;
}

export function Header({
  titulo,
  subtitulo,
  mostrarVoltar = false,
  onVoltar,
  acaoIcone,
  onAcao,
}: HeaderProps) {
  const router = useRouter();

  const handleVoltar = () => {
    if (onVoltar) {
      onVoltar();
    } else {
      router.back();
    }
  };

  return (
    <Box
      bg="$primary600"
      pt="$12"
      pb="$4"
      px="$4"
      borderBottomLeftRadius="$2xl"
      borderBottomRightRadius="$2xl"
    >
      <HStack alignItems="center" justifyContent="space-between">
        {/* Botão Voltar */}
        {mostrarVoltar ? (
          <Pressable
            onPress={handleVoltar}
            p="$2"
            borderRadius="$full"
            bg="$primary700"
          >
            <Icon as={Ionicons} name="arrow-back" size="xl" color="$white" />
          </Pressable>
        ) : (
          <Box w="$10" />
        )}

        {/* Título e Subtítulo */}
        <VStack flex={1} alignItems="center" mx="$2">
          <Heading size="lg" color="$white" textAlign="center">
            {titulo}
          </Heading>
          {subtitulo && (
            <Text color="$primary200" size="sm" textAlign="center">
              {subtitulo}
            </Text>
          )}
        </VStack>

        {/* Ação */}
        {acaoIcone && onAcao ? (
          <Pressable
            onPress={onAcao}
            p="$2"
            borderRadius="$full"
            bg="$primary700"
          >
            <Icon as={Ionicons} name={acaoIcone} size="xl" color="$white" />
          </Pressable>
        ) : (
          <Box w="$10" />
        )}
      </HStack>
    </Box>
  );
}

/**
 * Header compacto para formulários
 */
export function HeaderFormulario({
  titulo,
  onCancelar,
  onSalvar,
  salvando = false,
}: {
  titulo: string;
  onCancelar: () => void;
  onSalvar: () => void;
  salvando?: boolean;
}) {
  return (
    <Box
      bg="$white"
      py="$3"
      px="$4"
      borderBottomWidth={1}
      borderBottomColor="$borderLight200"
    >
      <HStack alignItems="center" justifyContent="space-between">
        <Pressable onPress={onCancelar} disabled={salvando}>
          <Text color="$error600" fontWeight="$medium">
            Cancelar
          </Text>
        </Pressable>

        <Heading size="md">{titulo}</Heading>

        <Pressable onPress={onSalvar} disabled={salvando}>
          <Text
            color={salvando ? "$textLight400" : "$primary600"}
            fontWeight="$bold"
          >
            {salvando ? "Salvando..." : "Salvar"}
          </Text>
        </Pressable>
      </HStack>
    </Box>
  );
}

export default Header;
