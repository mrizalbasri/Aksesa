import React, { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Menu as MenuIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LoginPanel } from "@/components/auth/LoginPanel";
import { RegisterPanel } from "@/components/auth/RegisterPanel";
import {
  AUTH_CHANGED_EVENT,
  SESSION_AUTH_TOKEN_KEY,
  getMe,
  login,
  loginWithGoogle,
  register,
} from "@/lib/api";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  // Register state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerBusinessName, setRegisterBusinessName] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

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

  const openRegisterPrompt = () => {
    setRegisterError(null);
    setShowRegisterPrompt(true);
  };

  const closeRegisterPrompt = () => {
    if (isRegistering) {
      return;
    }
    setShowRegisterPrompt(false);
    setRegisterError(null);
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

  const googleClientId =
    typeof process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === "string"
      ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID.trim()
      : "";

  const handleGoogleCredential = async (credential: string) => {
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      const response = await loginWithGoogle(credential);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          SESSION_AUTH_TOKEN_KEY,
          response.access_token,
        );
        window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
      }
      setIsLoggedIn(true);
      setShowLoginPrompt(false);
      setLoginEmail("");
      setLoginPassword("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Login Google gagal. Coba lagi.";
      setLoginError(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

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
    setShowRegisterPrompt(false);
    setLoginError(null);
    setRegisterError(null);
  };

  const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRegisterError(null);

    // Validation
    if (registerName.trim().length < 2) {
      setRegisterError("Nama lengkap minimal 2 karakter.");
      return;
    }

    const emailValid = /\S+@\S+\.\S+/.test(registerEmail);
    if (!emailValid) {
      setRegisterError("Masukkan email yang valid.");
      return;
    }

    if (registerPassword.trim().length < 8) {
      setRegisterError("Password minimal 8 karakter.");
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setRegisterError("Password dan konfirmasi password tidak sama.");
      return;
    }

    setIsRegistering(true);
    try {
      const response = await register({
        email: registerEmail,
        password: registerPassword,
        name: registerName,
        business_name: registerBusinessName.trim() || undefined,
        phone: registerPhone.trim() || undefined,
      });
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          SESSION_AUTH_TOKEN_KEY,
          response.access_token,
        );
        window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
      }
      setIsLoggedIn(true);
      setShowRegisterPrompt(false);
      // Reset form
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
      setRegisterBusinessName("");
      setRegisterPhone("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Pendaftaran gagal. Silakan coba lagi.";
      setRegisterError(message);
    } finally {
      setIsRegistering(false);
    }
  };

  const switchToLogin = () => {
    setShowRegisterPrompt(false);
    setShowLoginPrompt(true);
    setRegisterError(null);
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
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 text-[#626260] hover:bg-[#fcfaf7] hover:text-[#111111]"
                  onClick={openLoginPrompt}
                >
                  Login
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 border-[#ff5600] bg-[#ff5600] text-white hover:bg-[#e64d00] hover:text-white"
                  onClick={openRegisterPrompt}
                >
                  Daftar
                </Button>
              </div>
            )}
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <details className="group relative">
              <summary
                aria-label="Buka menu navigasi"
                className="list-none cursor-pointer rounded border border-[#111111] p-2 text-[#111111] transition-colors hover:bg-[#111111] hover:text-white"
              >
                <MenuIcon className="size-5" />
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
                {isLoggedIn ? (
                  <button
                    type="button"
                    className="mt-1 block w-full rounded px-3 py-2 text-left text-sm text-[#111111] transition-colors hover:bg-[#f5f4f1]"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="mt-1 block w-full rounded px-3 py-2 text-left text-sm text-[#111111] transition-colors hover:bg-[#f5f4f1]"
                      onClick={openLoginPrompt}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      className="mt-1 block w-full rounded px-3 py-2 text-left text-sm font-medium text-[#ff5600] transition-colors hover:bg-[#fff4ee]"
                      onClick={openRegisterPrompt}
                    >
                      Daftar
                    </button>
                  </>
                )}
              </div>
            </details>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showLoginPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-start justify-center bg-[#111111]/50 px-4 py-8 backdrop-blur-[3px] sm:items-center"
            onClick={(event) => {
              if (event.currentTarget === event.target && !isLoggingIn) {
                closeLoginPrompt();
              }
            }}
            role="presentation"
          >
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.99 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-md"
              role="dialog"
              aria-modal="true"
              aria-labelledby="navbar-login-title"
            >
              <LoginPanel
                titleId="navbar-login-title"
                eyebrow="Login"
                title="Akun Aksesa"
                emailId="header-login-email"
                passwordId="header-login-password"
                emailRef={emailInputRef}
                email={loginEmail}
                password={loginPassword}
                onEmailChange={setLoginEmail}
                onPasswordChange={setLoginPassword}
                error={loginError}
                isSubmitting={isLoggingIn}
                onSubmit={handleLoginSubmit}
                onClose={closeLoginPrompt}
                closeDisabled={isLoggingIn}
                submitLabel="Masuk"
                googleClientId={googleClientId}
                onGoogleCredential={handleGoogleCredential}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRegisterPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-start justify-center bg-[#111111]/50 px-4 py-8 backdrop-blur-[3px] sm:items-center"
            onClick={(event) => {
              if (event.currentTarget === event.target && !isRegistering) {
                closeRegisterPrompt();
              }
            }}
            role="presentation"
          >
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.99 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-md"
              role="dialog"
              aria-modal="true"
              aria-labelledby="navbar-register-title"
            >
              <RegisterPanel
                titleId="navbar-register-title"
                nameId="header-register-name"
                emailId="header-register-email"
                passwordId="header-register-password"
                businessNameId="header-register-business"
                phoneId="header-register-phone"
                emailRef={emailInputRef}
                name={registerName}
                email={registerEmail}
                password={registerPassword}
                confirmPassword={registerConfirmPassword}
                businessName={registerBusinessName}
                phone={registerPhone}
                onNameChange={setRegisterName}
                onEmailChange={setRegisterEmail}
                onPasswordChange={setRegisterPassword}
                onConfirmPasswordChange={setRegisterConfirmPassword}
                onBusinessNameChange={setRegisterBusinessName}
                onPhoneChange={setRegisterPhone}
                error={registerError}
                isSubmitting={isRegistering}
                onSubmit={handleRegisterSubmit}
                onClose={closeRegisterPrompt}
                closeDisabled={isRegistering}
                onSwitchToLogin={switchToLogin}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;