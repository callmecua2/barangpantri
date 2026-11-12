"use client";

import React, { useEffect, useMemo, useState } from "react";

export interface StockHistoryLog {
  id: string;
  barangId: string;
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

type Period = "day" | "week" | "month";

const TIME_ZONE = "Asia/Jakarta";

const dateKey = (value: string | Date): string => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
};

const formatDate = (isoString: string): string => {
  if (!isoString || isoString === "-") return "-";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: TIME_ZONE,
  }).format(date);
};

const formatDateOnly = (value: string): string => {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00Z`);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

const getPeriodRange = (selectedDate: string, period: Period) => {
  const selected = new Date(`${selectedDate}T00:00:00Z`);
  if (Number.isNaN(selected.getTime())) return { start: selectedDate, end: selectedDate };

  if (period === "day") return { start: selectedDate, end: selectedDate };

  if (period === "week") {
    const day = selected.getUTCDay();
    const daysSinceMonday = (day + 6) % 7;
    const start = new Date(selected);
    start.setUTCDate(selected.getUTCDate() - daysSinceMonday);
    const end = new Date(start);
    end.setUTCDate(start.getUTCDate() + 6);
    return { start: dateKey(start), end: dateKey(end) };
  }

  const start = new Date(Date.UTC(selected.getUTCFullYear(), selected.getUTCMonth(), 1));
  const end = new Date(Date.UTC(selected.getUTCFullYear(), selected.getUTCMonth() + 1, 0));
  return { start: dateKey(start), end: dateKey(end) };
};

const getDays = (start: string, end: string) => {
  const days: string[] = [];
  const cursor = new Date(`${start}T00:00:00Z`);
  const last = new Date(`${end}T00:00:00Z`);
  while (cursor <= last) {
    days.push(dateKey(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return days;
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(value);

export const StockHistoryTable: React.FC<StockHistoryTableProps> = ({ data }) => {
  const [selectedBarangId, setSelectedBarangId] = useState("all");
  const [period, setPeriod] = useState<Period>("day");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    setSelectedDate(dateKey(new Date()));
  }, []);

  const barangOptions = useMemo(() => {
    const unique = new Map<string, string>();
    data.forEach((row) => {
      if (row.barangId && row.namaBarang !== "-") unique.set(row.barangId, row.namaBarang);
    });
    return Array.from(unique, ([id, nama]) => ({ id, nama })).sort((a, b) =>
      a.nama.localeCompare(b.nama, "id")
    );
  }, [data]);

  const range = useMemo(
    () => (selectedDate ? getPeriodRange(selectedDate, period) : null),
    [selectedDate, period]
  );

  const periodData = useMemo(() => {
    if (!range) return [];
    return data.filter((row) => {
      const key = dateKey(row.tanggal);
      const matchesDate = key >= range.start && key <= range.end;
      const matchesBarang = selectedBarangId === "all" || row.barangId === selectedBarangId;
      return matchesDate && matchesBarang;
    });
  }, [data, range, selectedBarangId]);

  const consumptionRows = useMemo(
    () => periodData.filter((row) => row.keterangan === "PEMAKAIAN"),
    [periodData]
  );
  const totalUsage = consumptionRows.reduce((total, row) => total + Math.abs(row.jumlah), 0);
  const usageFrequency = consumptionRows.length;
  const dayCount = range ? getDays(range.start, range.end).length : 1;
  const averageUsage = totalUsage / Math.max(dayCount, 1);

  const latestUpdates = useMemo(() => {
    const relevant = selectedBarangId === "all"
      ? data
      : data.filter((row) => row.barangId === selectedBarangId);
    return [...relevant].sort(
      (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
    ).slice(0, 2);
  }, [data, selectedBarangId]);

  const chartData = useMemo(() => {
    if (!range) return [];
    const dailyUsage = new Map<string, number>();
    getDays(range.start, range.end).forEach((day) => dailyUsage.set(day, 0));
    consumptionRows.forEach((row) => {
      const key = dateKey(row.tanggal);
      dailyUsage.set(key, (dailyUsage.get(key) ?? 0) + Math.abs(row.jumlah));
    });
    return Array.from(dailyUsage, ([date, usage]) => ({ date, usage }));
  }, [range, consumptionRows]);

  const maxUsage = Math.max(1, ...chartData.map((item) => item.usage));
  const selectedBarangName = barangOptions.find((item) => item.id === selectedBarangId)?.nama;
  const periodLabel = period === "day" ? "Hari" : period === "week" ? "Minggu" : "Bulan";

  return (
    <div className="history-analysis">
      <section className="history-filter-panel" aria-label="Filter analisis riwayat">
        <div className="history-filter-heading">
          <div>
            <h3>Analisis pemakaian</h3>
            <p>Filter barang dan periode untuk melihat pola penggunaan stok.</p>
          </div>
          <span className="history-timezone">WIB · Asia/Jakarta</span>
        </div>

        <div className="history-filter-grid">
          <label className="history-filter-field">
            <span>Nama barang</span>
            <select
              className="form-control"
              value={selectedBarangId}
              onChange={(event) => setSelectedBarangId(event.target.value)}
            >
              <option value="all">Semua barang</option>
              {barangOptions.map((item) => (
                <option key={item.id} value={item.id}>{item.nama}</option>
              ))}
            </select>
          </label>

          <label className="history-filter-field">
            <span>Tanggal acuan</span>
            <input
              className="form-control"
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </label>

          <fieldset className="history-period-field">
            <legend>Periode</legend>
            <div className="history-period-options">
              {(["day", "week", "month"] as Period[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={period === value ? "history-period-button active" : "history-period-button"}
                  aria-pressed={period === value}
                  onClick={() => setPeriod(value)}
                >
                  {value === "day" ? "Hari" : value === "week" ? "Minggu" : "Bulan"}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {range && (
          <p className="history-range-caption">
            Menampilkan {periodLabel.toLowerCase()} {formatDateOnly(range.start)}
            {range.start !== range.end ? ` – ${formatDateOnly(range.end)}` : ""}
          </p>
        )}
      </section>

      <section className="history-summary-grid" aria-label="Ringkasan pemakaian">
        <article className="history-summary-card">
          <span>Total pemakaian</span>
          <strong>{formatNumber(totalUsage)} <small>unit</small></strong>
          <p>Hanya transaksi pemakaian, tidak termasuk restock.</p>
        </article>
        <article className="history-summary-card">
          <span>Frekuensi pemakaian</span>
          <strong>{formatNumber(usageFrequency)} <small>kali</small></strong>
          <p>Jumlah transaksi pemakaian dalam periode.</p>
        </article>
        <article className="history-summary-card">
          <span>Rata-rata per hari</span>
          <strong>{formatNumber(averageUsage)} <small>unit</small></strong>
          <p>Total pemakaian dibagi seluruh hari dalam periode.</p>
        </article>
        <article className="history-summary-card history-update-card">
          <span>Update stok terakhir</span>
          <strong>{latestUpdates[0] ? formatDate(latestUpdates[0].tanggal) : "Belum ada"}</strong>
          <p>
            {latestUpdates[1]
              ? `Sebelumnya: ${formatDate(latestUpdates[1].tanggal)}`
              : "Belum ada update sebelumnya."}
          </p>
        </article>
      </section>

      <section className="history-chart-card">
        <div className="history-section-heading">
          <div>
            <h3>Tren pemakaian per hari</h3>
            <p>{selectedBarangName ?? "Semua barang"} · {periodLabel}</p>
          </div>
          <strong>{formatNumber(totalUsage)} unit</strong>
        </div>
        {totalUsage === 0 ? (
          <div className="history-chart-empty">Tidak ada pemakaian pada periode ini.</div>
        ) : (
          <div className="history-chart-scroll">
            <div className="history-chart">
              {chartData.map((item) => (
                <div className="history-chart-column" key={item.date}>
                  <span className="history-chart-value">{item.usage || ""}</span>
                  <div className="history-chart-track">
                    <div
                      className="history-chart-bar"
                      style={{ height: `${item.usage === 0 ? 0 : Math.max(5, (item.usage / maxUsage) * 100)}%` }}
                      title={`${formatDateOnly(item.date)}: ${formatNumber(item.usage)} unit`}
                    />
                  </div>
                  <span className="history-chart-label">
                    {new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${item.date}T00:00:00Z`))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <div className="history-table-heading">
        <div>
          <h3>Detail riwayat transaksi</h3>
          <p>{periodData.length} transaksi pada periode terpilih</p>
        </div>
      </div>

      {periodData.length === 0 ? (
        <div className="table-card empty-state">Tidak ada transaksi untuk filter yang dipilih.</div>
      ) : (
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
                {periodData.map((row, index) => (
                  <tr key={row.id}>
                    <td className="cell-center cell-muted">{index + 1}</td>
                    <td className="cell-strong">{row.namaBarang}</td>
                    <td>{formatDate(row.tanggal)}</td>
                    <td>{row.keterangan}</td>
                    <td className={`cell-center ${row.keterangan === "PEMAKAIAN" ? "movement-negative" : "movement-positive"}`}>
                      {row.keterangan === "PEMAKAIAN" ? `-${Math.abs(row.jumlah)}` : `+${row.jumlah}`}
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
            {periodData.map((row, index) => (
              <article className="mobile-record" key={row.id}>
                <div className="mobile-record-heading">
                  <div>
                    <span className="mobile-record-index">Transaksi #{index + 1}</span>
                    <div className="mobile-record-title">{row.namaBarang}</div>
                  </div>
                  <span className={row.keterangan === "PEMAKAIAN" ? "movement-negative" : "movement-positive"}>
                    {row.keterangan === "PEMAKAIAN" ? `-${Math.abs(row.jumlah)}` : `+${row.jumlah}`}
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
      )}
    </div>
  );
};
