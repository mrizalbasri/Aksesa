import React from "react";
import LandingHero from "./LandingHero";
import FeatureCard from "./FeatureCard";
import Footer from "./Footer";
import {
  BarChart3,
  BrainCircuit,
  FileText,
  HandCoins,
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
        "Upload nota, invoice, atau catat transaksi harian untuk dianalisis.",
      icon: FileText,
    },
    {
      title: "AI Scoring Engine",
      description:
        "Dapatkan skor kredit akurat berbasis AI yang transparan dan adil.",
      icon: BrainCircuit,
    },
    {
      title: "Dashboard Interaktif",
      description:
        "Visualisasikan skor, lihat faktor penentu, dan dapatkan rekomendasi.",
      icon: BarChart3,
    },
    {
      title: "Simulasi Pinjaman",
      description:
        "Simulasikan pinjaman berdasarkan skormu untuk perencanaan keuangan.",
      icon: HandCoins,
    },
  ];

  return (
    <main className="bg-slate-950 text-slate-50">
      <LandingHero />
      <section id="fitur" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Fitur Utama SmartScore UMKM
          </h2>
          <p className="mt-4 text-slate-300">
            Dirancang untuk memberdayakan UMKM Indonesia dengan teknologi
            finansial terdepan.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default LandingPage;
