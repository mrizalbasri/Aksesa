import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const LandingHero = () => {
  return (
    <section className="relative w-full overflow-hidden border-b border-[#dedbd6] bg-[#faf9f6] pb-14 pt-10 md:pb-20 md:pt-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-10 h-52 w-52 rounded-full bg-[#ff5600]/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#2c6415]/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl text-4xl font-semibold leading-[1.04] tracking-[-1px] text-[#111111] sm:text-5xl md:text-[64px] md:tracking-[-1.6px]"
          >
            Modal bisnis tidak perlu menunggu laporan keuangan formal.
            <span className="mt-1 block text-[#626260]">
              Cukup data usaha harian yang nyata.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-[#313130] sm:text-lg"
          >
            Unggah nota 1 tahun, atau isi transaksi harian, atau input penjualan marketplace — sesuai data yang Anda miliki.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <Link
              href="/scoring"
              className="group inline-flex h-12 items-center justify-center rounded border border-[#111111] bg-[#ff5600] px-8 text-sm font-medium text-white transition-colors hover:bg-[#e64d00] sm:h-14 sm:px-10 sm:text-base"
            >
              Mulai Kalkulasi Skor
              <ArrowUpRight className="ml-2 size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;