/**
 * Service de Escolas
 *
 * Camada de abstração para chamadas HTTP relacionadas a escolas.
 * Usa o endpoint /api/schools conforme especificado.
 */

import { Escola, EscolaInput } from "../types/escola";
import { API_CONFIG } from "@utils/constants";

const BASE_URL = API_CONFIG.baseUrl;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(data.erro || "Erro na requisição", response.status);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Erro de conexão com o servidor", 500);
  }
}

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
