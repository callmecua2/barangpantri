"use client";

import React, { useEffect, useMemo, useState } from "react";

export interface StockHistoryLog {
  id: string;
  no: number;
  barangId: string;
  namaBarang: string;
  tanggal: string;
  tanggalSebelumnya: string | null;
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

const pad = (value: number) => String(value).padStart(2, "0");

const dateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const dateKeyInJakarta = (date: Date) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
};

const todayKey = () => dateKeyInJakarta(new Date());

const parseDateKey = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const getDateRange = (selectedDate: string, period: Period) => {
  const selected = parseDateKey(selectedDate);
  let start = new Date(selected);
  let end = new Date(selected);

  if (period === "week") {
    const dayFromMonday = (selected.getDay() + 6) % 7;
    start.setDate(selected.getDate() - dayFromMonday);
    end = new Date(start);
    end.setDate(start.getDate() + 6);
  } else if (period === "month") {
    start = new Date(selected.getFullYear(), selected.getMonth(), 1);
    end = new Date(selected.getFullYear(), selected.getMonth() + 1, 0);
  }

  return { start: dateKey(start), end: dateKey(end) };
};

const formatDate = (isoString: string | null): string => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(date);
};

const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(date);
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("id-ID").format(value);

const periodLabel: Record<Period, string> = {
  day: "Harian",
  week: "Mingguan",
  month: "Bulanan",
};

const isUsage = (row: StockHistoryLog) => row.keterangan === "PEMAKAIAN";
const isRestock = (row: StockHistoryLog) => row.keterangan === "RESTOCK";

