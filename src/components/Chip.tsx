import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "./ui/pressable";
import { HStack } from "./ui/hstack";
import { Box } from "./ui/box";
import { Text } from "./ui/text";

interface ChipProps {
  label: string;
  selecionado?: boolean;
  onPress: () => void;
  icone?: keyof typeof Ionicons.glyphMap;
  contador?: number;
}

export function Chip({
  label,
  selecionado = false,
  onPress,
  icone,
  contador,
}: ChipProps) {
  return (
    <Pressable onPress={onPress}>
      <HStack
        space="xs"
        alignItems="center"
        px="$3"
        py="$2"
        borderRadius={100}
        bg={selecionado ? "$primary500" : "$backgroundLight200"}
        borderWidth={1}
        borderColor={selecionado ? "$primary500" : "$borderLight300"}
      >
        {icone && (
          <Ionicons
            name={icone}
            size={14}
            color={selecionado ? "white" : "#666"}
          />
        )}

        <Text
          fontSize="$sm"
          color={selecionado ? "$white" : "$textLight600"}
          fontWeight={selecionado ? "$semibold" : "$normal"}
          padding={3}
        >
          {label}
        </Text>

        {contador !== undefined && contador > 0 && (
          <Box
            bg={selecionado ? "rgba(255,255,255,0.3)" : "$borderLight400"}
            borderRadius="$full"
            px="$1.5"
            minWidth={20}
            alignItems="center"
          >
            <Text
              fontSize="$xs"
              color={selecionado ? "$white" : "$textLight600"}
              fontWeight="$semibold"
            >
              {contador}
            </Text>
          </Box>
        )}
      </HStack>
    </Pressable>
  );
}

interface ChipGroupProps {
  children: React.ReactNode;
  label?: string;
}

export function ChipGroup({ children, label }: ChipGroupProps) {
  return (
    <Box mb="$4">
      {label && (
        <Text
          fontSize="$sm"
          fontWeight="$semibold"
          color="$textLight700"
          mb="$2"
        >
          {label}
        </Text>
      )}
      <HStack space="sm" flexWrap="wrap">
        {children}
      </HStack>
    </Box>
  );
}
