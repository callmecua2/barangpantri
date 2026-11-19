// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// const PENANGGUNG_JAWAB = [
//   "kasir", "sherly", "rahma", "febi", "tari", "keyla",
//   "heni", "via", "siti", "dimas", "hendri", "josua",
// ];

// interface UpdateInput {
//   id: string;
//   jumlah: number;
//   keterangan: string;
//   penanggungJawab: string;
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body: UpdateInput = await req.json();
//     const { id, jumlah, keterangan, penanggungJawab } = body;

//     if (!id || jumlah === undefined || !keterangan || !penanggungJawab) {
//       return NextResponse.json({ message: "Input tidak lengkap" }, { status: 400 });
//     }
//     if (keterangan !== "PEMAKAIAN" && keterangan !== "RESTOCK") {
//       return NextResponse.json({ message: "Keterangan harus 'PEMAKAIAN' atau 'RESTOCK'" }, { status: 400 });
//     }
//     if (!PENANGGUNG_JAWAB.includes(penanggungJawab)) {
//       return NextResponse.json({ message: "Penanggung jawab tidak valid" }, { status: 400 });
//     }

//     const jumlahInt = Number(jumlah);
//     if (!Number.isInteger(jumlahInt) || jumlahInt <= 0) {
//       return NextResponse.json({ message: "Jumlah harus bilangan bulat > 0" }, { status: 400 });
//     }

//     const barang = await prisma.barang.findUnique({ where: { id } });
//     if (!barang) return NextResponse.json({ message: "Barang tidak ditemukan" }, { status: 404 });

//     const stokSebelum = barang.stok;
//     const stokSesudah = stokSebelum + (keterangan === "PEMAKAIAN" ? -jumlahInt : jumlahInt);
//     if (stokSesudah < 0) {
//       return NextResponse.json({ message: `Stok tidak cukup. Stok saat ini: ${stokSebelum}, diminta: ${jumlahInt}` }, { status: 400 });
//     }

//     await prisma.$transaction(async (tx) => {
//       const user = await tx.user.findFirst({ where: { nama: penanggungJawab } })
//         ?? await tx.user.create({ data: { nama: penanggungJawab } });

//       await tx.barang.update({ where: { id }, data: { stok: stokSesudah } });
//       await tx.stockMovement.create({
//         data: {
//           idBarang: id,
//           tipe: keterangan,
//           jumlah: jumlahInt,
//           stokSebelum,
//           stokSesudah,
//           penanggungJawabId: user.id,
//         },
//       });
//     });

//     return NextResponse.json({ message: "Berhasil update stok", data: { stokSebelum, stokSesudah } }, { status: 200 });
//   } catch (error) {
//     console.error("Error /api/update:", error);
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//   }
// }


// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { Prisma } from "@/generated/prisma/client";

// const PENANGGUNG_JAWAB = [
//   "kasir", "sherly", "rahma", "febi", "tari", "keyla",
//   "heni", "via", "siti", "dimas", "hendri", "josua",
// ];

// interface UpdateInput {
//   id: string;
//   jumlah: number;
//   keterangan: string;
//   penanggungJawab: string;
//   tanggal?: string; // Opsional format YYYY-MM-DD dari form
// }

// function resolveTanggalTransaksi(tanggalStr?: string): Date {
//   if (!tanggalStr) return new Date();

//   const now = new Date();
//   const todayLocal = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

//   // Jika tanggal yang dipilih hari ini, pakai timestamp saat ini agar urutan jamnya akurat
//   if (tanggalStr === todayLocal) return now;

//   // Jika tanggal mundur (backdate), set ke jam 12:00 WIB agar tidak bergeser hari karena timezone
//   return new Date(`${tanggalStr}T12:00:00+07:00`);
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body: UpdateInput = await req.json();
//     const { id, jumlah, keterangan, penanggungJawab, tanggal } = body;

//     if (!id || jumlah === undefined || !keterangan || !penanggungJawab) {
//       return NextResponse.json({ message: "Input tidak lengkap" }, { status: 400 });
//     }
//     if (keterangan !== "PEMAKAIAN" && keterangan !== "RESTOCK") {
//       return NextResponse.json({ message: "Keterangan harus 'PEMAKAIAN' atau 'RESTOCK'" }, { status: 400 });
//     }
//     if (!PENANGGUNG_JAWAB.includes(penanggungJawab)) {
//       return NextResponse.json({ message: "Penanggung jawab tidak valid" }, { status: 400 });
//     }

//     const jumlahNum = Number(jumlah);
//     if (!Number.isFinite(jumlahNum) || jumlahNum <= 0) {
//       return NextResponse.json({ message: "Jumlah harus angka lebih dari 0" }, { status: 400 });
//     }

//     const jumlahDecimal = new Prisma.Decimal(jumlahNum);

