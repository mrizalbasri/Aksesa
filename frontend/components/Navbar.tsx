import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SESSION_AUTH_TOKEN_KEY, AUTH_CHANGED_EVENT, getMe } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let active = true;
    const syncAuthState = async () => {
      const token = window.sessionStorage.getItem(SESSION_AUTH_TOKEN_KEY);
      if (!token) {
        if (active) {
          setIsLoggedIn(false);
        }
        return;
      }

      try {
        await getMe(token);
        if (active) {
          setIsLoggedIn(true);
        }
      } catch {
        window.sessionStorage.removeItem(SESSION_AUTH_TOKEN_KEY);
        if (active) {
          setIsLoggedIn(false);
        }
      }
    };

    void syncAuthState();
    const handleAuthChanged = () => {
      void syncAuthState();
    };
    window.addEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);

    return () => {
      active = false;
      window.removeEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(SESSION_AUTH_TOKEN_KEY);
      window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    }
    setIsLoggedIn(false);
    void router.push("/");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-[#dedbd6] bg-[#faf9f6]/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/" className="group flex items-center gap-2">
            <motion.div
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex size-8 items-center justify-center rounded border border-[#111111] bg-[#ff5600] text-sm font-semibold text-white"
            >
              A
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-xl font-semibold tracking-tight text-[#111111]"
            >
              ksesa.
            </motion.span>
          </Link>
        </motion.div>

        {/* Nav Items */}
        <motion.div
          className="flex items-center gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
              },
            },
          }}
        >
          {isLoggedIn ? (
            <>
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: 20 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href="/scoring"
                  className="group inline-flex h-10 items-center justify-center rounded border border-[#111111] bg-[#ff5600] px-5 text-sm font-medium text-white transition-colors hover:bg-[#e64d00]"
                >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Mulai Scoring
                  </motion.span>
                </Link>
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: 20 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 border-[#111111] text-[#111111] transition-all hover:scale-105 hover:bg-[#111111] hover:text-white"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: 20 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href="/scoring"
                  className="group inline-flex h-10 items-center justify-center rounded border border-[#111111] bg-[#ff5600] px-5 text-sm font-medium text-white transition-colors hover:bg-[#e64d00]"
                >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Mulai Scoring
                  </motion.span>
                </Link>
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: 20 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href="/login"
                  className="inline-flex h-10 items-center justify-center rounded text-sm font-medium text-[#626260] transition-colors hover:text-[#111111]"
                >
                  <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    Login
                  </motion.span>
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Navbar;