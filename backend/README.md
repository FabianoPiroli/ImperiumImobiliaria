# Imperium Imobiliária - Backend

API REST da Imperium Imobiliária, construída com NestJS, Prisma e PostgreSQL.

## Responsabilidades

- Autenticação administrativa com JWT e bcrypt;
- CRUD e filtros de imóveis;
- Upload e exclusão de mídias no Cloudinary;
- Validação estrita dos DTOs;
- Localização por coordenadas e resolução segura de links de mapas;
- Documentação Swagger;
- Testes unitários e E2E.

## Tecnologias

- NestJS 11;
- TypeScript;
- Prisma 5;
- PostgreSQL;
- Jest, Supertest e ESLint;
- Cloudinary;
- Swagger/OpenAPI.

## Instalação

```bash
npm install
```

Crie o ambiente local:

```powershell
Copy-Item .env.example .env
```

Principais variáveis:

| Variável | Finalidade |
| --- | --- |
| `PORT` | Porta HTTP da API, normalmente `3000` |
| `FRONTEND_URL` | Origens autorizadas pelo CORS |
| `JWT_SECRET` | Chave de assinatura dos tokens |
| `ADMIN_EMAIL` | E-mail criado pelo seed |
| `ADMIN_PASSWORD` | Senha criada pelo seed |
| `POSTGRES_PRISMA_URL` | Conexão PostgreSQL usada pelo Prisma |
| `POSTGRES_URL_NON_POOLING` | Conexão direta usada nas migrations |
| `CLOUDINARY_CLOUD_NAME` | Nome da conta Cloudinary |
| `CLOUDINARY_API_KEY` | Chave da API Cloudinary |
| `CLOUDINARY_API_SECRET` | Segredo da API Cloudinary |

## Banco de dados

```bash
npx prisma generate
npx prisma migrate deploy
npm run db:seed
```

O schema está em `prisma/schema.prisma`, as migrations em `prisma/migrations` e o seed em `prisma/seed.ts`. Para consultar o comprovante da última verificação do banco, veja [../docs/migrations.md](../docs/migrations.md).

Em desenvolvimento, uma nova migration pode ser criada com:

```bash
npx prisma migrate dev --name nome_da_migration
```

Em produção ou CI, use `npx prisma migrate deploy`.

## Execução

```bash
npm run start:dev
```

A API ficará disponível em `http://localhost:3000` e o Swagger em `http://localhost:3000/api/docs`.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run start:dev` | Desenvolvimento com hot reload |
| `npm run build` | Gera o Prisma Client e compila o NestJS |
| `npm run start:prod` | Executa a versão compilada |
| `npm run lint` | Executa ESLint |
| `npm test` | Testes unitários |
| `npm run test:e2e` | Testes E2E |
| `npm run test:cov` | Cobertura dos testes |
| `npm run db:seed` | Popula administrador e imóveis de demonstração |

## Rotas principais

| Método | Rota | Acesso |
| --- | --- | --- |
| `POST` | `/auth/login` | Público |
| `GET` | `/imoveis` | Público |
| `GET` | `/imoveis/:id` | Público |
| `POST` | `/imoveis` | JWT |
| `PUT` | `/imoveis/:id` | JWT |
| `DELETE` | `/imoveis/:id` | JWT |
| `POST` | `/imoveis/:id/midias` | JWT |
| `DELETE` | `/imoveis/:id/midias/:mediaId` | JWT |
| `GET` | `/imoveis/resolver-maps` | Público |

Nas rotas protegidas, envie `Authorization: Bearer <token>`.

## Segurança

- `ValidationPipe` global com whitelist, transformação e rejeição de campos extras;
- Helmet e filtro global de exceções;
- Rate limiting via `@nestjs/throttler`;
- CORS configurável por `FRONTEND_URL`;
- Validação de domínios e bloqueio de IPs internos no resolvedor de mapas;
- Prisma para consultas parametrizadas;
- `.env` ignorado pelo Git.

## Deploy

O arquivo `vercel.json` configura a API para execução serverless na Vercel. Defina as variáveis do ambiente de produção e aplique as migrations com `npx prisma migrate deploy` antes do primeiro uso.
