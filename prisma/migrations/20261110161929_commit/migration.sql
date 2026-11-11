-- CreateTable
CREATE TABLE "Test" (
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Test_name_key" ON "Test"("name");
