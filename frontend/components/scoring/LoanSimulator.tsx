import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LoanSimulator = () => {
  const [amount, setAmount] = useState<number>(10000000);
  const [tenor, setTenor] = useState<number>(12); // in months
  const [interestRate, setInterestRate] = useState<number>(1.5); // assumed 1.5% flat monthly interest
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);

  const calculateLoan = () => {
    // Simple flat interest calculation
    const principalPerMonth = amount / tenor;
    const interestPerMonth = amount * (interestRate / 100);
    setMonthlyPayment(principalPerMonth + interestPerMonth);
  };

  // Calculate initially on mount
  useEffect(() => {
    calculateLoan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="border-[#dedbd6] bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-[#111111]">
          Simulator Pinjaman
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 text-[#313130]">
          <div className="space-y-2">
            <label className="text-sm font-medium">Jumlah Pinjaman (Rp)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="border-[#dedbd6] bg-white text-[#111111]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tenor (Bulan)</label>
            <Input
              type="number"
              value={tenor}
              onChange={(e) => setTenor(Number(e.target.value))}
              className="border-[#dedbd6] bg-white text-[#111111]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Bunga Flat (%/Bulan)</label>
            <Input
              type="number"
              value={interestRate}
              readOnly
              disabled
              className="border-[#dedbd6] bg-[#f3f1ec] text-[#7b7b78] opacity-100"
            />
          </div>

          <Button
            onClick={calculateLoan}
            className="w-full bg-[#ff5600] text-white hover:bg-[#e14b00]"
          >
            Hitung Estimasi Cicilan
          </Button>
        </div>

        {monthlyPayment > 0 && (
          <div className="rounded-lg border border-[#cde6c4] bg-[#eff9ec] p-6 text-center">
            <p className="text-sm font-medium text-[#2c6415]">
              Estimasi Cicilan per Bulan
            </p>
            <p className="mt-2 text-3xl font-bold text-[#2c6415]">
              {formatRupiah(monthlyPayment)}
            </p>
            <p className="mt-1 text-xs text-[#7b7b78]">
              *Estimasi dapat berubah tergantung persetujuan akhir
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoanSimulator;
