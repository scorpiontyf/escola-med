import { Turno } from "./turno";

export interface Turma {
  id: string;
  escolaId: string;
  nome: string;
  turno: Turno;
  anoLetivo: number;
  capacidade?: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface TurmaInput {
  escolaId: string;
  nome: string;
  turno: Turno;
  anoLetivo: number;
  capacidade?: number;
}

export interface TurmaFiltros {
  busca?: string;
  turno?: Turno;
  anoLetivo?: number;
  ordenarPor?: "nome" | "criadoEm";
  ordem?: "asc" | "desc";
}
