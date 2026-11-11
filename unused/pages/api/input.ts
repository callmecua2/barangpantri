// import type { NextApiResponse } from 'next'
// import prisma from '@/lib/prisma'
// import { withUser } from '@/lib/auth'
// import type { AuthedNextApiRequest } from '@/types/api'

// interface BarangInput {
//     nama: string
//     stok?: number
// }

// async function handler(req: AuthedNextApiRequest, res: NextApiResponse) {
//     if (req.method !== 'POST') {
//         res.setHeader('Allow', ['POST'])
//         return res.status(405).json({ message: `Method ${req.method} tidak diizinkan` })
//     }

//     try {
//         const { nama, stok } = (req.body ?? {}) as BarangInput
//         const userId = req.user!.id

//         if (!nama) return res.status(400).json({ message: 'Nama barang wajib diisi' })

//         const stokAwal = stok ?? 0
//         if (!Number.isInteger(stokAwal) || stokAwal < 0) {
//             return res.status(400).json({ message: 'Stok harus bilangan bulat >= 0' })
//         }

//         await prisma.$transaction(async (tx) => {
//             const barang = await tx.barang.create({
//                 data: { nama, stok: stokAwal, inputOlehId: userId },
//             })

//             if (stokAwal > 0) {
//                 await tx.stockMovement.create({
//                     data: {
//                         idBarang: barang.id,
//                         tipe: 'INISIALISASI',
//                         jumlah: stokAwal,
//                         stokSebelum: 0,
//                         stokSesudah: stokAwal,
//                         penanggungJawabId: userId,
//                     },
//                 })
//             }
//         })

//         return res.status(200).json({ message: 'Berhasil input barang' })
//     } catch (error) {
//         console.error('Error /input:', error)
//         return res.status(500).json({ message: 'Internal server error' })
//     }
// }

// export default withUser(handler)