import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScoreGauge from "@/components/scoring/ScoreGauge";
import FactorBreakdown from "@/components/scoring/FactorBreakdown";
import RecommendationCard from "@/components/scoring/RecommendationCard";
import ScoreHistory from "@/components/scoring/ScoreHistory";
import LoanSimulator from "@/components/scoring/LoanSimulator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, Save, ShieldCheck, Lock } from "lucide-react";
import { LoginPanel } from "@/components/auth/LoginPanel";
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
  loginWithGoogle,
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
  const loginEmailInputRef = useRef<HTMLInputElement | null>(null);

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
      riskCategory: scoringResult?.risk_category || "Sedang",
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
      submittedAt: scoringResult?.submitted_at || new Date().toISOString(),
      invoiceFileName: scoringResult?.invoice_file_name || "-",
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

  const closeLoginPrompt = useCallback(() => {
    setShowLoginPrompt(false);
    setPendingAction(null);
    setLoginError(null);
  }, []);

  useEffect(() => {
    if (!showLoginPrompt || typeof window === "undefined") {
      return;
    }

    const focusTimer = window.setTimeout(() => {
      loginEmailInputRef.current?.focus();
    }, 0);

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoggingIn) {
        closeLoginPrompt();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showLoginPrompt, isLoggingIn, closeLoginPrompt]);

  const googleClientId =
    typeof process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === "string"
      ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID.trim()
      : "";

  const handleGoogleCredential = async (credential: string) => {
    const actionToRun = pendingAction;
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      const response = await loginWithGoogle(credential);
      const token = response.access_token;

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(SESSION_AUTH_TOKEN_KEY, token);
        window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
      }

      setAuthToken(token);
      setIsLoggedIn(true);
      setShowLoginPrompt(false);
      setActionSuccess("Login berhasil. Aksi Anda langsung diproses.");
      setLoginError(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Login Google gagal.";
      setLoginError(message);
      setIsLoggingIn(false);
      return;
    }

    setIsLoggingIn(false);
    setPendingAction(null);
    if (actionToRun) {
      void runProtectedAction(actionToRun);
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
    <div className="relative min-h-screen bg-[#faf9f6] py-8 font-sans text-[#111111] selection:bg-[#ffd8c2] sm:py-12 lg:py-14">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-12 top-24 h-44 w-44 rounded-full bg-[#ff5600]/7 blur-3xl" />
        <div className="absolute bottom-32 left-0 h-36 w-36 rounded-full bg-[#2c6415]/6 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <Card className="border-[#dedbd6] bg-white shadow-sm">
            <CardHeader className="pb-2">
              <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7b7b78]">
                Ringkasan hasil
              </p>
              <CardTitle className="flex flex-col items-center gap-2 text-center text-2xl font-semibold tracking-tight text-[#111111] sm:text-3xl">
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
                  <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
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

          <section
            className="space-y-6"
            aria-labelledby="result-detail-heading"
          >
            <h2
              id="result-detail-heading"
              className="border-b border-[#dedbd6] pb-2 text-sm font-medium uppercase tracking-[0.1em] text-[#7b7b78]"
            >
              Faktor &amp; rekomendasi
            </h2>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <FactorBreakdown factors={scoringResult?.factors} />
              <RecommendationCard recommendations={scoringResult?.recommendations} />
            </div>
          </section>

          <section className="space-y-6" aria-labelledby="result-tools-heading">
            <h2
              id="result-tools-heading"
              className="border-b border-[#dedbd6] pb-2 text-sm font-medium uppercase tracking-[0.1em] text-[#7b7b78]"
            >
              Simulasi &amp; riwayat
            </h2>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <LoanSimulator score={score} />
              <ScoreHistory />
            </div>
          </section>
        </div>
      </div>

      {showLoginPrompt ? (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-[#111111]/50 px-4 py-8 backdrop-blur-[3px] sm:items-center"
          onClick={(event) => {
            if (event.currentTarget === event.target && !isLoggingIn) {
              closeLoginPrompt();
            }
          }}
          role="presentation"
        >
          <div
            className="w-full max-w-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="result-login-title"
            onClick={(event) => event.stopPropagation()}
          >
            <LoginPanel
              titleId="result-login-title"
              eyebrow="Login"
              title={`Lanjut: ${pendingAction ? actionLabels[pendingAction] : "aksi"}`}
              subtitle="Sesudah masuk, aksi dijalankan otomatis."
              emailId="result-login-email"
              passwordId="result-login-password"
              emailRef={loginEmailInputRef}
              email={loginEmail}
              password={loginPassword}
              onEmailChange={setLoginEmail}
              onPasswordChange={setLoginPassword}
              error={loginError}
              isSubmitting={isLoggingIn}
              onSubmit={handleLoginSubmit}
              onClose={closeLoginPrompt}
              closeDisabled={isLoggingIn}
              submitLabel="Masuk & lanjutkan"
              googleClientId={googleClientId}
              onGoogleCredential={handleGoogleCredential}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ResultPage;
