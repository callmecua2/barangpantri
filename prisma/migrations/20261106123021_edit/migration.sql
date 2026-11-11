/*
  Warnings:

  - You are about to drop the column `jumlahStokTerakhir` on the `Barang` table. All the data in the column will be lost.
  - You are about to drop the column `jumlahUpdate` on the `Barang` table. All the data in the column will be lost.
  - You are about to drop the column `keterangan` on the `Barang` table. All the data in the column will be lost.
  - You are about to drop the column `penanggungJawab` on the `Barang` table. All the data in the column will be lost.
  - You are about to drop the column `tanggalUpdate` on the `Barang` table. All the data in the column will be lost.
  - You are about to drop the column `tanggalUpdateTerakhir` on the `Barang` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "keterangan" AS ENUM ('Pemakaian', 'Restock');

-- AlterTable
ALTER TABLE "Barang" DROP COLUMN "jumlahStokTerakhir",
DROP COLUMN "jumlahUpdate",
DROP COLUMN "keterangan",
DROP COLUMN "penanggungJawab",
DROP COLUMN "tanggalUpdate",
DROP COLUMN "tanggalUpdateTerakhir";

-- CreateTable
CREATE TABLE "DataStockUpdate" (
    "id" TEXT NOT NULL,
    "idBarang" TEXT NOT NULL,
    "jumlahUpdate" INTEGER,
    "tanggalUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "keterangan" TEXT NOT NULL,
    "penanggungJawabId" TEXT NOT NULL,
    "jumlahStokTerakhir" INTEGER,
    "tanggalUpdateTerakhir" TIMESTAMP(3),

    CONSTRAINT "DataStockUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiwayatUpdateStok" (
    "id" TEXT NOT NULL,
    "updateId" TEXT NOT NULL,

    CONSTRAINT "RiwayatUpdateStok_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DataStockUpdate" ADD CONSTRAINT "DataStockUpdate_idBarang_fkey" FOREIGN KEY ("idBarang") REFERENCES "Barang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataStockUpdate" ADD CONSTRAINT "DataStockUpdate_penanggungJawabId_fkey" FOREIGN KEY ("penanggungJawabId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatUpdateStok" ADD CONSTRAINT "RiwayatUpdateStok_updateId_fkey" FOREIGN KEY ("updateId") REFERENCES "DataStockUpdate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
