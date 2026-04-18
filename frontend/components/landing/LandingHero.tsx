import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const LandingHero = () => {
  return (
    <section className="relative w-full border-b border-[#dedbd6] bg-[#faf9f6] pb-16 pt-10 md:pb-32 md:pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          <div className="md:col-span-8 flex flex-col items-start">
            <div className="mb-8 inline-flex items-center gap-2 rounded border border-[#dedbd6] bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-[#626260]">
              <span className="h-2 w-2 rounded-full bg-[#ff5600]" />
              Credit Scoring Engine 1.0
            </div>

            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-[#111111] sm:text-5xl md:text-7xl">
              Akses modal untuk UMKM,
              <span className="block text-[#626260] md:inline md:pl-2">
                bukan hanya korporasi.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#313130] sm:mt-8 sm:text-lg md:text-xl">
              Kami memvalidasi potensi bisnis Anda tanpa bergantung pada laporan
              bank tradisional. Cukup unggah nota toko dan biarkan AI
              membuktikan kelayakan kredit Anda.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                href="/scoring"
                className="group inline-flex h-12 w-full items-center justify-center rounded border border-[#111111] bg-[#ff5600] px-6 text-sm font-medium text-white transition-transform hover:scale-[1.03] sm:h-14 sm:w-auto sm:px-8 sm:text-base"
              >
                Mulai Kalkulasi Skor
                <ArrowUpRight className="ml-2 size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>

              <a
                href="#fitur"
                className="group inline-flex h-12 w-full items-center justify-center rounded border border-[#111111] bg-white px-6 text-sm font-medium text-[#111111] transition-colors hover:bg-[#111111] hover:text-white sm:h-14 sm:w-auto sm:px-8 sm:text-base"
              >
                Penjelasan Metode
              </a>
            </div>
          </div>

          <div className="md:col-span-4 hidden md:flex flex-col h-full justify-between">
            <div className="rounded-lg border border-[#dedbd6] bg-white p-6 transition-colors hover:border-[#ff5600]">
              <div className="mb-4 flex items-end justify-between border-b border-[#dedbd6] pb-4">
                <span className="text-xs font-medium text-[#7b7b78]">
                  ID: AKS-9321
                </span>
                <span className="text-sm font-semibold text-[#111111]">
                  Stempel Layak
                </span>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-dashed border-[#dedbd6] pb-2">
                  <span>Nota Masuk</span>
                  <span className="font-semibold">42 Berkas</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-[#dedbd6] pb-2">
                  <span>Validasi OCR</span>
                  <span className="font-semibold text-[#2c6415]">LULUS</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs uppercase text-[#7b7b78]">
                    Skor Final
                  </span>
                  <span className="text-4xl tracking-tight text-[#111111]">
                    84<span className="text-lg text-[#9c9fa5]">/100</span>
                  </span>
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
