import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-lg font-semibold text-white">Aksesa</p>
            <p className="text-sm text-slate-400">
              Solusi credit scoring alternatif berbasis AI untuk UMKM Indonesia.
            </p>
          </div>

          <nav className="flex items-center gap-4 text-sm text-slate-300">
            <Link href="/" className="hover:text-white">
              Beranda
            </Link>
            <Link href="/scoring" className="hover:text-white">
              Scoring
            </Link>
          </nav>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Copyright &copy; 2026 Aksesa. Semua hak dilindungi.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
