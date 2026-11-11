import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: 'ID barang wajib diisi' }, { status: 400 });
    }

    const barang = await prisma.barang.findUnique({ where: { id } });
    if (!barang) {
      return NextResponse.json({ message: 'Barang tidak ditemukan' }, { status: 404 });
    }

    const movements = await prisma.stockMovement.findMany({
      where: { idBarang: id },
      orderBy: { tanggal: 'desc' },
      include: { penanggungJawab: { select: { nama: true } } },
    });

    return NextResponse.json(
      {
        message: 'Berhasil',
        data: {
          barang: { id: barang.id, nama: barang.nama, stok: barang.stok },
          movements,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error /api/stock/[id]/history:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}