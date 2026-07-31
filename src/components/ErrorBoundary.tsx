import { Component, type ErrorInfo, type ReactNode } from "react";
import { t } from "@/lib/strings";

/**
 * Last line of defence. Without this a single render throw leaves a blank
 * screen with no way out — a dead end in an installed PWA that someone opened
 * mid-party. Offers a reload and a route home, and shows the message itself so
 * a bug report can be more than "it went white".
 */
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled render error:", error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="cscreen s-home">
        <div className="content items-center justify-center text-center">
          <div className="logo-area">
            <span className="logo-emoji" aria-hidden>
              🦎
            </span>
            <h1 className="logo-text">{t.crashTitle}</h1>
            <p className="logo-tagline">{t.crashBody}</p>
          </div>

          <p className="mode-desc-box max-w-full break-words font-mono text-xs">
            {error.message}
          </p>
        </div>

        <div className="footer flex flex-col gap-2.5">
          <button
            className="btn btn-primary hero-btn"
            onClick={() => window.location.reload()}
          >
            {t.crashReload}
          </button>
          <button
            className="btn btn-ghost w-full"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            {t.goHome}
          </button>
        </div>
      </div>
    );
  }
}
