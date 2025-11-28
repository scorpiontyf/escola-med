/**
 * Factory Pattern
 *
 * Centraliza a criação de entidades com validação e defaults.
 * Garante que todas as entidades são criadas de forma consistente.
 */

import {
  Turma,
  TurmaInput,
  isTurnoValido,
  Escola,
  EscolaInput,
} from "../types/index";

interface IEntityFactory<TEntity, TInput> {
  create(input: TInput): TEntity;
  validate(input: TInput): ValidationResult;
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

function gerarId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function retornarDataAtual(): string {
  return new Date().toISOString();
}

export class EscolaFactory implements IEntityFactory<Escola, EscolaInput> {
  validate(input: EscolaInput): ValidationResult {
    const errors: Record<string, string> = {};

    if (!input.nome || input.nome.trim().length < 3) {
      errors.nome = "Nome é obrigatório (mínimo 3 caracteres)";
    }

    if (!input.endereco || input.endereco.trim().length < 5) {
      errors.endereco = "Endereço é obrigatório (mínimo 5 caracteres)";
    }

    if (input.email && !this.isValidEmail(input.email)) {
      errors.email = "E-mail inválido";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  create(input: EscolaInput): Escola {
    const validation = this.validate(input);
    if (!validation.isValid) {
      throw new Error(
        `Dados inválidos: ${Object.values(validation.errors).join(", ")}`,
      );
    }

    return {
      id: gerarId(),
      nome: input.nome.trim(),
      endereco: input.endereco.trim(),
      telefone: input.telefone?.trim() || undefined,
      email: input.email?.trim() || undefined,
      turmas: [],
      criadoEm: retornarDataAtual(),
      atualizadoEm: retornarDataAtual(),
    };
  }

  createForUpdate(existing: Escola, input: Partial<EscolaInput>): Escola {
    return {
      ...existing,
      nome: input.nome?.trim() || existing.nome,
      endereco: input.endereco?.trim() || existing.endereco,
      telefone: input.telefone?.trim() || existing.telefone,
      email: input.email?.trim() || existing.email,
      atualizadoEm: retornarDataAtual(),
    };
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

export class TurmaFactory implements IEntityFactory<Turma, TurmaInput> {
  /**
   * Valida os dados de entrada
   */
  validate(input: TurmaInput): ValidationResult {
    const errors: Record<string, string> = {};

    if (!input.escolaId) {
      errors.escolaId = "ID da escola é obrigatório";
    }

    if (!input.nome || input.nome.trim().length < 2) {
      errors.nome = "Nome é obrigatório (mínimo 2 caracteres)";
    }

    if (!input.turno || !isTurnoValido(input.turno)) {
      errors.turno = "Turno é obrigatório";
    }

    if (!input.anoLetivo || input.anoLetivo < 2020 || input.anoLetivo > 2030) {
      errors.anoLetivo = "Ano letivo inválido";
    }

    if (
      input.capacidade &&
      (input.capacidade < 1 || input.capacidade > 100)
    ) {
      errors.capacidade = "Capacidade deve ser entre 1 e 100";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  create(input: TurmaInput): Turma {
    const validation = this.validate(input);
    if (!validation.isValid) {
      throw new Error(
        `Dados inválidos: ${Object.values(validation.errors).join(", ")}`,
      );
    }

    return {
      id: gerarId(),
      escolaId: input.escolaId,
      nome: input.nome.trim(),
      turno: input.turno,
      anoLetivo: input.anoLetivo,
      capacidade: input.capacidade || undefined,
      criadoEm: retornarDataAtual(),
      atualizadoEm: retornarDataAtual(),
    };
  }

  createForUpdate(existing: Turma, input: Partial<TurmaInput>): Turma {
    return {
      ...existing,
      nome: input.nome?.trim() || existing.nome,
      turno: input.turno || existing.turno,
      anoLetivo: input.anoLetivo || existing.anoLetivo,
      capacidade: input.capacidade ?? existing.capacidade,
      atualizadoEm: retornarDataAtual(),
    };
  }
}

let escolaFactory: EscolaFactory | null = null;
let turmaFactory: TurmaFactory | null = null;

export function getEscolaFactory(): EscolaFactory {
  if (!escolaFactory) {
    escolaFactory = new EscolaFactory();
  }
  return escolaFactory;
}

export function getTurmaFactory(): TurmaFactory {
  if (!turmaFactory) {
    turmaFactory = new TurmaFactory();
  }
  return turmaFactory;
}
