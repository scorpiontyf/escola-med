import { create } from "zustand";
import { Turma, TurmaInput } from "../types/turma";
import { turmaService } from "@services/turmaService";
import { ApiError } from "@services/escolaService";

interface TurmaStore {
  turmas: Turma[];

  turmaSelecionada: Turma | null;

  escolaIdAtual: string | null;

  carregando: boolean;

  executando: boolean;

  erro: string | null;

  carregarTurmasPorEscola: (escolaId: string) => Promise<void>;

  carregarTodasTurmas: () => Promise<void>;

  carregarTurmaPorId: (id: string) => Promise<void>;

  criarTurma: (dados: TurmaInput) => Promise<Turma>;

  atualizarTurma: (id: string, dados: Partial<TurmaInput>) => Promise<Turma>;

  excluirTurma: (id: string) => Promise<void>;

  limparTurmaSelecionada: () => void;

  limparErro: () => void;
}

export const useTurmaStore = create<TurmaStore>((set, get) => ({
  turmas: [],
  turmaSelecionada: null,
  escolaIdAtual: null,
  carregando: false,
  executando: false,
  erro: null,

  carregarTurmasPorEscola: async (escolaId: string) => {
    set({ carregando: true, erro: null, escolaIdAtual: escolaId });

    try {
      const turmas = await turmaService.listarPorEscola(escolaId);
      set({ turmas, carregando: false });

      console.log(
        "📦 Store: Turmas carregadas para escola",
        escolaId,
        ":",
        turmas.length,
      );
    } catch (error) {
      const mensagem =
        error instanceof ApiError ? error.message : "Erro ao carregar turmas";

      set({ erro: mensagem, carregando: false });
      console.error("📦 Store: Erro ao carregar turmas:", mensagem);
    }
  },

  carregarTodasTurmas: async () => {
    set({ carregando: true, erro: null, escolaIdAtual: null });

    try {
      const turmas = await turmaService.listar();
      set({ turmas, carregando: false });

      console.log("📦 Store: Todas turmas carregadas:", turmas.length);
    } catch (error) {
      const mensagem =
        error instanceof ApiError ? error.message : "Erro ao carregar turmas";

      set({ erro: mensagem, carregando: false });
    }
  },

  carregarTurmaPorId: async (id: string) => {
    set({ carregando: true, erro: null, turmaSelecionada: null });

    try {
      const turma = await turmaService.buscarPorId(id);
      set({ turmaSelecionada: turma, carregando: false });

      console.log("📦 Store: Turma carregada:", turma.nome);
    } catch (error) {
      const mensagem =
        error instanceof ApiError ? error.message : "Erro ao carregar turma";

      set({ erro: mensagem, carregando: false });
    }
  },

  criarTurma: async (dados: TurmaInput): Promise<Turma> => {
    set({ executando: true, erro: null });

    try {
      const novaTurma = await turmaService.criar(dados);

      const { escolaIdAtual } = get();
      if (escolaIdAtual === dados.escolaId) {
        set((state) => ({
          turmas: [...state.turmas, novaTurma].sort((a, b) =>
            a.nome.localeCompare(b.nome, "pt-BR"),
          ),
          executando: false,
        }));
      } else {
        set({ executando: false });
      }

      console.log("📦 Store: Turma criada:", novaTurma.nome);
      return novaTurma;
    } catch (error) {
      const mensagem =
        error instanceof ApiError ? error.message : "Erro ao criar turma";

      set({ erro: mensagem, executando: false });
      throw error;
    }
  },

  atualizarTurma: async (
    id: string,
    dados: Partial<TurmaInput>,
  ): Promise<Turma> => {
    set({ executando: true, erro: null });

    try {
      const turmaAtualizada = await turmaService.atualizar(id, dados);

      set((state) => ({
        turmas: state.turmas
          .map((t) => (t.id === id ? turmaAtualizada : t))
          .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
        turmaSelecionada: turmaAtualizada,
        executando: false,
      }));

      console.log("📦 Store: Turma atualizada:", turmaAtualizada.nome);
      return turmaAtualizada;
    } catch (error) {
      const mensagem =
        error instanceof ApiError ? error.message : "Erro ao atualizar turma";

      set({ erro: mensagem, executando: false });
      throw error;
    }
  },

  excluirTurma: async (id: string) => {
    set({ executando: true, erro: null });

    try {
      await turmaService.excluir(id);

      set((state) => ({
        turmas: state.turmas.filter((t) => t.id !== id),
        turmaSelecionada: null,
        executando: false,
      }));

      console.log("📦 Store: Turma excluída:", id);
    } catch (error) {
      const mensagem =
        error instanceof ApiError ? error.message : "Erro ao excluir turma";

      set({ erro: mensagem, executando: false });
      throw error;
    }
  },

  limparTurmaSelecionada: () => {
    set({ turmaSelecionada: null });
  },

  limparErro: () => {
    set({ erro: null });
  },
}));

export const useTurmas = () => useTurmaStore((state) => state.turmas);
export const useTurmaSelecionada = () =>
  useTurmaStore((state) => state.turmaSelecionada);
export const useTurmaCarregando = () =>
  useTurmaStore((state) => state.carregando);
export const useTurmaExecutando = () =>
  useTurmaStore((state) => state.executando);
export const useTurmaErro = () => useTurmaStore((state) => state.erro);
