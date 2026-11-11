import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET'])
        return res.status(405).json({ message: `Method ${req.method} tidak diizinkan` })
    }

    try {
        const { id } = req.query
        if (typeof id !== 'string' || !id) {
            return res.status(400).json({ message: 'ID barang wajib diisi' })
        }

        const barang = await prisma.barang.findUnique({ where: { id } })
        if (!barang) return res.status(404).json({ message: 'Barang tidak ditemukan' })

        const movements = await prisma.stockMovement.findMany({
            where: { idBarang: id },
            orderBy: { tanggal: 'desc' },
            include: { penanggungJawab: { select: { nama: true } } },
        })

        return res.status(200).json({
            message: 'Berhasil',
            data: {
                barang: { id: barang.id, nama: barang.nama, stok: barang.stok },
                movements,
            },
        })
    } catch (error) {
        console.error('Error /stock/:id/history:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}