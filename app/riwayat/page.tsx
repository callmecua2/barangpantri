"use client";

import { usePantry } from "../layout";
import { StockHistoryTable } from "../components/History";

export default function RiwayatPage() {
  const { historyLogs } = usePantry();

  return (
    <section className="history-data">
      <h2>Riwayat Penggunaan Stok Pantry</h2>
      <StockHistoryTable data={historyLogs} />
    </section>
  );
}