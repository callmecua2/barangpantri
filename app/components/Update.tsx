"use client";

import React, { useState } from 'react';

export interface StockUpdatePayload {
  namaBarang: string;
  keterangan: 'PEMAKAIAN' | 'RESTOCK';
  jumlahUpdate: number;
}

interface UpdateStockFormProps {
  itemList: string[];
  onSubmit?: (data: StockUpdatePayload) => void;
}

export const UpdateStockForm: React.FC<UpdateStockFormProps> = ({ itemList, onSubmit }) => {
  const [namaBarang, setNamaBarang] = useState<string>(itemList[0] || '');
  const [keterangan, setKeterangan] = useState<'PEMAKAIAN' | 'RESTOCK'>('PEMAKAIAN');
  const [jumlahUpdate, setJumlahUpdate] = useState<number | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaBarang || jumlahUpdate === '' || jumlahUpdate <= 0) {
      alert('Harap isi jumlah update dengan angka valid (> 0)');
      return;
    }

    const payload: StockUpdatePayload = {
      namaBarang,
      keterangan,
      jumlahUpdate: Number(jumlahUpdate),
    };

    if (onSubmit) {
      onSubmit(payload);
    }

    setJumlahUpdate('');
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={fieldStyle}>
        <label style={labelStyle}>Nama Barang</label>
        <select
          value={namaBarang}
          onChange={(e) => setNamaBarang(e.target.value)}
          style={inputStyle}
          required
        >
          {itemList.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Keterangan</label>
        <select
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value as 'PEMAKAIAN' | 'RESTOCK')}
          style={inputStyle}
          required
        >
          <option value="PEMAKAIAN">Pemakaian</option>
          <option value="RESTOCK">Restock</option>
        </select>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Jumlah Update</label>
        <input
          type="number"
          min="1"
          placeholder="Masukkan jumlah"
          value={jumlahUpdate}
          onChange={(e) => setJumlahUpdate(e.target.value === '' ? '' : Number(e.target.value))}
          style={inputStyle}
          required
        />
      </div>

      <button type="submit" style={buttonStyle}>
        Simpan Update
      </button>
    </form>
  );
};

const formStyle: React.CSSProperties = {
  maxWidth: '450px',
  margin: '0 auto',
  padding: '24px',
  border: '2px solid #000',
  borderRadius: '12px',
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  textAlign: 'left',
};

const labelStyle: React.CSSProperties = {
  fontWeight: 'bold',
  fontSize: '14px',
  color: '#000',
};

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: '6px',
  border: '1px solid #000',
  fontSize: '14px',
  width: '100%',
  boxSizing: 'border-box',
  backgroundColor: '#fff',
  color: '#000',
};

const buttonStyle: React.CSSProperties = {
  padding: '12px',
  backgroundColor: '#000',
  color: '#fff',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '15px',
  marginTop: '8px',
};