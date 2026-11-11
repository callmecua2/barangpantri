import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { COOKIE_NAME, COOKIE_MAX_AGE } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { nama } = await req.json();

    if (!nama || typeof nama !== 'string' || nama.trim() === '') {
      return NextResponse.json({ message: 'Nama wajib diisi' }, { status: 400 });
    }

    const trimmedNama = nama.trim();

    const user = await prisma.user.findFirst({ where: { nama: trimmedNama } });
    if (!user) {
      return NextResponse.json(
        { message: 'Nama tidak terdaftar. Hubungi admin untuk didaftarkan.' },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, user.id, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_NODE_ENV === 'production',
      path: '/',
    });

    return NextResponse.json(
      {
        message: 'Login berhasil',
        data: { id: user.id, nama: user.nama },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error /api/login:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}