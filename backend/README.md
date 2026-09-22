<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>
# 🏢 Imperium Imobiliária - Backend API

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest
API RESTful em **NestJS**, **Prisma ORM** e **PostgreSQL** desenvolvida para o sistema de gestão e catálogo da Imperium Imobiliária.

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->
---

## Description
## 🔒 Arquitetura de Segurança Implementada

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
- **Headers HTTP Defensivos**: Proteção ativa com `helmet` contra ataques comuns (X-Frame-Options, X-Content-Type-Options, etc.).
- **Rate Limiting (Proteção contra DoS e Brute Force)**: Configuração de `@nestjs/throttler` limitando o volume de requisições por IP.
- **CORS Parametrizado**: Suporte a origens seguras controladas via variável `FRONTEND_URL` com credentials.
- **Validação Estrita de Dados**: `ValidationPipe` global com `whitelist: true`, `transform: true` e `forbidNonWhitelisted: true` (rejeita qualquer campo extra não mapeado com erro 400).
- **Sanitização e Limites**: Uso de `@MaxLength()`, `@IsIn()` (enums permitidos) e validações de intervalo numérico para evitar payloads desproporcionais ou corrompidos.
- **Prevenção contra SQL Injection**: Consultas exclusivamente executadas via API nativa tipada e parametrizada do Prisma Client (sem queries brutas concatenadas).
- **Mitigação de SSRF (Server-Side Request Forgery)**: Endpoint de resolução de links do Google Maps (`/imoveis/resolver-maps`) com validação restrita de domínios confiáveis (`maps.google.com`, `goo.gl`, etc.) e bloqueio de IPs internos.
- **Proteção de Logs e Erros Internos**: `AllExceptionsFilter` global que oculta stack traces e detalhes de banco em respostas de erro 500, registrando o log completo com segurança no servidor.

## Project setup
---

## 📦 Tecnologias Principais

- **Framework**: [NestJS](https://nestjs.com/) (v11)
- **ORM**: [Prisma](https://www.prisma.io/) (v5)
- **Banco de Dados**: PostgreSQL (Supabase / Neon / Local)
- **Upload de Mídia**: Cloudinary API
- **Autenticação**: JWT (`@nestjs/jwt`) + Bcrypt
- **Documentação**: Swagger / OpenAPI 3.0 (`@nestjs/swagger`)
- **Testes**: Jest + Supertest (Testes unitários e e2e de segurança e CRUD)

---

## ⚙️ Variáveis de Ambiente

Crie o arquivo `.env` no diretório `backend` baseado no `.env.example`:

```bash
$ npm install
cp .env.example .env
```

## Compile and run the project
Campos essenciais:

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `PORT` | Porta onde o servidor HTTP escuta | `3000` |
| `FRONTEND_URL` | URL do frontend permitida no CORS | `http://localhost:3000` |
| `JWT_SECRET` | Chave privada para assinatura de tokens | `sua-chave-secreta-jwt` |
| `ADMIN_EMAIL` | E-mail do usuário administrador inicial | `admin@imperium.com` |
| `ADMIN_PASSWORD` | Senha do usuário administrador inicial | `admin123` |
| `POSTGRES_PRISMA_URL` | String de conexão do Prisma (Pooling) | `postgresql://...` |
| `POSTGRES_URL_NON_POOLING` | String de conexão direta (Migrations) | `postgresql://...` |
| `CLOUDINARY_*` | Credenciais da conta Cloudinary | `cloud_name`, `api_key`, etc. |

---

## 🚀 Como Executar Localmente

### 1. Instalar dependências
```bash
# development
$ npm run start
npm install
```

# watch mode
$ npm run start:dev
### 2. Sincronizar o Banco de Dados
```bash
# Executar as migrações do Prisma
npx prisma migrate deploy

# production mode
$ npm run start:prod
# Gerar o cliente TypeScript do Prisma
npx prisma generate
```

## Run tests
### 3. Executar o Seed (Dados de Demonstração e Admin)
```bash
npm run db:seed
```

### 4. Iniciar o Servidor
```bash
# unit tests
$ npm run test
# Modo desenvolvimento (com hot-reload)
npm run start:dev

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
# Modo produção
npm run build
npm run start:prod
```

## Deployment
---

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.
## 📖 Documentação da API (Swagger)

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:
Com o servidor rodando, acesse a documentação interativa Swagger UI em:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```
📍 **`http://localhost:3000/api/docs`**

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.
Através da interface Swagger é possível:
- Testar todos os endpoints de Imóveis e Autenticação.
- Realizar login e autenticar chamadas via botão **Authorize** (Bearer Token).
- Consultar esquemas detalhados dos DTOs de entrada e saída.

## Resources
---

Check out a few resources that may come in handy when working with NestJS:
## 🧪 Testes Automatizados

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).
```bash
# Executar testes unitários
npm test

## Support
# Executar testes de integração / segurança e2e
npm run test:e2e

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).
# Executar com cobertura de testes
npm run test:cov
```

## Stay in touch
Os testes de integração cobrem:
- Bloqueio de rotas protegidas sem token (401).
- Bloqueio de tokens forjados ou inválidos (401).
- Validação de campos obrigatórios e limites de caracteres (400).
- Rejeição de propriedades desconhecidas via `forbidNonWhitelisted` (400).
- Bloqueio de SSRF com IPs privados (400).
- Resiliência contra payloads de SQL Injection e XSS.
- Ciclo de vida completo do CRUD (Create, List, Filter, Get by ID, PATCH, Delete).

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)
---

## License
## ☁️ Deploy na Vercel

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
O backend está configurado para execução serverless na Vercel:
- Arquivo de configuração: `vercel.json`
- Script de compilação: `npm run vercel-build`
- Handler exportado em: `src/main.ts`
- Target binário configurado no `schema.prisma`: `rhel-openssl-3.0.x`
