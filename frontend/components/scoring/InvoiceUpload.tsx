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
    <div className="space-y-7">
      <div className="space-y-2">
        <h3 className="flex items-center gap-2 text-[26px] font-semibold tracking-[-0.4px] text-[#1f1d1a]">
          <FileImage className="h-6 w-6 text-[#ff5600]" />
          Upload Invoice atau Nota
        </h3>
        <p className="max-w-3xl text-[16px] leading-relaxed text-[#5f5b54]">
          Unggah bukti nota penjualan atau invoice terbaru untuk membantu kami
          memverifikasi omset bisnis Anda.
        </p>
      </div>

      <div className="relative group w-full">
        <label
          htmlFor="dropzone-file"
          className={`relative z-10 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border transition-all duration-300 dark:!text-[#1f1d1a] ${
            errors.file
              ? "border-[#c41c1c] bg-[#fff7f7]"
              : hasFile
                ? "border-[#2c6415] bg-[#f3faef]"
                : "border-[#dad4cc] border-dashed bg-[#fffdfa] hover:border-[#ff5600] hover:bg-white"
          }`}
        >
          <div className="flex flex-col items-center justify-center p-8 text-center">
            {hasFile ? (
              <>
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-lg bg-white border border-[#cde6c4]">
                  <FileCheck className="h-10 w-10 text-[#2c6415]" />
                </div>
                <p className="mb-2 text-[18px] font-semibold text-[#2c6415]">
                  File berhasil dipilih
                </p>
                <p className="mb-4 max-w-xs truncate rounded-md border border-[#cde6c4] bg-white px-4 py-2 text-[15px] text-[#1f1d1a]">
                  {file[0]?.name}
                </p>
                <p className="text-[14px] text-[#5f5b54]">
                  Klik untuk mengganti file
                </p>
              </>
            ) : (
              <>
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-lg border border-[#dcd6ce] bg-white transition-all duration-300 group-hover:border-[#ff5600] group-hover:scale-105">
                  <UploadCloud className="h-10 w-10 text-[#9c9fa5] transition-colors group-hover:text-[#ff5600]" />
                </div>
                <p className="mb-3 text-[17px] text-[#5f5b54]">
                  <span className="font-semibold text-[#ff5600]">
                    Klik untuk upload
                  </span>{" "}
                  atau seret dan lepas
                </p>
                <div className="flex items-center gap-2 rounded-md border border-[#ddd7cf] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6a655e]">
                  <span>PNG, JPG</span>
                  <span className="h-1 w-1 rounded-full bg-[#d3cec6]"></span>
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
        <div className="flex items-center gap-2 rounded-lg border border-[#c41c1c]/30 bg-[#fff7f7] px-4 py-3 text-sm text-[#c41c1c]">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#c41c1c] text-[10px] font-bold text-white">
            !
          </span>
          {errors.file.message as string}
        </div>
      )}
    </div>
  );
};

export default InvoiceUpload;
