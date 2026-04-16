import React from "react";
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
  type LucideIcon,
} from "lucide-react";

type LandingFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const LandingPage = () => {
  const features: LandingFeature[] = [
    {
      title: "Input Data Alternatif",
      description:
        "Lepaskan ketergantungan pada laporan standar. Upload nota, bon, dan kas harian Anda sebagai substitusi validasi formal.",
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
      question: "Siapa yang bisa menggunakan Aksesa?",
      answer:
        "Pelaku UMKM yang belum punya laporan keuangan formal tetap bisa menggunakan Aksesa dengan data alternatif seperti nota dan transaksi harian.",
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

      <section id="fitur" className="mx-auto max-w-6xl border-t border-[#dedbd6] px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="mb-3 inline-block border-b border-[#dedbd6] pb-1 text-sm font-medium uppercase tracking-[0.1em] text-[#7b7b78]">
              Kapabilitas Sistem
            </h2>
            <h3 className="text-4xl leading-tight text-[#111111] md:text-5xl">
              Infrastruktur untuk <span className="text-[#ff5600]">Inklusi Finansial</span>.
            </h3>
          </div>
          <p className="max-w-xs border-l-2 border-[#ff5600] pl-4 text-sm text-[#626260]">
            Didesain tanpa kosmetik berlebih. Setiap fitur adalah fungsi faktual yang menjembatani UMKM dengan kepercayaan institusi.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon || BadgeCent} // fallback
            />
          ))}
        </div>
      </section>

      <section
        id="keamanan-data"
        className="mx-auto max-w-6xl border-t border-[#dedbd6] bg-[#fffdf9] px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mb-12 flex flex-col gap-6">
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
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {securityHighlights.map((item) => {
            const Icon = item.icon || BadgeCent;

            return (
              <article
                key={item.title}
                className="rounded-lg border border-[#dedbd6] bg-white p-6 transition-colors hover:border-[#2c6415]"
              >
                <Icon className="mb-4 size-5 text-[#2c6415]" />
                <h4 className="text-lg font-semibold text-[#111111]">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-[#626260]">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl border-t border-[#dedbd6] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <h2 className="mb-3 inline-block border-b border-[#dedbd6] pb-1 text-sm font-medium uppercase tracking-[0.1em] text-[#7b7b78]">
            FAQ Singkat
          </h2>
          <h3 className="text-4xl leading-tight text-[#111111] md:text-5xl">
            Pertanyaan yang sering ditanyakan
          </h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-lg border border-[#dedbd6] bg-white p-5 transition-colors open:border-[#ff5600]"
            >
              <summary className="cursor-pointer list-none pr-8 text-base font-medium text-[#111111] marker:content-none">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#626260]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default LandingPage;
