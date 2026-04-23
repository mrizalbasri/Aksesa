import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { simulateLoan } from "@/lib/api";

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

interface LoanSimulatorProps {
  score: number;
}

const PRESET_AMOUNTS = [5000000, 10000000, 20000000, 50000000];
const PRESET_TENORS = [6, 12, 18, 24];

const LoanSimulator = ({ score }: LoanSimulatorProps) => {
  const [amount, setAmount] = useState<number>(10000000);
  const [tenor, setTenor] = useState<number>(12);
  const [result, setResult] = useState<{
    monthlyPayment: number;
    interestRate: number;
    totalPayment: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await simulateLoan({ amount, score, tenor_months: tenor });
      setResult({
        monthlyPayment: res.estimated_monthly_payment,
        interestRate: res.monthly_interest_rate,
        totalPayment: res.estimated_monthly_payment * tenor,
      });
    } catch {
      setError("Gagal menghitung simulasi. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetAmount = (val: number) => {
    setAmount(val);
    setResult(null);
  };

  const handlePresetTenor = (val: number) => {
    setTenor(val);
    setResult(null);
  };

  return (
    <Card className="border-[#dedbd6] bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-[#111111]">
          Simulator Pinjaman
        </CardTitle>
        <p className="mt-1 text-xs text-[#7b7b78]">
          Bunga dihitung berdasarkan skor kredit Anda ({score}/100)
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Presets */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#313130]">
            Jumlah Pinjaman
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_AMOUNTS.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handlePresetAmount(val)}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  amount === val
                    ? "border-[#ff5600] bg-[#ff5600] text-white"
                    : "border-[#dedbd6] text-[#313130] hover:border-[#111111]"
                }`}
              >
                {formatRupiah(val)}
              </button>
            ))}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-[#7b7b78]">Atau:</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(Number(e.target.value));
                setResult(null);
              }}
              className="flex-1 rounded-md border border-[#dedbd6] px-3 py-1.5 text-sm text-[#111111]"
              placeholder="Masukkan nominal lain"
            />
          </div>
        </div>

        {/* Tenor Presets */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#313130]">Tenor (Bulan)</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_TENORS.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handlePresetTenor(val)}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  tenor === val
                    ? "border-[#ff5600] bg-[#ff5600] text-white"
                    : "border-[#dedbd6] text-[#313130] hover:border-[#111111]"
                }`}
              >
                {val} Bulan
              </button>
            ))}
          </div>
        </div>

        {/* Interest Rate Info */}
        <div className="rounded-lg border border-[#dedbd6] bg-[#faf9f6] px-4 py-2 text-sm text-[#626260]">
          <span className="font-medium text-[#313130]">Bunga per bulan: </span>
          <span className="font-bold text-[#ff5600]">
            {score >= 71
              ? "1.2%"
              : score >= 41
                ? "1.6%"
                : "2.2%"}
          </span>
          <span className="ml-2 text-xs text-[#7b7b78]">
            (didasarkan pada kategori risiko Anda)
          </span>
        </div>

        <Button
          onClick={runSimulation}
          disabled={isLoading || amount <= 0 || tenor <= 0}
          className="w-full bg-[#ff5600] text-white hover:bg-[#e14b00] disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Menghitung...
            </>
          ) : (
            "Hitung Estimasi Cicilan"
          )}
        </Button>

        {error ? (
          <div className="rounded-lg border border-[#fe4c02] bg-[#fff4ee] px-4 py-2 text-sm text-[#fe4c02]">
            {error}
          </div>
        ) : null}

        {result ? (
          <div className="space-y-3 rounded-lg border border-[#cde6c4] bg-[#eff9ec] p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-[#2c6415]">
                Estimasi Cicilan per Bulan
              </p>
              <p className="mt-1 text-3xl font-bold text-[#2c6415]">
                {formatRupiah(result.monthlyPayment)}
              </p>
              <p className="mt-1 text-xs text-[#7b7b78]">
                Bunga {result.interestRate}% flat/bulan × {tenor} bulan
              </p>
            </div>
            <div className="mt-3 border-t border-[#cde6c4] pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#2c6415]">Total Pinjaman</span>
                <span className="font-medium text-[#2c6415]">
                  {formatRupiah(amount)}
                </span>
              </div>
              <div className="mt-1 flex justify-between text-sm">
                <span className="text-[#2c6415]">Total Bunga</span>
                <span className="font-medium text-[#2c6415]">
                  {formatRupiah(result.totalPayment - amount)}
                </span>
              </div>
              <div className="mt-2 flex justify-between border-t border-[#cde6c4] pt-2 font-semibold">
                <span className="text-[#2c6415]">Total Pengembalian</span>
                <span className="text-[#2c6415]">
                  {formatRupiah(result.totalPayment)}
                </span>
              </div>
            </div>
            <p className="text-center text-xs text-[#7b7b78]">
              *Estimasi dapat berubah tergantung persetujuan akhir lembaga
              pembiayaan.
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default LoanSimulator;