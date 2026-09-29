# Imperium Imobiliária - Frontend

Interface web do catálogo e da gestão de imóveis, construída com Next.js, React e TypeScript.

## Recursos

- Catálogo público de imóveis;
- Páginas separadas para compra, locação e detalhes do anúncio;
- Busca e filtros de imóveis;
- Cadastro e edição de imóveis para usuários autenticados;
- Login administrativo;
- Upload e gerenciamento de mídias;
- Visualização de localização em mapa;
- Layout responsivo.

## Tecnologias

- Next.js 16 com App Router;
- React 19;
- TypeScript;
- Leaflet;
- Lucide React;
- ESLint.

## Instalação

```bash
npm install
```

Opcionalmente, configure a URL da API em `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

Sem essa variável, o frontend usa `http://localhost:3000` como fallback.

## Execução

```bash
npm run dev
```

O frontend ficará disponível em `http://localhost:3001`.

## Estrutura

```text
frontend/
├── app/
│   ├── comprar/              # Catálogo de imóveis à venda
│   ├── alugar/               # Catálogo de imóveis para locação
│   ├── anuncio/[id]/         # Página pública do anúncio
│   ├── imoveis/              # Gestão de imóveis
│   ├── login/                # Autenticação
│   ├── contato/              # Contato
│   └── sobre/                # Informações institucionais
└── src/
    ├── components/           # Componentes reutilizáveis
    └── lib/                  # API e utilitários
```

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento na porta `3001` |
| `npm run build` | Build de produção e verificação TypeScript |
| `npm run start` | Inicia o build de produção |
| `npm run lint` | Executa ESLint |

## Integração com a API

A comunicação com o backend está centralizada em `src/lib/api.ts`. O token de autenticação é enviado como Bearer Token nas operações protegidas. A API padrão é `http://localhost:3000`; em outros ambientes, configure `NEXT_PUBLIC_API_BASE_URL`.

## Build

```bash
npm run lint
npm run build
npm run start
```

O frontend pode ser publicado como um projeto Next.js separado na Vercel, apontando `NEXT_PUBLIC_API_BASE_URL` para a API publicada.
