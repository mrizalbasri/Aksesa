import React from "react";
import { useFormContext } from "react-hook-form";
import { UploadCloud, FileImage, FileCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScoringFormValues } from "@/lib/validators";

const InvoiceUpload = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<ScoringFormValues>();

  const file = watch("file") as FileList | undefined;
  const hasFile = file && file.length > 0;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
          <FileImage className="text-orange-500 w-6 h-6" />
          Upload Invoice atau Nota
        </h3>
        <p className="text-slate-400 text-sm">
          Unggah bukti nota penjualan atau invoice terbaru untuk membantu kami memverifikasi omset bisnis Anda.
        </p>
      </div>

      <div className="relative group w-full">
        {/* Glow effect behind the box */}
        <div className={`absolute -inset-1 rounded-2xl blur-lg transition duration-500 opacity-20 group-hover:opacity-60 ${
          errors.file ? 'bg-rose-500/50' : hasFile ? 'bg-emerald-500/50' : 'bg-orange-500/30'
        }`}></div>
        
        <label
          htmlFor="dropzone-file"
          className={`relative z-10 flex h-72 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 bg-slate-900/80 backdrop-blur-sm ${
            errors.file 
              ? "border-rose-500/50 hover:border-rose-500/80" 
              : hasFile
                ? "border-emerald-500/50 hover:border-emerald-500/80"
                : "border-slate-700/80 hover:border-orange-500/60 hover:bg-slate-800/80"
          }`}
        >
          <div className="flex flex-col items-center justify-center p-8 text-center">
            {hasFile ? (
              <>
                <div className="w-20 h-20 mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <FileCheck className="h-10 w-10 text-emerald-400 drop-shadow-md" />
                </div>
                <p className="mb-2 text-lg font-medium text-emerald-400">
                  File berhasil dipilih
                </p>
                <p className="text-sm mb-4 text-slate-300 truncate max-w-xs px-4 py-2 bg-slate-800/60 rounded-lg border border-slate-700">
                  {file[0]?.name}
                </p>
                <p className="text-xs text-slate-500 transition-colors group-hover:text-slate-300">
                  Klik untuk mengganti file
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mb-6 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shadow-inner group-hover:scale-110 group-hover:bg-slate-800/80 transition-all duration-300">
                  <UploadCloud className="h-10 w-10 text-slate-400 group-hover:text-orange-400 transition-colors" />
                </div>
                <p className="mb-3 text-base text-slate-300">
                  <span className="font-semibold text-orange-400 group-hover:text-orange-300">Klik untuk upload</span> atau seret dan lepas
                </p>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-md border border-slate-700/50">
                  <span>PNG, JPG</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                  <span>Maks. 5MB</span>
                </div>
              </>
            )}
          </div>
          <Input
            id="dropzone-file"
            type="file"
            accept="image/png, image/jpeg"
            className="hidden"
            {...register("file")}
          />
        </label>
      </div>

      {errors.file && (
        <div className="flex items-center gap-2 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-lg">
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold">!</span>
          {errors.file.message as string}
        </div>
      )}
    </div>
  );
};

export default InvoiceUpload;
