/**
 * Service de Turmas (Classes)
 *
 * Camada de abstração para chamadas HTTP relacionadas a turmas.
 * Usa o endpoint /api/classes conforme especificado.
 */

import { Turma, TurmaInput } from "../types/turma";
import { API_CONFIG } from "@utils/constants";
import { fetchApi } from "./fetchApi";

const BASE_URL = API_CONFIG.baseUrl;

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
      method: "POST",
      body: JSON.stringify(dados),
    });
  },

  /**
   * Atualiza turma existente
   * PUT /api/classes/:id
   */
  atualizar: async (id: string, dados: Partial<TurmaInput>): Promise<Turma> => {
    return fetchApi<Turma>(`${BASE_URL}/classes/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    });
  },

  /**
   * Remove turma
   * DELETE /api/classes/:id
   */
  excluir: async (id: string): Promise<void> => {
    await fetchApi<void>(`${BASE_URL}/classes/${id}`, {
      method: "DELETE",
    });
  },
};
