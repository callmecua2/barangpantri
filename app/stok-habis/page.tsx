"use client";

import { usePantry } from "../layout";
import { LowStockTable } from "../components/LowStock";

export default function StokHabisPage() {
  const { lowStockData } = usePantry();

  return (
    <section className="lowstock-data">
      <h2>Daftar Stok Habis & Menipis</h2>
      <LowStockTable data={lowStockData} />
    </section>
  );
}