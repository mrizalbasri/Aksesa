import React, { useEffect, useRef } from "react";

const GIS_SCRIPT = "https://accounts.google.com/gsi/client";

type GoogleCredentialResponse = {
  credential?: string;
};

type GsiCallback = (response: GoogleCredentialResponse) => void;

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: GsiCallback;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: string;
              theme?: string;
              size?: string;
              text?: string;
              width?: number;
              locale?: string;
            },
          ) => void;
        };
      };
    };
  }
}

/** GIS initialize() is global; route callbacks to the mounted panel’s handler. */
let activeGoogleCredentialHandler:
  | ((credential: string) => void | Promise<void>)
  | null = null;

let gsiInitializedForClient: string | null = null;

function loadGisScript(): Promise<void> {
  if (typeof document === "undefined") {
    return Promise.resolve();
  }
  if (document.querySelector(`script[src="${GIS_SCRIPT}"]`)) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GIS_SCRIPT;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Gagal memuat Google Sign-In"));
    document.head.appendChild(script);
  });
}

type GoogleSignInButtonProps = {
  clientId: string;
  onCredential: (credential: string) => void | Promise<void>;
  disabled?: boolean;
};

export function GoogleSignInButton({
  clientId,
  onCredential,
  disabled,
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    activeGoogleCredentialHandler = onCredential;
    return () => {
      activeGoogleCredentialHandler = null;
    };
  }, [onCredential]);

  useEffect(() => {
    if (!clientId.trim() || !containerRef.current) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        await loadGisScript();
        if (cancelled || !containerRef.current || !window.google?.accounts?.id) {
          return;
        }

        if (gsiInitializedForClient !== clientId) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response: GoogleCredentialResponse) => {
              if (response.credential && activeGoogleCredentialHandler) {
                void activeGoogleCredentialHandler(response.credential);
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          gsiInitializedForClient = clientId;
        }

        const el = containerRef.current;
        el.innerHTML = "";
        const width = Math.min(
          400,
          Math.max(220, Math.floor(el.getBoundingClientRect().width) || 320),
        );
        window.google.accounts.id.renderButton(el, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          width,
          locale: "id",
        });
      } catch {
        /* caller shows error via login panel */
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [clientId]);

  if (!clientId.trim()) {
    return null;
  }

  return (
    <div
      className={`w-full ${disabled ? "pointer-events-none opacity-50" : ""}`}
    >
      <div ref={containerRef} className="flex min-h-[44px] w-full justify-center" />
    </div>
  );
}
