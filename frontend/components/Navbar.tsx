import React from "react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold text-white">
          SmartScore
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/#fitur"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-slate-300 hover:bg-slate-800 hover:text-white",
            )}
          >
            Fitur
          </Link>
          <Link
            href="/scoring"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-blue-600 text-white hover:bg-blue-700",
            )}
          >
            Mulai Scoring
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
