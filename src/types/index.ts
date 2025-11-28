export interface BaseEntity {
  id: string;
  criadoEm: string;
  atualizadoEm: string;
}

export type Turno = 'matutino' | 'vespertino' | 'noturno' | 'integral';

export const TurnoLabels: Record<Turno, string> = {
  matutino: 'Matutino',
  vespertino: 'Vespertino',
  noturno: 'Noturno',
  integral: 'Integral',
};

export interface Escola extends BaseEntity {
  nome: string;
  endereco: string;
  telefone?: string;
  email?: string;
  turmas: Turma[];
}

export interface EscolaInput {
  nome: string;
  endereco: string;
  telefone?: string;
  email?: string;
}

export type EscolaSemTurmas = Omit<Escola, 'turmas'>;

export type EscolaComContagem = EscolaSemTurmas & {
  quantidadeTurmas: number;
};

export interface Turma extends BaseEntity {
  escolaId: string;
  nome: string;
  turno: Turno;
  anoLetivo: number;
  capacidade?: number;
}

export interface TurmaInput {
  escolaId: string;
  nome: string;
  turno: Turno;
  anoLetivo: number;
  capacidade?: number;
}

export type TurmaUpdateInput = Partial<Omit<TurmaInput, 'escolaId'>>;

export type TurmaComEscola = Turma & {
  escola: EscolaSemTurmas;
};

export interface FiltroBase {
  busca?: string;
  pagina?: number;
  limite?: number;
}

export interface FiltroEscola extends FiltroBase {
  ordenarPor?: 'nome' | 'turmas' | 'recente';
  ordem?: 'asc' | 'desc';
}

export interface FiltroTurma extends FiltroBase {
  escolaId?: string;
  turno?: Turno | 'todos';
  anoLetivo?: number | 'todos';
}

export interface ResultadoPaginado<T> {
  dados: T[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

export interface ApiResponse<T> {
  data: T;
  success: true;
}

export interface ApiErrorResponse {
  erro: string;
  success: false;
  status: number;
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

export interface BaseStoreState {
  carregando: boolean;
  executando: boolean;
  erro: string | null;
}

export interface BaseStoreActions {
  limparErro: () => void;
}

export type Store<TState, TActions> = TState & TActions;

export interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

export type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

export interface FieldState<T> {
  value: T;
  error?: string;
  touched: boolean;
}

export type FormState<T> = {
  [K in keyof T]: FieldState<T[K]>;
};

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type Awaited<T> = T extends Promise<infer U> ? U : T;

export type AsyncFunction<TArgs extends any[], TReturn> = (
  ...args: TArgs
) => Promise<TReturn>;

export function isEscola(obj: any): obj is Escola {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.nome === 'string' &&
    typeof obj.endereco === 'string' &&
    Array.isArray(obj.turmas)
  );
}

export function isTurma(obj: any): obj is Turma {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.escolaId === 'string' &&
    typeof obj.nome === 'string' &&
    typeof obj.turno === 'string' &&
    typeof obj.anoLetivo === 'number'
  );
}

export function isApiError(obj: any): obj is ApiErrorResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.erro === 'string' &&
    obj.success === false
  );
}

export function isTurnoValido(turno: string): turno is Turno {
  return ['matutino', 'vespertino', 'noturno', 'integral'].includes(turno);
}

export const ANOS_LETIVOS = [2024, 2025, 2026] as const;
export type AnoLetivo = typeof ANOS_LETIVOS[number];

export const ORDENACAO_ESCOLAS = ['nome', 'turmas', 'recente'] as const;
export type OrdenacaoEscola = typeof ORDENACAO_ESCOLAS[number];