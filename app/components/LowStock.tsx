import React from 'react';

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
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid #000' }}>
        <thead>
          <tr>
            <th style={thStyle}>No</th>
            <th style={thStyle}>Nama Barang</th>
            <th style={thStyle}>Jumlah Stok</th>
            <th style={thStyle}>Tanggal Pemakaian Terakhir</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.no}>
              <td style={tdCenterStyle}>{row.no}</td>
              <td style={tdStyle}>{row.namaBarang}</td>
              <td
                style={{
                  ...tdCenterStyle,
                  fontWeight: 'bold',
                  color: row.jumlahStok === 0 ? '#d9534f' : '#f0ad4e',
                }}
              >
                {row.jumlahStok === 0 ? 'Habis (0)' : row.jumlahStok}
              </td>
              <td style={tdCenterStyle}>{row.tanggalPemakaianTerakhir}</td>
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