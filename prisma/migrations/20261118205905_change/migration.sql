/*
  Warnings:

  - You are about to alter the column `stok` on the `Barang` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `jumlah` on the `StockMovement` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `stokSebelum` on the `StockMovement` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `stokSesudah` on the `StockMovement` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Barang" ALTER COLUMN "stok" DROP DEFAULT,
ALTER COLUMN "stok" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "StockMovement" ALTER COLUMN "jumlah" SET DATA TYPE INTEGER,
ALTER COLUMN "stokSebelum" SET DATA TYPE INTEGER,
ALTER COLUMN "stokSesudah" SET DATA TYPE INTEGER;
