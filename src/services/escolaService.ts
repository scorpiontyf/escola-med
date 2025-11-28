/**
 * Service de Escolas
 *
 * Camada de abstração para chamadas HTTP relacionadas a escolas.
 * Usa o endpoint /api/schools conforme especificado.
 */

import { Escola, EscolaInput } from "../types/escola";
import { API_CONFIG } from "@utils/constants";
import { fetchApi } from "./fetchApi";

const BASE_URL = API_CONFIG.baseUrl;

/**
 * Service de Escolas
 */
export const escolaService = {
  /**
   * Lista todas as escolas
   * GET /api/schools
   */
  listar: async (): Promise<Escola[]> => {
    return fetchApi<Escola[]>(`${BASE_URL}/schools`);
  },

  /**
   * Busca escola por ID
   * GET /api/schools/:id
   */
  buscarPorId: async (id: string): Promise<Escola> => {
    return fetchApi<Escola>(`${BASE_URL}/schools/${id}`);
  },

  /**
   * Cria nova escola
   * POST /api/schools
   */
  criar: async (dados: EscolaInput): Promise<Escola> => {
    return fetchApi<Escola>(`${BASE_URL}/schools`, {
      method: "POST",
      body: JSON.stringify(dados),
    });
  },

  /**
   * Atualiza escola existente
   * PUT /api/schools/:id
   */
  atualizar: async (id: string, dados: EscolaInput): Promise<Escola> => {
    return fetchApi<Escola>(`${BASE_URL}/schools/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    });
  },

  /**
   * Remove escola
   * DELETE /api/schools/:id
   */
  excluir: async (id: string): Promise<void> => {
    await fetchApi<void>(`${BASE_URL}/schools/${id}`, {
      method: "DELETE",
    });
  },
};
