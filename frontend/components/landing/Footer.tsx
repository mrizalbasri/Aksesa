import React from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const linkVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const Footer = () => {
  const footerRef = useRef(null);
  const inView = useInView(footerRef, { once: true, amount: 0.3 });

  return (
    <footer ref={footerRef} className="relative overflow-hidden border-t border-[#dedbd6] bg-[#fcfaf7] text-[#626260]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-4 h-24 w-24 rounded-full bg-[#ff5600]/7 blur-3xl" />
        <div className="absolute right-10 bottom-6 h-20 w-20 rounded-full bg-[#2c6415]/6 blur-3xl" />
      </div>

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={footerVariants}
        className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-end">
          <motion.div variants={linkVariants} className="text-center md:text-left">
            <div className="mb-4 inline-flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded border border-[#111111] bg-[#ff5600] text-xs font-semibold text-white">
                A
              </div>
              <span className="font-semibold text-[#111111]">Aksesa.</span>
            </div>
            <p className="max-w-md text-sm">
              Validasi non-bankable.
              <br />
              Inklusi finansial faktual untuk UMKM Indonesia.
            </p>
          </motion.div>

          <nav className="flex items-center gap-6 text-xs font-medium uppercase tracking-[0.08em]">
            <motion.div variants={linkVariants}>
              <Link
                href="/"
                className="border-b border-transparent pb-1 transition-colors hover:border-[#ff5600] hover:text-[#111111]"
              >
                Dokumentasi
              </Link>
            </motion.div>
            <motion.div variants={linkVariants}>
              <Link
                href="/#keamanan-data"
                className="border-b border-transparent pb-1 transition-colors hover:border-[#ff5600] hover:text-[#111111]"
              >
                Keamanan Data
              </Link>
            </motion.div>
            <motion.div variants={linkVariants}>
              <Link
                href="/scoring"
                className="border-b border-transparent pb-1 transition-colors hover:border-[#ff5600] hover:text-[#111111]"
              >
                Panel Uji
              </Link>
            </motion.div>
          </nav>
        </div>

        <motion.div
          variants={linkVariants}
          className="mt-12 flex flex-col items-center justify-between border-t border-[#dedbd6] pt-6 text-xs md:flex-row"
        >
          <p>COPYRIGHT &copy; 2026 AKSESA.</p>
          <p className="mt-2 md:mt-0">V.1.0.0-BETACITY</p>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;