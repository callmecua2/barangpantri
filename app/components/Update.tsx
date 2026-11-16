"use client";

import React, { useEffect, useState } from "react";

export interface StockUpdatePayload {
  namaBarang: string;
  keterangan: "PEMAKAIAN" | "RESTOCK";
  jumlahUpdate: number;
  penanggungJawab: string;
}

interface UpdateStockFormProps {
  itemList: string[];
  onSubmit?: (data: StockUpdatePayload) => void | Promise<void>;
}

const PENANGGUNG_JAWAB = [
  "kasir", "sherly", "rahma", "febi", "tari", "keyla",
  "heni", "via", "siti", "dimas", "hendri", "josua",
];

export const UpdateStockForm: React.FC<UpdateStockFormProps> = ({ itemList, onSubmit }) => {
  const [namaBarang, setNamaBarang] = useState(itemList[0] || "");
  const [keterangan, setKeterangan] = useState<"PEMAKAIAN" | "RESTOCK">("PEMAKAIAN");
  const [jumlahUpdate, setJumlahUpdate] = useState<number | "">("");
  const [penanggungJawab, setPenanggungJawab] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!itemList.includes(namaBarang)) setNamaBarang(itemList[0] || "");
  }, [itemList, namaBarang]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!namaBarang || !penanggungJawab || jumlahUpdate === "" || jumlahUpdate <= 0) {
      setError("Pilih barang, penanggung jawab, dan masukkan jumlah lebih dari 0.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await onSubmit?.({
        namaBarang,
        keterangan,
        jumlahUpdate: Number(jumlahUpdate),
        penanggungJawab,
      });
      setJumlahUpdate("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Update stok gagal.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="update-form">
      <div className="form-field">
        <label className="form-label" htmlFor="nama-barang">Nama Barang</label>
        <select id="nama-barang" value={namaBarang} onChange={(e) => setNamaBarang(e.target.value)} className="form-control" required disabled={itemList.length === 0 || submitting}>
          {itemList.length === 0 ? <option value="">Belum ada barang tersedia</option> : itemList.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="jenis-update">Jenis Update</label>
        <select id="jenis-update" value={keterangan} onChange={(e) => setKeterangan(e.target.value as "PEMAKAIAN" | "RESTOCK")} className="form-control" required disabled={submitting}>
          <option value="PEMAKAIAN">Pemakaian</option>
          <option value="RESTOCK">Restock</option>
        </select>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="penanggung-jawab">Penanggung Jawab</label>
        <select id="penanggung-jawab" value={penanggungJawab} onChange={(e) => setPenanggungJawab(e.target.value)} className="form-control" required disabled={submitting}>
          <option value="">Pilih penanggung jawab</option>
          {PENANGGUNG_JAWAB.map((nama) => <option key={nama} value={nama}>{nama}</option>)}
        </select>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="jumlah-update">Jumlah Update</label>
        <input id="jumlah-update" type="number" min="1" step="1" inputMode="numeric" placeholder="Masukkan jumlah" value={jumlahUpdate} onChange={(e) => setJumlahUpdate(e.target.value === "" ? "" : Number(e.target.value))} className="form-control" required disabled={submitting} />
        <span className="form-hint">Masukkan jumlah unit yang dipakai atau ditambahkan.</span>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" className="primary-button" disabled={submitting || itemList.length === 0}>
        {submitting ? "Menyimpan..." : "Simpan Update"}
      </button>
    </form>
  );
};
