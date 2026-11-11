import { type SerializeOptions } from 'cookie'

export const COOKIE_NAME = 'userId'
export const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 hari

const BASE: SerializeOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
}

// Cookie serialize pakai detik, bukan ms
export const COOKIE_LOGIN_OPTIONS: SerializeOptions = {
    ...BASE,
    maxAge: COOKIE_MAX_AGE_MS / 1000,
}

export const COOKIE_CLEAR_OPTIONS: SerializeOptions = {
    ...BASE,
    maxAge: 0,
}