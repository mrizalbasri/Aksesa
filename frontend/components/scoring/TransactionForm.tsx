import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
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
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-[#111111]">
        Langkah 2: Input Transaksi Harian
      </h3>
      <p className="text-sm text-[#626260]">
        Masukkan data transaksi harian Anda selama 7 hari terakhir.
      </p>
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <div className="flex-grow">
              <Input
                type="date"
                {...register(`transactions.${index}.date`)}
                className={
                  errors.transactions?.[index]?.date ? "border-red-500" : ""
                }
              />
              {errors.transactions?.[index]?.date && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.transactions[index].date.message}
                </p>
              )}
            </div>
            <div className="flex-grow">
              <Input
                type="number"
                placeholder="Jumlah (Rp)"
                {...register(`transactions.${index}.amount`)}
                className={
                  errors.transactions?.[index]?.amount ? "border-red-500" : ""
                }
              />
              {errors.transactions?.[index]?.amount && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.transactions[index].amount.message}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => remove(index)}
              className="text-red-500 hover:bg-red-500/10 mt-1"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ date: "", amount: 0 })}
        className="border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white"
      >
        <PlusCircle className="mr-2 size-4" />
        Tambah Transaksi
      </Button>
      {errors.transactions && (
        <p className="text-sm text-red-500">{errors.transactions.message}</p>
      )}
    </div>
  );
};

export default TransactionForm;
