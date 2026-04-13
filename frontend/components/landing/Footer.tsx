import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-end">
          
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 mb-4 opacity-50 grayscale">
              <div className="flex size-6 items-center justify-center border border-current font-serif font-bold text-xs">A</div>
              <span className="font-serif italic font-bold">Aksesa.</span>
            </div>
            <p className="text-sm font-medium font-mono text-slate-500 max-w-md">
              Validasi non-bankable.<br/>
              Inklusi finansial faktual untuk UMKM Indonesia.
            </p>
          </div>

          <nav className="flex items-center gap-6 font-mono text-xs font-bold uppercase tracking-widest text-slate-500">
            <Link href="/" className="hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">
              Dokumentasi
            </Link>
            <Link href="/scoring" className="hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">
              Panel Uji
            </Link>
          </nav>

        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600 font-mono">
          <p>COPYRIGHT &copy; 2026 AKSESA.</p>
          <p className="mt-2 md:mt-0">V.1.0.0-BETACITY</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
