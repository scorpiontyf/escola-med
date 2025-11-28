/**
 * Componente de Campo de Busca
 *
 * Input estilizado para busca com ícone, animações e feedback visual.
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Animated, 
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CORES, RAIO, ESPACAMENTO, FONTE } from '@utils/constants';

interface CampoBuscaProps {
  valor: string;
  onChange: (valor: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  tamanho?: 'sm' | 'md' | 'lg';
}

export function CampoBusca({
  valor,
  onChange,
  placeholder = 'Buscar...',
  autoFocus = false,
  tamanho = 'md',
}: CampoBuscaProps) {
  const [focado, setFocado] = useState(false);
  const animacaoBorda = useRef(new Animated.Value(0)).current;
  const animacaoIcone = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animacaoBorda, {
        toValue: focado ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.spring(animacaoIcone, {
        toValue: focado ? 1.1 : 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focado]);

  const limpar = () => {
    onChange('');
  };

  const config = {
    sm: { height: 40, iconSize: 18, fontSize: 14, paddingH: 12 },
    md: { height: 48, iconSize: 20, fontSize: 15, paddingH: 16 },
    lg: { height: 56, iconSize: 22, fontSize: 16, paddingH: 20 },
  };

  const { height, iconSize, fontSize, paddingH } = config[tamanho];

  const corBorda = animacaoBorda.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E7EB', CORES.primaria],
  });

  const corFundo = animacaoBorda.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFFFFF', '#F8FAFF'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height,
          borderColor: corBorda,
          backgroundColor: corFundo,
        },
        focado && styles.containerFocado,
      ]}
    >
      {/* Ícone de busca */}
      <Animated.View 
        style={[
          styles.iconeContainer,
          { 
            paddingLeft: paddingH,
            transform: [{ scale: animacaoIcone }],
          }
        ]}
      >
        <Ionicons
          name="search"
          size={iconSize}
          color={focado ? CORES.primaria : '#9CA3AF'}
        />
      </Animated.View>

      <TextInput
        value={valor}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onFocus={() => setFocado(true)}
        onBlur={() => setFocado(false)}
        style={[
          styles.input,
          { fontSize, paddingRight: valor.length > 0 ? 8 : paddingH }
        ]}
      />

      {valor.length > 0 && (
        <TouchableOpacity
          onPress={limpar}
          activeOpacity={0.7}
          style={[styles.botaoLimpar, { marginRight: paddingH - 4 }]}
        >
          <View style={styles.botaoLimparInner}>
            <Ionicons
              name="close"
              size={tamanho === 'sm' ? 12 : 14}
              color="#6B7280"
            />
          </View>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 14,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  containerFocado: {
    ...Platform.select({
      ios: {
        shadowColor: CORES.primaria,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  iconeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#1F2937',
    fontWeight: '400',
    paddingLeft: 12,
  },
  botaoLimpar: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  botaoLimparInner: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
});