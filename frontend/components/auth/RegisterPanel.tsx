import React, { type FormEvent, type RefObject, useState } from "react";
import { Eye, EyeOff, Loader2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const inputClassName =
  "h-11 border-[#dedbd6] bg-[#faf9f6] text-[15px] placeholder:text-[#9c9fa5] focus-visible:ring-[#ff5600]/35";

export type RegisterPanelProps = {
  titleId: string;
  emailId: string;
  passwordId: string;
  nameId: string;
  businessNameId?: string;
  phoneId?: string;
  emailRef?: RefObject<HTMLInputElement>;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  businessName?: string;
  phone?: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onBusinessNameChange?: (value: string) => void;
  onPhoneChange?: (value: string) => void;
  error: string | null;
  isSubmitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  closeDisabled?: boolean;
  onSwitchToLogin: () => void;
};

export function RegisterPanel({
  titleId,
  emailId,
  passwordId,
  nameId,
  businessNameId,
  phoneId,
  emailRef,
  name,
  email,
  password,
  confirmPassword,
  businessName = "",
  phone = "",
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onBusinessNameChange,
  onPhoneChange,
  error,
  isSubmitting,
  onSubmit,
  onClose,
  closeDisabled = false,
  onSwitchToLogin,
}: RegisterPanelProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Card className="overflow-hidden rounded-2xl border-[#dedbd6] bg-white shadow-[0_20px_56px_rgba(17,17,17,0.16)]">
      <div
        className="h-1 w-full bg-gradient-to-r from-[#ff5600] via-[#ff7a3d] to-[#2c6415]"
        aria-hidden
      />
      <CardHeader className="space-y-2 pb-2 pt-6 sm:pt-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7b7b78]">
              Daftar
            </p>
            <CardTitle
              id={titleId}
              className="mt-1.5 text-pretty text-2xl font-semibold leading-tight tracking-tight text-[#111111] sm:text-[26px]"
            >
              Buat Akun Aksesa
            </CardTitle>
            <p className="mt-1.5 text-sm leading-snug text-[#626260]">
              Dapatkan akses scoring kredit untuk UMKM Anda
            </p>
          </div>
          <button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            disabled={closeDisabled}
            className="shrink-0 rounded-lg p-2 text-[#626260] transition-colors hover:bg-[#fcfaf7] hover:text-[#111111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5600]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X className="size-5" strokeWidth={1.75} />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pb-7 pt-0 sm:px-8">
        <form className="space-y-5" onSubmit={onSubmit} noValidate>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-[#111111]"
              htmlFor={nameId}
            >
              Nama Lengkap <span className="text-[#fe4c02]">*</span>
            </label>
            <Input
              id={nameId}
              type="text"
              ref={emailRef}
              autoComplete="name"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="Nama lengkap Anda"
              className={inputClassName}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-[#111111]"
              htmlFor={emailId}
            >
              Email <span className="text-[#fe4c02]">*</span>
            </label>
            <Input
              id={emailId}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="nama@bisnis.com"
              className={inputClassName}
              disabled={isSubmitting}
              required
            />
          </div>
          {businessNameId && onBusinessNameChange && (
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-[#111111]"
                htmlFor={businessNameId}
              >
                Nama Bisnis <span className="text-[#9c9fa5]">(opsional)</span>
              </label>
              <Input
                id={businessNameId}
                type="text"
                autoComplete="organization"
                value={businessName}
                onChange={(event) => onBusinessNameChange(event.target.value)}
                placeholder="Nama bisnis Anda"
                className={inputClassName}
                disabled={isSubmitting}
              />
            </div>
          )}
          {phoneId && onPhoneChange && (
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-[#111111]"
                htmlFor={phoneId}
              >
                No. WhatsApp <span className="text-[#9c9fa5]">(opsional)</span>
              </label>
              <Input
                id={phoneId}
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => onPhoneChange(event.target.value)}
                placeholder="0812 3456 7890"
                className={inputClassName}
                disabled={isSubmitting}
              />
            </div>
          )}
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-[#111111]"
              htmlFor={passwordId}
            >
              Password <span className="text-[#fe4c02]">*</span>
            </label>
            <div className="relative">
              <Input
                id={passwordId}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(event) => onPasswordChange(event.target.value)}
                placeholder="Minimal 8 karakter"
                className={`${inputClassName} pr-10`}
                disabled={isSubmitting}
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#626260] hover:text-[#111111]"
              >
                {showPassword ? (
                  <EyeOff className="size-4" strokeWidth={1.75} />
                ) : (
                  <Eye className="size-4" strokeWidth={1.75} />
                )}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-[#111111]"
              htmlFor={`${passwordId}-confirm`}
            >
              Konfirmasi Password <span className="text-[#fe4c02]">*</span>
            </label>
            <div className="relative">
              <Input
                id={`${passwordId}-confirm`}
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => onConfirmPasswordChange(event.target.value)}
                placeholder="Masukkan password lagi"
                className={`${inputClassName} pr-10`}
                disabled={isSubmitting}
                required
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#626260] hover:text-[#111111]"
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" strokeWidth={1.75} />
                ) : (
                  <Eye className="size-4" strokeWidth={1.75} />
                )}
              </button>
            </div>
          </div>
          {error ? (
            <div
              className="rounded-lg border border-[#fe4c02] bg-[#fff4ee] px-3 py-2.5 text-sm text-[#c94f1b]"
              role="alert"
            >
              {error}
            </div>
          ) : null}
          <div className="space-y-2 border-t border-[#ebe6de] pt-5">
            <Button
              type="submit"
              className="h-12 w-full bg-[#2c6415] text-base font-medium text-white hover:bg-[#245111] focus-visible:ring-[#2c6415]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
              ) : null}
              Daftar
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-11 w-full text-[#626260] hover:bg-[#fcfaf7] hover:text-[#111111]"
              onClick={onSwitchToLogin}
              disabled={isSubmitting}
            >
              Sudah punya akun?{" "}
              <span className="font-medium text-[#ff5600]">Masuk</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}