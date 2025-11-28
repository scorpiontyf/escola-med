import { Turma } from "./turma";

export interface Escola {
  id: string;
  nome: string;
  endereco: string;
  telefone?: string;
  email?: string;
  turmas: Turma[];
  criadoEm: string;
  atualizadoEm: string;
}

export interface EscolaInput {
  nome: string;
  endereco: string;
  telefone?: string;
  email?: string;
}

export interface EscolaFiltros {
  busca?: string;
  ordenarPor?: 'nome' | 'criadoEm';
  ordem?: 'asc' | 'desc';
}