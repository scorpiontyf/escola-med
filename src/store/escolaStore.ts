import { create } from "zustand";
import { Escola, EscolaInput } from "../types/escola";
import { escolaService, ApiError } from "@services/escolaService";

interface EscolaStore {
  escolas: Escola[];

  escolaSelecionada: Escola | null;

  carregando: boolean;

  executando: boolean;

  erro: string | null;

  carregarEscolas: () => Promise<void>;

  carregarEscolaPorId: (id: string) => Promise<void>;

  criarEscola: (dados: EscolaInput) => Promise<Escola>;

  atualizarEscola: (id: string, dados: EscolaInput) => Promise<Escola>;

  excluirEscola: (id: string) => Promise<void>;

  limparEscolaSelecionada: () => void;

  limparErro: () => void;
}

export const useEscolaStore = create<EscolaStore>((set, get) => ({
  escolas: [],
  escolaSelecionada: null,
  carregando: false,
  executando: false,
  erro: null,

  carregarEscolas: async () => {
    set({ carregando: true, erro: null });

    try {
      const escolas = await escolaService.listar();

      set({ escolas });

      console.log("📦 Store: Escolas carregadas:", escolas.length);
    } catch (error) {
      const mensagem =
        error instanceof ApiError ? error.message : "Erro ao carregar escolas";

      set({ erro: mensagem });
      console.error("📦 Store: Erro ao carregar escolas:", mensagem);
    } finally {
      set({ carregando: false });
    }
  },

  carregarEscolaPorId: async (id: string) => {
    set({ carregando: true, erro: null, escolaSelecionada: null });

    try {
      const escola = await escolaService.buscarPorId(id);
      set({ escolaSelecionada: escola });

      console.log("📦 Store: Escola carregada:", escola.nome);
    } catch (error) {
      const mensagem =
        error instanceof ApiError ? error.message : "Erro ao carregar escola";

      set({ erro: mensagem });
      console.error("📦 Store: Erro ao carregar escola:", mensagem);
    } finally {
      set({ carregando: false });
    }
  },

  criarEscola: async (dados: EscolaInput): Promise<Escola> => {
    set({ executando: true, erro: null });

    try {
      const novaEscola = await escolaService.criar(dados);

      set((state) => ({
        escolas: [...state.escolas, novaEscola].sort((a, b) =>
          a.nome.localeCompare(b.nome, "pt-BR")
        ),
        executando: false,
      }));

      console.log("📦 Store: Escola criada:", novaEscola.nome);
      return novaEscola;
    } catch (error) {
      const mensagem =
        error instanceof ApiError ? error.message : "Erro ao criar escola";

      set({ erro: mensagem, executando: false });
      console.error("📦 Store: Erro ao criar escola:", mensagem);
      throw error;
    }
  },

  atualizarEscola: async (id: string, dados: EscolaInput): Promise<Escola> => {
    set({ executando: true, erro: null });

    try {
      const escolaAtualizada = await escolaService.atualizar(id, dados);

      set((state) => ({
        escolas: state.escolas
          .map((e) => (e.id === id ? escolaAtualizada : e))
          .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
        escolaSelecionada: escolaAtualizada,
        executando: false,
      }));

      console.log("📦 Store: Escola atualizada:", escolaAtualizada.nome);
      return escolaAtualizada;
    } catch (error) {
      const mensagem =
        error instanceof ApiError ? error.message : "Erro ao atualizar escola";

      set({ erro: mensagem, executando: false });
      console.error("📦 Store: Erro ao atualizar escola:", mensagem);
      throw error;
    }
  },

  excluirEscola: async (id: string) => {
    set({ executando: true, erro: null });

    try {
      await escolaService.excluir(id);

      set((state) => ({
        escolas: state.escolas.filter((e) => e.id !== id),
        escolaSelecionada: null,
        executando: false,
      }));

      console.log("📦 Store: Escola excluída:", id);
    } catch (error) {
      const mensagem =
        error instanceof ApiError ? error.message : "Erro ao excluir escola";

      set({ erro: mensagem, executando: false });
      console.error("📦 Store: Erro ao excluir escola:", mensagem);
      throw error;
    }
  },

  limparEscolaSelecionada: () => {
    set({ escolaSelecionada: null });
  },

  limparErro: () => {
    set({ erro: null });
  },
}));

export const useEscolas = () => useEscolaStore((state) => state.escolas);

export const useEscolaSelecionada = () =>
  useEscolaStore((state) => state.escolaSelecionada);

export const useEscolaCarregando = () =>
  useEscolaStore((state) => state.carregando);

export const useEscolaExecutando = () =>
  useEscolaStore((state) => state.executando);

export const useEscolaErro = () => useEscolaStore((state) => state.erro);
