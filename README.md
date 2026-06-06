# Campus Ativo Platform

Aplicação em Next.js do Campus Ativo, responsável pela interface de autenticação, acompanhamento de problemas, dashboard e áreas administrativas.

Se você vai contribuir com o projeto, consulte o [guia de contribuição](./.github/docs/CONTRIBUTING.md).

## Projetos relacionados

O Campus Ativo é dividido em dois repositórios:

- [`campus-ativo-platform`](https://github.com/dhianapereira/campus-ativo-platform): aplicação web em Next.js.
- [`campus-ativo`](https://github.com/dhianapereira/campus-ativo): API em NestJS, documentação OpenAPI, banco de dados e integrações.

Para rodar o projeto completo localmente, suba primeiro o backend `campus-ativo` e depois esta aplicação. Por padrão, o frontend espera a API disponível em `http://localhost:3333`.

## Stack

- Node.js `22.18.0` via `.nvmrc`
- Next.js `16`
- React `19`
- TypeScript
- React Query
- React Hook Form
- Zod
- Stitches
- Orval

## O que a aplicação cobre

- login e cadastro
- abertura e acompanhamento de problemas
- importação de problemas por CSV
- dashboard e relatório
- gestão de categorias e localizações
- administração de membros
- perfil do usuário
- lixeira de itens restauráveis

O design foi desenvolvido no Figma. Para acessar, [clique aqui](https://www.figma.com/design/uRxcTWge7V9l36AfLkKclf/Campus-Ativo).

## Estrutura

```text
src/
  components/           componentes reutilizáveis
  contexts/             estados globais, como autenticação
  layouts/              estruturas compartilhadas
  lib/api/              cliente HTTP e código gerado
  pages/                páginas e rotas de API do Next.js
  styles/               estilos globais
  validators/           schemas de formulário
```

## Pré-requisitos

- Node.js `22.18.0`
- npm
- backend `campus-ativo` rodando e acessível

## Como o frontend conversa com o backend

O projeto usa duas camadas:

- páginas React em `src/pages/**/*.page.tsx`
- rotas de API do Next em `src/pages/api/**/*.api.ts`

Essas rotas `/api` do Next intermediam autenticação, cookies e algumas chamadas ao backend. Por isso, o frontend depende da URL base do backend configurada em `NEXT_PUBLIC_SERVER_URL`.

## Variáveis de ambiente

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Valores usados no desenvolvimento local:

- `NEXT_PUBLIC_SERVER_URL=http://localhost:3333`
- `NODE_ENV=development`

### Variável principal

- `NEXT_PUBLIC_SERVER_URL`: URL base da API NestJS. Em ambiente local, normalmente `http://localhost:3333`.

Se o backend estiver em outra porta ou host, ajuste essa variável antes de iniciar o frontend.

## Rodando localmente

1. Instale as dependências:

```bash
npm install
```

2. Crie o `.env`:

```bash
cp .env.example .env
```

3. Garanta que o backend esteja rodando em `http://localhost:3333` ou ajuste `NEXT_PUBLIC_SERVER_URL`.

4. Inicie a aplicação:

```bash
npm run dev
```

Por padrão, o frontend sobe em `http://localhost:3000`.

## Autenticação local

O login é feito por rotas de API do próprio Next, que armazenam o token em cookie `httpOnly`.

Durante desenvolvimento local:

- o frontend roda em `http://localhost:3000`
- o backend normalmente roda em `http://localhost:3333`
- os cookies usam comportamento apropriado para `NODE_ENV=development`

## Cliente da API

O projeto usa Orval para gerar o cliente a partir de [`openapi/openapi.json`](./openapi/openapi.json).

Arquivos gerados são enviados para:

- `src/lib/api/generated`
- `src/lib/api/generated/models`

Para regenerar:

```bash
npm run generate:api
```

Evite editar manualmente arquivos em `src/lib/api/generated`.

Quando o backend mudar contratos ou endpoints, atualize primeiro o `openapi.json` e depois regenere o cliente aqui.

Fluxo recomendado:

1. No backend `campus-ativo`, rode `npm run openapi`.
2. Copie o arquivo `campus-ativo/openapi.json` atualizado para `campus-ativo-platform/openapi/openapi.json`.
3. Neste projeto, rode `npm run generate:api`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run format
npm run format:check
npm run generate:api
```
