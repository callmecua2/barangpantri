// /* eslint-disable react-hooks/set-state-in-effect */
// "use client";

// import React, { useEffect, useState } from "react";

// export interface StockUpdatePayload {
//   namaBarang: string;
//   keterangan: "PEMAKAIAN" | "RESTOCK";
//   jumlahUpdate: number;
//   penanggungJawab: string;
// }

// interface UpdateStockFormProps {
//   itemList: string[];
//   onSubmit?: (data: StockUpdatePayload) => void | Promise<void>;
// }

// const PENANGGUNG_JAWAB = [
//   "kasir", "sherly", "rahma", "febi", "tari", "keyla",
//   "heni", "via", "siti", "dimas", "hendri", "josua",
// ];

// export const UpdateStockForm: React.FC<UpdateStockFormProps> = ({ itemList, onSubmit }) => {
//   const [namaBarang, setNamaBarang] = useState(itemList[0] || "");
//   const [keterangan, setKeterangan] = useState<"PEMAKAIAN" | "RESTOCK">("PEMAKAIAN");
//   const [jumlahUpdate, setJumlahUpdate] = useState<number | "">("");
//   const [penanggungJawab, setPenanggungJawab] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!itemList.includes(namaBarang)) setNamaBarang(itemList[0] || "");
//   }, [itemList, namaBarang]);

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     if (!namaBarang || !penanggungJawab || jumlahUpdate === "" || jumlahUpdate <= 0) {
//       setError("Pilih barang, penanggung jawab, dan masukkan jumlah lebih dari 0.");
//       return;
//     }

//     setSubmitting(true);
//     setError("");
//     try {
//       await onSubmit?.({
//         namaBarang,
//         keterangan,
//         jumlahUpdate: Number(jumlahUpdate),
//         penanggungJawab,
//       });
//       setJumlahUpdate("");
//     } catch (submitError) {
//       setError(submitError instanceof Error ? submitError.message : "Update stok gagal.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="update-form">
//       <div className="form-field">
//         <label className="form-label" htmlFor="nama-barang">Nama Barang</label>
//         <select id="nama-barang" value={namaBarang} onChange={(e) => setNamaBarang(e.target.value)} className="form-control" required disabled={itemList.length === 0 || submitting}>
//           {itemList.length === 0 ? <option value="">Belum ada barang tersedia</option> : itemList.map((item) => <option key={item} value={item}>{item}</option>)}
//         </select>
//       </div>

//       <div className="form-field">
//         <label className="form-label" htmlFor="jenis-update">Jenis Update</label>
//         <select id="jenis-update" value={keterangan} onChange={(e) => setKeterangan(e.target.value as "PEMAKAIAN" | "RESTOCK")} className="form-control" required disabled={submitting}>
//           <option value="PEMAKAIAN">Pemakaian</option>
//           <option value="RESTOCK">Restock</option>
//         </select>
//       </div>

//       <div className="form-field">
//         <label className="form-label" htmlFor="penanggung-jawab">Penanggung Jawab</label>
//         <select id="penanggung-jawab" value={penanggungJawab} onChange={(e) => setPenanggungJawab(e.target.value)} className="form-control" required disabled={submitting}>
//           <option value="">Pilih penanggung jawab</option>
//           {PENANGGUNG_JAWAB.map((nama) => <option key={nama} value={nama}>{nama}</option>)}
//         </select>
//       </div>

//       <div className="form-field">
//         <label className="form-label" htmlFor="jumlah-update">Jumlah Update</label>
//         <input id="jumlah-update" type="number" min="1" step="1" inputMode="numeric" placeholder="Masukkan jumlah" value={jumlahUpdate} onChange={(e) => setJumlahUpdate(e.target.value === "" ? "" : Number(e.target.value))} className="form-control" required disabled={submitting} />
//         <span className="form-hint">Masukkan jumlah unit yang dipakai atau ditambahkan.</span>
//       </div>

//       {error && <p className="form-error" role="alert">{error}</p>}
//       <button type="submit" className="primary-button" disabled={submitting || itemList.length === 0}>
//         {submitting ? "Menyimpan..." : "Simpan Update"}
//       </button>
//     </form>
//   );
// };


/* eslint-disable react-hooks/set-state-in-effect */
// "use client";

// import React, { useEffect, useState } from "react";

// export interface StockUpdatePayload {
//   namaBarang: string;
//   keterangan: "PEMAKAIAN" | "RESTOCK";
//   jumlahUpdate: number;
//   penanggungJawab: string;
//   tanggal: string;
// }

// interface UpdateStockFormProps {
//   itemList: string[];
//   onSubmit?: (data: StockUpdatePayload) => void | Promise<void>;
// }

// const PENANGGUNG_JAWAB = [
//   "kasir", "sherly", "rahma", "febi", "tari", "keyla",
//   "heni", "via", "siti", "dimas", "hendri", "josua",
// ];

// // Helper untuk mendapatkan tanggal hari ini (YYYY-MM-DD) berdasarkan zona waktu lokal perangkat
// const getTodayLocal = (): string => {
//   const now = new Date();
//   const year = now.getFullYear();
//   const month = String(now.getMonth() + 1).padStart(2, "0");
//   const day = String(now.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// };

// export const UpdateStockForm: React.FC<UpdateStockFormProps> = ({ itemList, onSubmit }) => {
//   const [namaBarang, setNamaBarang] = useState(itemList[0] || "");
//   const [keterangan, setKeterangan] = useState<"PEMAKAIAN" | "RESTOCK">("PEMAKAIAN");
//   const [jumlahUpdate, setJumlahUpdate] = useState<number | "">("");
//   const [penanggungJawab, setPenanggungJawab] = useState("");
//   const [tanggal, setTanggal] = useState<string>("");
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   // Set tanggal default hari ini setelah komponen terpasang di client (aman untuk Next.js 16 prerender)
//   useEffect(() => {
//     setTanggal(getTodayLocal());
//   }, []);

//   useEffect(() => {
//     if (!itemList.includes(namaBarang)) setNamaBarang(itemList[0] || "");
//   }, [itemList, namaBarang]);

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     if (!namaBarang || !penanggungJawab || !tanggal || jumlahUpdate === "" || jumlahUpdate <= 0) {
//       setError("Pilih barang, penanggung jawab, tanggal, dan masukkan jumlah lebih dari 0.");
//       return;
//     }

//     setSubmitting(true);
//     setError("");
//     try {
//       await onSubmit?.({
//         namaBarang,
//         keterangan,
//         jumlahUpdate: Number(jumlahUpdate),
//         penanggungJawab,
//         tanggal,
//       });
//       setJumlahUpdate("");
//       setTanggal(getTodayLocal());
//     } catch (submitError) {
//       setError(submitError instanceof Error ? submitError.message : "Update stok gagal.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="update-form">
//       <div className="form-field">
//         <label className="form-label" htmlFor="nama-barang">Nama Barang</label>
//         <select
//           id="nama-barang"
//           value={namaBarang}
//           onChange={(e) => setNamaBarang(e.target.value)}
//           className="form-control"
//           required
//           disabled={itemList.length === 0 || submitting}
//         >
//           {itemList.length === 0 ? (
//             <option value="">Belum ada barang tersedia</option>
//           ) : (
//             itemList.map((item) => (
//               <option key={item} value={item}>
//                 {item}
//               </option>
//             ))
//           )}
//         </select>
//       </div>

//       <div className="form-field">
//         <label className="form-label" htmlFor="jenis-update">Jenis Update</label>
//         <select
//           id="jenis-update"
//           value={keterangan}
//           onChange={(e) => setKeterangan(e.target.value as "PEMAKAIAN" | "RESTOCK")}
//           className="form-control"
//           required
//           disabled={submitting}
//         >
//           <option value="PEMAKAIAN">Pemakaian</option>
//           <option value="RESTOCK">Restock</option>
//         </select>
//       </div>

//       <div className="form-field">
//         <label className="form-label" htmlFor="penanggung-jawab">Penanggung Jawab</label>
//         <select
//           id="penanggung-jawab"
//           value={penanggungJawab}
//           onChange={(e) => setPenanggungJawab(e.target.value)}
//           className="form-control"
//           required
//           disabled={submitting}
//         >
//           <option value="">Pilih penanggung jawab</option>
//           {PENANGGUNG_JAWAB.map((nama) => (
//             <option key={nama} value={nama}>
//               {nama}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="form-field">
//         <label className="form-label" htmlFor="tanggal-update">Tanggal</label>
//         <input
//           id="tanggal-update"
//           type="date"
//           value={tanggal}
//           onChange={(e) => setTanggal(e.target.value)}
//           className="form-control"
//           required
//           disabled={submitting}
//         />
//       </div>

//       <div className="form-field">
//         <label className="form-label" htmlFor="jumlah-update">Jumlah Update</label>
//         <input
//           id="jumlah-update"
//           type="number"
//           min="0.01"
//           step="any"
//           inputMode="decimal"
//           placeholder="Masukkan jumlah"
//           value={jumlahUpdate}
//           onChange={(e) => setJumlahUpdate(e.target.value === "" ? "" : Number(e.target.value))}
//           className="form-control"
//           required
//           disabled={submitting}
//         />
//         <span className="form-hint">Masukkan jumlah unit yang dipakai atau ditambahkan (bisa desimal, misal 0.25).</span>
//       </div>

//       {error && (
//         <p className="form-error" role="alert">
//           {error}
//         </p>
//       )}
//       <button type="submit" className="primary-button" disabled={submitting || itemList.length === 0}>
//         {submitting ? "Menyimpan..." : "Simpan Update"}
//       </button>
//     </form>
//   );
// };


"use client";

import React, { useEffect, useState } from "react";
import { PENANGGUNG_JAWAB } from "@/constants/staff";

export interface BarangOption {
  id: string;
  nama: string;
}

export interface StockUpdatePayload {
  idBarang: string;
  keterangan: "PEMAKAIAN" | "RESTOCK";
  jumlah: number;
  penanggungJawab: string;
  tanggal: string;
}

interface UpdateStockFormProps {
  itemList: BarangOption[];
  onSubmit?: (data: StockUpdatePayload) => void | Promise<void>;
}

const getTodayLocal = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const UpdateStockForm: React.FC<UpdateStockFormProps> = ({ itemList, onSubmit }) => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [keterangan, setKeterangan] = useState<"PEMAKAIAN" | "RESTOCK">("PEMAKAIAN");
  const [jumlah, setJumlah] = useState<number | "">("");
  const [penanggungJawab, setPenanggungJawab] = useState("");
  const [tanggal, setTanggal] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setTanggal((prev) => prev || getTodayLocal());
  }, []);

  const activeIdBarang = itemList.some((item) => item.id === selectedId)
    ? selectedId
    : itemList[0]?.id || "";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeIdBarang || !penanggungJawab || !tanggal || jumlah === "" || !Number.isInteger(jumlah) || jumlah <= 0) {
      setError("Pilih barang, penanggung jawab, tanggal, dan masukkan jumlah bilangan bulat lebih dari 0.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await onSubmit?.({
        idBarang: activeIdBarang,
        keterangan,
        jumlah: Number(jumlah),
        penanggungJawab,
        tanggal,
      });
      setJumlah("");
      setTanggal(getTodayLocal());
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
        <select
          id="nama-barang"
          value={activeIdBarang}
          onChange={(e) => setSelectedId(e.target.value)}
          className="form-control"
          required
          disabled={itemList.length === 0 || submitting}
        >
          {itemList.length === 0 ? (
            <option value="">Belum ada barang tersedia</option>
          ) : (
            itemList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="jenis-update">Jenis Update</label>
        <select
          id="jenis-update"
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value as "PEMAKAIAN" | "RESTOCK")}
          className="form-control"
          required
          disabled={submitting}
        >
          <option value="PEMAKAIAN">Pemakaian</option>
          <option value="RESTOCK">Restock</option>
        </select>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="penanggung-jawab">Penanggung Jawab</label>
        <select
          id="penanggung-jawab"
          value={penanggungJawab}
          onChange={(e) => setPenanggungJawab(e.target.value)}
          className="form-control"
          required
          disabled={submitting}
        >
          <option value="">Pilih penanggung jawab</option>
          {PENANGGUNG_JAWAB.map((nama) => (
            <option key={nama} value={nama}>
              {nama}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="tanggal-update">Tanggal</label>
        <input
          id="tanggal-update"
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          className="form-control"
          required
          disabled={submitting}
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="jumlah-update">Jumlah Update</label>
        <input
          id="jumlah-update"
          type="number"
          min="1"
          step="1"
          inputMode="numeric"
          placeholder="Masukkan jumlah"
          value={jumlah}
          onChange={(e) => setJumlah(e.target.value === "" ? "" : Number(e.target.value))}
          className="form-control"
          required
          disabled={submitting}
        />
        <span className="form-hint">Masukkan jumlah unit dalam bilangan bulat (contoh: 1, 5, 10).</span>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="primary-button" disabled={submitting || itemList.length === 0}>
        {submitting ? "Menyimpan..." : "Simpan Update"}
      </button>
    </form>
  );
};