export const StockHistoryTable: React.FC<StockHistoryTableProps> = ({ data }) => {
  const [selectedItem, setSelectedItem] = useState("all");
  const [period, setPeriod] = useState<Period>("day");
  const [selectedDate, setSelectedDate] = useState("");
  const [isDateReady, setIsDateReady] = useState(false);

  useEffect(() => {
    setSelectedDate(todayKey());
    setIsDateReady(true);
  }, []);

  const items = useMemo(() => {
    const unique = new Map<string, string>();
    data.forEach((row) => {
      if (row.barangId && row.namaBarang !== "-") {
        unique.set(row.barangId, row.namaBarang);
      }
    });
    return [...unique.entries()].sort((a, b) => a[1].localeCompare(b[1], "id"));
  }, [data]);

  const range = useMemo(
    () => selectedDate ? getDateRange(selectedDate, period) : { start: "", end: "" },
    [selectedDate, period]
  );

  const filteredData = useMemo(
    () =>
      data.filter((row) => {
        const rowDate = dateKeyInJakarta(new Date(row.tanggal));
        const matchesItem = selectedItem === "all" || row.barangId === selectedItem;
        return matchesItem && rowDate >= range.start && rowDate <= range.end;
      }),
    [data, range, selectedItem]
  );

  const usageRows = useMemo(
    () => filteredData.filter(isUsage),
    [filteredData]
  );

  const restockRows = useMemo(
    () => filteredData.filter(isRestock),
    [filteredData]
  );

  const totalConsumed = usageRows.reduce((sum, row) => sum + Math.abs(row.jumlah), 0);
  const totalRestocked = restockRows.reduce((sum, row) => sum + row.jumlah, 0);

  const dailyBreakdown = useMemo(() => {
    const grouped = new Map<string, { count: number; consumed: number; restocked: number }>();

    filteredData.forEach((row) => {
      const key = dateKeyInJakarta(new Date(row.tanggal));
      const current = grouped.get(key) ?? { count: 0, consumed: 0, restocked: 0 };

      if (isUsage(row)) {
        current.count += 1;
        current.consumed += Math.abs(row.jumlah);
      } else if (isRestock(row)) {
        current.restocked += row.jumlah;
      }

      grouped.set(key, current);
    });

    return [...grouped.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, values]) => ({ date, ...values }));
  }, [filteredData]);

  const rangeDescription =
    range.start === range.end
      ? formatDate(`${range.start}T00:00:00+07:00`)
      : `${formatDate(`${range.start}T00:00:00+07:00`)} – ${formatDate(`${range.end}T00:00:00+07:00`)}`;

  if (!isDateReady) {
    return <div className="table-card empty-state" aria-live="polite">Menyiapkan analisis riwayat...</div>;
  }

  if (data.length === 0) {
    return <div className="table-card empty-state">Belum ada riwayat penggunaan stok.</div>;
  }

  return (
    <div className="history-analysis">
      <section className="history-filter-panel" aria-label="Filter analisis riwayat">
        <div className="history-filter-heading">
          <div>
            <h3>Analisis penggunaan</h3>
            <p>Pilih barang dan periode untuk melihat frekuensi serta jumlah pemakaian.</p>
          </div>
        </div>

        <div className="history-filter-grid">
          <label className="history-filter-field">
            <span>Nama barang</span>
            <select
              className="form-control"
              value={selectedItem}
              onChange={(event) => setSelectedItem(event.target.value)}
            >
              <option value="all">Semua barang</option>
              {items.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </label>

          <label className="history-filter-field">
            <span>Periode</span>
            <select
              className="form-control"
              value={period}
              onChange={(event) => setPeriod(event.target.value as Period)}
            >
              <option value="day">Per hari</option>
              <option value="week">Per minggu</option>
              <option value="month">Per bulan</option>
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
        </div>

        <p className="history-range-caption">
          Menampilkan {periodLabel[period].toLowerCase()} · {rangeDescription}
        </p>
      </section>

      <section className="history-summary-grid" aria-label="Ringkasan pemakaian">
        <article className="history-summary-card">
          <span className="history-summary-label">Frekuensi pemakaian</span>
          <strong>{formatNumber(usageRows.length)} <small>kali</small></strong>
          <span className="history-summary-note">Jumlah transaksi pemakaian</span>
        </article>
        <article className="history-summary-card">
          <span className="history-summary-label">Total pemakaian</span>
          <strong>{formatNumber(totalConsumed)} <small>unit</small></strong>
          <span className="history-summary-note">Barang yang benar-benar digunakan</span>
        </article>
        <article className="history-summary-card">
          <span className="history-summary-label">Total restock</span>
          <strong>{formatNumber(totalRestocked)} <small>unit</small></strong>
          <span className="history-summary-note">Barang yang ditambahkan kembali</span>
        </article>
      </section>

      <section className="history-breakdown-section">
        <div className="history-section-heading">
          <div>
            <h3>Rincian pemakaian per hari</h3>
            <p>Transaksi RESTOCK tidak dihitung sebagai konsumsi.</p>
          </div>
        </div>

        {dailyBreakdown.length === 0 ? (
          <div className="table-card empty-state">Tidak ada transaksi pada periode ini.</div>
        ) : (
          <div className="table-card">
            <div className="table-scroll">
              <table className="responsive-table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th className="cell-center">Frekuensi pemakaian</th>
                    <th className="cell-center">Total terpakai</th>
                    <th className="cell-center">Total restock</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyBreakdown.map((day) => (
                    <tr key={day.date}>
                      <td className="cell-strong">{formatDate(`${day.date}T00:00:00+07:00`)}</td>
                      <td className="cell-center">{formatNumber(day.count)} kali</td>
                      <td className="cell-center movement-negative">{formatNumber(day.consumed)} unit</td>
                      <td className="cell-center movement-positive">{formatNumber(day.restocked)} unit</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <section className="history-records-section">
        <div className="history-section-heading">
          <div>
            <h3>Detail riwayat transaksi</h3>
            <p>{formatNumber(filteredData.length)} transaksi pada periode terpilih.</p>
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="table-card empty-state">Tidak ada transaksi yang cocok dengan filter.</div>
        ) : (
          <div className="table-card">
            <div className="table-scroll responsive-table-desktop">
              <table className="responsive-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Barang</th>
                    <th>Tanggal & Jam</th>
                    <th>Tanggal Update Sebelumnya</th>
                    <th>Keterangan</th>
                    <th className="cell-center">Jumlah</th>
                    <th>Penanggung Jawab</th>
                    <th className="cell-center">Stok Sebelum</th>
                    <th className="cell-center">Stok Setelah</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={row.id}>
                      <td className="cell-center cell-muted">{index + 1}</td>
                      <td className="cell-strong">{row.namaBarang}</td>
                      <td>{formatDateTime(row.tanggal)}</td>
                      <td>{formatDate(row.tanggalSebelumnya)}</td>
                      <td>{row.keterangan}</td>
                      <td className={`cell-center ${row.jumlah < 0 ? "movement-negative" : "movement-positive"}`}>
                        {row.jumlah > 0 ? `+${row.jumlah}` : row.jumlah}
                      </td>
                      <td>{row.penanggungJawab}</td>
                      <td className="cell-center">{row.stokSebelumUpdate}</td>
                      <td className="cell-center">{row.stokSetelahUpdate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mobile-records">
              {filteredData.map((row, index) => (
                <article className="mobile-record" key={row.id}>
                  <div className="mobile-record-heading">
                    <div>
                      <span className="mobile-record-index">Transaksi #{index + 1}</span>
                      <div className="mobile-record-title">{row.namaBarang}</div>
                    </div>
                    <span className={row.jumlah < 0 ? "movement-negative" : "movement-positive"}>
                      {row.jumlah > 0 ? `+${row.jumlah}` : row.jumlah}
                    </span>
                  </div>
                  <div className="mobile-record-grid">
                    <div className="mobile-field">
                      <span className="mobile-field-label">Tanggal & jam</span>
                      <span className="mobile-field-value">{formatDateTime(row.tanggal)}</span>
                    </div>
                    <div className="mobile-field">
                      <span className="mobile-field-label">Update sebelumnya</span>
                      <span className="mobile-field-value">{formatDate(row.tanggalSebelumnya)}</span>
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
      </section>
    </div>
  );
};
