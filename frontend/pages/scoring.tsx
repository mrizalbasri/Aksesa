import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ScoringPage = () => {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <section className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-20 sm:px-6 lg:px-8">
        <p className="inline-flex w-fit rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-200">
          Phase 2 Frontend
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Halaman Scoring Sedang Disiapkan
        </h1>
        <p className="text-sm text-slate-300 sm:text-base">
          Landing page sudah aktif. Langkah berikutnya adalah implementasi form
          scoring lengkap dengan upload dokumen, input transaksi, dan validasi
          data bisnis.
        </p>
        <div>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-slate-500 bg-transparent text-slate-100 hover:bg-slate-800 hover:text-white"
            )}
          >
            Kembali ke Beranda
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ScoringPage;
