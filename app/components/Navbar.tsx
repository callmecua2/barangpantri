"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/lib/api";

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const pathname = usePathname();

  const links = [
    { href: "/stok", label: "Data Stok Pantry" },
    { href: "/update", label: "Update Stok" },
    { href: "/riwayat", label: "Riwayat Penggunaan" },
    { href: "/stok-habis", label: "Stok Pantry Habis/Kosong" },
  ];

  return (
    <>
      <section className="navigation-section">
        <nav className="nav-link">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-item ${pathname === link.href ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginLeft: "auto",
          }}
        >
          <span style={{ fontSize: 14 }}>
            Login sebagai: <strong>{user.nama}</strong>
          </span>
          <button
            onClick={onLogout}
            style={{ padding: "6px 12px", cursor: "pointer" }}
          >
            Logout
          </button>
        </div>
      </section>
      <hr className="divider" />
    </>
  );
}