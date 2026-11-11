import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { nama } = await req.json();

    if (!nama || typeof nama !== 'string' || nama.trim() === '') {
      return NextResponse.json({ message: 'Nama wajib diisi' }, { status: 400 });
    }

    const trimmedNama = nama.trim();

    const existing = await prisma.user.findFirst({ where: { nama: trimmedNama } });
    if (existing) {
      return NextResponse.json(
        {
          message: 'User dengan nama tersebut sudah ada',
          data: { id: existing.id, nama: existing.nama },
        },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({ data: { nama: trimmedNama } });

    return NextResponse.json(
      {
        message: 'User berhasil dibuat',
        data: { id: user.id, nama: user.nama },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error /api/users:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}