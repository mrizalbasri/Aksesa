import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScoreGauge from "@/components/scoring/ScoreGauge";
import FactorBreakdown from "@/components/scoring/FactorBreakdown";
import RecommendationCard from "@/components/scoring/RecommendationCard";
import ScoreHistory from "@/components/scoring/ScoreHistory";
import LoanSimulator from "@/components/scoring/LoanSimulator";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { generatePdfReport } from "@/lib/pdfGenerator";

const ResultPage = () => {
  const score = 75; // Mock score

  // Mock data for the PDF report
  const reportData = {
    score: score,
    positiveFactors: [
      "Pembayaran tagihan selalu tepat waktu.",
      "Memiliki riwayat kredit yang panjang dan baik.",
      "Tingkat utilisasi kredit rendah.",
    ],
    negativeFactors: [
      "Baru-baru ini mengajukan beberapa pinjaman baru.",
      "Memiliki satu catatan keterlambatan pembayaran di masa lalu.",
    ],
    recommendations: [
      "Hindari mengajukan terlalu banyak kredit dalam waktu singkat.",
      "Terus pertahankan kebiasaan pembayaran yang baik.",
      "Pertimbangkan untuk diversifikasi jenis kredit Anda.",
    ],
  };

  const handleDownloadPdf = () => {
    generatePdfReport(reportData);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] py-12 text-[#111111]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <Card className="border-[#dedbd6] bg-white">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-semibold text-[#111111]">
                Hasil Analisis Skor Kredit Anda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center rounded-lg border border-[#dedbd6] bg-[#fffaf6] p-6">
                <ScoreGauge score={score} />
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    className="border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white"
                  >
                    <Share2 className="mr-2 size-4" />
                    Bagikan
                  </Button>
                  <Button
                    className="bg-[#ff5600] text-white hover:bg-[#e14b00]"
                    onClick={handleDownloadPdf}
                  >
                    <Download className="mr-2 size-4" />
                    Download Laporan PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <FactorBreakdown />
            <RecommendationCard />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <ScoreHistory />
            <LoanSimulator />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
