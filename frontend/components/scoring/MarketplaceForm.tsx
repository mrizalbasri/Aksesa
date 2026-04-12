import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { ScoringFormValues } from "@/lib/validators";

const MarketplaceForm = () => {
  const { register } = useFormContext<ScoringFormValues>();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">
        Langkah 3: Data Marketplace (Opsional)
      </h3>
      <p className="text-sm text-slate-300">
        Jika Anda berjualan di marketplace, masukkan total penjualan bulanan
        Anda.
      </p>
      <div className="space-y-3">
        <div>
          <label
            htmlFor="tokopedia"
            className="text-sm font-medium text-slate-300"
          >
            Penjualan Tokopedia (Bulan Terakhir)
          </label>
          <Input
            id="tokopedia"
            type="number"
            placeholder="Rp 0"
            className="mt-1"
            {...register("tokopedia")}
          />
        </div>
        <div>
          <label
            htmlFor="shopee"
            className="text-sm font-medium text-slate-300"
          >
            Penjualan Shopee (Bulan Terakhir)
          </label>
          <Input
            id="shopee"
            type="number"
            placeholder="Rp 0"
            className="mt-1"
            {...register("shopee")}
          />
        </div>
      </div>
    </div>
  );
};

export default MarketplaceForm;
