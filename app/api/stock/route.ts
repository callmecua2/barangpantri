
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { message: "Silakan login dulu" },
        { status: 401 }
      );
    }

    const items = await prisma.barang.findMany({
      orderBy: {
        nama: "asc",
      },
      include: {
        movements: {
          orderBy: {
            tanggal: "desc",
          },
          take: 1,
          include: {
            penanggungJawab: {
              select: {
                nama: true,
              },
            },
          },
        },
      },
    });

    const data = items.map((item) => {
      const latest = item.movements[0];

      return {
        id: item.id,
        nama: item.nama,
        stok: item.stok,
        updateTerakhir: latest
          ? {
              tipe: latest.tipe,
              jumlah: latest.jumlah,
              stokSebelum: latest.stokSebelum,
              stokSesudah: latest.stokSesudah,
              tanggal: latest.tanggal.toISOString(),
              penanggungJawab:
                latest.penanggungJawab.nama,
            }
          : null,
      };
    });

    return NextResponse.json({
      message: "Berhasil",
      data,
    });
  } catch (error) {
    console.error("Error /api/stock:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
