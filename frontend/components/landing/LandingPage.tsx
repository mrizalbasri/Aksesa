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
      
      <Footer />
    </main>
  );
};

export default LandingPage;
