import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET'])
        return res.status(405).json({ message: `Method ${req.method} tidak diizinkan` })
    }

    try {
        const barangs = await prisma.barang.findMany({
            orderBy: { nama: 'asc' },
            include: {
                movements: {
                    orderBy: { tanggal: 'desc' },
                    take: 1,
                    include: { penanggungJawab: { select: { nama: true } } },
                },
            },
        })

        const data = barangs.map((b) => {
            const last = b.movements[0]
            return {
                id: b.id,
                nama: b.nama,
                stok: b.stok,
                updateTerakhir: last
                    ? {
                          tipe: last.tipe,
                          jumlah: last.jumlah,
                          stokSebelum: last.stokSebelum,
                          stokSesudah: last.stokSesudah,
                          tanggal: last.tanggal,
                          penanggungJawab: last.penanggungJawab.nama,
                      }
                    : null,
            }
        })

        return res.status(200).json({ message: 'Berhasil', data })
    } catch (error) {
        console.error('Error /stock:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}