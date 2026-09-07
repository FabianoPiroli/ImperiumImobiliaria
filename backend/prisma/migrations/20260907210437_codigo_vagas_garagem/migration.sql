/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `Imovel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Imovel" ADD COLUMN     "codigo" SERIAL NOT NULL,
ADD COLUMN     "vagasGaragem" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Imovel_codigo_key" ON "Imovel"("codigo");
