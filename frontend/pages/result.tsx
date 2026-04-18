import React, { useEffect, useMemo, useState, type FormEvent } from "react";
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
import {
  AUTH_CHANGED_EVENT,
  ApiError,
  SESSION_AUTH_TOKEN_KEY,
  SESSION_SCORING_RESULT_KEY,
  createResult,
  exportResultPdf,
  getMe,
  login,
  shareResult,
} from "@/lib/api";

type ProtectedAction = "save" | "download" | "share";

const actionLabels: Record<ProtectedAction, string> = {
  save: "Simpan Hasil",
  download: "Download PDF",
  share: "Bagikan Hasil",
};

type StoredScoringResult = {
  score: number;
  risk_category: string;
  factors: string[];
  recommendations: string[];
  submitted_at: string;
  invoice_file_name: string;
};

const parseStoredScoringResult = (
  raw: string | null,
): StoredScoringResult | null => {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredScoringResult>;
    if (
      typeof parsed.score !== "number" ||
      typeof parsed.risk_category !== "string" ||
      !Array.isArray(parsed.factors) ||
      !Array.isArray(parsed.recommendations)
    ) {
      return null;
    }

    return {
      score: parsed.score,
      risk_category: parsed.risk_category,
      factors: parsed.factors.filter(
        (item): item is string => typeof item === "string",
      ),
      recommendations: parsed.recommendations.filter(
        (item): item is string => typeof item === "string",
      ),
      submitted_at:
        typeof parsed.submitted_at === "string"
          ? parsed.submitted_at
          : new Date().toISOString(),
      invoice_file_name:
        typeof parsed.invoice_file_name === "string" ? parsed.invoice_file_name : "-",
    };
  } catch {
    return null;
  }
};

const ResultPage = () => {
  const [scoringResult, setScoringResult] = useState<StoredScoringResult | null>(
    null,
  );
  const [isHydrating, setIsHydrating] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [savedResultId, setSavedResultId] = useState<string | null>(null);
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
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const score = scoringResult?.score ?? 0;
  const hasScoringResult = scoringResult !== null;

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsHydrating(false);
      return;
    }

    const storedResult = parseStoredScoringResult(
      window.sessionStorage.getItem(SESSION_SCORING_RESULT_KEY),
    );
    setScoringResult(storedResult);

    let active = true;
    const syncAuthState = async () => {
      const existingToken = window.sessionStorage.getItem(SESSION_AUTH_TOKEN_KEY);
      if (!existingToken) {
        if (active) {
          setIsLoggedIn(false);
          setAuthToken(null);
          setIsHydrating(false);
        }
        return;
      }

      if (active) {
        setAuthToken(existingToken);
      }
      try {
        await getMe(existingToken);
        if (active) {
          setIsLoggedIn(true);
        }
      } catch {
        window.sessionStorage.removeItem(SESSION_AUTH_TOKEN_KEY);
        window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
        if (active) {
          setIsLoggedIn(false);
          setAuthToken(null);
        }
      } finally {
        if (active) {
          setIsHydrating(false);
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

  const reportData = useMemo(
    () => ({
      score,
      positiveFactors:
        scoringResult?.factors.length && scoringResult.factors.length > 0
          ? scoringResult.factors
          : ["Belum ada faktor."],
      negativeFactors: [] as string[],
      recommendations:
        scoringResult?.recommendations.length &&
        scoringResult.recommendations.length > 0
          ? scoringResult.recommendations
          : ["Belum ada rekomendasi."],
    }),
    [score, scoringResult],
  );

  const ensureSavedResult = async (): Promise<string> => {
    if (!authToken) {
      throw new Error("Login diperlukan untuk aksi ini.");
    }
    if (!scoringResult) {
      throw new Error(
        "Hasil scoring belum tersedia. Silakan submit ulang dari halaman scoring.",
      );
    }
    if (savedResultId) {
      return savedResultId;
    }

    const created = await createResult(
      {
        score: scoringResult.score,
        risk_category: scoringResult.risk_category,
        factors: scoringResult.factors,
        recommendations: scoringResult.recommendations,
        metadata: {
          submitted_at: scoringResult.submitted_at,
          invoice_file_name: scoringResult.invoice_file_name,
        },
      },
      authToken,
    );
    setSavedResultId(created.id);
    return created.id;
  };

  const runProtectedAction = async (action: ProtectedAction) => {
    setActionError(null);
    setActionSuccess(null);
    setLastFailedAction(null);
    setIsProcessingAction(true);

    try {
      if (action === "save") {
        await ensureSavedResult();
        setActionSuccess("Hasil berhasil disimpan ke akun Anda.");
        return;
      }

      if (action === "download") {
        const resultId = await ensureSavedResult();
        await exportResultPdf(resultId, authToken ?? "");
        generatePdfReport(reportData);
        setActionSuccess("Laporan PDF berhasil diunduh.");
        return;
      }

      const resultId = await ensureSavedResult();
      const shareResponse = await shareResult(resultId, authToken ?? "");
      const currentUrl = shareResponse.share_url;
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
      if (error instanceof ApiError && error.code === "AUTH_REQUIRED") {
        setIsLoggedIn(false);
        setAuthToken(null);
        if (typeof window !== "undefined") {
          window.sessionStorage.removeItem(SESSION_AUTH_TOKEN_KEY);
          window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
        }
      }
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kendala saat menjalankan aksi. Silakan coba lagi.";
      setActionError(message);
      setLastFailedAction(action);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleProtectedAction = (action: ProtectedAction) => {
    if (!hasScoringResult) {
      setActionSuccess(null);
      setActionError(
        "Hasil scoring belum tersedia. Silakan kembali ke halaman scoring.",
      );
      return;
    }

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
    try {
      const response = await login(loginEmail, loginPassword);
      const token = response.access_token;

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(SESSION_AUTH_TOKEN_KEY, token);
        window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
      }

      setAuthToken(token);
      setIsLoggedIn(true);
      setShowLoginPrompt(false);
      setActionSuccess("Login berhasil. Aksi Anda langsung diproses.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Login gagal. Periksa email dan password Anda.";
      setLoginError(message);
      setIsLoggingIn(false);
      return;
    }

    setIsLoggingIn(false);

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
                {!hasScoringResult && !isHydrating ? (
                  <div className="mb-4 w-full rounded-lg border border-[#fe4c02] bg-[#fff4ee] px-4 py-3 text-sm text-[#fe4c02]">
                    Data hasil scoring belum ditemukan. Silakan submit ulang dari halaman
                    scoring.
                  </div>
                ) : null}
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
                    disabled={isHydrating || isProcessingAction}
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
                    disabled={isHydrating || isProcessingAction}
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
                    disabled={isHydrating || isProcessingAction}
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
                        onClick={() => void runProtectedAction(lastFailedAction)}
                        disabled={isProcessingAction}
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
            <FactorBreakdown factors={scoringResult?.factors} />
            <RecommendationCard recommendations={scoringResult?.recommendations} />
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
                    Lanjutkan {pendingAction ? actionLabels[pendingAction] : "aksi"}
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
