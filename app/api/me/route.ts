import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAuthenticatedUser, COOKIE_NAME } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      const cookieStore = await cookies();
      cookieStore.delete(COOKIE_NAME);
      return NextResponse.json({ message: 'Belum login atau sesi tidak valid' }, { status: 401 });
    }

    return NextResponse.json({ data: { id: user.id, nama: user.nama } }, { status: 200 });
  } catch (error) {
    console.error('Error /api/me:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}