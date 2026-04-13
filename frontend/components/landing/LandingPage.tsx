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
    <main className="min-h-screen bg-[#F9F8F6] text-slate-900 font-sans selection:bg-red-200">
      <LandingHero />
      
      <section id="fitur" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 border-t-2 border-slate-900">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3 border-b-2 border-slate-900 inline-block pb-1">
              Kapabilitas Sistem
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight">
              Infrastruktur untuk <i>Inklusi Finansial</i>.
            </h3>
          </div>
          <p className="max-w-xs text-sm text-slate-600 font-medium border-l-2 border-red-700 pl-4">
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
