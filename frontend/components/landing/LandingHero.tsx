import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { animated, useSpring } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const LandingHero = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [ctaHovered, setCtaHovered] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);

  const ctaSpring = useSpring({
    transform: prefersReducedMotion
      ? "scale(1)"
      : ctaHovered
        ? "scale(1.02)"
        : "scale(1)",
    config: { tension: 280, friction: 22 },
    immediate: prefersReducedMotion,
  });

  const cardSpring = useSpring({
    from: prefersReducedMotion
      ? { opacity: 1, transform: "translateY(0px)", boxShadow: "none" }
      : {
          opacity: 0,
          transform: "translateY(14px)",
          boxShadow: "0 10px 20px rgba(17,17,17,0.06)",
        },
    to: prefersReducedMotion
      ? { opacity: 1, transform: "translateY(0px)", boxShadow: "none" }
      : {
          opacity: 1,
          transform: cardHovered ? "translateY(-6px)" : "translateY(0px)",
          boxShadow: cardHovered
            ? "0 22px 46px rgba(17,17,17,0.16)"
            : "0 16px 38px rgba(17,17,17,0.12)",
        },
    config: { tension: 230, friction: 24 },
    immediate: prefersReducedMotion,
  });

  return (
    <section className="relative w-full overflow-hidden border-b border-[#dedbd6] bg-[#faf9f6] pb-14 pt-10 md:pb-20 md:pt-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-10 h-52 w-52 rounded-full bg-[#ff5600]/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#2c6415]/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12 md:gap-12">
          <div className="flex flex-col items-start md:col-span-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded border border-[#dedbd6] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#626260]">
              <span className="h-2 w-2 rounded-full bg-[#ff5600]" />
              Credit Scoring Engine 1.0
            </div>

            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.04] tracking-[-1px] text-[#111111] sm:text-5xl md:text-[64px] md:tracking-[-1.6px]">
              Modal bisnis tidak perlu menunggu laporan keuangan formal.
              <span className="mt-1 block text-[#626260]">
                Cukup data usaha harian yang nyata.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#313130] sm:text-lg">
              Unggah nota 1 tahun, atau isi transaksi harian, atau input
              penjualan marketplace — sesuai data yang Anda miliki.
            </p>

            <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
              <animated.div
                style={ctaSpring}
                className="w-full sm:w-auto"
                onMouseEnter={() => setCtaHovered(true)}
                onMouseLeave={() => setCtaHovered(false)}
              >
                <Link
                  href="/scoring"
                  className="group inline-flex h-12 w-full items-center justify-center rounded border border-[#111111] bg-[#ff5600] px-6 text-sm font-medium text-white sm:h-14 sm:w-auto sm:px-8 sm:text-base"
                  onFocus={() => setCtaHovered(true)}
                  onBlur={() => setCtaHovered(false)}
                >
                  Mulai Kalkulasi Skor
                  <ArrowUpRight className="ml-2 size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </animated.div>

              <a
                href="#fitur"
                className="group inline-flex h-12 w-full items-center justify-center rounded border border-[#111111] bg-white px-6 text-sm font-medium text-[#111111] transition-colors hover:bg-[#111111] hover:text-white sm:h-14 sm:w-auto sm:px-8 sm:text-base"
              >
                Penjelasan Metode
              </a>
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#6a655e]">
              Tidak perlu laporan bank. Gunakan data yang Anda punya.
            </p>
          </div>

          <div className="md:col-span-4">
            <div className="relative mt-1 md:mt-6">
              <div className="pointer-events-none absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-lg border border-[#e6e0d8] bg-[#f7f1ea]" />

              <animated.div
                style={cardSpring}
                className="relative z-10 rounded-lg border border-[#dedbd6] bg-white p-6"
                onMouseEnter={() => setCardHovered(true)}
                onMouseLeave={() => setCardHovered(false)}
              >
                <div className="mb-3 inline-flex items-center rounded bg-[#fff4ee] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#ff5600]">
                  Trust Snapshot
                </div>

                <p className="text-sm leading-relaxed text-[#313130]">
                  Data masuk tervalidasi dan siap dianalisis.
                </p>

                <div className="mt-4 flex items-center justify-between rounded border border-[#e5e0d8] bg-[#fcfaf7] px-3 py-2 text-sm">
                  <span className="text-[#313130]">Validasi OCR</span>
                  <span className="font-semibold text-[#2c6415]">LULUS</span>
                </div>

                <div className="pt-4">
                  <div className="mb-2 flex items-center justify-between text-[11px] font-medium text-[#7b7b78]">
                    <span>Progress Validasi</span>
                    <span>84%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#efeae3]">
                    <div className="h-full w-[84%] rounded-full bg-[#2c6415]" />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-dashed border-[#dedbd6] pt-4">
                  <span className="text-xs uppercase text-[#7b7b78]">Skor Final</span>
                  <span className="text-4xl tracking-tight text-[#111111]">
                    84<span className="text-lg text-[#9c9fa5]">/100</span>
                  </span>
                </div>
              </animated.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
