import { Toaster as Sonner, type ToasterProps } from "sonner";
import { Glyph } from "@/ui/Glyph";
import { Spinner } from "@/ui/Button";

/**
 * Toasts, in Pressing.
 *
 * `theme="dark"` is hard-coded rather than read from next-themes: this design has no light
 * theme, and the provider was never mounted, so the hook was silently falling back to
 * "system" and letting sonner pick a light palette on a light-mode OS.
 *
 * The CSS-var bridge maps sonner's own tokens onto ours. `--normal-bg` is ink-700 (the
 * card surface) rather than the page, so a toast reads as an object on top of the screen
 * rather than as part of it.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      icons={{
        success: <Glyph name="check" className="text-teal" />,
        info: <Glyph name="eye" />,
        warning: <Glyph name="warn" className="text-gold" />,
        error: <Glyph name="warn" className="text-signal-text" />,
        loading: <Spinner />,
      }}
      style={
        {
          "--normal-bg": "var(--color-ink-700)",
          "--normal-text": "var(--color-paper)",
          "--normal-border": "var(--color-line-strong)",
          "--border-radius": "var(--radius-md)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
