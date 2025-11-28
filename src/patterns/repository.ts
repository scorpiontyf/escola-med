/**
 * Repository Pattern
 *
 * Abstrai a camada de acesso a dados, permitindo trocar
 * a implementação (API, AsyncStorage, etc) sem afetar o resto do código.
 */

import { Escola, EscolaInput } from "../types/escola";
import { Turma, TurmaInput } from "../types/turma";

import { API_CONFIG } from "@utils/constants";

export interface IRepository<T, TInput> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T>;
  create(data: TInput): Promise<T>;
  update(id: string, data: Partial<TInput>): Promise<T>;
  delete(id: string): Promise<void>;
}

export interface IEscolaRepository extends IRepository<Escola, EscolaInput> {
  getWithClasses(id: string): Promise<Escola>;
}

export interface ITurmaRepository extends IRepository<Turma, TurmaInput> {
  getBySchoolId(schoolId: string): Promise<Turma[]>;
}

const BASE_URL = API_CONFIG.baseUrl;

export class EscolaApiRepository implements IEscolaRepository {
  private async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (response.status === 204) return {} as T;

    const data = await response.json();
    if (!response.ok) throw new Error(data.erro || "Erro na requisição");

    return data;
  }

  async getAll(): Promise<Escola[]> {
    return this.fetch<Escola[]>(`${BASE_URL}/schools`);
  }

  async getById(id: string): Promise<Escola> {
    return this.fetch<Escola>(`${BASE_URL}/schools/${id}`);
  }

  async getWithClasses(id: string): Promise<Escola> {
    return this.getById(id);
  }

  async create(data: EscolaInput): Promise<Escola> {
    return this.fetch<Escola>(`${BASE_URL}/schools`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: Partial<EscolaInput>): Promise<Escola> {
    return this.fetch<Escola>(`${BASE_URL}/schools/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<void> {
    await this.fetch<void>(`${BASE_URL}/schools/${id}`, {
      method: "DELETE",
    });
  }
}

export class TurmaApiRepository implements ITurmaRepository {
  private async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (response.status === 204) return {} as T;

    const data = await response.json();
    if (!response.ok) throw new Error(data.erro || "Erro na requisição");

    return data;
  }

  async getAll(): Promise<Turma[]> {
    return this.fetch<Turma[]>(`${BASE_URL}/classes`);
  }

  async getById(id: string): Promise<Turma> {
    return this.fetch<Turma>(`${BASE_URL}/classes/${id}`);
  }

  async getBySchoolId(schoolId: string): Promise<Turma[]> {
    return this.fetch<Turma[]>(`${BASE_URL}/schools/${schoolId}/classes`);
  }

  async create(data: TurmaInput): Promise<Turma> {
    return this.fetch<Turma>(`${BASE_URL}/classes`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: Partial<TurmaInput>): Promise<Turma> {
    return this.fetch<Turma>(`${BASE_URL}/classes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<void> {
    await this.fetch<void>(`${BASE_URL}/classes/${id}`, {
      method: "DELETE",
    });
  }
}

let escolaRepository: IEscolaRepository | null = null;
let turmaRepository: ITurmaRepository | null = null;

export function getEscolaRepository(): IEscolaRepository {
  if (!escolaRepository) {
    escolaRepository = new EscolaApiRepository();
  }
  return escolaRepository;
}

export function getTurmaRepository(): ITurmaRepository {
  if (!turmaRepository) {
    turmaRepository = new TurmaApiRepository();
  }
  return turmaRepository;
}
