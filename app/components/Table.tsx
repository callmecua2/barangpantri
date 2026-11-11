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
                  <span className={`stock-badge ${row.jumlahStok === 0 ? "empty" : row.jumlahStok <= 3 ? "low" : ""}`}>
                    {row.jumlahStok}
                  </span>
                </td>
                <td>{row.tanggalUpdate}</td>
                <td>{row.keterangan}</td>
                <td>{row.penanggungJawab}</td>
                <td className="cell-center">{row.jumlahPemakaianPenambahan}</td>
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
              <span className={`stock-badge ${row.jumlahStok === 0 ? "empty" : row.jumlahStok <= 3 ? "low" : ""}`}>
                {row.jumlahStok} stok
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
                <span className="mobile-field-value">{row.jumlahPemakaianPenambahan}</span>
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
