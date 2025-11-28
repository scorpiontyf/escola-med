export const CORES = {
  primaria: "#1a73e8",
  primariaClara: "#4285f4",
  primariaEscura: "#1557b0",

  secundaria: "#34a853",
  secundariaClara: "#5bb974",
  secundariaEscura: "#1e8e3e",

  fundo: "#f8f9fa",
  fundoCard: "#ffffff",
  texto: "#202124",
  textoSecundario: "#5f6368",
  borda: "#dadce0",
  divisor: "#e8eaed",

  erro: "#d93025",
  erroClaro: "#fce8e6",
  sucesso: "#1e8e3e",
  sucessoClaro: "#e6f4ea",
  alerta: "#f9ab00",
  alertaClaro: "#fef7e0",
  info: "#1a73e8",
  infoClaro: "#e8f0fe",

  branco: "#ffffff",
  preto: "#000000",
  transparente: "transparent",
} as const;

export const ESPACAMENTO = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FONTE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  titulo: 28,
} as const;

export const RAIO = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const API_CONFIG = {
  baseUrl: "/api",
  timeout: 5000,
  delayMin: 200,
  delayMax: 800,
} as const;

export const ANOS_LETIVOS = [2024, 2025, 2026] as const;

export const MENSAGENS = {
  escolaCriada: "Escola cadastrada com sucesso!",
  escolaAtualizada: "Escola atualizada com sucesso!",
  escolaExcluida: "Escola excluída com sucesso!",
  turmaCriada: "Turma cadastrada com sucesso!",
  turmaAtualizada: "Turma atualizada com sucesso!",
  turmaExcluida: "Turma excluída com sucesso!",

  erroCarregar: "Erro ao carregar dados. Tente novamente.",
  erroSalvar: "Erro ao salvar. Tente novamente.",
  erroExcluir: "Erro ao excluir. Tente novamente.",
  erroConexao: "Erro de conexão. Verifique sua internet.",

  campoObrigatorio: "Este campo é obrigatório",
  nomeMinimo: "Nome deve ter pelo menos 3 caracteres",
  enderecoMinimo: "Endereço deve ter pelo menos 5 caracteres",

  confirmarExclusaoEscola:
    "Deseja realmente excluir esta escola? Todas as turmas associadas também serão excluídas.",
  confirmarExclusaoTurma: "Deseja realmente excluir esta turma?",

  nenhumaEscola: "Nenhuma escola cadastrada",
  nenhumaTurma: "Nenhuma turma cadastrada nesta escola",
  nenhumResultado: "Nenhum resultado encontrado",
} as const;
