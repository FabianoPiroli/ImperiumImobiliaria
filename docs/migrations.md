# Migrations do banco

As migrations do banco da Imperium Imobiliária ficam versionadas em `backend/prisma/migrations` e são aplicadas pelo Prisma.

## Migrations versionadas

1. `20260907194301_init`
2. `20260907202653_auth_media`
3. `20260907204327_finalidade_anuncio`
4. `20260907205324_localizacao_imovel`
5. `20260907210437_codigo_vagas_garagem`
6. `20260907230640_cloudinary_media_metadata`

## Comprovante de verificação

Em 29/09/2026, a verificação foi executada com Prisma 5.15.0 a partir do diretório `backend`:

```text
6 migrations found in prisma/migrations
Database schema is up to date!
```

O resultado confirma que, para o banco configurado no ambiente local durante a verificação, as seis migrations versionadas estavam aplicadas.

## Comandos

Verificar o estado do banco:

```bash
cd backend
npx prisma migrate status
```

Aplicar migrations pendentes em produção ou CI:

```bash
npx prisma migrate deploy
```

Criar uma nova migration durante o desenvolvimento:

```bash
npx prisma migrate dev --name nome_da_migration
```

Este documento não contém URLs de conexão, senhas ou outros segredos.
