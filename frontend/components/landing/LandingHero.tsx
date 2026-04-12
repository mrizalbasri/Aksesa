import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LandingHero = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.24),transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-200">
            Platform Credit Scoring UMKM
          </p>
          <h1 className="mt-6 bg-gradient-to-r from-blue-200 via-blue-400 to-cyan-300 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
            Aksesa
            <span className="mt-2 block text-slate-100">
              Akses pembiayaan lebih adil untuk pelaku usaha Indonesia.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm text-slate-300 sm:text-base">
            Nilai kelayakan kredit bisnis Anda dari data alternatif seperti
            nota penjualan, transaksi harian, dan profil usaha, lalu dapatkan
            rekomendasi tindakan yang jelas.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/scoring"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 bg-blue-600 px-6 text-white hover:bg-blue-700"
              )}
            >
              Mulai Scoring Sekarang
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#fitur"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 border-slate-500 bg-transparent px-6 text-slate-100 hover:bg-slate-800 hover:text-white"
              )}
            >
              Lihat Fitur
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
