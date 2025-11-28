import { Escola, EscolaInput } from "../src/types/escola";
import { Turma, TurmaInput } from "../src/types/turma";
import { createServer, Model, Response } from "miragejs";

function gerarId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function retornarDataAtual(): string {
  return new Date().toISOString();
}

// Simula delay de rede (200-600ms)
function delayAleatorio(): number {
  return Math.floor(Math.random() * 400) + 200;
}

const escolasIniciais: Omit<Escola, "turmas">[] = [
  {
    id: "1",
    nome: "Escola Municipal João da Silva",
    endereco: "Rua das Flores, 123 - Centro",
    telefone: "(11) 1234-5678",
    email: "contato@emjoaodasilva.edu.br",
    criadoEm: "2024-01-15T10:00:00Z",
    atualizadoEm: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    nome: "Escola Estadual Maria Souza",
    endereco: "Av. Brasil, 456 - Jardim América",
    telefone: "(11) 9876-5432",
    email: "secretaria@eemariasouza.edu.br",
    criadoEm: "2024-02-20T14:30:00Z",
    atualizadoEm: "2024-02-20T14:30:00Z",
  },
  {
    id: "3",
    nome: "EMEF Professor Carlos Santos",
    endereco: "Rua Independência, 789 - Vila Nova",
    telefone: "(11) 5555-1234",
    criadoEm: "2024-03-10T09:15:00Z",
    atualizadoEm: "2024-03-10T09:15:00Z",
  },
];

const turmasIniciais: Turma[] = [
  {
    id: "t1",
    escolaId: "1",
    nome: "5º Ano A",
    turno: "matutino",
    anoLetivo: 2024,
    capacidade: 30,
    criadoEm: "2024-01-20T08:00:00Z",
    atualizadoEm: "2024-01-20T08:00:00Z",
  },
  {
    id: "t2",
    escolaId: "1",
    nome: "5º Ano B",
    turno: "vespertino",
    anoLetivo: 2024,
    capacidade: 28,
    criadoEm: "2024-01-20T08:00:00Z",
    atualizadoEm: "2024-01-20T08:00:00Z",
  },
  {
    id: "t3",
    escolaId: "1",
    nome: "6º Ano A",
    turno: "matutino",
    anoLetivo: 2024,
    capacidade: 32,
    criadoEm: "2024-01-22T10:00:00Z",
    atualizadoEm: "2024-01-22T10:00:00Z",
  },
  {
    id: "t4",
    escolaId: "2",
    nome: "1º Ano A",
    turno: "matutino",
    anoLetivo: 2024,
    capacidade: 25,
    criadoEm: "2024-02-25T11:00:00Z",
    atualizadoEm: "2024-02-25T11:00:00Z",
  },
  {
    id: "t5",
    escolaId: "2",
    nome: "1º Ano B",
    turno: "vespertino",
    anoLetivo: 2024,
    capacidade: 25,
    criadoEm: "2024-02-25T11:00:00Z",
    atualizadoEm: "2024-02-25T11:00:00Z",
  },
];

