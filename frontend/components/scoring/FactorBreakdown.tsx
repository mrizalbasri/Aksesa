import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, TrendingUp, TrendingDown } from "lucide-react";

const mockFactors = [
  { name: "Konsistensi Transaksi", weight: 0.8, positive: true },
  { name: "Tren Pendapatan", weight: 0.7, positive: true },
  { name: "Usia Bisnis", weight: 0.9, positive: true },
  { name: "Rasio Utang", weight: 0.4, positive: false },
];

interface FactorBreakdownProps {
  factors?: string[];
}

const FactorBreakdown = ({ factors }: FactorBreakdownProps) => {
  const factorItems =
    factors && factors.length > 0
      ? factors.map((name) => ({ name, weight: 0.7, positive: true }))
      : mockFactors;

  return (
    <Card className="border-[#dedbd6] bg-white">
      <CardHeader>
        <CardTitle className="text-lg text-[#111111]">
          Faktor Penentu Skor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {factorItems.map((factor) => (
            <li key={factor.name} className="flex items-center justify-between">
              <div className="flex items-center">
                {factor.positive ? (
                  <CheckCircle className="mr-2 size-5 text-green-500" />
                ) : (
                  <XCircle className="mr-2 size-5 text-red-500" />
                )}
                <span className="text-sm text-[#313130]">{factor.name}</span>
              </div>
              <div className="flex items-center">
                <span
                  className={`text-sm font-semibold ${
                    factor.positive ? "text-[#2c6415]" : "text-[#c41c1c]"
                  }`}
                >
                  {factor.positive ? "Positif" : "Negatif"}
                </span>
                {factor.positive ? (
                  <TrendingUp className="ml-2 size-4 text-[#2c6415]" />
                ) : (
                  <TrendingDown className="ml-2 size-4 text-[#c41c1c]" />
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default FactorBreakdown;
