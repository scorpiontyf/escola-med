import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CORES, ESPACAMENTO, FONTE, MENSAGENS } from '@utils/constants';
import { EscolaInput } from '../../../src/types/index';

import { useSchools, useForm } from '@hooks/index';


import { Button, ButtonText } from '@components/ui/button';
import { Box } from '@components/ui/box';
import { CampoTexto } from '@components/CampoTexto';
import { LoadingTela } from '@components/Loading';
import { getEscolaFactory } from '../../../src/patterns/factory';

const initialValues: EscolaInput = {
  nome: '',
  endereco: '',
  telefone: '',
  email: '',
};

const escolaFactory = getEscolaFactory();

export default function EditarEscolaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [carregouDados, setCarregouDados] = useState(false);

  const { 
    selectedSchool,
    loading,
    executing,
    loadSchoolById,
    updateSchool,
  } = useSchools();

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setFormValues,
    isSubmitting,
  } = useForm({
    initialValues,
    validationRules: {
      nome: [
        {
          validate: (value) => value.trim().length > 0,
          message: MENSAGENS.campoObrigatorio,
        },
        {
          validate: (value) => value.trim().length >= 3,
          message: MENSAGENS.nomeMinimo,
        },
      ],
      endereco: [
        {
          validate: (value) => value.trim().length > 0,
          message: MENSAGENS.campoObrigatorio,
        },
        {
          validate: (value) => value.trim().length >= 5,
          message: MENSAGENS.enderecoMinimo,
        },
      ],
      email: [
        {
          validate: (value) => {
            if (!value || value.trim() === '') return true;
            const result = escolaFactory.validate({ ...initialValues, email: value });
            return !result.errors.email;
          },
          message: 'E-mail inválido',
        },
      ],
    },
    onSubmit: async (formValues) => {
      try {
        const dados: EscolaInput = {
          nome: formValues.nome.trim(),
          endereco: formValues.endereco.trim(),
          telefone: formValues.telefone?.trim() || undefined,
          email: formValues.email?.trim() || undefined,
        };

        const validacao = escolaFactory.validate(dados);
        if (!validacao.isValid) {
          const primeiroErro = Object.values(validacao.errors)[0];
          throw new Error(primeiroErro);
        }

        await updateSchool(id!, dados);

        Alert.alert('Sucesso', MENSAGENS.escolaAtualizada, [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } catch (error: any) {
        Alert.alert('Erro', error.message || MENSAGENS.erroSalvar);
      }
    },
  });

  useEffect(() => {
    if (id) {
      loadSchoolById(id);
    }
  }, [id, loadSchoolById]);

  useEffect(() => {
    if (selectedSchool && !carregouDados) {
      setFormValues({
        nome: selectedSchool.nome,
        endereco: selectedSchool.endereco,
        telefone: selectedSchool.telefone || '',
        email: selectedSchool.email || '',
      });
      setCarregouDados(true);
    }
  }, [selectedSchool, carregouDados, setFormValues]);

  const handleCancelar = () => {
    router.back();
  };

  const carregando = isSubmitting || executing;

  if (loading && !carregouDados) {
    return <LoadingTela mensagem="Carregando escola..." />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="create" size={32} color={CORES.primaria} />
          </View>
          <Text style={styles.titulo}>Editar Escola</Text>
          <Text style={styles.subtitulo}>Altere os dados da escola</Text>
        </View>

        <Box className="mb-4 gap-4">
          <CampoTexto
            label="Nome da Escola"
            value={values.nome}
            onChangeText={(text) => handleChange('nome', text)}
            onBlur={() => handleBlur('nome')}
            placeholder="Ex: Escola Municipal João da Silva"
            erro={errors.nome}
            obrigatorio
            icone="school"
            autoCapitalize="words"
          />

          <CampoTexto
            label="Endereço"
            value={values.endereco}
            onChangeText={(text) => handleChange('endereco', text)}
            onBlur={() => handleBlur('endereco')}
            placeholder="Ex: Rua das Flores, 123 - Centro"
            erro={errors.endereco}
            obrigatorio
            icone="location"
            autoCapitalize="words"
          />

          <CampoTexto
            label="Telefone"
            value={values.telefone || ''}
            onChangeText={(text) => handleChange('telefone', text)}
            placeholder="Ex: (11) 1234-5678"
            icone="call"
            keyboardType="phone-pad"
          />

          <CampoTexto
            label="E-mail"
            value={values.email || ''}
            onChangeText={(text) => handleChange('email', text)}
            onBlur={() => handleBlur('email')}
            placeholder="Ex: escola@email.com"
            erro={errors.email}
            icone="mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </Box>

        <View style={styles.botoes}>
          <Button
            onPress={handleCancelar}
            variant="outline"
            action="secondary"
            disabled={carregando}
            className="flex-1"
          >
            <ButtonText>Cancelar</ButtonText>
          </Button>

          <Button
            onPress={handleSubmit}
            action="primary"
            disabled={carregando}
            className="flex-1"
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="checkmark" size={18} color="#fff" />
              <ButtonText>{carregando ? 'Salvando...' : 'Salvar'}</ButtonText>
            </View>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  header: {
    alignItems: 'center',
    paddingVertical: ESPACAMENTO.lg,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: CORES.infoClaro,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ESPACAMENTO.md,
  },
  titulo: {
    fontSize: FONTE.xl,
    fontWeight: 'bold',
    color: CORES.texto,
  },
  subtitulo: {
    fontSize: FONTE.sm,
    color: CORES.textoSecundario,
    marginTop: ESPACAMENTO.xs,
  },
  botoes: {
    gap: ESPACAMENTO.md,
  },
});