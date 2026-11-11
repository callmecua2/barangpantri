import React from "react";

export interface LowStockData {
  no: number;
  namaBarang: string;
  jumlahStok: number;
  tanggalPemakaianTerakhir: string;
}

interface LowStockTableProps {
  data: LowStockData[];
}

export const LowStockTable: React.FC<LowStockTableProps> = ({ data }) => {
  if (data.length === 0) {
    return <div className="table-card empty-state">Tidak ada barang yang stoknya habis atau menipis.</div>;
  }

  return (
    <div className="table-card">
      <div className="table-scroll responsive-table-desktop">
        <table className="responsive-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Barang</th>
              <th className="cell-center">Jumlah Stok</th>
              <th>Tanggal Pemakaian Terakhir</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.no}>
                <td className="cell-center cell-muted">{row.no}</td>
                <td className="cell-strong">{row.namaBarang}</td>
                <td className="cell-center">
                  <span className={`stock-badge ${row.jumlahStok === 0 ? "empty" : "low"}`}>
                    {row.jumlahStok === 0 ? "Habis (0)" : row.jumlahStok}
                  </span>
                </td>
                <td>{row.tanggalPemakaianTerakhir}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-records">
        {data.map((row) => (
          <article className="mobile-record" key={row.no}>
            <div className="mobile-record-heading">
              <div>
                <span className="mobile-record-index">Barang #{row.no}</span>
                <div className="mobile-record-title">{row.namaBarang}</div>
              </div>
              <span className={`stock-badge ${row.jumlahStok === 0 ? "empty" : "low"}`}>
                {row.jumlahStok === 0 ? "Habis (0)" : `${row.jumlahStok} tersisa`}
              </span>
            </div>
            <div className="mobile-field">
              <span className="mobile-field-label">Pemakaian terakhir</span>
              <span className="mobile-field-value">{row.tanggalPemakaianTerakhir}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
