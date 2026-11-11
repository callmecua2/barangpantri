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
    throw new Error("usePantry harus digunakan di dalam AppContext");
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
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    api
      .getMe()
      .then((response) => {
        if (!isMounted) return;

        if (response?.data) {
          setUser(response.data);
          void refreshAll();
        } else {
          setUser(null);
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.error("Gagal memeriksa sesi:", error);
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

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    void refreshAll();
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
            {!authChecked && <p style={{ padding: 24 }}>Memuat...</p>}

            {authChecked && !user && <LoginForm onLogin={handleLoginSuccess} />}

            {authChecked && user && (
              <Navbar user={user} onLogout={handleLogout} />
            )}

            <main className="app-main">
              {loading && user && (
                <p style={{ marginBottom: 16 }}>Memuat data...</p>
              )}
              {children}
            </main>
          </div>
        </AppContext.Provider>
      </body>
    </html>
  );
}
