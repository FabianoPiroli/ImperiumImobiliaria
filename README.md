# Imperium Imobiliária

Sistema completo de gestão e catálogo de imóveis (Frontend em Next.js e Backend em NestJS com Prisma e PostgreSQL).

---

## 🚀 Como rodar em uma máquina nova (Primeira execução)

Após clonar o repositório, execute na **raiz** do projeto:

```bash
npm run setup
```

Esse comando irá automaticamente:
1. Instalar todas as dependências do `backend`.
2. Gerar o cliente do Prisma (`prisma generate`).
3. Instalar todas as dependências do `frontend`.

---

## 💻 Comandos disponíveis na raiz

| Comando | Descrição |
| --- | --- |
| `npm run setup` | Instala dependências do backend e frontend de uma só vez |
| `npm run dev:backend` | Inicia o backend em modo de desenvolvimento |
| `npm run dev:frontend` | Inicia o frontend em modo de desenvolvimento |
| `npm run build` | Compila o backend e o frontend |