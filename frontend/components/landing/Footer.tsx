import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-[#dedbd6] bg-[#fcfaf7] text-[#626260]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-4 h-24 w-24 rounded-full bg-[#ff5600]/7 blur-3xl" />
        <div className="absolute right-10 bottom-6 h-20 w-20 rounded-full bg-[#2c6415]/6 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-end">
          <div className="text-center md:text-left">
            <div className="mb-4 inline-flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded border border-[#111111] bg-[#ff5600] text-xs font-semibold text-white">
                A
              </div>
              <span className="font-semibold text-[#111111]">Aksesa.</span>
            </div>
            <p className="max-w-md text-sm">
              Validasi non-bankable.
              <br />
              Inklusi finansial faktual untuk UMKM Indonesia.
            </p>
          </div>

          <nav className="flex items-center gap-6 text-xs font-medium uppercase tracking-[0.08em]">
            <Link
              href="/"
              className="border-b border-transparent pb-1 transition-colors hover:border-[#ff5600] hover:text-[#111111]"
            >
              Dokumentasi
            </Link>
            <Link
              href="/#keamanan-data"
              className="border-b border-transparent pb-1 transition-colors hover:border-[#ff5600] hover:text-[#111111]"
            >
              Keamanan Data
            </Link>
            <Link
              href="/scoring"
              className="border-b border-transparent pb-1 transition-colors hover:border-[#ff5600] hover:text-[#111111]"
            >
              Panel Uji
            </Link>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-[#dedbd6] pt-6 text-xs md:flex-row">
          <p>COPYRIGHT &copy; 2026 AKSESA.</p>
          <p className="mt-2 md:mt-0">V.1.0.0-BETACITY</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
