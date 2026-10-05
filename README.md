> **UNOESC - Universidade do Oeste de Santa Catarina**  
> **Curso:** Ciência da Computação | **Disciplina:** Programação IV  
> **Professor:** Roberson Junior Fernandes Alves | **Semestre:** 2026/02  
> **Equipe MasterCoding:**  
> - Fabiano Piroli ([github.com/FabianoPiroli](https://github.com/FabianoPiroli))  
> - Jorge Zastrow ([github.com/jzastrowss-cpu](https://github.com/jzastrowss-cpu))
> **Vídeo de apresentação:**
> ([YouTube](https://youtu.be/RKsxQ8L7TyY))

# Imperium Imobiliária

O Imperium Imobiliária é uma aplicação full stack para cadastro, consulta, filtragem, gestão e avaliação de imóveis. O sistema combina uma interface Next.js renderizada no servidor com uma API NestJS, autenticação JWT, integração com mapas interativos e persistência PostgreSQL mapeada pelo Prisma.

## Recursos

- Cadastro e login de usuários (clientes e administradores);
- Senhas protegidas com hash bcrypt e nunca retornadas pela API;
- Sessão JWT armazenada e enviada via header `Authorization: Bearer <token>`;
- CRUD completo de imóveis com autorização restrita a administradores;
- Catálogo público de imóveis para compra e locação com busca por título, localização, tipo e faixa de preço;
- Área do cliente para submissão de solicitações de avaliação de imóveis para venda/locação;
- Upload e substituição de foto dos imóveis solicitados pelo cliente com pré-visualização;
- Painel administrativo de solicitações para avaliação, alteração de status (`pendente`, `em_avaliacao`, `aprovada`, `recusada`), edição completa e exclusão de solicitações;
- Upload de mídias (imagens e vídeos) associadas aos imóveis do catálogo, armazenadas no Cloudinary;
- Localização em mapa interativo (Leaflet / OpenStreetMap) com geocodificação por URL do Google Maps e opção de ocultar o número exato para privacidade;
- Favoritos: usuários autenticados podem salvar e gerenciar seus imóveis preferidos com ícone interativo de coração;
- Compartilhamento de imóveis por link direto (`/anuncio/:id`);
- Design responsivo e acessível, com suporte nativo a temas Claro e Escuro (`data-theme`);
- Validação no backend com `class-validator` e `class-transformer` em DTOs estritos (`whitelist: true`, `forbidNonWhitelisted: true`);
- Headers de segurança com Helmet e limite de requisições global (Rate limiting) com NestJS Throttler;
- Documentação interativa da API com Swagger/OpenAPI (`/api/docs`);
- Configuração completa para deploy de frontend e backend na Vercel.

## Arquitetura

```mermaid
flowchart LR
    U[Usuário] --> N[Next.js App Router]
    N -->|JWT em Bearer Header| A[NestJS API]
    A --> P[Prisma ORM]
    P --> D[(PostgreSQL)]
    A -->|Upload/Delete| C[Cloudinary]
```

O Next.js é responsável pela interface responsiva e renderização de páginas no cliente e servidor. O backend NestJS concentra a autenticação JWT, controle de acesso baseado em papéis (`admin` e `cliente`), validações de dados, regras de negócio, persistência no banco e integração com Cloudinary.

## Tecnologias

### Frontend

- Next.js 16 e App Router;
- React 19;
- TypeScript;
- Leaflet e React-Leaflet para mapas interativos;
- Lucide React para ícones vetoriais;
- Vanilla CSS com variáveis de tema (Claro/Escuro) e design responsivo.

### Backend

- NestJS 11 (Express Adapter);
- Prisma 5 com PostgreSQL;
- PostgreSQL 16+;
- JWT (`@nestjs/jwt`);
- bcryptjs;
- `class-validator` e `class-transformer`;
- Cloudinary API (`cloudinary` e `multer-storage-cloudinary`);
- Helmet e NestJS Throttler;
- Swagger/OpenAPI.

## Modelo de dados

Todas as tabelas de domínio estão declaradas em `backend/prisma/schema.prisma` e possuem migrações versionadas.

### `User`

| Campo       | Tipo       | Observação                                                           |
| ----------- | ---------- | -------------------------------------------------------------------- |
| `id`        | `Int`      | Identificador autoincremental e chave primária.                      |
| `nome`      | `String`   | Nome completo do usuário.                                            |
| `email`     | `String`   | E-mail único utilizado no acesso.                                    |
| `senha`     | `String`   | Hash bcrypt; a senha em texto puro nunca é persistida nem retornada. |
| `role`      | `String`   | Papel do usuário (`admin` ou `cliente`, padrão `admin`).             |
| `createdAt` | `DateTime` | Data de criação.                                                     |
| `updatedAt` | `DateTime` | Atualizado automaticamente pelo Prisma.                              |

### `Imovel`

| Campo                | Tipo       | Observação                                                                  |
| -------------------- | ---------- | --------------------------------------------------------------------------- |
| `id`                 | `Int`      | Identificador autoincremental e chave primária.                             |
| `codigo`             | `Int`      | Código único do imóvel gerado automaticamente.                              |
| `titulo`             | `String`   | Título do anúncio do imóvel.                                                |
| `descricao`          | `String`   | Descrição detalhada do imóvel.                                              |
| `tipo`               | `String`   | Tipo (`casa`, `apartamento`, `terreno`, `cobertura`, `comercial`, `rural`). |
| `finalidade`         | `String`   | Finalidade (`venda` ou `locacao`, padrão `venda`).                          |
| `estado`             | `String`   | Sigla do estado (padrão `SC`).                                              |
| `cidade`             | `String`   | Nome da cidade.                                                             |
| `bairro`             | `String`   | Nome do bairro.                                                             |
| `endereco`           | `String`   | Endereço completo.                                                          |
| `cep`                | `String`   | Código de Endereçamento Postal.                                             |
| `preco`              | `Float`    | Valor do imóvel para venda ou aluguel mensal.                               |
| `status`             | `String`   | Status de publicação (`disponivel`, `reservado`, `vendido`, `alugado`).     |
| `quartos`            | `Int`      | Quantidade de quartos/suítes.                                               |
| `banheiros`          | `Int`      | Quantidade de banheiros.                                                    |
| `vagasGaragem`       | `Int`      | Quantidade de vagas de garagem.                                             |
| `latitude`           | `Float?`   | Coordenada de latitude para o mapa.                                         |
| `longitude`          | `Float?`   | Coordenada de longitude para o mapa.                                        |
| `ocultarNumeroExato` | `Boolean`  | Exibe círculo de localização aproximada quando `true`.                      |
| `createdAt`          | `DateTime` | Data de criação.                                                            |
| `updatedAt`          | `DateTime` | Atualizado automaticamente pelo Prisma.                                     |

### `PropertyRequest`

| Campo             | Tipo       | Observação                                                                |
| ----------------- | ---------- | ------------------------------------------------------------------------- |
| `id`              | `Int`      | Identificador autoincremental.                                            |
| `userId`          | `Int`      | Chave estrangeira para `User` (`ON DELETE CASCADE`).                      |
| `titulo`          | `String`   | Título da solicitação enviada pelo cliente.                               |
| `tipo`            | `String`   | Tipo do imóvel proposto.                                                  |
| `finalidade`      | `String`   | Finalidade (`venda` ou `locacao`).                                        |
| `estado`          | `String`   | Estado do imóvel.                                                         |
| `cidade`          | `String`   | Cidade do imóvel.                                                         |
| `bairro`          | `String`   | Bairro do imóvel.                                                         |
| `preco`           | `Float?`   | Preço estimado sugerido pelo cliente.                                     |
| `descricao`       | `String`   | Descrição detalhada enviada pelo cliente.                                 |
| `contatoEmail`    | `String`   | E-mail do proprietário para contato.                                      |
| `contatoTelefone` | `String`   | Telefone do proprietário para contato.                                    |
| `fotoUrl`         | `String?`  | URL da foto enviada para avaliação no Cloudinary.                         |
| `fotoPublicId`    | `String?`  | Identificador da foto no Cloudinary.                                      |
| `status`          | `String`   | Status da avaliação (`pendente`, `em_avaliacao`, `aprovada`, `recusada`). |
| `createdAt`       | `DateTime` | Data de criação da solicitação.                                           |
| `updatedAt`       | `DateTime` | Data da última atualização de status ou dados.                            |

### `Favorite`

| Campo       | Tipo       | Observação                                             |
| ----------- | ---------- | ------------------------------------------------------ |
| `id`        | `Int`      | Identificador autoincremental.                         |
| `userId`    | `Int`      | Chave estrangeira para `User` (`ON DELETE CASCADE`).   |
| `imovelId`  | `Int`      | Chave estrangeira para `Imovel` (`ON DELETE CASCADE`). |
| `createdAt` | `DateTime` | Data em que o imóvel foi favoritado.                   |

Par `(userId, imovelId)` é único: cada usuário favorita o mesmo imóvel no máximo uma vez.

### `Midia`

| Campo          | Tipo       | Observação                                                  |
| -------------- | ---------- | ----------------------------------------------------------- |
| `id`           | `Int`      | Identificador autoincremental.                              |
| `url`          | `String`   | URL do arquivo hospedado no Cloudinary.                     |
| `nome`         | `String`   | Nome original do arquivo enviado.                           |
| `tipo`         | `String`   | Tipo de mídia (`imagem` ou `video`).                        |
| `mimeType`     | `String`   | Tipo MIME (`image/jpeg`, `video/mp4`, etc.).                |
| `publicId`     | `String?`  | Identificador único do arquivo no Cloudinary para exclusão. |
| `resourceType` | `String`   | Recursos do Cloudinary (`image` ou `video`).                |
| `imovelId`     | `Int`      | Chave estrangeira para `Imovel` (`ON DELETE CASCADE`).      |
| `createdAt`    | `DateTime` | Data de upload.                                             |

Ao excluir um imóvel, todas as mídias e favoritos vinculados são removidos em cascata automaticamente (`ON DELETE CASCADE`).

## Estrutura

```text
ImperiumImobiliaria/
├── backend/
│   ├── prisma/                  # Schema, migrations e seed.ts
│   ├── src/auth/                # Autenticação JWT, login, cadastro e guards
│   ├── src/cliente/             # Área do cliente, favoritos e solicitações
│   ├── src/cloudinary/          # Upload e remoção de mídias
│   ├── src/common/              # Filtros de exceção global HTTP
│   ├── src/imoveis/             # CRUD de imóveis, filtros e mapas
│   ├── src/prisma/              # PrismaService
│   └── test/                    # Testes E2E de integração e segurança
└── frontend/
    ├── app/                     # App Router (/comprar, /alugar, /cliente, /imoveis, etc.)
    └── src/
        ├── components/          # Componentes reutilizáveis (PublicHeader, PropertyMap, etc.)
        └── lib/                 # Comunicação com a API (api.ts)
```

## Pré-requisitos

- Node.js 20 ou superior;
- npm;
- PostgreSQL 16 ou superior (local ou em nuvem como Supabase/Neon).

## Instalação

```bash
git clone https://github.com/FabianoPiroli/ImperiumImobiliaria.git
cd ImperiumImobiliaria

npm run setup
```

O comando `npm run setup` instala automaticamente as dependências da raiz, do backend e do frontend.

## Configuração local

Copie o arquivo de exemplo do backend:

```bash
cp backend/.env.example backend/.env
```

No PowerShell (Windows):

```powershell
Copy-Item backend/.env.example backend/.env
```

Variáveis do backend (`backend/.env`):

```env
PORT=3000
FRONTEND_URL=http://localhost:3001,http://localhost:3000

# Autenticação e Segurança (JWT)
JWT_SECRET=sua-chave-secreta-jwt-super-segura-aqui
ADMIN_EMAIL=email-aqui
ADMIN_PASSWORD=senha-aqui

# Banco de Dados PostgreSQL
DATABASE_URL=postgresql://usuario:senha@localhost:5432/imperium
POSTGRES_PRISMA_URL=postgresql://usuario:senha@localhost:5432/imperium
POSTGRES_URL_NON_POOLING=postgresql://usuario:senha@localhost:5432/imperium

# Cloudinary (Mídias)
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_api_secret
```

Variáveis do frontend (`frontend/.env.local` - Opcional):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

Se `NEXT_PUBLIC_API_BASE_URL` não for configurado, o frontend utiliza `http://localhost:3000` como padrão.

## Banco de dados

Gere o cliente Prisma e aplique as migrações:

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
```

Para conferir o status da conexão e migrações aplicadas:

```bash
npx prisma migrate status
```

Popule as contas de teste e imóveis demonstrativos:

```bash
npm run db:seed
```

O seed cria automaticamente as contas de demonstração:

- **Administrador:** `admin@imperium.com` | **Senha:** `admin123`
- **Cliente:** `cliente@imperium.com` | **Senha:** `cliente123`

## Executando

Execução simultânea de frontend e backend em um único terminal na raiz:

```bash
npm run dev
```

Ou em terminais separados:

```bash
# Backend
npm run dev:backend

# Frontend
npm run dev:frontend
```

- Frontend: `http://localhost:3001` (ou `http://localhost:3000`)
- API: `http://localhost:3000`
- Documentação Swagger: `http://localhost:3000/api/docs`

## Endpoints

### Autenticação

| Método | Endpoint         | Acesso  | Descrição                                           |
| ------ | ---------------- | ------- | --------------------------------------------------- |
| `POST` | `/auth/login`    | Público | Autentica administrador ou cliente e retorna o JWT. |
| `POST` | `/auth/clientes` | Público | Cadastro público de conta de cliente.               |

### Imóveis

| Método   | Endpoint                             | Acesso  | Descrição                                                            |
| -------- | ------------------------------------ | ------- | -------------------------------------------------------------------- |
| `GET`    | `/imoveis`                           | Público | Lista e filtra imóveis por finalidade, tipo, preço, cidade e estado. |
| `GET`    | `/imoveis/:id`                       | Público | Consulta detalhes de um imóvel.                                      |
| `POST`   | `/imoveis`                           | Admin   | Cadastra um novo imóvel.                                             |
| `PUT`    | `/imoveis/:id`                       | Admin   | Atualiza um imóvel existente.                                        |
| `DELETE` | `/imoveis/:id`                       | Admin   | Remove um imóvel e suas mídias vinculadas.                           |
| `POST`   | `/imoveis/:id/midias`                | Admin   | Envia mídias para o Cloudinary (`multipart/form-data`).              |
| `DELETE` | `/imoveis/:imovelId/midias/:mediaId` | Admin   | Exclui mídia do imóvel e do Cloudinary.                              |
| `GET`    | `/imoveis/resolver-maps`             | Público | Extrai coordenadas a partir de URL do Google Maps.                   |

### Área do Cliente & Solicitações

| Método   | Endpoint                          | Acesso        | Descrição                                          |
| -------- | --------------------------------- | ------------- | -------------------------------------------------- |
| `GET`    | `/cliente/solicitacoes`           | Cliente       | Lista solicitações do cliente autenticado.         |
| `GET`    | `/cliente/solicitacoes/:id`       | Cliente       | Consulta solicitação específica do cliente.        |
| `POST`   | `/cliente/solicitacoes`           | Cliente       | Cria solicitação de avaliação de imóvel.           |
| `PATCH`  | `/cliente/solicitacoes/:id`       | Cliente       | Atualiza dados da solicitação do próprio cliente.  |
| `DELETE` | `/cliente/solicitacoes/:id`       | Cliente       | Exclui solicitação do próprio cliente.             |
| `POST`   | `/cliente/solicitacoes/:id/foto`  | Cliente/Admin | Envia ou substitui a foto da solicitação.          |
| `GET`    | `/cliente/admin/solicitacoes`     | Admin         | Lista todas as solicitações enviadas por clientes. |
| `GET`    | `/cliente/admin/solicitacoes/:id` | Admin         | Consulta detalhes da solicitação de um cliente.    |
| `PATCH`  | `/cliente/admin/solicitacoes/:id` | Admin         | Atualiza status e/ou dados da solicitação.         |
| `DELETE` | `/cliente/admin/solicitacoes/:id` | Admin         | Exclui solicitação no painel administrativo.       |

### Favoritos

| Método   | Endpoint                       | Acesso  | Descrição                               |
| -------- | ------------------------------ | ------- | --------------------------------------- |
| `GET`    | `/cliente/favoritos`           | Cliente | Lista imóveis favoritados pelo cliente. |
| `POST`   | `/cliente/favoritos/:imovelId` | Cliente | Adiciona imóvel aos favoritos.          |
| `DELETE` | `/cliente/favoritos/:imovelId` | Cliente | Remove imóvel dos favoritos.            |

Nas rotas protegidas, envie o header `Authorization: Bearer <token>`.

## SSR, mapas e validação

- As páginas de anúncios usam Next.js App Router para renderização rápida e metadados SEO;
- O mapa interativo (Leaflet) carrega dinamicamente no cliente (`ssr: false`) evitando falhas na renderização do servidor;
- O backend aplica validação estrita nos DTOs com `class-validator` (`whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`);
- Tratamento centralizado de erros de API no cliente via `parseResponse` em `frontend/src/lib/api.ts`.

## Testes e qualidade

```bash
cd backend
npm test       # Testes unitários de serviços e controllers
npm run test:e2e # Testes de integração E2E de segurança, autenticação e CRUD
npm run build

cd ../frontend
npm run build  # Build, verificação TypeScript e páginas estáticas
```

Os testes E2E validam permissões de acesso, hashing de senhas, criação de imóveis, filtros de busca, validações de DTOs e sanitização de requisições.

## Deploy na Vercel

O monorepo é configurado para publicação como dois projetos Vercel ligados ao mesmo repositório no GitHub:

### Passo 1: Configurar Banco de Dados em Nuvem (PostgreSQL)

1. Crie uma instância PostgreSQL gerenciada no [Supabase](https://supabase.com) ou [Neon](https://neon.tech).
2. Obtenha as strings de conexão pooling e direta:
   - `DATABASE_URL` (Direct Connection / Connection Pooling)
   - `POSTGRES_PRISMA_URL` e `POSTGRES_URL_NON_POOLING`
3. Execute as migrações no banco remoto:
   ```bash
   cd backend
   DATABASE_URL="postgresql://user:pass@host:5432/db" npx prisma migrate deploy
   ```

### Passo 2: Deploy do Backend NestJS na Vercel

1. Acesse o Dashboard da [Vercel](https://vercel.com) e clique em **Add New Project**.
2. Importe o repositório `FabianoPiroli/ImperiumImobiliaria`.
3. Defina o **Root Directory** como `backend`.
4. Em **Environment Variables**, cadastre:
   - `DATABASE_URL` = string de conexão do PostgreSQL
   - `POSTGRES_PRISMA_URL` = string de conexão do PostgreSQL
   - `JWT_SECRET` = chave secreta para tokens JWT
   - `FRONTEND_URL` = URL do frontend na Vercel (ex: `https://imperium-imobiliaria.vercel.app`)
   - `CLOUDINARY_CLOUD_NAME` = nome do seu cloud no Cloudinary
   - `CLOUDINARY_API_KEY` = chave da API Cloudinary
   - `CLOUDINARY_API_SECRET` = segredo da API Cloudinary
   - `NODE_ENV` = `production`
5. Clique em **Deploy**. A API estará disponível na URL atribuída (ex: `https://imperium-backend.vercel.app`).

### Passo 3: Deploy do Frontend Next.js na Vercel

1. No Dashboard da Vercel, clique novamente em **Add New Project**.
2. Importe o mesmo repositório `FabianoPiroli/ImperiumImobiliaria`.
3. Defina o **Root Directory** como `frontend`.
4. Framework Preset: **Next.js**.
5. Em **Environment Variables**, cadastre:
   - `NEXT_PUBLIC_API_BASE_URL` = URL pública do Backend implantado no Passo 2 (ex: `https://imperium-backend.vercel.app`).
6. Clique em **Deploy**.
7. Após a conclusão, copie a URL gerada para o frontend e atualize a variável `FRONTEND_URL` no projeto do backend para liberar o CORS.

## Segurança

- Senhas armazenadas com hash bcrypt (custo 10);
- JWT para controle de acesso às rotas protegidas;
- DTOs rejeitam estritamente propriedades não mapeadas (`forbidNonWhitelisted: true`);
- Headers de segurança Helmet ativados no backend;
- Limite de requisições por IP com `@nestjs/throttler`;
- CORS restrito às origens configuradas em `FRONTEND_URL`;
- Consultas ao PostgreSQL parametrizadas nativamente pelo Prisma ORM contra SQL Injection;
- Filtro global `AllExceptionsFilter` oculta stack traces sensíveis em produção;
- Arquivos `.env` mantidos fora do versionamento via `.gitignore`.

## Próximos passos

Micro-backlog de evolução do MVP:

1. **Notificações por E-mail:** Envio de e-mails transacionais (via Resend ou Nodemailer) para alertar o cliente quando sua solicitação de imóvel for avaliada ou aprovada pela equipe.
2. **Filtros Avançados de Busca:** Seleção por quantidade de quartos, suítes, banheiros e vagas de garagem diretamente no painel de busca da página inicial e catálogo público.
3. **Agendamento de Visitas:** Formulário interativo na página de detalhe do imóvel (`/anuncio/:id`) para que clientes interessados agendem visita presencial com os corretores.
4. **Pipeline de CI/CD:** Automação de testes de integração (`npm test`, `npm run test:e2e`), verificação TypeScript e build no GitHub Actions a cada Pull Request ou push na branch `main`.

## Evolução do projeto

O Imperium Imobiliária foi construído através de um ciclo contínuo de evolução de software:

- **Estrutura Base e Autenticação:** Implementação do esqueleto do projeto em NestJS e Next.js com banco PostgreSQL via Prisma, autenticação de administradores com JWT e hashing bcrypt.
- **Catálogo de Imóveis e Mídias:** Desenvolvimento do CRUD de imóveis com suporte a diferentes tipos e finalidades (venda/locação), upload de imagens e vídeos no Cloudinary e gerador de código único de anúncio.
- **Integração com Mapas:** Adição de mapas interativos com Leaflet, cálculo de latitude/longitude e funcionalidade de área aproximada para preservar a privacidade do proprietário.
- **Área do Cliente e Solicitações:** Criação do portal do cliente com fluxo de envio de solicitações de avaliação de imóveis, upload de foto da fachada e área de acompanhamento de status.
- **Painel Administrativo de Avaliações:** Expansão das rotas administrativas para permitir que a equipe avalie, edite e aprove ou recuse as solicitações enviadas pelos clientes.
- **Gestão de Favoritos:** Funcionalidade de favoritar anúncios no catálogo público com persistência no banco de dados e listagem dedicada na conta do cliente.
- **Design System & Acessibilidade:** Padronização da interface visual com suporte nativo a temas Claro e Escuro, animação fluida de componentes dropdown, rotação de chevrons SVG nos menus e setas de navegação do carrossel (`ChevronLeft` / `ChevronRight`).

---

