import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const mockRecommendations = [
  "Tingkatkan konsistensi pencatatan transaksi harian Anda.",
  "Diversifikasi sumber pendapatan di luar penjualan utama.",
  "Pertimbangkan untuk mengurangi utang jangka pendek.",
];

interface RecommendationCardProps {
  recommendations?: string[];
}

const RecommendationCard = ({ recommendations }: RecommendationCardProps) => {
  const recommendationItems =
    recommendations && recommendations.length > 0
      ? recommendations
      : mockRecommendations;

  return (
    <Card className="border-[#dedbd6] bg-white">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-[#111111]">
          <Lightbulb className="mr-2 size-5 text-[#ff5600]" />
          Rekomendasi AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc space-y-2 pl-5 text-sm text-[#313130]">
          {recommendationItems.map((rec, index) => (
            <li key={`${rec}-${index}`}>{rec}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
