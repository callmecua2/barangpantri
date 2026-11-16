/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { usePantry } from "../layout";
import { UpdateStockForm, StockUpdatePayload } from "../components/Update";
import { api } from "@/lib/api";

export default function UpdatePage() {
  const { stockItems, refreshAll } = usePantry();
  const itemNames = stockItems.map((i) => i.nama);

  const handleStockUpdateSubmit = async (data: StockUpdatePayload) => {
    const barang = stockItems.find((s) => s.nama === data.namaBarang);
    if (!barang) throw new Error("Barang tidak ditemukan");

    try {
      await api.updateStock({
        id: barang.id,
        jumlah: data.jumlahUpdate,
        keterangan: data.keterangan,
        penanggungJawab: data.penanggungJawab,
      });
      await refreshAll();
      alert(`Update Stok Berhasil:\nBarang: ${data.namaBarang}\nTipe: ${data.keterangan}\nJumlah: ${data.jumlahUpdate}\nPenanggung Jawab: ${data.penanggungJawab}`);
    } catch (e: any) {
      throw new Error(`Gagal update: ${e.message}`);
    }
  };

  return (
    <section className="update-section">
      <h2 style={{ marginBottom: "24px" }}>Form Update Stok Pantry</h2>
      <UpdateStockForm itemList={itemNames} onSubmit={handleStockUpdateSubmit} />
    </section>
  );
}
