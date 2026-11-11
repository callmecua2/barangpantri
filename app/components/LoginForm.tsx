/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { api, User } from "@/lib/api";

export default function LoginForm({ onLogin }: { onLogin: (user: User) => void }) {
  const [nama, setNama] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!nama.trim()) {
      setErr("Nama wajib diisi.");
      return;
    }

    setLoading(true);
    setErr("");

    try {
      const response = await api.login(nama.trim());
      onLogin(response.data);
    } catch (error: any) {
      setErr(error.message || "Login gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <section className="login-card">
        <h2>Login Stok Pantry</h2>
        <p className="login-description">
          Masuk untuk melihat dan mengelola persediaan pantry.
        </p>

        <form onSubmit={submit} className="update-form" style={{ padding: 0, border: 0, boxShadow: "none" }}>
          <div className="form-field">
            <label className="form-label" htmlFor="login-nama">Nama kamu</label>
            <input
              id="login-nama"
              type="text"
              value={nama}
              onChange={(event) => setNama(event.target.value)}
              placeholder="Masukkan nama"
              className="form-control"
              autoComplete="username"
              autoFocus
              required
              disabled={loading}
            />
          </div>

          {err && <p className="form-error" role="alert">{err}</p>}

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </section>
    </div>
  );
}
