/**
 * Service de Turmas (Classes)
 * 
 * Camada de abstração para chamadas HTTP relacionadas a turmas.
 * Usa o endpoint /api/classes conforme especificado.
 */

import { Turma, TurmaInput } from '../types/turma';
import { API_CONFIG } from '@utils/constants';
import { ApiError } from './escolaService';

const BASE_URL = API_CONFIG.baseUrl;

/**
 * Função auxiliar para fazer requisições
 */
async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.erro || 'Erro na requisição',
        response.status
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Erro de conexão com o servidor', 500);
  }
}

/**
 * Service de Turmas
 */
export const turmaService = {
  /**
   * Lista todas as turmas
   * GET /api/classes
   */
  listar: async (): Promise<Turma[]> => {
    return fetchApi<Turma[]>(`${BASE_URL}/classes`);
  },

  /**
   * Lista turmas de uma escola específica
   * GET /api/schools/:schoolId/classes
   */
  listarPorEscola: async (escolaId: string): Promise<Turma[]> => {
    return fetchApi<Turma[]>(`${BASE_URL}/schools/${escolaId}/classes`);
  },

  /**
   * Busca turma por ID
   * GET /api/classes/:id
   */
  buscarPorId: async (id: string): Promise<Turma> => {
    return fetchApi<Turma>(`${BASE_URL}/classes/${id}`);
  },

  /**
   * Cria nova turma
   * POST /api/classes
   */
  criar: async (dados: TurmaInput): Promise<Turma> => {
    return fetchApi<Turma>(`${BASE_URL}/classes`, {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  },

  /**
   * Atualiza turma existente
   * PUT /api/classes/:id
   */
  atualizar: async (id: string, dados: Partial<TurmaInput>): Promise<Turma> => {
    return fetchApi<Turma>(`${BASE_URL}/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    });
  },

  /**
   * Remove turma
   * DELETE /api/classes/:id
   */
  excluir: async (id: string): Promise<void> => {
    await fetchApi<void>(`${BASE_URL}/classes/${id}`, {
      method: 'DELETE',
    });
  },
};