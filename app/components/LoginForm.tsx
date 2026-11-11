/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { api, User } from "@/lib/api";

export default function LoginForm({ onLogin }: { onLogin: (u: User) => void }) {
  const [nama, setNama] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setErr("Nama wajib diisi");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const r = await api.login(nama.trim());
      onLogin(r.data);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 360,
        margin: "80px auto",
        padding: 24,
        border: "1px solid #ddd",
        borderRadius: 8,
      }}
    >
      <h2 style={{ marginBottom: 16 }}>Login Stok Pantry</h2>
      <form
        onSubmit={submit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <label>
          Nama kamu
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Masukkan nama"
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            autoFocus
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 16px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Memuat..." : "Masuk"}
        </button>
        {err && <p style={{ color: "red", margin: 0 }}>{err}</p>}
      </form>
    </div>
  );
}