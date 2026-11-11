/*
  Warnings:

  - Added the required column `inputOlehId` to the `Barang` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Barang" ADD COLUMN     "inputOlehId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Barang" ADD CONSTRAINT "Barang_inputOlehId_fkey" FOREIGN KEY ("inputOlehId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
