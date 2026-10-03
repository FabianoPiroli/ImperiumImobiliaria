ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'admin';

CREATE TABLE "Favorite" (
  "id" SERIAL NOT NULL,
  "userId" INTEGER NOT NULL,
  "imovelId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PropertyRequest" (
  "id" SERIAL NOT NULL,
  "userId" INTEGER NOT NULL,
  "titulo" TEXT NOT NULL,
  "tipo" TEXT NOT NULL,
  "finalidade" TEXT NOT NULL DEFAULT 'venda',
  "cidade" TEXT NOT NULL,
  "bairro" TEXT NOT NULL DEFAULT '',
  "preco" DOUBLE PRECISION,
  "descricao" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pendente',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PropertyRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Favorite_userId_imovelId_key" ON "Favorite"("userId", "imovelId");
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");
CREATE INDEX "Favorite_imovelId_idx" ON "Favorite"("imovelId");
CREATE INDEX "PropertyRequest_userId_idx" ON "PropertyRequest"("userId");
CREATE INDEX "PropertyRequest_status_idx" ON "PropertyRequest"("status");
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PropertyRequest" ADD CONSTRAINT "PropertyRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;