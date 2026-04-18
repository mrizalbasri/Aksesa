import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, CalendarHeart } from "lucide-react";
import { ScoringFormValues } from "@/lib/validators";

const TransactionForm = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ScoringFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "transactions",
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="flex items-center gap-2 text-[24px] font-semibold text-[#111111]">
          <CalendarHeart className="h-6 w-6 text-[#ff5600]" />
          Input Transaksi Harian
        </h3>
        <p className="text-base text-[#626260]">
          Masukkan data transaksi harian Anda selama 7 hari terakhir agar kami bisa menganalisis cashflow Anda.
        </p>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="group flex flex-col items-start gap-4 rounded-lg border border-[#dedbd6] bg-[#faf9f6] p-4 transition-all hover:border-[#ff5600] hover:bg-white sm:flex-row"
          >
            <div className="flex-grow w-full">
              <label className="mb-2 block text-[12px] font-medium uppercase tracking-[0.08em] text-[#626260]">
                Tanggal Transaksi
              </label>
              <Input
                type="date"
                {...register(`transactions.${index}.date`)}
                className={`h-10 rounded ${
                  errors.transactions?.[index]?.date
                    ? "border-[#c41c1c] bg-[#fff6f6] focus:border-[#c41c1c]"
                    : "border-[#dedbd6] bg-white text-[#111111] focus:border-[#ff5600] focus-visible:ring-[#ff5600]/20"
                }`}
              />
              {errors.transactions?.[index]?.date && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-[#c41c1c]">
                  <span className="inline-block h-1 w-1 rounded-full bg-[#c41c1c]"></span>
                  {errors.transactions[index].date.message}
                </p>
              )}
            </div>
            <div className="flex-grow w-full">
              <label className="mb-2 block text-[12px] font-medium uppercase tracking-[0.08em] text-[#626260]">
                Total Amount (Rp)
              </label>
              <Input
                type="number"
                placeholder="0"
                {...register(`transactions.${index}.amount`)}
                className={`h-10 rounded font-mono ${
                  errors.transactions?.[index]?.amount
                    ? "border-[#c41c1c] bg-[#fff6f6] focus:border-[#c41c1c]"
                    : "border-[#dedbd6] bg-white text-[#111111] focus:border-[#ff5600] focus-visible:ring-[#ff5600]/20"
                }`}
              />
              {errors.transactions?.[index]?.amount && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-[#c41c1c]">
                  <span className="inline-block h-1 w-1 rounded-full bg-[#c41c1c]"></span>
                  {errors.transactions[index].amount.message}
                </p>
              )}
            </div>
            <div className="flex items-end h-[68px] sm:pb-0 pb-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                className="h-10 w-10 rounded p-0 text-[#9c9fa5] transition-colors hover:bg-[#fff4ee] hover:text-[#ff5600] disabled:opacity-30 disabled:hover:bg-transparent"
                title="Hapus baris"
              >
                <Trash2 className="size-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ date: "", amount: 0 })}
          className="h-12 w-full rounded-[4px] border-[#111111] bg-white px-8 text-[#111111] transition-colors hover:bg-[#111111] hover:text-white sm:w-auto"
        >
          <PlusCircle className="mr-2 size-5" />
          Tambah Baris Transaksi
        </Button>
      </div>
      
      {errors.transactions && !Array.isArray(errors.transactions) && (
        <div className="flex items-center gap-2 rounded border border-[#c41c1c]/30 bg-[#fff6f6] px-4 py-3 text-sm text-[#c41c1c]">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#c41c1c] text-[10px] font-bold text-white">!</span>
          {errors.transactions.message}
        </div>
      )}
    </div>
  );
};

export default TransactionForm;
