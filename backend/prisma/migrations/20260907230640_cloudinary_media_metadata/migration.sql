-- AlterTable
ALTER TABLE "Midia" ADD COLUMN     "publicId" TEXT,
ADD COLUMN     "resourceType" TEXT NOT NULL DEFAULT 'image';