//     const barang = await prisma.barang.findUnique({ where: { id } });
//     if (!barang) {
//       return NextResponse.json({ message: "Barang tidak ditemukan" }, { status: 404 });
//     }

//     const stokSebelum = barang.stok;
//     const stokSesudah =
//       keterangan === "PEMAKAIAN"
//         ? stokSebelum.minus(jumlahDecimal)
//         : stokSebelum.plus(jumlahDecimal);

//     if (stokSesudah.lt(0)) {
//       return NextResponse.json(
//         { message: `Stok tidak cukup. Stok saat ini: ${stokSebelum.toNumber()}, diminta: ${jumlahNum}` },
//         { status: 400 }
//       );
//     }

//     const tanggalTransaksi = resolveTanggalTransaksi(tanggal);

//     await prisma.$transaction(async (tx) => {
//       const user =
//         (await tx.user.findFirst({ where: { nama: penanggungJawab } })) ??
//         (await tx.user.create({ data: { nama: penanggungJawab } }));

//       await tx.barang.update({
//         where: { id },
//         data: { stok: stokSesudah },
//       });

//       await tx.stockMovement.create({
//         data: {
//           idBarang: id,
//           tipe: keterangan,
//           jumlah: jumlahDecimal,
//           stokSebelum,
//           stokSesudah,
//           penanggungJawabId: user.id,
//           tanggal: tanggalTransaksi,
//         },
//       });
//     });

//     return NextResponse.json(
//       {
//         message: "Berhasil update stok",
//         data: {
//           stokSebelum: stokSebelum.toNumber(),
//           stokSesudah: stokSesudah.toNumber(),
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error /api/update:", error);
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//   }
// }







import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PENANGGUNG_JAWAB, PenanggungJawab } from "@/constants/staff";

interface UpdateInput {
  idBarang: string;
  jumlah: number;
  keterangan: "PEMAKAIAN" | "RESTOCK";
  penanggungJawab: string;
  tanggal: string; // Format YYYY-MM-DD dari frontend
}

export async function POST(req: NextRequest) {
  try {
    const body: UpdateInput = await req.json();
    const { idBarang, jumlah, keterangan, penanggungJawab, tanggal } = body;

    if (!idBarang || jumlah === undefined || !keterangan || !penanggungJawab || !tanggal) {
      return NextResponse.json({ message: "Input tidak lengkap" }, { status: 400 });
    }

    if (keterangan !== "PEMAKAIAN" && keterangan !== "RESTOCK") {
      return NextResponse.json({ message: "Keterangan harus 'PEMAKAIAN' atau 'RESTOCK'" }, { status: 400 });
    }

    if (!PENANGGUNG_JAWAB.includes(penanggungJawab as PenanggungJawab)) {
      return NextResponse.json({ message: "Penanggung jawab tidak valid" }, { status: 400 });
    }

    const jumlahInt = Number(jumlah);
    if (!Number.isInteger(jumlahInt) || jumlahInt <= 0) {
      return NextResponse.json({ message: "Jumlah harus bilangan bulat lebih dari 0" }, { status: 400 });
    }

    // Validasi dan parsing tanggal dari frontend
    const parsedTanggal = new Date(tanggal);
    if (isNaN(parsedTanggal.getTime())) {
      return NextResponse.json({ message: "Format tanggal tidak valid" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const barang = await tx.barang.findUnique({ where: { id: idBarang } });
      if (!barang) {
        throw new Error("NOT_FOUND");
      }

      const stokSebelum = barang.stok;
      const stokSesudah = stokSebelum + (keterangan === "PEMAKAIAN" ? -jumlahInt : jumlahInt);

      if (stokSesudah < 0) {
        throw new Error(`INSUFFICIENT_STOCK:${stokSebelum}:${jumlahInt}`);
      }

      const user = await tx.user.upsert({
        where: { nama: penanggungJawab },
        update: {},
        create: { nama: penanggungJawab },
      });

      await tx.barang.update({
        where: { id: idBarang },
        data: { stok: stokSesudah },
      });

      await tx.stockMovement.create({
        data: {
          idBarang,
          tipe: keterangan,
          jumlah: jumlahInt,
          stokSebelum,
          stokSesudah,
          penanggungJawabId: user.id,
          tanggal: parsedTanggal, // Menggunakan tanggal dari frontend
        },
      });

      return { stokSebelum, stokSesudah };
    });

    return NextResponse.json(
      { message: "Berhasil update stok", data: result },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "NOT_FOUND") {
        return NextResponse.json({ message: "Barang tidak ditemukan" }, { status: 404 });
      }
      if (error.message.startsWith("INSUFFICIENT_STOCK:")) {
        const [, stokSebelum, diminta] = error.message.split(":");
        return NextResponse.json(
          { message: `Stok tidak cukup. Stok saat ini: ${stokSebelum}, diminta: ${diminta}` },
          { status: 400 }
        );
      }
    }
    console.error("Error /api/update:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}