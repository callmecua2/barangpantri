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
    if (!barang) {
      alert("Barang tidak ditemukan");
      return;
    }

    try {
      await api.updateStock({
        id: barang.id,
        jumlah: data.jumlahUpdate,
        keterangan: data.keterangan,
      });
      await refreshAll();
      alert(
        `Update Stok Berhasil:\nBarang: ${data.namaBarang}\nTipe: ${data.keterangan}\nJumlah: ${data.jumlahUpdate}`
      );
    } catch (e: any) {
      alert(`Gagal update: ${e.message}`);
    }
  };

  return (
    <section className="update-section">
      <h2 style={{ marginBottom: "24px" }}>Form Update Stok Pantry</h2>
      <UpdateStockForm
        itemList={itemNames}
        onSubmit={handleStockUpdateSubmit}
      />
    </section>
  );
}