import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, TrendingUp, TrendingDown } from "lucide-react";

const mockFactors = [
  { name: "Konsistensi Transaksi", weight: 0.8, positive: true },
  { name: "Tren Pendapatan", weight: 0.7, positive: true },
  { name: "Usia Bisnis", weight: 0.9, positive: true },
  { name: "Rasio Utang", weight: 0.4, positive: false },
];

const FactorBreakdown = () => {
  return (
    <Card className="border-slate-800 bg-slate-900">
      <CardHeader>
        <CardTitle className="text-lg text-white">
          Faktor Penentu Skor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {mockFactors.map((factor) => (
            <li key={factor.name} className="flex items-center justify-between">
              <div className="flex items-center">
                {factor.positive ? (
                  <CheckCircle className="mr-2 size-5 text-green-500" />
                ) : (
                  <XCircle className="mr-2 size-5 text-red-500" />
                )}
                <span className="text-sm text-slate-300">{factor.name}</span>
              </div>
              <div className="flex items-center">
                <span
                  className={`text-sm font-semibold ${
                    factor.positive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {factor.positive ? "Positif" : "Negatif"}
                </span>
                {factor.positive ? (
                  <TrendingUp className="ml-2 size-4 text-green-400" />
                ) : (
                  <TrendingDown className="ml-2 size-4 text-red-400" />
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
