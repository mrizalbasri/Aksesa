import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LandingHero = () => {
  return (
    <section className="relative w-full border-b-2 border-slate-900 bg-[#F9F8F6] pt-12 pb-24 md:pt-24 md:pb-32 overflow-hidden">
      {/* Decorative texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          
          <div className="md:col-span-8 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 border-2 border-slate-900 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-900 mb-8 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              Credit Scoring Engine 1.0
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif text-slate-900 font-medium tracking-tight leading-[1.1]">
              Akses modal untuk UMKM, <br/><span className="text-slate-500 italic">bukan hanya korporasi.</span>
            </h1>
            
            <p className="mt-8 max-w-2xl text-lg md:text-xl text-slate-700 font-medium leading-relaxed">
              Kami memvalidasi potensi bisnis Anda tanpa bergantung pada laporan bank tradisional. Cukup unggah nota toko dan biarkan AI membuktikan kelayakan kredit Anda.
            </p>
            
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/scoring"
                className="group relative inline-flex h-14 items-center justify-center border-2 border-slate-900 bg-[#C2410C] px-8 text-base font-bold text-white transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]"
              >
                Mulai Kalkulasi Skor
                <ArrowUpRight className="ml-2 size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
              
              <a
                href="#fitur"
                className="group relative inline-flex h-14 items-center justify-center border-2 border-slate-900 bg-white px-8 text-base font-bold text-slate-900 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
              >
                Penjelasan Metode
              </a>
            </div>
          </div>
          
          <div className="md:col-span-4 hidden md:flex flex-col h-full justify-between">
            {/* Visual Ledger Element */}
            <div className="border-2 border-slate-900 bg-white p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-end mb-4">
                <span className="text-xs font-mono font-bold text-slate-500">ID: AKS-9321</span>
                <span className="font-serif italic font-bold">Stempel Layak</span>
              </div>
              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between border-b border-dashed border-slate-300 pb-2">
                  <span>Nota Masuk</span>
                  <span className="font-bold">42 Berkas</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-slate-300 pb-2">
                  <span>Validasi OCR</span>
                  <span className="text-green-700 font-bold">LULUS</span>
                </div>
                <div className="flex justify-between pt-2 items-center">
                  <span className="text-xs uppercase">Skor Final</span>
                  <span className="text-4xl text-slate-900 tracking-tighter">84<span className="text-lg text-slate-400">/100</span></span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LandingHero;