export function iniciarMockServer() {
  // Evita criar múltiplas instâncias em hot reload
  if ((window as any).server) {
    (window as any).server.shutdown();
  }

  const server = createServer({
    models: {
      school: Model,
      class: Model,
    },

    seeds(server) {
      escolasIniciais.forEach((escola) => {
        server.create("school", escola as any);
      });
      turmasIniciais.forEach((turma) => {
        server.create("class", turma as any);
      });
      console.log("🌱 Mock Server: Dados iniciais carregados");
    },

    routes() {
      this.namespace = "api";
      this.timing = delayAleatorio();

      // ============================================
      // ENDPOINTS DE SCHOOLS (Escolas)
      // ============================================

      // GET /api/schools - Lista todas as escolas
      this.get("/schools", (schema: any) => {
        const schools = schema.all("school").models;
        const classes = schema.all("class").models;

        const schoolsWithClasses = schools.map((school: any) => ({
          ...school.attrs,
          turmas: classes
            .filter((c: any) => c.attrs.escolaId === school.attrs.id)
            .map((c: any) => c.attrs),
        }));

        schoolsWithClasses.sort((a: any, b: any) =>
          a.nome.localeCompare(b.nome, "pt-BR")
        );

        console.log(
          "📋 GET /api/schools:",
          schoolsWithClasses.length,
          "registros"
        );
        return schoolsWithClasses;
      });

      // GET /api/schools/:id - Busca escola por ID
      this.get("/schools/:id", (schema: any, request) => {
        const id = request.params.id;
        const school = schema.find("school", id);

        if (!school) {
          console.log("❌ GET /api/schools/" + id + ": Não encontrada");
          return new Response(404, {}, { erro: "Escola não encontrada" });
        }

        const classes = schema
          .all("class")
          .models.filter((c: any) => c.attrs.escolaId === id)
          .map((c: any) => c.attrs);

        const resultado = { ...school.attrs, turmas: classes };
        console.log("🔍 GET /api/schools/" + id + ":", resultado.nome);
        return resultado;
      });

      // POST /api/schools - Cria nova escola
      this.post("/schools", (schema: any, request) => {
        const dados: EscolaInput = JSON.parse(request.requestBody);

        if (!dados.nome || dados.nome.trim().length < 3) {
          return new Response(
            400,
            {},
            { erro: "Nome é obrigatório (mínimo 3 caracteres)" }
          );
        }
        if (!dados.endereco || dados.endereco.trim().length < 5) {
          return new Response(
            400,
            {},
            { erro: "Endereço é obrigatório (mínimo 5 caracteres)" }
          );
        }

        const novaEscola = {
          id: gerarId(),
          nome: dados.nome.trim(),
          endereco: dados.endereco.trim(),
          telefone: dados.telefone?.trim() || null,
          email: dados.email?.trim() || null,
          criadoEm: retornarDataAtual(),
          atualizadoEm: retornarDataAtual(),
        };

        const school = schema.create("school", novaEscola as any);
        console.log("✅ POST /api/schools:", novaEscola.nome);
        return { ...school.attrs, turmas: [] };
      });

      // PUT /api/schools/:id - Atualiza escola
      this.put("/schools/:id", (schema: any, request) => {
        const id = request.params.id;
        const dados: EscolaInput = JSON.parse(request.requestBody);
        const school = schema.find("school", id);

        if (!school) {
          return new Response(404, {}, { erro: "Escola não encontrada" });
        }

        if (!dados.nome || dados.nome.trim().length < 3) {
          return new Response(
            400,
            {},
            { erro: "Nome é obrigatório (mínimo 3 caracteres)" }
          );
        }
        if (!dados.endereco || dados.endereco.trim().length < 5) {
          return new Response(
            400,
            {},
            { erro: "Endereço é obrigatório (mínimo 5 caracteres)" }
          );
        }

        school.update({
          nome: dados.nome.trim(),
          endereco: dados.endereco.trim(),
          telefone: dados.telefone?.trim() || null,
          email: dados.email?.trim() || null,
          atualizadoEm: retornarDataAtual(),
        });

        const classes = schema
          .all("class")
          .models.filter((c: any) => c.attrs.escolaId === id)
          .map((c: any) => c.attrs);

        console.log("📝 PUT /api/schools/" + id + ":", school.attrs.nome);
        return { ...school.attrs, turmas: classes };
      });

      // DELETE /api/schools/:id - Remove escola e suas turmas
      this.delete("/schools/:id", (schema: any, request) => {
        const id = request.params.id;
        const school = schema.find("school", id);

        if (!school) {
          return new Response(404, {}, { erro: "Escola não encontrada" });
        }

        // Remove turmas associadas (CASCADE)
        schema
          .all("class")
          .models.filter((c: any) => c.attrs.escolaId === id)
          .forEach((c: any) => c.destroy());

        school.destroy();
        console.log("🗑️ DELETE /api/schools/" + id);
        return new Response(204);
      });

      // GET /api/schools/:schoolId/classes - Lista turmas da escola
      this.get("/schools/:schoolId/classes", (schema: any, request) => {
        const schoolId = request.params.schoolId;
        const school = schema.find("school", schoolId);

        if (!school) {
          return new Response(404, {}, { erro: "Escola não encontrada" });
        }

        const classes = schema
          .all("class")
          .models.filter((c: any) => c.attrs.escolaId === schoolId)
          .map((c: any) => c.attrs)
          .sort((a: any, b: any) => a.nome.localeCompare(b.nome, "pt-BR"));

        console.log(
          "📋 GET /api/schools/" + schoolId + "/classes:",
          classes.length,
          "turmas"
        );
        return classes;
      });

      // ============================================
      // ENDPOINTS DE CLASSES (Turmas)
      // ============================================

      // GET /api/classes - Lista todas as turmas
      this.get("/classes", (schema: any) => {
        const classes = schema
          .all("class")
          .models.map((c: any) => c.attrs)
          .sort((a: any, b: any) => a.nome.localeCompare(b.nome, "pt-BR"));

        console.log("📋 GET /api/classes:", classes.length, "registros");
        return classes;
      });

      // GET /api/classes/:id - Busca turma por ID
      this.get("/classes/:id", (schema: any, request) => {
        const id = request.params.id;
        const classItem = schema.find("class", id);

        if (!classItem) {
          console.log("❌ GET /api/classes/" + id + ": Não encontrada");
          return new Response(404, {}, { erro: "Turma não encontrada" });
        }

        console.log("🔍 GET /api/classes/" + id + ":", classItem.attrs.nome);
        return classItem.attrs;
      });

      // POST /api/classes - Cria nova turma
      this.post("/classes", (schema: any, request) => {
        const dados: TurmaInput = JSON.parse(request.requestBody);

        if (!dados.escolaId) {
          return new Response(400, {}, { erro: "ID da escola é obrigatório" });
        }

        const school = schema.find("school", dados.escolaId);
        if (!school) {
          return new Response(400, {}, { erro: "Escola não encontrada" });
        }

        if (!dados.nome || dados.nome.trim().length < 2) {
          return new Response(
            400,
            {},
            { erro: "Nome é obrigatório (mínimo 2 caracteres)" }
          );
        }
        if (!dados.turno) {
          return new Response(400, {}, { erro: "Turno é obrigatório" });
        }
        if (!dados.anoLetivo) {
          return new Response(400, {}, { erro: "Ano letivo é obrigatório" });
        }

        const novaTurma = {
          id: gerarId(),
          escolaId: dados.escolaId,
          nome: dados.nome.trim(),
          turno: dados.turno,
          anoLetivo: dados.anoLetivo,
          capacidade: dados.capacidade || null,
          criadoEm: retornarDataAtual(),
          atualizadoEm: retornarDataAtual(),
        };

        const classItem = schema.create("class", novaTurma as any);
        console.log("✅ POST /api/classes:", novaTurma.nome);
        return classItem.attrs;
      });

      // PUT /api/classes/:id - Atualiza turma
      this.put("/classes/:id", (schema: any, request) => {
        const id = request.params.id;
        const dados: Partial<TurmaInput> = JSON.parse(request.requestBody);
        const classItem = schema.find("class", id);

        if (!classItem) {
          return new Response(404, {}, { erro: "Turma não encontrada" });
        }

        if (dados.nome !== undefined && dados.nome.trim().length < 2) {
          return new Response(
            400,
            {},
            { erro: "Nome deve ter mínimo 2 caracteres" }
          );
        }

        classItem.update({
          ...(dados.nome && { nome: dados.nome.trim() }),
          ...(dados.turno && { turno: dados.turno }),
          ...(dados.anoLetivo && { anoLetivo: dados.anoLetivo }),
          ...{
            capacidade: dados.capacidade,
          },
          atualizadoEm: retornarDataAtual(),
        });

        console.log("📝 PUT /api/classes/" + id + ":", classItem.attrs.nome);
        return classItem.attrs;
      });

      // DELETE /api/classes/:id - Remove turma
      this.delete("/classes/:id", (schema: any, request) => {
        const id = request.params.id;
        const classItem = schema.find("class", id);

        if (!classItem) {
          return new Response(404, {}, { erro: "Turma não encontrada" });
        }

        classItem.destroy();
        console.log("🗑️ DELETE /api/classes/" + id);
        return new Response(204);
      });

      this.passthrough();
    },
  });

  (window as any).server = server;

  console.log("🚀 Mock Server iniciado em /api");
  console.log("📍 Endpoints disponíveis:");
  console.log("   GET    /api/schools");
  console.log("   GET    /api/schools/:id");
  console.log("   POST   /api/schools");
  console.log("   PUT    /api/schools/:id");
  console.log("   DELETE /api/schools/:id");
  console.log("   GET    /api/schools/:id/classes");
  console.log("   GET    /api/classes");
  console.log("   GET    /api/classes/:id");
  console.log("   POST   /api/classes");
  console.log("   PUT    /api/classes/:id");
  console.log("   DELETE /api/classes/:id");

  return server;
}
