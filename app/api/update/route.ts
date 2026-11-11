import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

interface UpdateInput {
  id: string;
  jumlah: number;
  keterangan: string;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ message: 'Silakan login dulu' }, { status: 401 });
    }

    const body: UpdateInput = await req.json();
    const { id, jumlah, keterangan } = body;

    if (!id || !jumlah || !keterangan) {
      return NextResponse.json({ message: 'Input tidak lengkap' }, { status: 400 });
    }
    if (keterangan !== 'PEMAKAIAN' && keterangan !== 'RESTOCK') {
      return NextResponse.json(
        { message: "Keterangan harus 'PEMAKAIAN' atau 'RESTOCK'" },
        { status: 400 }
      );
    }

    const jumlahInt = Number(jumlah);
    if (!Number.isInteger(jumlahInt) || jumlahInt <= 0) {
      return NextResponse.json({ message: 'Jumlah harus bilangan bulat > 0' }, { status: 400 });
    }

    const signedAmount = keterangan === 'PEMAKAIAN' ? -jumlahInt : jumlahInt;

    const barang = await prisma.barang.findUnique({ where: { id } });
    if (!barang) {
      return NextResponse.json({ message: 'Barang tidak ditemukan' }, { status: 404 });
    }

    const stokSebelum = barang.stok;
    const stokSesudah = stokSebelum + signedAmount;

    if (stokSesudah < 0) {
      return NextResponse.json(
        { message: `Stok tidak cukup. Stok saat ini: ${stokSebelum}, diminta: ${jumlahInt}` },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.barang.update({
        where: { id },
        data: { stok: stokSesudah },
      });

      await tx.stockMovement.create({
        data: {
          idBarang: id,
          tipe: keterangan,
          jumlah: jumlahInt,
          stokSebelum,
          stokSesudah,
          penanggungJawabId: user.id,
        },
      });
    });

    return NextResponse.json(
      {
        message: 'Berhasil update stok',
        data: { stokSebelum, stokSesudah },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error /api/update:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}