# Gestão de Contatos Inteligente

Mini-aplicação que recebe contatos em formato bruto, normaliza os dados, permite organizá-los com tags,
enriquecer o endereço via ViaCEP e gerar um resumo profissional com IA (OpenAI `gpt-4o-mini`).

- **Backend:** NestJS + Prisma 7 + PostgreSQL (`backend/`)
- **Frontend:** Next.js 16 (App Router) + Tailwind (`frontend/`)

## Pré-requisitos

- Node.js 20+
- Docker (para o PostgreSQL) — ou um PostgreSQL 16 local

## Como rodar localmente

### 1. Banco de dados

```bash
docker compose up -d
```

### 2. Backend (porta 3001)

```bash
cd backend
cp ../.env.example .env     # preencha OPENAI_API_KEY
npm install                 # também gera o Prisma Client (postinstall)
npx prisma migrate deploy   # cria as tabelas
npm run start:dev
```

### 3. Frontend (porta 3000)

```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
npm install
npm run dev
```

Acesse http://localhost:3000.

## Variáveis de ambiente

| Variável              | Onde      | Descrição                                          |
| --------------------- | --------- | -------------------------------------------------- |
| `DATABASE_URL`        | backend   | String de conexão do PostgreSQL                    |
| `OPENAI_API_KEY`      | backend   | Chave da OpenAI (sem ela, `/summarize` retorna 503) |
| `PORT`                | backend   | Porta da API (padrão `3001`)                       |
| `FRONTEND_URL`        | backend   | Origem liberada no CORS (padrão `http://localhost:3000`) |
| `NEXT_PUBLIC_API_URL` | frontend  | URL da API (padrão `http://localhost:3001`)        |

## Endpoints

| Método | Rota                            | Descrição                                            |
| ------ | ------------------------------- | ---------------------------------------------------- |
| POST   | `/contacts`                     | Cria e normaliza um contato                          |
| GET    | `/contacts?page=&limit=&tagId=` | Lista com filtro por tag e paginação                 |
| GET    | `/contacts/:id`                 | Detalhe com tags e último resumo de IA               |
| POST   | `/contacts/import`              | Importa um array de contatos brutos e retorna relatório |
| POST   | `/contacts/:id/summarize`       | Gera resumo com IA e salva em `ai_summaries`         |
| POST   | `/contacts/:id/enrich-address`  | Consulta o CEP na ViaCEP e salva em `address` (JSONB) |
| POST   | `/tags`                         | Cria uma tag                                         |
| GET    | `/tags`                         | Lista as tags                                        |
| POST   | `/contacts/:id/tags`            | Associa uma tag ao contato                           |
| DELETE | `/contacts/:id/tags/:tagId`     | Remove uma tag do contato                            |

Exemplos prontos de requisição em [`backend/requests.http`](backend/requests.http) e um arquivo de exemplo
para importação em [`frontend/public/exemplo-importacao.json`](frontend/public/exemplo-importacao.json).

## Normalização

- **Nome:** remove espaços nas pontas e espaços repetidos.
- **E-mail:** `trim` + minúsculas, validado no formato `nome@dominio.tld`. E-mails duplicados são rejeitados (409).
- **Telefone:** aceita qualquer formatação (inclusive `+55`) e salva como `(XX) XXXXX-XXXX`.
- **CEP:** aceita com ou sem hífen; precisa ter 8 dígitos.

## Banco de dados

O schema está em [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma) e a migration SQL em
[`backend/prisma/migrations`](backend/prisma/migrations). Tabelas: `contacts`, `tags`, `contact_tags` (N:N)
e `ai_summaries`.

## Testes

```bash
cd backend
npm test
```
