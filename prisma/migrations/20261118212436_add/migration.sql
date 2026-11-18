/*
  Warnings:

  - A unique constraint covering the columns `[nama]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_nama_key" ON "User"("nama");
