import React, { useState, useRef, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { RegisterPanel } from "@/components/auth/RegisterPanel";
import {
  SESSION_AUTH_TOKEN_KEY,
  AUTH_CHANGED_EVENT,
  register,
} from "@/lib/api";

const SignupPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    // Validation
    if (name.trim().length < 2) {
      setError("Nama lengkap minimal 2 karakter.");
      return;
    }

    const emailValid = /\S+@\S+\.\S+/.test(email);
    if (!emailValid) {
      setError("Masukkan email yang valid.");
      return;
    }

    if (password.trim().length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await register({
        email,
        password,
        name,
        business_name: businessName.trim() || undefined,
        phone: phone.trim() || undefined,
      });
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
          : "Pendaftaran gagal. Silakan coba lagi.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchToLogin = async () => {
    await router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffaf6] to-[#f5f1ec] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <RegisterPanel
          titleId="page-register-title"
          nameId="page-register-name"
          emailId="page-register-email"
          passwordId="page-register-password"
          businessNameId="page-register-business"
          phoneId="page-register-phone"
          emailRef={emailInputRef}
          name={name}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          businessName={businessName}
          phone={phone}
          onNameChange={setName}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onBusinessNameChange={setBusinessName}
          onPhoneChange={setPhone}
          error={error}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onClose={() => {}} // No-op for page
          closeDisabled={isSubmitting}
          onSwitchToLogin={handleSwitchToLogin}
        />

        <div className="mt-6 text-center">
          <p className="text-sm text-[#626260]">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-medium text-[#ff5600] hover:text-[#e64d00] transition-colors"
            >
              Masuk di sini
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

export default SignupPage;
