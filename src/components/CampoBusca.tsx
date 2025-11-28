/**
 * Componente de Campo de Busca usando Gluestack UI
 * 
 * Input estilizado para busca com ícone e botão de limpar.
 */

import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Input, InputSlot, InputIcon, InputField } from './ui/input';

interface CampoBuscaProps {
  valor: string;
  onChange: (valor: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function CampoBusca({
  valor,
  onChange,
  placeholder = 'Buscar...',
  autoFocus = false,
}: CampoBuscaProps) {
  const limpar = () => {
    onChange('');
  };

  return (
    <Input
      variant="rounded"
      size="md"
      bg="$white"
      className="flex"
    >
      <InputSlot pl="$3" className="pt-2 pl-2">
        <InputIcon as={Ionicons} name="search" color="$textLight400" />
      </InputSlot>

      <InputField
        value={valor}
        style={{color: "black"}}
        onChangeText={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />

      {valor.length > 0 && (
        <InputSlot pr="$3" onPress={limpar}>
          <InputIcon as={Ionicons} name="close-circle" color="$textLight400" />
        </InputSlot>
      )}
    </Input>
  );
}