"use client";

import { usePantry } from "../layout";
import { StockTable } from "../components/Table";

export default function StokPage() {
  const { stockTableData } = usePantry();

  return (
    <section className="data-section">
      <h2 className="title-data-stok">Data Stok Pantry</h2>
      <StockTable data={stockTableData} />
    </section>
  );
}