-- CreateTable
CREATE TABLE "Imovel" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'disponivel',
    "quartos" INTEGER NOT NULL,
    "banheiros" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Imovel_pkey" PRIMARY KEY ("id")
);
