import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#dedbd6] bg-[#faf9f6]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded border border-[#111111] bg-[#ff5600] text-sm font-semibold text-white">
            A
          </div>
          <span className="text-xl font-semibold tracking-tight text-[#111111]">
            ksesa.
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/#fitur"
            className="text-sm font-medium text-[#626260] transition-colors hover:text-[#111111]"
          >
            Fitur Utama
          </Link>
          <Link
            href="/#keamanan-data"
            className="text-sm font-medium text-[#626260] transition-colors hover:text-[#111111]"
          >
            Keamanan Data
          </Link>
          <Link
            href="/scoring"
            className="inline-flex h-10 items-center justify-center rounded border border-[#111111] bg-[#111111] px-5 text-sm font-medium text-white transition-colors hover:bg-white hover:text-[#111111]"
          >
            Akses Panel
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/scoring"
            className="inline-flex h-9 items-center justify-center rounded border border-[#111111] bg-[#111111] px-3 text-xs font-medium text-white transition-colors hover:bg-white hover:text-[#111111]"
          >
            Panel
          </Link>
          <details className="group relative">
            <summary className="list-none cursor-pointer rounded border border-[#111111] px-3 py-2 text-xs font-medium text-[#111111] transition-colors hover:bg-[#111111] hover:text-white">
              Menu
            </summary>
            <div className="absolute right-0 mt-2 w-52 rounded-md border border-[#dedbd6] bg-[#fffdf9] p-2 shadow-sm">
              <Link
                href="/#fitur"
                className="block rounded px-3 py-2 text-sm text-[#111111] transition-colors hover:bg-[#f5f4f1]"
              >
                Fitur Utama
              </Link>
              <Link
                href="/#keamanan-data"
                className="block rounded px-3 py-2 text-sm text-[#111111] transition-colors hover:bg-[#f5f4f1]"
              >
                Keamanan Data
              </Link>
              <Link
                href="/scoring"
                className="block rounded px-3 py-2 text-sm text-[#111111] transition-colors hover:bg-[#f5f4f1]"
              >
                Akses Panel
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
