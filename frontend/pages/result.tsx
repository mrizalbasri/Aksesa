import React, { useState, type FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScoreGauge from "@/components/scoring/ScoreGauge";
import FactorBreakdown from "@/components/scoring/FactorBreakdown";
import RecommendationCard from "@/components/scoring/RecommendationCard";
import ScoreHistory from "@/components/scoring/ScoreHistory";
import LoanSimulator from "@/components/scoring/LoanSimulator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Share2,
  Save,
  ShieldCheck,
  Lock,
  X,
  Loader2,
} from "lucide-react";
import { generatePdfReport } from "@/lib/pdfGenerator";

type ProtectedAction = "save" | "download" | "share";

const actionLabels: Record<ProtectedAction, string> = {
  save: "Simpan Hasil",
  download: "Download PDF",
  share: "Bagikan Hasil",
};

const ResultPage = () => {
  const score = 75; // Mock score
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState<ProtectedAction | null>(
    null,
  );
  const [lastFailedAction, setLastFailedAction] =
    useState<ProtectedAction | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Mock data for the PDF report
  const reportData = {
    score: score,
    positiveFactors: [
      "Pembayaran tagihan selalu tepat waktu.",
      "Memiliki riwayat kredit yang panjang dan baik.",
      "Tingkat utilisasi kredit rendah.",
    ],
    negativeFactors: [
      "Baru-baru ini mengajukan beberapa pinjaman baru.",
      "Memiliki satu catatan keterlambatan pembayaran di masa lalu.",
    ],
    recommendations: [
      "Hindari mengajukan terlalu banyak kredit dalam waktu singkat.",
      "Terus pertahankan kebiasaan pembayaran yang baik.",
      "Pertimbangkan untuk diversifikasi jenis kredit Anda.",
    ],
  };

  const runProtectedAction = async (action: ProtectedAction) => {
    setActionError(null);
    setActionSuccess(null);
    setLastFailedAction(null);

    try {
      if (action === "save") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setActionSuccess("Hasil berhasil disimpan ke akun Anda.");
        return;
      }

      if (action === "download") {
        generatePdfReport(reportData);
        setActionSuccess("Laporan PDF berhasil diunduh.");
        return;
      }

      const currentUrl =
        typeof window !== "undefined"
          ? window.location.href
          : "https://aksesa.id/result";
      const shareText = `Skor kredit saya di Aksesa: ${score}.`;

      if (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function"
      ) {
        await navigator.share({
          title: "Hasil Skor Kredit Aksesa",
          text: shareText,
          url: currentUrl,
        });
        setActionSuccess("Hasil berhasil dibagikan.");
        return;
      }

      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        await navigator.clipboard.writeText(`${shareText} ${currentUrl}`);
        setActionSuccess(
          "Perangkat tidak mendukung share langsung. Link sudah disalin.",
        );
        return;
      }

      throw new Error("Perangkat Anda belum mendukung fitur bagikan.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kendala saat menjalankan aksi. Silakan coba lagi.";
      setActionError(message);
      setLastFailedAction(action);
    }
  };

  const handleProtectedAction = (action: ProtectedAction) => {
    if (!isLoggedIn) {
      setPendingAction(action);
      setShowLoginPrompt(true);
      setLoginError(null);
      return;
    }

    void runProtectedAction(action);
  };

  const closeLoginPrompt = () => {
    setShowLoginPrompt(false);
    setPendingAction(null);
    setLoginError(null);
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
    await new Promise((resolve) => setTimeout(resolve, 700));
    setIsLoggingIn(false);
    setIsLoggedIn(true);
    setShowLoginPrompt(false);
    setActionSuccess("Login berhasil. Aksi Anda langsung diproses.");

    const action = pendingAction;
    setPendingAction(null);
    if (action) {
      void runProtectedAction(action);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] py-8 text-[#111111] sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <Card className="border-[#dedbd6] bg-white">
            <CardHeader>
              <CardTitle className="flex flex-col items-center gap-2 text-center text-2xl font-semibold text-[#111111]">
                Hasil Analisis Skor Kredit Anda
                <Badge
                  className={
                    isLoggedIn
                      ? "border-[#cde7c3] bg-[#f4fbf1] text-[#2c6415]"
                      : "border-[#dedbd6] bg-[#f5f4f1] text-[#626260]"
                  }
                  variant="outline"
                >
                  {isLoggedIn ? "Akun Terverifikasi" : "Mode Tamu"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center rounded-lg border border-[#dedbd6] bg-[#fffaf6] p-6">
                <div className="mb-6 flex w-full items-start gap-2 rounded-lg border border-[#cde7c3] bg-[#f4fbf1] px-4 py-3 text-sm text-[#2c6415]">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                  <p>
                    {isLoggedIn
                      ? "Data hasil scoring Anda tersimpan aman di akun."
                      : "Anda sedang di mode tamu. Login diperlukan untuk simpan, unduh, atau bagikan hasil."}
                  </p>
                </div>
                <ScoreGauge score={score} />
                <div className="mt-4 flex w-full flex-col justify-center gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
                  <Button
                    variant="outline"
                    className="w-full border-[#2c6415] text-[#2c6415] hover:bg-[#2c6415] hover:text-white sm:w-auto"
                    onClick={() => handleProtectedAction("save")}
                  >
                    {!isLoggedIn ? (
                      <Lock className="mr-2 size-4" />
                    ) : (
                      <Save className="mr-2 size-4" />
                    )}
                    Simpan Hasil
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white sm:w-auto"
                    onClick={() => handleProtectedAction("share")}
                  >
                    {!isLoggedIn ? (
                      <Lock className="mr-2 size-4" />
                    ) : (
                      <Share2 className="mr-2 size-4" />
                    )}
                    Bagikan
                  </Button>
                  <Button
                    className="w-full bg-[#ff5600] text-white hover:bg-[#e14b00] sm:w-auto"
                    onClick={() => handleProtectedAction("download")}
                  >
                    {!isLoggedIn ? (
                      <Lock className="mr-2 size-4" />
                    ) : (
                      <Download className="mr-2 size-4" />
                    )}
                    Download Laporan PDF
                  </Button>
                </div>
                {actionSuccess ? (
                  <div className="mt-4 w-full rounded-lg border border-[#cde7c3] bg-[#f4fbf1] px-4 py-3 text-sm text-[#2c6415]">
                    {actionSuccess}
                  </div>
                ) : null}
                {actionError ? (
                  <div className="mt-4 w-full rounded-lg border border-[#fe4c02] bg-[#fff4ee] px-4 py-3 text-sm text-[#fe4c02]">
                    <p>{actionError}</p>
                    {lastFailedAction ? (
                      <Button
                        variant="outline"
                        className="mt-3 border-[#fe4c02] text-[#fe4c02] hover:bg-[#fe4c02] hover:text-white"
                        onClick={() =>
                          void runProtectedAction(lastFailedAction)
                        }
                      >
                        Coba Lagi
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <FactorBreakdown />
            <RecommendationCard />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <ScoreHistory />
            <LoanSimulator />
          </div>
        </div>
      </div>

      {showLoginPrompt ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#111111]/40 px-4 py-8 sm:items-center">
          <Card className="w-full max-w-md border-[#dedbd6] bg-white">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7b7b78]">
                    Login Diperlukan
                  </p>
                  <CardTitle className="mt-2 text-xl text-[#111111]">
                    Lanjutkan{" "}
                    {pendingAction ? actionLabels[pendingAction] : "aksi"}
                  </CardTitle>
                </div>
                <button
                  type="button"
                  aria-label="Tutup login prompt"
                  onClick={closeLoginPrompt}
                  className="rounded p-1 text-[#626260] transition-colors hover:bg-[#f5f4f1] hover:text-[#111111]"
                >
                  <X className="size-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleLoginSubmit}>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-[#111111]"
                    htmlFor="login-email"
                  >
                    Email
                  </label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                    placeholder="nama@bisnis.com"
                    className="border-[#dedbd6] focus-visible:ring-[#111111]"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-[#111111]"
                    htmlFor="login-password"
                  >
                    Password
                  </label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    placeholder="Minimal 8 karakter"
                    className="border-[#dedbd6] focus-visible:ring-[#111111]"
                  />
                </div>
                {loginError ? (
                  <div className="rounded-lg border border-[#fe4c02] bg-[#fff4ee] px-3 py-2 text-sm text-[#fe4c02]">
                    {loginError}
                  </div>
                ) : null}
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white"
                    onClick={closeLoginPrompt}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#2c6415] text-white hover:bg-[#245111]"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : null}
                    Masuk & Lanjutkan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
};

export default ResultPage;
