/*
  Warnings:

  - You are about to drop the `DataStockUpdate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RiwayatUpdateStok` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `stok` on table `Barang` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "DataStockUpdate" DROP CONSTRAINT "DataStockUpdate_idBarang_fkey";

-- DropForeignKey
ALTER TABLE "DataStockUpdate" DROP CONSTRAINT "DataStockUpdate_penanggungJawabId_fkey";

-- DropForeignKey
ALTER TABLE "RiwayatUpdateStok" DROP CONSTRAINT "RiwayatUpdateStok_updateId_fkey";

-- AlterTable
ALTER TABLE "Barang" ALTER COLUMN "stok" SET NOT NULL,
ALTER COLUMN "stok" SET DEFAULT 0;

-- DropTable
DROP TABLE "DataStockUpdate";

-- DropTable
DROP TABLE "RiwayatUpdateStok";

-- DropEnum
DROP TYPE "keterangan";

-- CreateTable
CREATE TABLE "StockMovement" (
    "id" TEXT NOT NULL,
    "idBarang" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "stokSebelum" INTEGER NOT NULL,
    "stokSesudah" INTEGER NOT NULL,
    "penanggungJawabId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StockMovement_idBarang_tanggal_idx" ON "StockMovement"("idBarang", "tanggal");

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_idBarang_fkey" FOREIGN KEY ("idBarang") REFERENCES "Barang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_penanggungJawabId_fkey" FOREIGN KEY ("penanggungJawabId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
