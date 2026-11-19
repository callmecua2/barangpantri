"use client";

import { usePantry } from "../layout";
import { UpdateStockForm, StockUpdatePayload } from "../components/Update";
import { api } from "@/lib/api";

export default function UpdatePage() {
  const { stockItems, refreshAll } = usePantry();

  const itemOptions = stockItems.map((item) => ({
    id: item.id,
    nama: item.nama,
  }));

  const handleStockUpdateSubmit = async (data: StockUpdatePayload) => {
    const barang = stockItems.find((s) => s.id === data.idBarang);
    if (!barang) throw new Error("Barang tidak ditemukan");

    try {
      await api.updateStock({
        idBarang: barang.id,
        jumlah: data.jumlah,
        keterangan: data.keterangan,
        penanggungJawab: data.penanggungJawab,
        tanggal: ""
      });

      await refreshAll();

      alert(
        `Update Stok Berhasil:\n` +
        `Barang: ${barang.nama}\n` +
        `Tipe: ${data.keterangan}\n` +
        `Jumlah: ${data.jumlah}\n` +
        `Penanggung Jawab: ${data.penanggungJawab}`
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat menghubungi server";
      throw new Error(`Gagal update: ${errorMessage}`);
    }
  };

  return (
    <section className="update-section">
      <h2 style={{ marginBottom: "24px" }}>Form Update Stok Pantry</h2>
      <UpdateStockForm itemList={itemOptions} onSubmit={handleStockUpdateSubmit} />
    </section>
  );
}