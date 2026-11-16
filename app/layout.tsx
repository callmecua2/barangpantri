/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
} from "react";

import "./globals.css";

import {
  api,
  StockItem,
  toStockData,
  toLowStockData,
  toHistoryLogs,
} from "@/lib/api";

import Navbar from "./components/Navbar";

interface AppContextType {
  stockItems: StockItem[];
  stockTableData: any[];
  lowStockData: any[];
  historyLogs: any[];
  loading: boolean;
  refreshAll: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const usePantry = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("usePantry harus digunakan di dalam AppContext");
  return context;
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      const [stocks, histories] = await Promise.all([
        api.getStock(),
        api.getAllHistory(),
      ]);
      setStockItems(stocks);
      setHistoryLogs(toHistoryLogs(histories));
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshAll();
  }, [refreshAll]);

  const stockTableData = toStockData(stockItems);
  const lowStockData = toLowStockData(stockItems);

  return (
    <html lang="id">
      <body>
        <AppContext.Provider value={{
          stockItems,
          stockTableData,
          lowStockData,
          historyLogs,
          loading,
          refreshAll,
        }}>
          <div id="app-container">
            <Navbar />
            <main className="app-main">
              {loading && <p style={{ marginBottom: 16 }}>Memuat data...</p>}
              {children}
            </main>
          </div>
        </AppContext.Provider>
      </body>
    </html>
  );
}
