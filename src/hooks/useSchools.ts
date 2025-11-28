/**
 * Hook useSchools - Gerenciamento de Escolas
 * 
 * Hook personalizado que encapsula toda a lógica de escolas.
 * Segue o padrão de hooks customizados do React.
 */

import { useCallback, useMemo } from 'react';
import { useEscolaStore } from '@store/escolaStore';
import { EscolaInput, Escola } from '../types';
import { contemTexto } from '@utils/index';

type Ordenacao = 'nome' | 'turmas' | 'recente';

interface UseSchoolsOptions {
  busca?: string;
  ordenacao?: Ordenacao;
}

/**
 * Hook para gerenciar escolas
 * 
 * @example
 * const { schools, loading, error, createSchool, deleteSchool } = useSchools();
 */
export function useSchools(options: UseSchoolsOptions = {}) {
  const { busca = '', ordenacao = 'nome' } = options;

  const {
    escolas,
    escolaSelecionada,
    carregando,
    executando,
    erro,
    carregarEscolas,
    carregarEscolaPorId,
    criarEscola,
    atualizarEscola,
    excluirEscola,
    limparEscolaSelecionada,
    limparErro,
  } = useEscolaStore();

  const schoolsFiltered = useMemo(() => {
    let resultado = [...escolas];

    if (busca.trim()) {
      resultado = resultado.filter(
        (escola) =>
          contemTexto(escola.nome, busca) ||
          contemTexto(escola.endereco, busca)
      );
    }

    switch (ordenacao) {
      case 'nome':
        resultado.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
        break;
      case 'turmas':
        resultado.sort((a, b) => (b.turmas?.length || 0) - (a.turmas?.length || 0));
        break;
      case 'recente':
        resultado.sort((a, b) => 
          new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
        );
        break;
    }

    return resultado;
  }, [escolas, busca, ordenacao]);

  const loadSchools = useCallback(async () => {
    await carregarEscolas();
  }, [carregarEscolas]);

  const loadSchoolById = useCallback(async (id: string) => {
    await carregarEscolaPorId(id);
  }, [carregarEscolaPorId]);

  const createSchool = useCallback(async (data: EscolaInput): Promise<Escola> => {
    return await criarEscola(data);
  }, [criarEscola]);

  const updateSchool = useCallback(async (id: string, data: EscolaInput): Promise<Escola> => {
    return await atualizarEscola(id, data);
  }, [atualizarEscola]);

  const deleteSchool = useCallback(async (id: string) => {
    await excluirEscola(id);
  }, [excluirEscola]);

  const stats = useMemo(() => ({
    total: escolas.length,
    filtered: schoolsFiltered.length,
    totalClasses: escolas.reduce((acc, e) => acc + (e.turmas?.length || 0), 0),
  }), [escolas, schoolsFiltered]);

  return {
    schools: schoolsFiltered,
    allSchools: escolas,
    selectedSchool: escolaSelecionada,
    stats,

    loading: carregando,
    executing: executando,
    error: erro,

    loadSchools,
    loadSchoolById,
    createSchool,
    updateSchool,
    deleteSchool,
    clearSelectedSchool: limparEscolaSelecionada,
    clearError: limparErro,
  };
}