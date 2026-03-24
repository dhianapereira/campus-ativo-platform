# IFAL Arapiraca Frontend

Aplicação em Next.js para a interface do Campus Ativo, sistema de gerenciamento de problemas de infraestrutura do IFAL Arapiraca.
O frontend cobre autenticação, abertura e acompanhamento de problemas, dashboard, gestão de categorias e localizações,
perfil do usuário, administração de usuários e integração com relatórios consumindo a API do projeto.
Caso queira contribuir com novos componentes, melhorias e/ou correções no projeto, siga os passos do arquivo [CONTRIBUTING.md](./.github/docs/CONTRIBUTING.md).

## Stack

- Node.js `22.18.0`
- Next.js `16`
- React `18`
- TypeScript
- React Query
- React Hook Form
- Zod
- Stitches
- ESLint
- Prettier
- Orval

## O que a aplicação faz

- autenticação de usuários
- cadastro de conta e fluxo de acesso inicial
- listagem, visualização, criação e edição de problemas
- dashboard com métricas e geração de relatório
- gestão de categorias e localizações
- gestão de usuários por perfis administrativos
- edição de perfil e alteração de senha
- upload de anexos e integração com endpoints internos da aplicação

## Estrutura do projeto

O projeto segue uma separação entre páginas, componentes visuais, regras de formulário e integração com a API:

```text
src/
  components/                    componentes reutilizáveis
  contexts/                      estados globais, como autenticação
  lib/api/                       cliente HTTP e infraestrutura manual de API
  lib/api/generated/             cliente OpenAPI e modelos gerados pelo Orval
  layouts/                       estruturas visuais compartilhadas
  pages/                         páginas e rotas de API do Next.js
  styles/                        estilos globais e componentes base
  utils/                         utilitários
  validators/                    schemas e validações de formulário
```

Fluxo geral da aplicação:

1. `src/pages` renderiza a interface e aciona hooks, contexto e componentes.
2. As rotas em `src/pages/api` funcionam como camada intermediária para algumas chamadas.
3. `src/lib/api/generated` concentra o código gerado a partir do contrato OpenAPI, enquanto `src/lib/api` guarda a infraestrutura manual.
4. A aplicação consome a API backend definida em `NEXT_PUBLIC_SERVER_URL`.

## Variáveis de ambiente

Copie o arquivo [`.env.example`](./.env.example) para `.env`:

```bash
cp .env.example .env
```

Variáveis usadas atualmente:

- `NEXT_PUBLIC_SERVER_URL`: URL base da API backend. Em ambiente local, o valor esperado é `http://localhost:3333`
- `NODE_ENV`: ambiente da aplicação. Em desenvolvimento local, use `development`

## Como rodar localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar e revisar o `.env`

```bash
cp .env.example .env
```

Preencha ou confirme ao menos:

- `NEXT_PUBLIC_SERVER_URL`
- `NODE_ENV`

### 3. Garantir que o backend esteja rodando

O frontend depende da API backend para carregar autenticação, dashboard, usuários, problemas, categorias, localizações e anexos.

Por padrão, a aplicação espera o backend em:

```text
http://localhost:3333
```

### 4. Iniciar a aplicação

```bash
npm run dev
```

Por padrão, o frontend sobe em `http://localhost:3000`.

## Geração do cliente da API

O projeto usa Orval para gerar o cliente HTTP a partir do arquivo [`openapi/openapi.json`](./openapi/openapi.json).

Para regenerar os arquivos de cliente:

```bash
npm run generate:api
```

Observações:

- o contrato OpenAPI fica em `openapi/openapi.json`
- o código gerado fica em `src/lib/api/generated`
- evite editar manualmente arquivos gerados
- se o contrato da API mudar, atualize o `openapi.json` antes de regenerar

## Scripts úteis

```bash
npm run dev            # desenvolvimento
npm run build          # build de produção
npm run start          # executa a aplicação após o build
npm run lint           # lint com correções automáticas
npm run format         # formata os arquivos do projeto
npm run format:check   # valida a formatação
npm run generate:api   # regenera o cliente OpenAPI
```

## Principais áreas da interface

- `/login` e `/register` para autenticação e criação de conta
- `/problems` para listagem e acompanhamento dos problemas
- `/problems/[id]` para detalhes e ações sobre um problema
- `/dashboard` para métricas e relatórios
- `/settings` para categorias e localizações
- `/users` para administração de usuários
- `/profile` para edição de perfil

## Design

O design foi desenvolvido no Figma. Para acessar, [clique aqui](https://www.figma.com/design/uRxcTWge7V9l36AfLkKclf/Campus-Ativo).

## Problemas comuns

### A aplicação abre, mas não carrega dados

Verifique se:

- o backend está rodando
- `NEXT_PUBLIC_SERVER_URL` aponta para a URL correta
- há erro de CORS ou indisponibilidade na API

### O login não funciona localmente

Confirme se:

- a API backend está acessível
- o frontend está rodando em `localhost`
- a URL configurada no `.env` corresponde ao backend esperado

### O lint alterou arquivos

Isso é esperado. O script `npm run lint` executa correções automáticas e pode ajustar imports, formatação e outros problemas simples.

## Observações de desenvolvimento

- o projeto usa `.nvmrc`; se você utiliza `nvm`, rode `nvm use`
- `npm run lint` executa correções automáticas com `--fix`
- as rotas de API do Next.js ficam em `src/pages/api`
- para padrões de commit e fluxo de colaboração, consulte a documentação em [`.github/docs`](./.github/docs)
