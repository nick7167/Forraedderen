import { Component, type ErrorInfo, type ReactNode } from "react";
import { t } from "@/lib/strings";

/**
 * Last line of defence. Without this a single render throw leaves a blank screen with no
 * way out — a dead end in an installed PWA that someone opened mid-party. Offers a reload
 * and a route home, and shows the message itself so a bug report can be more than "it went
 * white".
 *
 * Deliberately built from raw elements and inline-ish utilities rather than from `src/ui`:
 * this is what renders when something else has already failed, and it must not be able to
 * throw a second time because a primitive it imported is the thing that broke.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
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
      <div
        className="bg-ink-800 text-paper flex min-h-dvh flex-col items-center justify-center gap-6 px-4 py-12"
        data-testid="crash-screen"
      >
        <div className="flex max-w-md flex-col items-center gap-3 text-center">
          <span className="text-6xl" aria-hidden>
            🦎
          </span>
          <h1 className="font-display text-display-2 font-extrabold">{t.crashTitle}</h1>
          <p className="text-body text-muted">{t.crashBody}</p>
        </div>

        <pre className="bg-ink-inset border-line text-body-sm text-signal-text max-w-md overflow-x-auto rounded-md border px-3 py-2 font-mono break-words whitespace-pre-wrap">
          {error.message}
        </pre>

        <div className="flex w-full max-w-xs flex-col gap-2">
          <button
            type="button"
            style={{ "--press-edge": "#9E7414" } as React.CSSProperties}
            className="press bg-gold text-ink-900 text-body-lg inline-flex min-h-13 w-full items-center justify-center rounded-md px-7 font-semibold"
            onClick={() => window.location.reload()}
          >
            {t.crashReload}
          </button>
          <button
            type="button"
            className="text-secondary hover:text-paper hover:bg-ink-700 text-body inline-flex min-h-11 w-full items-center justify-center rounded-md px-5 font-semibold transition-colors"
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
