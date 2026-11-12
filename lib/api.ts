/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  id: string;
  nama: string;
}

export interface StockMovement {
  id: string;
  tipe: string;
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

const BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMessage = data?.message || `Request gagal dengan status ${res.status}`;
    const error = new Error(errorMessage);
    (error as any).status = res.status;
    throw error;
  }

  return data;
}

export const api = {
  getMe: async (): Promise<{ data: User } | null> => {
    try {
      return await request<{ data: User }>("/me");
    } catch (err: any) {
      if (err.status === 401) {
        return null;
      }
      throw err;
    }
  },
  login: (nama: string) =>
    request<{ data: User }>("/login", {
      method: "POST",
      body: JSON.stringify({ nama }),
    }),
  logout: () => request<{ message: string }>("/logout", { method: "POST" }),
  getStock: () => request<{ data: StockItem[] }>("/stock").then((r) => r.data),
  getAllHistory: () =>
    request<{ data: StockMovement[] }>("/history").then((r) => r.data),
  updateStock: (payload: {
    id: string;
    jumlah: number;
    keterangan: "PEMAKAIAN" | "RESTOCK";
  }) =>
    request<{ data: { stokSebelum: number; stokSesudah: number } }>("/update", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// ─────────────────────────────────────────────
// Adapters (Exported untuk layout.tsx / pages)
// ─────────────────────────────────────────────
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
  const sorted = [...movements].sort(
    (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
  );

  // Simpan tanggal transaksi yang lebih lama untuk barang yang sama.
  const previousDateByMovementId = new Map<string, string | null>();
  const movementsByItem = new Map<string, StockMovement[]>();

  for (const movement of sorted) {
    const itemId = movement.barang?.id ?? movement.barang?.nama ?? "unknown";
    const itemMovements = movementsByItem.get(itemId) ?? [];
    itemMovements.push(movement);
    movementsByItem.set(itemId, itemMovements);
  }

  for (const itemMovements of movementsByItem.values()) {
    itemMovements.forEach((movement, index) => {
      previousDateByMovementId.set(
        movement.id,
        itemMovements[index + 1]?.tanggal ?? null
      );
    });
  }

  return sorted.map((m, i) => ({
    id: m.id,
    no: i + 1,
    barangId: m.barang?.id ?? "",
    namaBarang: m.barang?.nama ?? "-",
    tanggal: m.tanggal,
    tanggalSebelumnya: previousDateByMovementId.get(m.id) ?? null,
    keterangan: m.tipe,
    jumlah: m.tipe === "PEMAKAIAN" ? -m.jumlah : m.jumlah,
    penanggungJawab: m.penanggungJawab?.nama ?? "-",
    stokSetelahUpdate: m.stokSesudah,
    stokSebelumUpdate: m.stokSebelum,
  }));
}
