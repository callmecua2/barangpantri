import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

interface BarangInput {
  nama: string;
  stok?: number;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ message: 'Silakan login dulu' }, { status: 401 });
    }

    const body: BarangInput = await req.json();
    const { nama, stok } = body;

    if (!nama) {
      return NextResponse.json({ message: 'Nama barang wajib diisi' }, { status: 400 });
    }

    const stokAwal = stok ?? 0;
    if (!Number.isInteger(stokAwal) || stokAwal < 0) {
      return NextResponse.json({ message: 'Stok harus bilangan bulat >= 0' }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      const barang = await tx.barang.create({
        data: { nama, stok: stokAwal, inputOlehId: user.id },
      });

      if (stokAwal > 0) {
        await tx.stockMovement.create({
          data: {
            idBarang: barang.id,
            tipe: 'INISIALISASI',
            jumlah: stokAwal,
            stokSebelum: 0,
            stokSesudah: stokAwal,
            penanggungJawabId: user.id,
          },
        });
      }
    });

    return NextResponse.json({ message: 'Berhasil input barang' }, { status: 200 });
  } catch (error) {
    console.error('Error /api/input:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}