/**
 * Hook useClasses - Gerenciamento de Turmas
 * 
 * Hook personalizado que encapsula toda a lógica de turmas.
 */

import { useCallback, useMemo } from 'react';
import { useTurmaStore } from '@store/turmaStore';
import { TurmaInput, Turma } from '../types/turma';
import { Turno } from '../types/turno';

interface UseClassesOptions {
  schoolId?: string;
  filterTurno?: Turno | 'todos';
  filterAno?: number | 'todos';
}

/**
 * Hook para gerenciar turmas
 * 
 * @example
 * const { classes, loading, createClass, deleteClass } = useClasses({ schoolId: '123' });
 */
export function useClasses(options: UseClassesOptions = {}) {
  const { filterTurno = 'todos', filterAno = 'todos' } = options;

  const {
    turmas,
    turmaSelecionada,
    carregando,
    executando,
    erro,
    carregarTurmasPorEscola,
    carregarTodasTurmas,
    carregarTurmaPorId,
    criarTurma,
    atualizarTurma,
    excluirTurma,
    limparTurmaSelecionada,
    limparErro,
  } = useTurmaStore();

  const classesFiltered = useMemo(() => {
    return turmas.filter((turma) => {
      const passaTurno = filterTurno === 'todos' || turma.turno === filterTurno;
      const passaAno = filterAno === 'todos' || turma.anoLetivo === filterAno;
      return passaTurno && passaAno;
    });
  }, [turmas, filterTurno, filterAno]);

  const availableYears = useMemo(() => {
    const anos = [...new Set(turmas.map((t) => t.anoLetivo))];
    return anos.sort((a, b) => b - a);
  }, [turmas]);

  const availableShifts = useMemo(() => {
    return [...new Set(turmas.map((t) => t.turno))];
  }, [turmas]);

  const loadClassesBySchool = useCallback(async (escolaId: string) => {
    await carregarTurmasPorEscola(escolaId);
  }, [carregarTurmasPorEscola]);

  const loadAllClasses = useCallback(async () => {
    await carregarTodasTurmas();
  }, [carregarTodasTurmas]);

  const loadClassById = useCallback(async (id: string) => {
    await carregarTurmaPorId(id);
  }, [carregarTurmaPorId]);

  const createClass = useCallback(async (data: TurmaInput): Promise<Turma> => {
    return await criarTurma(data);
  }, [criarTurma]);

  const updateClass = useCallback(async (id: string, data: Partial<TurmaInput>): Promise<Turma> => {
    return await atualizarTurma(id, data);
  }, [atualizarTurma]);

  const deleteClass = useCallback(async (id: string) => {
    await excluirTurma(id);
  }, [excluirTurma]);

  const stats = useMemo(() => ({
    total: turmas.length,
    filtered: classesFiltered.length,
    totalCapacity: turmas.reduce((acc, t) => acc + (t.capacidade || 0), 0),
    shiftsCount: availableShifts.length,
  }), [turmas, classesFiltered, availableShifts]);

  return {
    classes: classesFiltered,
    allClasses: turmas,
    selectedClass: turmaSelecionada,
    availableYears,
    availableShifts,
    stats,

    loading: carregando,
    executing: executando,
    error: erro,

    loadClassesBySchool,
    loadAllClasses,
    loadClassById,
    createClass,
    updateClass,
    deleteClass,
    clearSelectedClass: limparTurmaSelecionada,
    clearError: limparErro,
  };
}