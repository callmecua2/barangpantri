import React from 'react';

export interface StockData {
  no: number;
  namaBarang: string;
  jumlahStok: number;
  jumlahPemakaianPenambahan: number;
  tanggalUpdate: string;
  keterangan: string;
  penanggungJawab: string;
  jumlahStokTerakhir: number;
  tanggalUpdateTerakhir: string;
}

interface StockTableProps {
  data: StockData[];
}

export const StockTable: React.FC<StockTableProps> = ({ data }) => {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid #000' }}>
        <thead>
          <tr>
            <th rowSpan={2} style={thStyle}>No</th>
            <th rowSpan={2} style={thStyle}>Nama Barang</th>
            <th rowSpan={2} style={thStyle}>Jumlah Stok Update</th>
            <th colSpan={6} style={thStyle}>Data Update</th>
          </tr>
          <tr>
            <th style={thStyle}>Jumlah Pemakaian/Penambahan</th>
            <th style={thStyle}>Tanggal Update</th>
            <th style={thStyle}>Keterangan</th>
            <th style={thStyle}>Penanggung Jawab</th>
            <th style={thStyle}>Jumlah Stok Terakhir</th>
            <th style={thStyle}>Tanggal Update Terakhir</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.no}>
              <td style={tdCenterStyle}>{row.no}</td>
              <td style={tdStyle}>{row.namaBarang}</td>
              <td style={tdCenterStyle}>{row.jumlahStok}</td>
              <td style={tdCenterStyle}>{row.jumlahPemakaianPenambahan}</td>
              <td style={tdCenterStyle}>{row.tanggalUpdate}</td>
              <td style={tdStyle}>{row.keterangan}</td>
              <td style={tdStyle}>{row.penanggungJawab}</td>
              <td style={tdCenterStyle}>{row.jumlahStokTerakhir}</td>
              <td style={tdCenterStyle}>{row.tanggalUpdateTerakhir}</td>
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