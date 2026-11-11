/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, createContext, useContext, useCallback } from "react";
import "./globals.css";
import {
  api,
  User,
  StockItem,
  toStockData,
  toLowStockData,
  toHistoryLogs,
} from "@/lib/api";
import Navbar from "./components/Navbar";
import LoginForm from "./components/LoginForm";

interface AppContextType {
  user: User | null;
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  // 1. Cek sesi saat mount. Jika user valid, langsung fetch data.
useEffect(() => {
  let isMounted = true;
  api
    .getMe()
    .then((res) => {
      if (!isMounted) return;
      if (res && res.data) {
        setUser(res.data);
        refreshAll();
      } else {
        setUser(null);
      }
    })
    .catch((err) => {
      if (isMounted) {
        console.error("Gagal memeriksa sesi:", err);
        setUser(null);
      }
    })
    .finally(() => {
      if (isMounted) setAuthChecked(true);
    });

  return () => {
    isMounted = false;
  };
}, [refreshAll]);

  // Handler saat user berhasil submit form login
  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    refreshAll();
  };

  const handleLogout = async () => {
    await api.logout().catch(() => {});
    setUser(null);
    setStockItems([]);
    setHistoryLogs([]);
  };

  const stockTableData = toStockData(stockItems);
  const lowStockData = toLowStockData(stockItems);

  return (
    <html lang="id">
      <body>
        <div id="app-container">
          {!authChecked ? (
            <p style={{ padding: 24 }}>Memuat...</p>
          ) : !user ? (
            <LoginForm onLogin={handleLoginSuccess} />
          ) : (
            <AppContext.Provider
              value={{
                user,
                stockItems,
                stockTableData,
                lowStockData,
                historyLogs,
                loading,
                refreshAll,
              }}
            >
              <Navbar user={user} onLogout={handleLogout} />
              <main style={{ padding: "24px" }}>
                {loading && <p style={{ marginBottom: 12 }}>Memuat data...</p>}
                {children}
              </main>
            </AppContext.Provider>
          )}
        </div>
      </body>
    </html>
  );
}