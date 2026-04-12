import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const mockRecommendations = [
  "Tingkatkan konsistensi pencatatan transaksi harian Anda.",
  "Diversifikasi sumber pendapatan di luar penjualan utama.",
  "Pertimbangkan untuk mengurangi utang jangka pendek.",
];

const RecommendationCard = () => {
  return (
    <Card className="border-slate-800 bg-slate-900">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-white">
          <Lightbulb className="mr-2 size-5 text-amber-400" />
          Rekomendasi AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-slate-300 list-disc pl-5">
          {mockRecommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
