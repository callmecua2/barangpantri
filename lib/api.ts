export interface StockMovement {
  id: string;
  idBarang: string;
  tipe: "PEMAKAIAN" | "RESTOCK" | "INISIALISASI" | string;
  jumlah: number;
  stokSebelum: number;
  stokSesudah: number;
  tanggal: string;
  penanggungJawab: { nama: string };
  barang?: { id: string; nama: string; stok: number };
}

export interface StockItem {
  id: string;
  nama: string;
  stok: number;
  updateTerakhir: {
    tipe: string;
    jumlah: number;
    stokSebelum: number;
    stokSesudah: number;
    tanggal: string;
    penanggungJawab: string;
  } | null;
}

export interface UpdateStockPayload {
  idBarang: string;
  jumlah: number;
  keterangan: "PEMAKAIAN" | "RESTOCK";
  penanggungJawab: string;
  tanggal: string;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  const data = (await res.json().catch(() => ({}))) as { message?: string };

  if (!res.ok) {
    const errorMessage = data?.message || `Request gagal dengan status ${res.status}`;
    throw new ApiError(errorMessage, res.status);
  }

  return data as T;
}

export const api = {
  getStock: () => request<{ data: StockItem[] }>("/stock").then((r) => r.data),
  getAllHistory: () => request<{ data: StockMovement[] }>("/history").then((r) => r.data),
  updateStock: (payload: UpdateStockPayload) =>
    request<{ data: { stokSebelum: number; stokSesudah: number } }>("/update", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

const LOW_STOCK_THRESHOLD = 3;

export function toStockData(items: StockItem[]) {
  return items.map((it, i) => ({
    no: i + 1,
    namaBarang: it.nama,
    jumlahStok: it.stok,
    jumlahPemakaianPenambahan: it.updateTerakhir?.jumlah ?? 0,
    tanggalUpdate: it.updateTerakhir?.tanggal?.slice(0, 10) ?? "-",
    keterangan: it.updateTerakhir?.tipe ?? "-",
    penanggungJawab: it.updateTerakhir?.penanggungJawab ?? "-",
    jumlahStokTerakhir: it.updateTerakhir?.stokSesudah ?? it.stok,
    tanggalUpdateTerakhir: it.updateTerakhir?.tanggal?.slice(0, 10) ?? "-",
  }));
}

export function toLowStockData(items: StockItem[]) {
  return items
    .filter((it) => it.stok <= LOW_STOCK_THRESHOLD)
    .sort((a, b) => a.stok - b.stok)
    .map((it, i) => ({
      no: i + 1,
      namaBarang: it.nama,
      jumlahStok: it.stok,
      tanggalPemakaianTerakhir: it.updateTerakhir?.tanggal?.slice(0, 10) ?? "-",
    }));
}

export function toHistoryLogs(movements: StockMovement[]) {
  return movements.map((m, i) => ({
    id: m.id,
    barangId: m.idBarang,
    no: i + 1,
    namaBarang: m.barang?.nama ?? "-",
    tanggal: m.tanggal,
    keterangan: m.tipe,
    jumlah: m.tipe === "PEMAKAIAN" ? -m.jumlah : m.jumlah,
    penanggungJawab: m.penanggungJawab?.nama ?? "-",
    stokSetelahUpdate: m.stokSesudah,
    stokSebelumUpdate: m.stokSebelum,
  }));
}