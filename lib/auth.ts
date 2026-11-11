// lib/auth.ts
import { cookies } from 'next/headers';
import prisma from './prisma';

export const COOKIE_NAME = 'userId';
export const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 hari (dalam detik untuk Next.js cookie)

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(COOKIE_NAME)?.value;

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return null;
  }

  return { id: user.id, nama: user.nama };
}