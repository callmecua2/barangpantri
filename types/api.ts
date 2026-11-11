import type { NextApiRequest } from 'next'

export interface AuthedNextApiRequest extends NextApiRequest {
    user?: { id: string; nama: string }
}