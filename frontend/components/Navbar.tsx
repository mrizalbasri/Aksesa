import React, { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { X, Loader2 } from "lucide-react";
import { animated, to, useTransition } from "@react-spring/web";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AUTH_CHANGED_EVENT,
  SESSION_AUTH_TOKEN_KEY,
  getMe,
  login,
} from "@/lib/api";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const modalTransitions = useTransition(showLoginPrompt, {
    from: { opacity: 0, y: 10, scale: 0.985 },
    enter: { opacity: 1, y: 0, scale: 1 },
    leave: { opacity: 0, y: 8, scale: 0.99 },
    config: { tension: 250, friction: 24 },
    immediate: prefersReducedMotion,
  });

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

  const openLoginPrompt = () => {
    setLoginError(null);
    setShowLoginPrompt(true);
  };

  const closeLoginPrompt = () => {
    if (isLoggingIn) {
      return;
    }
    setShowLoginPrompt(false);
    setLoginError(null);
  };

  useEffect(() => {
    if (!showLoginPrompt || typeof window === "undefined") {
      return;
    }

    const focusTimer = window.setTimeout(() => {
      emailInputRef.current?.focus();
    }, 0);

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoggingIn) {
        setShowLoginPrompt(false);
        setLoginError(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showLoginPrompt, isLoggingIn]);

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError(null);

    const emailValid = /\S+@\S+\.\S+/.test(loginEmail);
    if (!emailValid) {
      setLoginError("Masukkan email yang valid.");
      return;
    }
    if (loginPassword.trim().length < 8) {
      setLoginError("Password minimal 8 karakter.");
      return;
    }

    setIsLoggingIn(true);
    try {
      const response = await login(loginEmail, loginPassword);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          SESSION_AUTH_TOKEN_KEY,
          response.access_token,
        );
        window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
      }
      setIsLoggedIn(true);
      setShowLoginPrompt(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Login gagal. Periksa email dan password Anda.";
      setLoginError(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(SESSION_AUTH_TOKEN_KEY);
      window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    }
    setIsLoggedIn(false);
    setShowLoginPrompt(false);
    setLoginError(null);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#dedbd6] bg-[#faf9f6]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded border border-[#111111] bg-[#ff5600] text-sm font-semibold text-white">
              A
            </div>
            <span className="text-xl font-semibold tracking-tight text-[#111111]">
              ksesa.
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/#fitur"
              className="text-sm font-medium text-[#626260] transition-colors hover:text-[#111111]"
            >
              Fitur Utama
            </Link>
            <Link
              href="/#keamanan-data"
              className="text-sm font-medium text-[#626260] transition-colors hover:text-[#111111]"
            >
              Keamanan Data
            </Link>
            <Link
              href="/scoring"
              className="inline-flex h-10 items-center justify-center rounded border border-[#111111] bg-[#111111] px-5 text-sm font-medium text-white transition-colors hover:bg-white hover:text-[#111111]"
            >
              Akses Panel
            </Link>
            {isLoggedIn ? (
              <Button
                type="button"
                variant="outline"
                className="h-10 border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white"
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="h-10 border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white"
                onClick={openLoginPrompt}
              >
                Login
              </Button>
            )}
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/scoring"
              className="inline-flex h-9 items-center justify-center rounded border border-[#111111] bg-[#111111] px-3 text-xs font-medium text-white transition-colors hover:bg-white hover:text-[#111111]"
            >
              Panel
            </Link>
            {isLoggedIn ? (
              <Button
                type="button"
                variant="outline"
                className="h-9 border-[#111111] px-3 text-xs text-[#111111] hover:bg-[#111111] hover:text-white"
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="h-9 border-[#111111] px-3 text-xs text-[#111111] hover:bg-[#111111] hover:text-white"
                onClick={openLoginPrompt}
              >
                Login
              </Button>
            )}
            <details className="group relative">
              <summary className="list-none cursor-pointer rounded border border-[#111111] px-3 py-2 text-xs font-medium text-[#111111] transition-colors hover:bg-[#111111] hover:text-white">
                Menu
              </summary>
              <div className="absolute right-0 mt-2 w-52 rounded-md border border-[#dedbd6] bg-[#fffdf9] p-2 shadow-sm">
                <Link
                  href="/#fitur"
                  className="block rounded px-3 py-2 text-sm text-[#111111] transition-colors hover:bg-[#f5f4f1]"
                >
                  Fitur Utama
                </Link>
                <Link
                  href="/#keamanan-data"
                  className="block rounded px-3 py-2 text-sm text-[#111111] transition-colors hover:bg-[#f5f4f1]"
                >
                  Keamanan Data
                </Link>
                <Link
                  href="/scoring"
                  className="block rounded px-3 py-2 text-sm text-[#111111] transition-colors hover:bg-[#f5f4f1]"
                >
                  Akses Panel
                </Link>
              </div>
            </details>
          </div>
        </div>
      </header>

      {modalTransitions((style, visible) =>
        visible ? (
          <animated.div
            style={{ opacity: style.opacity }}
            className="fixed inset-0 z-[60] flex items-start justify-center bg-[#111111]/45 px-4 py-8 backdrop-blur-[2px] sm:items-center"
            onClick={(event) => {
              if (event.currentTarget === event.target && !isLoggingIn) {
                closeLoginPrompt();
              }
            }}
          >
            <animated.div
              style={{
                transform: to(
                  [style.y, style.scale],
                  (y, scale) => `translateY(${y}px) scale(${scale})`,
                ),
              }}
              className="w-full max-w-md"
            >
              <Card className="rounded-2xl border-[#dedbd6] bg-white shadow-[0_16px_48px_rgba(17,17,17,0.18)]">
            <CardHeader className="space-y-4 pb-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6d6861]">
                    Akses Aman
                  </p>
                  <CardTitle className="mt-2 text-[26px] leading-tight text-[#111111]">
                    Masuk ke Akun Aksesa
                  </CardTitle>
                  <p className="mt-2 text-sm leading-relaxed text-[#626260]">
                    Login untuk menyimpan, membagikan, dan mengunduh hasil scoring.
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Tutup login prompt"
                  onClick={closeLoginPrompt}
                  className="rounded-md p-2 text-[#626260] transition-colors hover:bg-[#f5f4f1] hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={isLoggingIn}
                >
                  <X className="size-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <form className="space-y-5" onSubmit={handleLoginSubmit}>
                <div className="space-y-2.5">
                  <label
                    className="text-sm font-medium text-[#111111]"
                    htmlFor="header-login-email"
                  >
                    Email
                  </label>
                  <Input
                    id="header-login-email"
                    type="email"
                    ref={emailInputRef}
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                    placeholder="nama@bisnis.com"
                    className="h-11 border-[#d9d4cd] bg-[#fffdf9] text-[15px] placeholder:text-[#979289] focus-visible:ring-[#111111]"
                  />
                </div>
                <div className="space-y-2.5">
                  <label
                    className="text-sm font-medium text-[#111111]"
                    htmlFor="header-login-password"
                  >
                    Password
                  </label>
                  <Input
                    id="header-login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    placeholder="Minimal 8 karakter"
                    className="h-11 border-[#d9d4cd] bg-[#fffdf9] text-[15px] placeholder:text-[#979289] focus-visible:ring-[#111111]"
                  />
                </div>
                {loginError ? (
                  <div className="rounded-lg border border-[#f9c7ad] bg-[#fff8f4] px-3 py-2.5 text-sm text-[#c94f1b]">
                    {loginError}
                  </div>
                ) : null}
                <div className="border-t border-[#ebe6de] pt-4">
                  <Button
                    type="submit"
                    className="h-11 w-full bg-[#2c6415] text-white hover:bg-[#245111]"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : null}
                    Masuk
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="mt-1 h-10 w-full text-[#66625b] hover:bg-[#f5f4f1] hover:text-[#111111]"
                    onClick={closeLoginPrompt}
                    disabled={isLoggingIn}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
              </Card>
            </animated.div>
          </animated.div>
        ) : null,
      )}
    </>
  );
};

export default Navbar;
