import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { BriefcaseBusiness, MapPin, Users, Building2 } from "lucide-react";
import { ScoringFormValues } from "@/lib/validators";

const BusinessProfileForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ScoringFormValues>();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-[24px] font-normal text-[#111111] leading-none tracking-[-0.48px] flex items-center gap-2">
          <BriefcaseBusiness className="text-[#ff5600] w-6 h-6" />
          Profil Bisnis
        </h3>
        <p className="text-[#626260] text-[16px] leading-[1.50]">
          Informasi ini digunakan untuk memetakan skala bisnis dan kelayakan pembiayaan Anda.
        </p>
      </div>

      <div className="bg-[#faf9f6] p-6 rounded-[8px] border border-[#dedbd6] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 group">
            <label
              htmlFor="business-age"
              className="text-[12px] font-medium tracking-[0.6px] uppercase text-[#626260] flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-[#9c9fa5] group-hover:text-[#ff5600] transition-colors" />
              Lama Usaha (Bulan)
            </label>
            <Input
              id="business-age"
              type="number"
              placeholder="Contoh: 12"
              className={`h-12 bg-white border-[#dedbd6] text-[#111111] shadow-sm focus:border-[#ff5600] focus:ring-1 focus:ring-[#ff5600]/20 rounded-[4px] transition-all ${
                errors.businessAge ? "border-[#c41c1c] focus:border-[#c41c1c] bg-[#c41c1c]/5" : ""
              }`}
              {...register("businessAge")}
            />
            {errors.businessAge && (
              <p className="mt-1 text-[12px] font-medium text-[#c41c1c]">
                {errors.businessAge.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2 group">
            <label
              htmlFor="employees"
              className="text-[12px] font-medium tracking-[0.6px] uppercase text-[#626260] flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-[#9c9fa5] group-hover:text-[#ff5600] transition-colors" />
              Jumlah Karyawan
            </label>
            <Input
              id="employees"
              type="number"
              placeholder="Contoh: 3"
              className={`h-12 bg-white border-[#dedbd6] text-[#111111] shadow-sm focus:border-[#ff5600] focus:ring-1 focus:ring-[#ff5600]/20 rounded-[4px] transition-all ${
                errors.employees ? "border-[#c41c1c] focus:border-[#c41c1c] bg-[#c41c1c]/5" : ""
              }`}
              {...register("employees")}
            />
            {errors.employees && (
              <p className="mt-1 text-[12px] font-medium text-[#c41c1c]">
                {errors.employees.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2 group pt-4 border-t border-[#dedbd6] mt-6">
          <label
            htmlFor="location"
            className="text-[12px] font-medium tracking-[0.6px] uppercase text-[#626260] flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-[#9c9fa5] group-hover:text-[#ff5600] transition-colors" />
            Lokasi Usaha (Kota)
          </label>
          <Input
            id="location"
            type="text"
            placeholder="Contoh: Jakarta Selatan"
            className={`h-12 bg-white border-[#dedbd6] text-[#111111] shadow-sm focus:border-[#ff5600] focus:ring-1 focus:ring-[#ff5600]/20 rounded-[4px] transition-all ${
              errors.location ? "border-[#c41c1c] focus:border-[#c41c1c] bg-[#c41c1c]/5" : ""
            }`}
            {...register("location")}
          />
          {errors.location && (
            <p className="mt-1 text-[12px] font-medium text-[#c41c1c]">
              {errors.location.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessProfileForm;
