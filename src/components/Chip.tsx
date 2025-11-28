import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CORES } from '@utils/constants';

type Variante = 'primario' | 'secundario' | 'sucesso' | 'info' | 'aviso' | 'neutro';
type Tamanho = 'sm' | 'md' | 'lg';

interface ChipProps {
  label: string;
  selecionado?: boolean;
  onPress: () => void;
  icone?: keyof typeof Ionicons.glyphMap;
  contador?: number;
  variante?: Variante;
  tamanho?: Tamanho;
  desabilitado?: boolean;
}

const VARIANTES = {
  primario: {
    bg: CORES.primaria,
    bgLight: '#EBF4FF',
    texto: '#FFFFFF',
    textoLight: CORES.primaria,
    borda: CORES.primaria,
    bordaLight: '#BFDBFE',
  },
  secundario: {
    bg: CORES.secundaria,
    bgLight: '#ECFDF5',
    texto: '#FFFFFF',
    textoLight: CORES.secundaria,
    borda: CORES.secundaria,
    bordaLight: '#A7F3D0',
  },
  sucesso: {
    bg: '#10B981',
    bgLight: '#D1FAE5',
    texto: '#FFFFFF',
    textoLight: '#059669',
    borda: '#10B981',
    bordaLight: '#6EE7B7',
  },
  info: {
    bg: '#3B82F6',
    bgLight: '#DBEAFE',
    texto: '#FFFFFF',
    textoLight: '#2563EB',
    borda: '#3B82F6',
    bordaLight: '#93C5FD',
  },
  aviso: {
    bg: '#F59E0B',
    bgLight: '#FEF3C7',
    texto: '#FFFFFF',
    textoLight: '#D97706',
    borda: '#F59E0B',
    bordaLight: '#FCD34D',
  },
  neutro: {
    bg: '#6B7280',
    bgLight: '#F3F4F6',
    texto: '#FFFFFF',
    textoLight: '#4B5563',
    borda: '#6B7280',
    bordaLight: '#D1D5DB',
  },
};

const TAMANHOS = {
  sm: { height: 30, paddingH: 12, fontSize: 12, iconSize: 14, gap: 5 },
  md: { height: 36, paddingH: 16, fontSize: 13, iconSize: 16, gap: 6 },
  lg: { height: 42, paddingH: 20, fontSize: 14, iconSize: 18, gap: 8 },
};

export function Chip({
  label,
  selecionado = false,
  onPress,
  icone,
  contador,
  variante = 'primario',
  tamanho = 'md',
  desabilitado = false,
}: ChipProps) {
  const cores = VARIANTES[variante];
  const tamanhoConfig = TAMANHOS[tamanho];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={desabilitado}
    >
      <View
        style={[
          styles.container,
          {
            height: tamanhoConfig.height,
            paddingHorizontal: tamanhoConfig.paddingH,
            backgroundColor: selecionado ? cores.bg : cores.bgLight,
            borderColor: selecionado ? cores.bg : cores.bordaLight,
            opacity: desabilitado ? 0.5 : 1,
          },
        ]}
      >
        {icone && (
          <Ionicons
            name={icone}
            size={tamanhoConfig.iconSize}
            color={selecionado ? cores.texto : cores.textoLight}
            style={{ marginRight: tamanhoConfig.gap }}
          />
        )}

        <Text
          style={[
            styles.label,
            {
              fontSize: tamanhoConfig.fontSize,
              color: selecionado ? cores.texto : cores.textoLight,
              fontWeight: selecionado ? '600' : '500',
            },
          ]}
        >
          {label}
        </Text>

        {contador !== undefined && contador > 0 && (
          <View
            style={[
              styles.contador,
              {
                backgroundColor: selecionado ? 'rgba(255,255,255,0.3)' : cores.bordaLight,
                marginLeft: tamanhoConfig.gap,
              },
            ]}
          >
            <Text
              style={[
                styles.contadorTexto,
                {
                  fontSize: tamanhoConfig.fontSize - 2,
                  color: selecionado ? cores.texto : cores.textoLight,
                },
              ]}
            >
              {contador > 99 ? '99+' : contador}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

interface ChipGroupProps {
  children: React.ReactNode;
  label?: string;
}

export function ChipGroup({ children, label }: ChipGroupProps) {
  return (
    <View style={styles.grupo}>
      {label && <Text style={styles.grupoLabel}>{label}</Text>}
      <View style={styles.grupoChips}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1.5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  label: {
    letterSpacing: 0.2,
  },
  contador: {
    minWidth: 20,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contadorTexto: {
    fontWeight: '600',
  },
  grupo: {
    marginBottom: 16,
  },
  grupoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  grupoChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});