/*
  Warnings:

  - You are about to alter the column `stok` on the `Barang` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `jumlah` on the `StockMovement` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `stokSebelum` on the `StockMovement` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `stokSesudah` on the `StockMovement` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Barang" ALTER COLUMN "stok" SET DEFAULT 0,
ALTER COLUMN "stok" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "StockMovement" ALTER COLUMN "jumlah" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "stokSebelum" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "stokSesudah" SET DATA TYPE DECIMAL(10,2);

-- DropTable
DROP TABLE "Test";
