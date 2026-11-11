
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
  authChecked: boolean;
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

  if (!context) {
    throw new Error(
      "usePantry harus digunakan di dalam AppContext"
    );
  }

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
      console.error("Gagal mengambil data:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memeriksa sesi autentikasi
  useEffect(() => {
    let isMounted = true;

    api
      .getMe()
      .then((res) => {
        if (!isMounted) return;

        if (res?.data) {
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
        if (isMounted) {
          setAuthChecked(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [refreshAll]);

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
        <AppContext.Provider
          value={{
            user,
            authChecked,
            stockItems,
            stockTableData,
            lowStockData,
            historyLogs,
            loading,
            refreshAll,
          }}
        >
          <div id="app-container">

            {/* Status autentikasi */}
            {!authChecked && (
              <p style={{ padding: 24 }}>
                Memuat...
              </p>
            )}

            {/* Login */}
            {authChecked && !user && (
              <LoginForm
                onLogin={handleLoginSuccess}
              />
            )}

            {/* Navbar */}
            {authChecked && user && (
              <Navbar
                user={user}
                onLogout={handleLogout}
              />
            )}

            {/* Children selalu dirender */}
            <main style={{ padding: "24px" }}>
              {loading && user && (
                <p style={{ marginBottom: 12 }}>
                  Memuat data...
                </p>
              )}

              {children}
            </main>

          </div>
        </AppContext.Provider>
      </body>
    </html>
  );
}
