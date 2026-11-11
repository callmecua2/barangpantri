import React from "react";

export interface StockHistoryLog {
  id: number;
  no: number;
  namaBarang: string;
  tanggal: string;
  keterangan: string;
  jumlah: number;
  penanggungJawab: string;
  stokSetelahUpdate: number;
  stokSebelumUpdate: number;
}

interface StockHistoryTableProps {
  data: StockHistoryLog[];
}

const formatDate = (isoString: string): string => {
  if (!isoString || isoString === "-") return "-";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const StockHistoryTable: React.FC<StockHistoryTableProps> = ({ data }) => {
  if (data.length === 0) {
    return <div className="table-card empty-state">Belum ada riwayat penggunaan stok.</div>;
  }

  return (
    <div className="table-card">
      <div className="table-scroll responsive-table-desktop">
        <table className="responsive-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Barang</th>
              <th>Tanggal & Jam</th>
              <th>Keterangan</th>
              <th className="cell-center">Jumlah</th>
              <th>Penanggung Jawab</th>
              <th className="cell-center">Stok Setelah</th>
              <th className="cell-center">Stok Sebelum</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td className="cell-center cell-muted">{row.no}</td>
                <td className="cell-strong">{row.namaBarang}</td>
                <td>{formatDate(row.tanggal)}</td>
                <td>{row.keterangan}</td>
                <td className={`cell-center ${row.jumlah < 0 ? "movement-negative" : "movement-positive"}`}>
                  {row.jumlah > 0 ? `+${row.jumlah}` : row.jumlah}
                </td>
                <td>{row.penanggungJawab}</td>
                <td className="cell-center">{row.stokSetelahUpdate}</td>
                <td className="cell-center">{row.stokSebelumUpdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-records">
        {data.map((row) => (
          <article className="mobile-record" key={row.id}>
            <div className="mobile-record-heading">
              <div>
                <span className="mobile-record-index">Transaksi #{row.no}</span>
                <div className="mobile-record-title">{row.namaBarang}</div>
              </div>
              <span className={row.jumlah < 0 ? "movement-negative" : "movement-positive"}>
                {row.jumlah > 0 ? `+${row.jumlah}` : row.jumlah}
              </span>
            </div>
            <div className="mobile-record-grid">
              <div className="mobile-field">
                <span className="mobile-field-label">Tanggal & jam</span>
                <span className="mobile-field-value">{formatDate(row.tanggal)}</span>
              </div>
              <div className="mobile-field">
                <span className="mobile-field-label">Keterangan</span>
                <span className="mobile-field-value">{row.keterangan}</span>
              </div>
              <div className="mobile-field">
                <span className="mobile-field-label">Stok sebelum</span>
                <span className="mobile-field-value">{row.stokSebelumUpdate}</span>
              </div>
              <div className="mobile-field">
                <span className="mobile-field-label">Stok setelah</span>
                <span className="mobile-field-value">{row.stokSetelahUpdate}</span>
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
