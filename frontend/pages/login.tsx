import React, { useState, useRef, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { LoginPanel } from "@/components/auth/LoginPanel";
import {
  SESSION_AUTH_TOKEN_KEY,
  AUTH_CHANGED_EVENT,
  login,
  loginWithGoogle,
} from "@/lib/api";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const googleClientId =
    typeof process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === "string"
      ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID.trim()
      : "";

  const handleGoogleCredential = async (credential: string) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await loginWithGoogle(credential);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          SESSION_AUTH_TOKEN_KEY,
          response.access_token
        );
        window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
      }
      await router.push("/scoring");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login Google gagal. Coba lagi.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const emailValid = /\S+@\S+\.\S+/.test(email);
    if (!emailValid) {
      setError("Masukkan email yang valid.");
      return;
    }
    if (password.trim().length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await login(email, password);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          SESSION_AUTH_TOKEN_KEY,
          response.access_token
        );
        window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
      }
      await router.push("/scoring");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Login gagal. Periksa email dan password Anda.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffaf6] to-[#f5f1ec] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <LoginPanel
          titleId="page-login-title"
          eyebrow="Masuk"
          title="Akun Aksesa"
          emailId="page-login-email"
          passwordId="page-login-password"
          emailRef={emailInputRef}
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          error={error}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onClose={() => {}} // No-op for page
          closeDisabled={isSubmitting}
          submitLabel="Masuk"
          googleClientId={googleClientId}
          onGoogleCredential={handleGoogleCredential}
        />

        <div className="mt-6 text-center">
          <p className="text-sm text-[#626260]">
            Belum punya akun?{" "}
            <Link
              href="/signup"
              className="font-medium text-[#ff5600] hover:text-[#e64d00] transition-colors"
            >
              Daftar di sini
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-[#626260] hover:text-[#111111] transition-colors"
          >
            ← Kembali ke beranda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
