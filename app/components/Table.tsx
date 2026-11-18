"use client";

import React from "react";

export interface StockData {
  no: number;
  namaBarang: string;
  jumlahStok: number;
  tanggalUpdate: string;
  keterangan: string;
  penanggungJawab: string;
  jumlahPemakaianPenambahan: number;
}

interface StockTableProps {
  data: StockData[];
}

// Helper untuk mengubah angka desimal (misal 0.25 atau 1.5) menjadi teks pecahan ("1/4" atau "1 1/2")
function formatPecahan(nilai: number): string {
  const num = Number(nilai);
  if (!Number.isFinite(num)) return String(nilai);
  if (num === 0) return "0";

  const isNegative = num < 0;
  const absVal = Math.abs(num);
  const bilanganBulat = Math.floor(absVal);
  // Bulatkan 2 digit desimal untuk menghindari floating-point error (misal 0.25000001)
  const sisaDesimal = Math.round((absVal - bilanganBulat) * 100) / 100;

  const petaPecahan: Record<number, string> = {
    0.25: "1/4",
    0.5: "1/2",
    0.75: "3/4",
    0.2: "1/5",
    0.4: "2/5",
    0.6: "3/5",
    0.8: "4/5",
    0.33: "1/3",
    0.67: "2/3",
  };

  let hasil = "";
  if (sisaDesimal === 0) {
    hasil = `${bilanganBulat}`;
  } else if (petaPecahan[sisaDesimal]) {
    hasil =
      bilanganBulat > 0
        ? `${bilanganBulat} ${petaPecahan[sisaDesimal]}`
        : petaPecahan[sisaDesimal];
  } else {
    // Jika desimal tidak ada di daftar pecahan umum (misal 0.15), tampilkan angka aslinya
    hasil = `${absVal}`;
  }

  return isNegative ? `-${hasil}` : hasil;
}

export const StockTable: React.FC<StockTableProps> = ({ data }) => {
  if (data.length === 0) {
    return <div className="table-card empty-state">Belum ada data stok.</div>;
  }

  return (
    <div className="table-card">
      <div className="table-scroll responsive-table-desktop">
        <table className="responsive-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Barang</th>
              <th className="cell-center">Stok Saat Ini</th>
              <th>Tanggal Update</th>
              <th>Keterangan</th>
              <th>Penanggung Jawab</th>
              <th className="cell-center">Jumlah Pemakaian/Restock</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.no}>
                <td className="cell-center cell-muted">{row.no}</td>
                <td className="cell-strong">{row.namaBarang}</td>
                <td className="cell-center">
                  <span
                    className={`stock-badge ${
                      row.jumlahStok === 0
                        ? "empty"
                        : row.jumlahStok <= 3
                        ? "low"
                        : ""
                    }`}
                  >
                    {formatPecahan(row.jumlahStok)}
                  </span>
                </td>
                <td>{row.tanggalUpdate}</td>
                <td>{row.keterangan}</td>
                <td>{row.penanggungJawab}</td>
                <td className="cell-center">
                  {formatPecahan(row.jumlahPemakaianPenambahan)}
                </td>
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
                <span className="mobile-record-index">Barangasda #{row.no}</span>
                <div className="mobile-record-title">{row.namaBarang}</div>
              </div>
              <span
                className={`stock-badge ${
                  row.jumlahStok === 0
                    ? "empty"
                    : row.jumlahStok <= 3
                    ? "low"
                    : ""
                }`}
              >
                {formatPecahan(row.jumlahStok)} stok
              </span>
            </div>
            <div className="mobile-record-grid">
              <div className="mobile-field">
                <span className="mobile-field-label">Update terakhir</span>
                <span className="mobile-field-value">{row.tanggalUpdate}</span>
              </div>
              <div className="mobile-field">
                <span className="mobile-field-label">Jenis update</span>
                <span className="mobile-field-value">{row.keterangan}</span>
              </div>
              <div className="mobile-field">
                <span className="mobile-field-label">Jumlah perubahan</span>
                <span className="mobile-field-value">
                  {formatPecahan(row.jumlahPemakaianPenambahan)}
                </span>
              </div>
              <div className="mobile-field">
                <span className="mobile-field-label">Penanggung jawab</span>
                <span className="mobile-field-value">{row.penanggungJawab}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};