import React from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

const LandingHero = () => {
  return (
    <section className="relative w-full overflow-hidden border-b border-[#dedbd6] bg-[#faf9f6] pb-14 pt-10 md:pb-20 md:pt-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-10 h-52 w-52 rounded-full bg-[#ff5600]/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#2c6415]/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center lg:justify-between">
          {/* Left Content */}
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-3xl text-4xl font-semibold leading-[1.04] tracking-[-1px] text-[#111111] sm:text-5xl md:text-[64px] md:tracking-[-1.6px]"
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

          {/* Trust Snapshot Card */}
          <motion.div
            initial={{ opacity: 0, x: 40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="flex-1 lg:flex lg:justify-end"
          >
            <div className="w-full max-w-sm rounded-2xl border border-[#dedbd6] bg-white/80 backdrop-blur-sm p-6 shadow-lg sm:p-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="flex items-center gap-2 mb-6"
              >
                <CheckCircle2 className="size-5 text-[#2c6415]" />
                <span className="text-sm font-semibold text-[#626260]">Kepercayaan Aksesa</span>
              </motion.div>

              {/* Stats */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  className="border-b border-[#dedbd6] pb-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#626260] mb-1">Accuracy Rate</p>
                      <p className="text-2xl font-bold text-[#111111]">94.2%</p>
                    </div>
                    <TrendingUp className="size-6 text-[#ff5600]" />
                  </div>
                  <p className="text-xs text-[#626260] mt-2">Tingkat akurasi prediksi kredit</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="border-b border-[#dedbd6] pb-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#626260] mb-1">UMKM Terbantu</p>
                      <p className="text-2xl font-bold text-[#111111]">2,847+</p>
                    </div>
                    <Users className="size-6 text-[#2c6415]" />
                  </div>
                  <p className="text-xs text-[#626260] mt-2">Usaha telah dinilai dan mendapat modal</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 }}
                >
                  <p className="text-xs text-[#626260] mb-2">Diverifikasi oleh</p>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-[#ff5600]/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-[#ff5600]">MS</span>
                    </div>
                    <span className="text-sm font-medium text-[#111111]">Microsoft</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;