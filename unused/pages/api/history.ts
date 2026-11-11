import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET'])
        return res.status(405).json({ message: `Method ${req.method} tidak diizinkan` })
    }

    try {
        const data = await prisma.stockMovement.findMany({
            orderBy: { tanggal: 'desc' },
            include: {
                barang: { select: { nama: true, stok: true } },
                penanggungJawab: { select: { nama: true } },
            },
        })

        return res.status(200).json({
            message: data.length < 1 ? 'Belum ada data' : 'Berhasil',
            data,
        })
    } catch (error) {
        console.error('Error /history:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}