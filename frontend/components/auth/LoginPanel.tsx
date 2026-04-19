import React, { type FormEvent, type RefObject } from "react";
import { Loader2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

const inputClassName =
  "h-11 border-[#dedbd6] bg-[#faf9f6] text-[15px] placeholder:text-[#9c9fa5] focus-visible:ring-[#ff5600]/35";

export type LoginPanelProps = {
  title: string;
  titleId: string;
  eyebrow: string;
  subtitle?: string;
  emailId: string;
  passwordId: string;
  emailRef?: RefObject<HTMLInputElement>;
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  error: string | null;
  isSubmitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  closeDisabled?: boolean;
  submitLabel?: string;
  googleClientId?: string;
  onGoogleCredential?: (credential: string) => void | Promise<void>;
};

export function LoginPanel({
  title,
  titleId,
  eyebrow,
  subtitle,
  emailId,
  passwordId,
  emailRef,
  email,
  password,
  onEmailChange,
  onPasswordChange,
  error,
  isSubmitting,
  onSubmit,
  onClose,
  closeDisabled = false,
  submitLabel = "Masuk",
  googleClientId,
  onGoogleCredential,
}: LoginPanelProps) {
  const showGoogle = Boolean(
    googleClientId?.trim() && typeof onGoogleCredential === "function",
  );

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
              {eyebrow}
            </p>
            <CardTitle
              id={titleId}
              className="mt-1.5 text-pretty text-2xl font-semibold leading-tight tracking-tight text-[#111111] sm:text-[26px]"
            >
              {title}
            </CardTitle>
            {subtitle ? (
              <p className="mt-1.5 text-sm leading-snug text-[#626260]">{subtitle}</p>
            ) : null}
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
        {showGoogle ? (
          <>
            <GoogleSignInButton
              clientId={googleClientId!.trim()}
              onCredential={(c) => onGoogleCredential!(c)}
              disabled={isSubmitting}
            />
            <div className="relative py-1">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden
              >
                <span className="w-full border-t border-[#ebe6de]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-[#7b7b78]">atau email</span>
              </div>
            </div>
          </>
        ) : null}

        <form className="space-y-5" onSubmit={onSubmit} noValidate>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-[#111111]"
              htmlFor={emailId}
            >
              Email
            </label>
            <Input
              id={emailId}
              type="email"
              ref={emailRef}
              autoComplete="email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="nama@bisnis.com"
              className={inputClassName}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-[#111111]"
              htmlFor={passwordId}
            >
              Password
            </label>
            <Input
              id={passwordId}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="Minimal 8 karakter"
              className={inputClassName}
              disabled={isSubmitting}
            />
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
              {submitLabel}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-11 w-full text-[#626260] hover:bg-[#fcfaf7] hover:text-[#111111]"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
