import React from 'react';

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

export const StockHistoryTable: React.FC<StockHistoryTableProps> = ({ data }) => {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid #000' }}>
        <thead>
          <tr>
            <th style={thStyle}>No</th>
            <th style={thStyle}>Nama Barang</th>
            <th style={thStyle}>Tanggal</th>
            <th style={thStyle}>Keterangan</th>
            <th style={thStyle}>Jumlah</th>
            <th style={thStyle}>Penanggung Jawab</th>
            <th style={thStyle}>Stok setelah update</th>
            <th style={thStyle}>Stok sebelum update</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td style={tdCenterStyle}>{row.no}</td>
              <td style={tdStyle}>{row.namaBarang}</td>
              <td style={tdCenterStyle}>{row.tanggal}</td>
              <td style={tdStyle}>{row.keterangan}</td>
              <td style={{ ...tdCenterStyle, fontWeight: 'bold', color: row.jumlah < 0 ? '#d9534f' : '#5cb85c' }}>
                {row.jumlah > 0 ? `+${row.jumlah}` : row.jumlah}
              </td>
              <td style={tdStyle}>{row.penanggungJawab}</td>
              <td style={tdCenterStyle}>{row.stokSetelahUpdate}</td>
              <td style={tdCenterStyle}>{row.stokSebelumUpdate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  border: '1px solid #000',
  padding: '8px',
  backgroundColor: '#f2f2f2',
  textAlign: 'center',
  fontWeight: 'bold',
};

const tdStyle: React.CSSProperties = {
  border: '1px solid #000',
  padding: '8px',
  textAlign: 'left',
};

const tdCenterStyle: React.CSSProperties = {
  border: '1px solid #000',
  padding: '8px',
  textAlign: 'center',
};