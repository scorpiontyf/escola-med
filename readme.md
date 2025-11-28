# 🏫 Gestão Escolar - App Mobile

Aplicativo móvel multiplataforma (Android/iOS) para gestão de escolas públicas e suas turmas.

## 📋 Sobre o Projeto

Sistema desenvolvido para centralizar o cadastro de escolas públicas e turmas, substituindo controles manuais em planilhas Excel.

### Funcionalidades

- ✅ Cadastro, listagem, edição e exclusão de escolas
- ✅ Cadastro, listagem, edição e exclusão de turmas
- ✅ Busca e filtros
- ✅ Interface responsiva (mobile/tablet)

## 🚀 Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Expo SDK | 54.0.25 | Framework React Native |
| React | 19.1.0 | Biblioteca |
| React Native | 0.81.5 | Framework mobile |
| TypeScript | 5.9.2 | Tipagem estática |
| Expo Router | 6.0.15 | Navegação baseada em arquivos |
| Gluestack UI | 3.0.10 | Componentes de UI |
| Zustand | 5.0.8 | Gerenciamento de estado |
| MirageJS | 0.1.48 | Mock de API |

## 📦 Pré-requisitos

- Node.js 20.x ou superior
- npm ou yarn
- Expo Go (app no celular) ou emulador Android/iOS

## 🔧 Instalação

```bash
# Clone o repositório
git clone https://github.com/scorpiontyf/escola-med.git

# Entre na pasta do projeto
cd escola-med

# Instale as dependências
npm install

# Inicie o projeto
npx expo start
```

## 📱 Executando o App

Após `npx expo start`, você terá as opções:

- **Expo Go (Recomendado)**: Escaneie o QR Code com o app Expo Go
- **Android**: Pressione `a` para abrir no emulador Android
- **iOS**: Pressione `i` para abrir no simulador iOS (apenas macOS)
- **Web**: Pressione `w` para abrir no navegador

## 🗂️ Estrutura do Projeto

```
escola-app/
├── app/                    # Rotas/Telas (Expo Router)
│   ├── (tabs)/            # Layout com abas
│   ├── escola/            # Telas de escola
│   ├── constants/         # Arquivo onde estão organizadas as cores
│   └── turma/             # Telas de turma
├── src/
│   ├── components/        # Componentes reutilizáveis
│   ├── hooks/             # Hooks customizados
│   ├── patterns/          # Utilização de Patterns
│   ├── services/          # Chamadas API
│   ├── store/             # Estado global (Zustand)
│   ├── types/             # Tipagens TypeScript
│   └── utils/             # Funções utilitárias
├── mocks/                 # MirageJS (mock backend)
└── assets/                # Imagens e fontes
```

## 🧪 Mock do Backend

O projeto utiliza MirageJS para simular uma API REST:

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| /api/schools | GET | Lista todas as escolas |
| /api/schools | POST | Cria nova escola |
| /api/schools/:id | GET | Busca escola por ID |
| /api/schools/:id | PUT | Atualiza escola |
| /api/schools/:id | DELETE | Remove escola |
| /api/schools/:id/classes | GET | Lista turmas da escola |
| /api/classes | POST | Cria nova turma |
| /api/classes/:id | PUT | Atualiza turma |
| /api/classes/:id | DELETE | Remove turma |

## 🎨 Padrões de Código

- **ESLint** para padronização
- **TypeScript** 
- Commits seguindo Conventional Commits

```bash
# Rodar lint
npm run lint
```

## 📝 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o Expo |
| `npm run android` | Abre no Android |
| `npm run ios` | Abre no iOS |
| `npm run web` | Abre no navegador |
| `npm run lint` | Verifica código |

## 📄 Licença

Este projeto está sob a licença MIT.
