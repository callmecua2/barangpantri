"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/lib/api";

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/stok", label: "Data Stok Pantry" },
    { href: "/update", label: "Update Stok" },
    { href: "/riwayat", label: "Riwayat Penggunaan" },
    { href: "/stok-habis", label: "Stok Pantry Habis/Kosong" },
  ];

  return (
    <>
      <header className="navigation-section">
        <Link
          href="/stok"
          className="nav-brand"
          onClick={() => setMenuOpen(false)}
        >
          Pantry Stock
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? "Tutup navigasi" : "Buka navigasi"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
        </button>

        <div
          id="primary-navigation"
          className={`nav-content ${menuOpen ? "is-open" : ""}`}
        >
          <nav className="nav-link" aria-label="Navigasi utama">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`nav-item ${pathname === link.href ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="nav-user">
            <span className="nav-user-name">
              <span className="nav-user-label">Login sebagai</span>
              {user.nama}
            </span>
            <button type="button" className="nav-logout" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>
      <hr className="divider" />
    </>
  );
}
