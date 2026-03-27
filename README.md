# IFAL Arapiraca Frontend

Aplicação em Next.js do Campus Ativo, responsável pela interface de autenticação, acompanhamento de problemas, dashboard e áreas administrativas.

Se você vai contribuir com o projeto, consulte o [CONTRIBUTING.md](./.github/docs/CONTRIBUTING.md).

## Stack

- Node.js `22.18.0` via `.nvmrc`
- Next.js `16`
- React `18`
- TypeScript
- React Query
- React Hook Form
- Zod
- Stitches
- Orval

## O que a aplicação cobre

- login e cadastro
- abertura e acompanhamento de problemas
- dashboard e relatório
- gestão de categorias e localizações
- administração de membros
- perfil do usuário
- lixeira de itens restauráveis

O design foi desenvolvido no Figma. Para acessar, [clique aqui](https://www.figma.com/design/uRxcTWge7V9l36AfLkKclf/Campus-Ativo).

## Estrutura resumida

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

## Variáveis de ambiente

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Valores usados no desenvolvimento local:

- `NEXT_PUBLIC_SERVER_URL=http://localhost:3333`
- `NODE_ENV=development`

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

## Cliente da API

O projeto usa Orval para gerar o cliente a partir de [`openapi/openapi.json`](./openapi/openapi.json).

Para regenerar:

```bash
npm run generate:api
```

Evite editar manualmente arquivos em `src/lib/api/generated`.

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
