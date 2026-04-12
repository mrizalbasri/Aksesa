import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { ScoringFormValues } from "@/lib/validators";

const BusinessProfileForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ScoringFormValues>();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">
        Langkah 4: Profil Bisnis
      </h3>
      <p className="text-sm text-slate-300">
        Lengkapi informasi dasar mengenai bisnis Anda.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="business-age"
            className="text-sm font-medium text-slate-300"
          >
            Lama Usaha (Bulan)
          </label>
          <Input
            id="business-age"
            type="number"
            placeholder="Contoh: 12"
            className={`mt-1 ${errors.businessAge ? "border-red-500" : ""}`}
            {...register("businessAge")}
          />
          {errors.businessAge && (
            <p className="mt-1 text-xs text-red-500">
              {errors.businessAge.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="employees"
            className="text-sm font-medium text-slate-300"
          >
            Jumlah Karyawan
          </label>
          <Input
            id="employees"
            type="number"
            placeholder="Contoh: 3"
            className={`mt-1 ${errors.employees ? "border-red-500" : ""}`}
            {...register("employees")}
          />
          {errors.employees && (
            <p className="mt-1 text-xs text-red-500">
              {errors.employees.message}
            </p>
          )}
        </div>
        <div className="md:col-span-2">
          <label
            htmlFor="location"
            className="text-sm font-medium text-slate-300"
          >
            Lokasi Usaha (Kota)
          </label>
          <Input
            id="location"
            type="text"
            placeholder="Contoh: Jakarta"
            className={`mt-1 ${errors.location ? "border-red-500" : ""}`}
            {...register("location")}
          />
          {errors.location && (
            <p className="mt-1 text-xs text-red-500">
              {errors.location.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessProfileForm;
