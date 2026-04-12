"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ScoreGaugeProps {
  score: number;
}

const getRiskCategory = (score: number) => {
  if (score <= 40) return "Risiko Tinggi";
  if (score <= 70) return "Risiko Sedang";
  return "Layak Kredit";
};

const getColor = (score: number) => {
  if (score <= 40) return "#ef4444"; // red-500
  if (score <= 70) return "#f59e0b"; // amber-500
  return "#22c55e"; // green-500
};

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const data = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ];

  const color = getColor(score);
  const riskCategory = getRiskCategory(score);

  return (
    <div className="relative flex flex-col items-center">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#374151" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 -translate-y-1/4 text-center">
        <p className="text-4xl font-bold text-white">{score}</p>
        <p className="text-sm font-medium" style={{ color }}>
          {riskCategory}
        </p>
      </div>
    </div>
  );
};

export default ScoreGauge;
