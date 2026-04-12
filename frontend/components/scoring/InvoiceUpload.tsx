import React from "react";
import { useFormContext } from "react-hook-form";
import { UploadCloud } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScoringFormValues } from "@/lib/validators";

const InvoiceUpload = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ScoringFormValues>();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">
        Langkah 1: Upload Invoice atau Nota
      </h3>
      <p className="text-sm text-slate-300">
        Upload file gambar (JPG/PNG, maks 5MB) dari nota penjualan atau invoice
        terbaru Anda.
      </p>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-slate-800/50 hover:bg-slate-800 ${
            errors.file ? "border-red-500" : "border-slate-700"
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-8 h-8 mb-4 text-slate-400" />
            <p className="mb-2 text-sm text-slate-400">
              <span className="font-semibold">Klik untuk upload</span> atau
              seret dan lepas
            </p>
            <p className="text-xs text-slate-500">PNG, JPG (MAX. 5MB)</p>
          </div>
          <Input
            id="dropzone-file"
            type="file"
            className="hidden"
            {...register("file")}
          />
        </label>
      </div>
      {errors.file && (
        <p className="text-sm text-red-500">{errors.file.message as string}</p>
      )}
    </div>
  );
};

export default InvoiceUpload;
