import React, { useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import LandingHero from "./LandingHero";
import FeatureCard from "./FeatureCard";
import Footer from "./Footer";
import {
  FileText,
  BadgeCent,
  LineChart,
  Landmark,
  BrainCircuit,
  LockKeyhole,
  ShieldCheck,
  Trash2,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

type LandingFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const featureVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const securityVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const faqVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
    },
  }),
};

const LandingPage = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const featuresRef = useRef(null);
  const securityRef = useRef(null);
  const faqRef = useRef(null);

  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const securityInView = useInView(securityRef, { once: true, amount: 0.2 });
  const faqInView = useInView(faqRef, { once: true, amount: 0.2 });

  const features: LandingFeature[] = [
    {
      title: "Input Data Fleksibel",
      description:
        "Upload kumpulan nota 1 tahun, isi transaksi harian, atau input penjualan marketplace — sesuai kenyamanan Anda.",
      icon: FileText,
    },
    {
      title: "AI Kredit Engine",
      description:
        "Mesin analitik kognitif menelaah profil risiko dari pola transaksi untuk memberikan metrik kelayakan yang lebih dari sekadar angka.",
      icon: BrainCircuit,
    },
    {
      title: "Laporan Terbuka",
      description:
        "Skor direpresentasikan layaknya sertifikat faktual dengan detail transparan tentang kekuatan dan kelemahan finansial Anda.",
      icon: LineChart,
    },
    {
      title: "Mekanika Pinjaman",
      description:
        "Simulasikan proyeksi pengembalian dana pinjaman sebelum mengeksekusi komitmen dengan estimasi berbasis skor.",
      icon: Landmark,
    },
  ];
  const securityHighlights: LandingFeature[] = [
    {
      title: "Data terenkripsi",
      description: "Data dilindungi saat dikirim dan saat disimpan.",
      icon: LockKeyhole,
    },
    {
      title: "Akses terbatas",
      description: "Data hanya dipakai untuk analisis skor kredit Anda.",
      icon: ShieldCheck,
    },
    {
      title: "Kontrol penghapusan",
      description: "Anda bisa meminta penghapusan data sesuai kebutuhan.",
      icon: Trash2,
    },
  ];
  const faqs = [
    {
      question: "Apakah data transaksi saya aman?",
      answer:
        "Ya. Data digunakan khusus untuk proses penilaian kredit dan ditampilkan secara terbatas sesuai kebutuhan analisis.",
    },
    {
      question: "Saya tidak punya nota selama 1 tahun, bisa bagaimana?",
      answer:
        "Tidak masalah. Anda bisa input manual transaksi harian, atau kalau jualan di marketplace seperti Tokopedia/Shopee, bisa langsung input angka penjualan marketplace. Gunakan saja data yang Anda punya.",
    },
    {
      question: "Berapa lama proses scoring berlangsung?",
      answer:
        "Umumnya hanya beberapa menit setelah data utama terisi lengkap dan dokumen berhasil tervalidasi.",
    },
    {
      question: "Apakah skor dari Aksesa sudah final untuk persetujuan pinjaman?",
      answer:
        "Skor Aksesa menjadi indikator awal kelayakan. Keputusan akhir tetap mengikuti kebijakan lembaga pembiayaan yang menerima pengajuan Anda.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#faf9f6] font-sans text-[#111111] selection:bg-[#ffd8c2]">
      <LandingHero />

      <section
        id="fitur"
        ref={featuresRef}
        className="relative mx-auto max-w-6xl overflow-hidden border-t border-[#dedbd6] bg-[#fdfbf8] px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-10 top-8 h-32 w-32 rounded-full bg-[#ff5600]/7 blur-3xl" />
          <div className="absolute right-10 top-20 h-36 w-36 rounded-full bg-[#2c6415]/6 blur-3xl" />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
          >
            <div className="max-w-xl">
              <h2 className="mb-3 inline-block border-b border-[#dedbd6] pb-1 text-sm font-medium uppercase tracking-[0.1em] text-[#7b7b78]">
                Kapabilitas Sistem
              </h2>
              <h3 className="text-4xl leading-tight text-[#111111] md:text-5xl">
                Infrastruktur untuk{" "}
                <span className="text-[#ff5600]">Inklusi Finansial</span>.
              </h3>
            </div>
            <p className="max-w-xs border-l-2 border-[#ff5600] pl-4 text-sm text-[#626260]">
              Didesain tanpa kosmetik berlebih. Setiap fitur adalah fungsi
              faktual yang menjembatani UMKM dengan kepercayaan institusi.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                animate={featuresInView ? "visible" : "hidden"}
                variants={featureVariants}
              >
                <FeatureCard
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon || BadgeCent}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="keamanan-data"
        ref={securityRef}
        className="relative mx-auto max-w-6xl overflow-hidden border-t border-[#dedbd6] bg-[#fffdf9] px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-12 top-16 h-44 w-44 rounded-full bg-[#2c6415]/7 blur-3xl" />
          <div className="absolute left-8 bottom-12 h-32 w-32 rounded-full bg-[#ff5600]/5 blur-3xl" />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={securityInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-12 flex flex-col gap-6"
          >
            <div className="max-w-2xl">
              <h2 className="mb-3 inline-block border-b border-[#dedbd6] pb-1 text-sm font-medium uppercase tracking-[0.1em] text-[#7b7b78]">
                Keamanan Data
              </h2>
              <h3 className="text-4xl leading-tight text-[#111111] md:text-5xl">
                Data bisnis Anda kami jaga dengan standar yang jelas
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[#626260]">
                Data Anda diproses khusus untuk scoring, dengan kontrol yang
                transparan dan mudah dipahami.
              </p>
              <div className="mt-5 inline-flex items-center rounded-full border border-[#cde7c3] bg-[#f4fbf1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#2c6415]">
                Bukti Keamanan Aktif
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {securityHighlights.map((item, index) => {
              const Icon = item.icon || BadgeCent;

              return (
                <motion.article
                  key={item.title}
                  custom={index}
                  initial="hidden"
                  animate={securityInView ? "visible" : "hidden"}
                  variants={securityVariants}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="rounded-lg border border-[#dedbd6] bg-white p-6"
                >
                  <Icon className="mb-4 size-5 text-[#2c6415]" />
                  <h4 className="text-lg font-semibold text-[#111111]">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#626260]">
                    {item.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        ref={faqRef}
        className="relative mx-auto max-w-6xl overflow-hidden border-t border-[#dedbd6] bg-[#fcfaf7] px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-8 top-10 h-28 w-28 rounded-full bg-[#ff5600]/6 blur-3xl" />
          <div className="absolute -left-8 bottom-10 h-24 w-24 rounded-full bg-[#d7cec3]/45 blur-3xl" />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-12 max-w-2xl"
          >
            <h2 className="mb-3 inline-block border-b border-[#dedbd6] pb-1 text-sm font-medium uppercase tracking-[0.1em] text-[#7b7b78]">
              FAQ Singkat
            </h2>
            <h3 className="text-4xl leading-tight text-[#111111] md:text-5xl">
              Pertanyaan yang sering ditanyakan
            </h3>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              const panelId = `faq-panel-${index}`;
              const buttonId = `faq-trigger-${index}`;

              return (
                <motion.article
                  key={faq.question}
                  custom={index}
                  initial="hidden"
                  animate={faqInView ? "visible" : "hidden"}
                  variants={faqVariants}
                  className={`overflow-hidden rounded-lg border bg-white transition-colors duration-200 ${
                    isOpen ? "border-[#ff5600]" : "border-[#dedbd6]"
                  }`}
                >
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() =>
                      setOpenFaqIndex((current) =>
                        current === index ? null : index,
                      )
                    }
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                  >
                    <span className="text-base font-medium text-[#111111]">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="size-4 shrink-0 text-[#626260]" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-4">
                          <p className="text-sm leading-relaxed text-[#626260]">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default LandingPage;