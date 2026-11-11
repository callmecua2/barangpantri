import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.stockMovement.findMany({
      orderBy: { tanggal: 'desc' },
      include: {
        barang: { select: { nama: true, stok: true } },
        penanggungJawab: { select: { nama: true } },
      },
    });

    return NextResponse.json(
      {
        message: data.length < 1 ? 'Belum ada data' : 'Berhasil',
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error /api/history:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}