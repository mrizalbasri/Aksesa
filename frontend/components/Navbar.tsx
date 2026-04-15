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

        <nav className="flex items-center gap-6">
          <Link
            href="/#fitur"
            className="text-sm font-medium text-[#626260] transition-colors hover:text-[#111111]"
          >
            Fitur Utama
          </Link>
          <Link
            href="/scoring"
            className="hidden sm:inline-flex h-10 items-center justify-center rounded border border-[#111111] bg-[#111111] px-5 text-sm font-medium text-white transition-colors hover:bg-white hover:text-[#111111]"
          >
            Akses Panel
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
