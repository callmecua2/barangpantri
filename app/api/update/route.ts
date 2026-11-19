import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PENANGGUNG_JAWAB, PenanggungJawab } from "@/constants/staff";

interface UpdateInput {
  idBarang: string;
  jumlah: number;
  keterangan: "PEMAKAIAN" | "RESTOCK";
  penanggungJawab: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: UpdateInput = await req.json();
    const { idBarang, jumlah, keterangan, penanggungJawab } = body;

    if (!idBarang || jumlah === undefined || !keterangan || !penanggungJawab) {
      return NextResponse.json({ message: "Input tidak lengkap" }, { status: 400 });
    }

    if (keterangan !== "PEMAKAIAN" && keterangan !== "RESTOCK") {
      return NextResponse.json({ message: "Keterangan harus 'PEMAKAIAN' atau 'RESTOCK'" }, { status: 400 });
    }

    if (!PENANGGUNG_JAWAB.includes(penanggungJawab as PenanggungJawab)) {
      return NextResponse.json({ message: "Penanggung jawab tidak valid" }, { status: 400 });
    }

    const jumlahInt = Number(jumlah);
    if (!Number.isInteger(jumlahInt) || jumlahInt <= 0) {
      return NextResponse.json({ message: "Jumlah harus bilangan bulat lebih dari 0" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const barang = await tx.barang.findUnique({ where: { id: idBarang } });
      if (!barang) {
        throw new Error("NOT_FOUND");
      }

      const stokSebelum = barang.stok;
      const stokSesudah = stokSebelum + (keterangan === "PEMAKAIAN" ? -jumlahInt : jumlahInt);

      if (stokSesudah < 0) {
        throw new Error(`INSUFFICIENT_STOCK:${stokSebelum}:${jumlahInt}`);
      }

      const user = await tx.user.upsert({
        where: { nama: penanggungJawab },
        update: {},
        create: { nama: penanggungJawab },
      });

      await tx.barang.update({
        where: { id: idBarang },
        data: { stok: stokSesudah },
      });

      await tx.stockMovement.create({
        data: {
          idBarang,
          tipe: keterangan,
          jumlah: jumlahInt,
          stokSebelum,
          stokSesudah,
          penanggungJawabId: user.id,
        },
      });

      return { stokSebelum, stokSesudah };
    });

    return NextResponse.json(
      { message: "Berhasil update stok", data: result },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "NOT_FOUND") {
        return NextResponse.json({ message: "Barang tidak ditemukan" }, { status: 404 });
      }
      if (error.message.startsWith("INSUFFICIENT_STOCK:")) {
        const [, stokSebelum, diminta] = error.message.split(":");
        return NextResponse.json(
          { message: `Stok tidak cukup. Stok saat ini: ${stokSebelum}, diminta: ${diminta}` },
          { status: 400 }
        );
      }
    }
    console.error("Error /api/update:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}