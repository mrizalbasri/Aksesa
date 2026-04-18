import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Store } from "lucide-react";
import { ScoringFormValues } from "@/lib/validators";

const MarketplaceForm = () => {
  const { register } = useFormContext<ScoringFormValues>();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-[24px] font-normal text-[#111111] leading-none tracking-[-0.48px] flex items-center gap-2">
          <Store className="text-[#ff5600] w-6 h-6" />
          Data Marketplace 
          <span className="text-[12px] font-medium uppercase px-2 py-0.5 rounded-[4px] bg-[#faf9f6] text-[#626260] border border-[#dedbd6] ml-2 tracking-[0.6px]">Opsional</span>
        </h3>
        <p className="text-[#626260] text-[16px] leading-[1.50]">
          Jika bisnis Anda terhubung dengan marketplace, mohon input perkiraan rata-rata penjualan bulanan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
        <div className="bg-[#faf9f6] p-5 rounded-[8px] border border-[#dedbd6] hover:border-[#ff5600] hover:bg-white transition-all group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-[6px] bg-white flex items-center justify-center border border-[#dedbd6] group-hover:border-[#ff5600] transition-colors shadow-sm">
              <div className="w-5 h-5 bg-[#00da00] mask mask-hexagon rounded-sm transition-colors"></div>
            </div>
            <label
              htmlFor="tokopedia"
              className="text-[16px] font-medium text-[#111111] transition-colors"
            >
              Tokopedia
            </label>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#626260] font-mono text-[14px]">Rp</span>
            <Input
              id="tokopedia"
              type="number"
              placeholder="0"
              className="pl-11 h-12 bg-white border-[#dedbd6] text-[#111111] shadow-sm focus:border-[#ff5600] focus:ring-1 focus:ring-[#ff5600]/20 text-[16px] font-mono rounded-[4px] placeholder:text-[#9c9fa5]"
              {...register("tokopedia")}
            />
          </div>
        </div>

        <div className="bg-[#faf9f6] p-5 rounded-[8px] border border-[#dedbd6] hover:border-[#ff5600] hover:bg-white transition-all group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-[6px] bg-white flex items-center justify-center border border-[#dedbd6] group-hover:border-[#ff5600] transition-colors shadow-sm">
              <div className="w-5 h-5 bg-[#ff5600] mask mask-bag rounded-sm transition-colors"></div>
            </div>
            <label
              htmlFor="shopee"
              className="text-[16px] font-medium text-[#111111] transition-colors"
            >
              Shopee
            </label>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#626260] font-mono text-[14px]">Rp</span>
            <Input
              id="shopee"
              type="number"
              placeholder="0"
              className="pl-11 h-12 bg-white border-[#dedbd6] text-[#111111] shadow-sm focus:border-[#ff5600] focus:ring-1 focus:ring-[#ff5600]/20 text-[16px] font-mono rounded-[4px] placeholder:text-[#9c9fa5]"
              {...register("shopee")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceForm;
