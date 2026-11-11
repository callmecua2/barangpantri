-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Barang" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "stok" INTEGER,
    "jumlahUpdate" INTEGER,
    "tanggalUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "keterangan" TEXT,
    "penanggungJawab" TEXT,
    "jumlahStokTerakhir" INTEGER,
    "tanggalUpdateTerakhir" TIMESTAMP(3),

    CONSTRAINT "Barang_pkey" PRIMARY KEY ("id")
);
