import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-slate-900 bg-[#F9F8F6]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex size-8 items-center justify-center border-2 border-slate-900 bg-[#C2410C] text-white font-serif font-bold transition-transform group-hover:rotate-6">A</div>
          <span className="text-xl font-serif font-bold tracking-tight text-slate-900 italic">
            ksesa.
          </span>
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link
            href="/#fitur"
            className="text-sm font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-colors"
          >
            Fitur Utama
          </Link>
          <Link
            href="/scoring"
            className="hidden sm:inline-flex h-10 items-center justify-center border-2 border-slate-900 bg-white px-5 text-sm font-bold text-slate-900 transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
          >
            Akses Panel
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
