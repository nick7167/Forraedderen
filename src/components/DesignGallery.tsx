import { useState, type ReactNode } from "react";
import { Button, Spinner } from "@/ui/Button";
import { Card, Chip, Empty, Meter, SectionLabel, Skeleton } from "@/ui/Surface";
import { Field, Input, Textarea } from "@/ui/Input";
import { Dialog } from "@/ui/Dialog";
import { Glyph, type GlyphName } from "@/ui/Glyph";

/**
 * The design gallery.
 *
 * Ported from SnapArena's `/design` route. Dev-only — see the guard in App.tsx.
 *
 * This is the verification harness and it replaces the old
 * `ui-concepts/kamaeleon-polish-concepts.html` + `e2e/concept-parity.spec.ts` pair. That
 * arrangement required a hand-maintained HTML mockup to be kept in sync with the app's CSS
 * by a comment saying "do not improve numbers in place" — which is a rule, not a mechanism.
 * A gallery built from the real components cannot drift, because it IS the components.
 *
 * Check this at 390px and 1440px, with prefers-reduced-motion on and off, and with a
 * keyboard only — every focusable element must show the paper ring.
 */
export function DesignGallery() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-4 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-display-1 font-extrabold tracking-tight">Pressing</h1>
        <p className="text-body text-muted max-w-2xl">
          Kamæleon's design system, ported from SnapArena. Deep ink surfaces, fully opaque
          colour, no gradients and no glow. Depth comes from one device only: a hard 4px
          bottom edge that collapses when a control is pressed.
        </p>
        <p className="text-body-sm text-faint max-w-2xl">
          Check at 390px and 1440px, with prefers-reduced-motion on and off, and with a
          keyboard only — every focusable element must show the paper ring.
        </p>
      </header>

      <Group label="Colour" note="Ratios measured against ink-800 in sRGB, where WCAG defines contrast.">
        <Swatches />
      </Group>

      <Group label="Typography" note="Archivo for display and numerals, Geist for body. Tabular figures are non-negotiable.">
        <Typography />
      </Group>

      <Group label="Buttons" note="Solid fill, hard 4px bottom edge, travels down on press. Tab to each — the paper ring is required.">
        <Buttons />
      </Group>

      <Group label="Inputs" note="Inset, not raised — controls you press stand out, controls you fill are cut in.">
        <Inputs />
      </Group>

      <Group label="Surfaces" note="`you` draws the chamfered plate. It is the app's brand geometry and marks identity only.">
        <Surfaces />
      </Group>

      <Group label="Meters">
        <Meters />
      </Group>

      <Group label="Glyphs" note="One 16×16 grid, one stroke weight, sized in em. Game-meaningful emoji stay emoji.">
        <Glyphs />
      </Group>

      <Group label="The role card" note="The fourth licensed exception — the only surface in the app allowed a gradient.">
        <RoleCard />
      </Group>

      <Group label="Overlays">
        <Overlays />
      </Group>
    </div>
  );
}

function Group({ label, note, children }: { label: string; note?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="border-line flex flex-col gap-1 border-b pb-2">
        <SectionLabel>{label}</SectionLabel>
        {note && <p className="text-body-sm text-muted">{note}</p>}
      </div>
      {children}
    </section>
  );
}

/* ---------------------------------------------------------------- colour */

const SURFACES = [
  ["ink-900", "bg-ink-900", "chrome"],
  ["ink-800", "bg-ink-800", "page"],
  ["ink-700", "bg-ink-700", "card"],
  ["ink-600", "bg-ink-600", "raised"],
  ["ink-500", "bg-ink-500", "hover"],
  ["ink-inset", "bg-ink-inset", "inset"],
] as const;

const TEXT = [
  ["paper", "bg-paper", "15.9:1"],
  ["secondary", "bg-secondary", "8.2:1"],
  ["muted", "bg-muted", "4.7:1 — AA floor"],
  ["faint", "bg-faint", "2.1:1 — decorative only"],
] as const;

const WORKING = [
  ["gold", "bg-gold", "9.6:1 — primary, winner"],
  ["signal", "bg-signal", "4.1:1 — imposter, ≥24px"],
  ["signal-text", "bg-signal-text", "6.4:1 — same at body size"],
  ["teal", "bg-teal", "5.4:1 — crew, live"],
  ["line", "bg-line", "dividers"],
  ["line-strong", "bg-line-strong", "3.6:1 — controls"],
] as const;

function Swatches() {
  return (
    <div className="flex flex-col gap-6">
      {(
        [
          ["Surfaces", SURFACES],
          ["Text", TEXT],
          ["Working colour", WORKING],
        ] as const
      ).map(([group, items]) => (
        <div key={group} className="flex flex-col gap-2">
          <p className="text-label text-faint font-semibold tracking-[0.12em] uppercase">
            {group}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {items.map(([name, bg, note]) => (
              <div key={name} className="flex flex-col gap-1">
                <div className={`border-line h-14 rounded-md border ${bg}`} />
                <span className="text-label text-secondary">{name}</span>
                <span className="text-label text-muted">{note}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------ typography */

function Typography() {
  return (
    <div className="flex flex-col gap-5">
      <Spec name="display-hero · 96/0.9">
        <p className="font-display text-display-hero font-extrabold tracking-tight">3</p>
      </Spec>
      <Spec name="display-1 · 56/1">
        <p className="font-display text-display-1 font-extrabold tracking-tight">Kamæleon</p>
      </Spec>
      <Spec name="display-2 · 32/1.1">
        <p className="font-display text-display-2 font-extrabold">Afsløring</p>
      </Spec>
      <Spec name="numeral · 20/1">
        <p className="font-display text-numeral font-bold">Runde 2 / 5 · 4 / 6 klar</p>
      </Spec>
      <Spec name="body-lg · 18/1.5">
        <p className="text-body-lg">Find kamæleonen iblandt jer.</p>
      </Spec>
      <Spec name="body · 15/1.5">
        <p className="text-body">Alle får det samme hemmelige ord — undtagen én.</p>
      </Spec>
      <Spec name="body-sm · 13/1.45">
        <p className="text-body-sm text-secondary">Tryk på kortet for at se din rolle.</p>
      </Spec>
      <Spec name="label · 11/1.2 · uppercase, 0.12em">
        <p className="text-label text-muted font-semibold tracking-[0.12em] uppercase">
          Dine medspillere
        </p>
      </Spec>
      <div className="bg-ink-700 flex flex-col gap-1 rounded-md p-4">
        <p className="text-label text-muted font-semibold tracking-[0.12em] uppercase">
          Tabular numerals — must not reflow
        </p>
        <p className="font-display text-numeral font-bold">1 / 12</p>
        <p className="font-display text-numeral font-bold">8 / 12</p>
        <p className="font-display text-numeral font-bold">11 / 12</p>
      </div>
    </div>
  );
}

function Spec({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-label text-faint tabular-nums">{name}</span>
      {children}
    </div>
  );
}

/* --------------------------------------------------------------- buttons */

const VARIANTS = ["primary", "secondary", "ghost", "destructive"] as const;

function Buttons() {
  return (
    <div className="flex flex-col gap-6">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <p className="text-label text-faint font-semibold tracking-[0.12em] uppercase">
            {variant}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant={variant} size="sm">
              Small
            </Button>
            <Button variant={variant} size="md">
              Medium
            </Button>
            <Button variant={variant} size="lg">
              Large
            </Button>
            <Button variant={variant} loading>
              Loading
            </Button>
            <Button variant={variant} disabled>
              Disabled
            </Button>
            <Button variant={variant}>
              <Glyph name="check" />
              With glyph
            </Button>
          </div>
        </div>
      ))}
      <div className="flex max-w-sm flex-col gap-2">
        <p className="text-label text-faint font-semibold tracking-[0.12em] uppercase">
          block · the phone-layout CTA
        </p>
        <Button size="lg" block>
          Start spil
        </Button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- inputs */

function Inputs() {
  const [filled, setFilled] = useState("Nicklas");

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Field label="Dit navn" htmlFor="g-empty" help="Vises for de andre spillere.">
        <Input id="g-empty" placeholder="Skriv dit navn" />
      </Field>

      <Field label="Udfyldt" htmlFor="g-filled">
        <Input id="g-filled" value={filled} onChange={(e) => setFilled(e.target.value)} />
      </Field>

      <Field label="Med affiks" htmlFor="g-affix">
        <Input
          id="g-affix"
          defaultValue="ABCD"
          prefix={<Glyph name="search" />}
          suffix={<Glyph name="check" className="text-teal" />}
        />
      </Field>

      <Field label="Ugyldig" htmlFor="g-invalid" error="Mindst 3 spillere.">
        <Input id="g-invalid" defaultValue="AB" invalid />
      </Field>

      <Field label="Deaktiveret" htmlFor="g-disabled">
        <Input id="g-disabled" defaultValue="Låst" disabled />
      </Field>

      <Field label="Stor" htmlFor="g-lg" count="4/24">
        <Input id="g-lg" size="lg" placeholder="Skriv dit svar (ét ord)" />
      </Field>

      <div className="sm:col-span-2">
        <Field label="Ord (ét pr. linje)" htmlFor="g-area" count="3/200">
          <Textarea id="g-area" rows={4} defaultValue={"Æble\nBanan\nKiwi"} />
        </Field>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- surfaces */

function Surfaces() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="flex flex-col gap-1 p-4">
          <p className="text-body text-paper font-semibold">Card · default</p>
          <p className="text-body-sm text-muted">ink-700 with a hairline border.</p>
        </Card>
        <Card variant="hero" className="flex flex-col gap-1 p-4">
          <p className="text-body text-paper font-semibold">Card · hero</p>
          <p className="text-body-sm text-muted">One per screen. Adds the 1px top sheen.</p>
        </Card>
        <Card you accent="#1f9e8c" className="flex flex-col gap-1 p-4">
          <p className="text-body text-paper font-semibold">Card · you</p>
          <p className="text-body-sm text-secondary">The struck plate. Identity only.</p>
        </Card>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-label text-faint font-semibold tracking-[0.12em] uppercase">
          Chips — md
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone="neutral">Neutral</Chip>
          <Chip tone="gold">
            <Glyph name="host" filled />
            Vært
          </Chip>
          <Chip tone="signal">Kamæleon</Chip>
          <Chip tone="teal">Klar</Chip>
          <Chip tone="paper">Vinder</Chip>
        </div>
        <p className="text-label text-faint mt-2 font-semibold tracking-[0.12em] uppercase">
          Chips — sm
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone="neutral" size="sm">
            <Glyph name="bot" />
            Bot
          </Chip>
          <Chip tone="teal" size="sm">
            3 / 6
          </Chip>
          <Chip tone="signal" size="sm">
            Afsløret
          </Chip>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-label text-faint font-semibold tracking-[0.12em] uppercase">
          Skeleton
        </p>
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-24 w-full" />
      </div>

      <Empty
        title="Ingen kategorier matcher"
        body="Prøv et andet søgeord, eller lav din egen pakke."
        action={
          <Button variant="secondary" size="sm">
            <Glyph name="plus" />
            Lav egen pakke
          </Button>
        }
      />
    </div>
  );
}

/* ---------------------------------------------------------------- meters */

function Meters() {
  return (
    <div className="flex max-w-sm flex-col gap-4">
      {[
        [6, 6, "teal", "Alle klar"],
        [4, 6, "teal", "4 af 6 klar"],
        [1, 6, "gold", "1 af 6 klar"],
        [0, 6, "muted", "Ingen klar"],
      ].map(([value, max, tone, label]) => (
        <div key={String(label)} className="flex flex-col gap-1">
          <span className="text-label text-muted tabular-nums">{label as string}</span>
          <Meter
            value={value as number}
            max={max as number}
            tone={tone as "teal" | "gold" | "muted"}
            height="lg"
            label={label as string}
          />
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- glyphs */

const ALL_GLYPHS: GlyphName[] = [
  "check", "close", "plus", "minus", "copy", "share", "search", "settings", "leave",
  "history", "mute", "sound", "chevron", "user", "users", "warn", "bot", "host",
  "timer", "eye",
];

function Glyphs() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
      {ALL_GLYPHS.map((name) => (
        <div
          key={name}
          className="bg-ink-700 flex flex-col items-center gap-2 rounded-md p-3 text-2xl"
        >
          <Glyph name={name} />
          <span className="text-label text-muted">{name}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------- role card */

function RoleCard() {
  const [flipped, setFlipped] = useState(false);
  const [role, setRole] = useState<"crew" | "imposter">("crew");

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={() => setFlipped((f) => !f)}>
          <Glyph name="eye" />
          {flipped ? "Vend tilbage" : "Vend kortet"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setRole((r) => (r === "crew" ? "imposter" : "crew"))}
        >
          Skift rolle ({role})
        </Button>
      </div>

      <div className="reveal-card h-[402px] w-[286px]">
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-pressed={flipped}
          aria-label={flipped ? "Skjul rollen" : "Vis rollen"}
          className="reveal-card__inner block cursor-pointer text-left"
          data-flipped={flipped}
        >
          <span className="reveal-card__face">
            <span aria-hidden className="reveal-card__edge plate" />
            <span aria-hidden className="reveal-card__fill plate" />
            <span className="reveal-card__body plate gap-4">
              <span className="reveal-card__sweep" />
              <span className="text-6xl" aria-hidden>
                🦎
              </span>
              <span className="text-body-sm text-muted flex items-center gap-1.5">
                <Glyph name="eye" />
                Tryk for at se
              </span>
            </span>
          </span>

          <span
            className="reveal-card__face reveal-card__face--back"
            style={
              {
                "--reveal-edge":
                  role === "imposter" ? "var(--color-signal)" : "var(--color-teal)",
              } as React.CSSProperties
            }
          >
            <span aria-hidden className="reveal-card__edge plate" />
            <span aria-hidden className="reveal-card__fill plate" />
            <span className="reveal-card__body plate gap-3 px-5 text-center">
              <span className="text-label text-muted font-semibold tracking-[0.12em] uppercase">
                Din rolle
              </span>
              <span
                className={`font-display text-display-2 font-extrabold ${
                  role === "imposter" ? "text-signal-text" : "text-teal"
                }`}
              >
                {role === "imposter" ? "Kamæleon" : "Med i flokken"}
              </span>
              <span className="text-label text-muted mt-2 font-semibold tracking-[0.12em] uppercase">
                {role === "imposter" ? "Du kender ikke ordet" : "Ordet er"}
              </span>
              <span className="font-display text-display-2 text-paper font-extrabold">
                {role === "imposter" ? "— ? —" : "Havfrue"}
              </span>
              <Chip tone={role === "imposter" ? "signal" : "teal"} size="sm" className="mt-2">
                {role === "imposter" ? "Bland dig ind" : "Kategori: Eventyr"}
              </Chip>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- overlays */

function Overlays() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Åbn dialog
      </Button>
      <span className="text-body-sm text-muted inline-flex items-center gap-2">
        <Spinner /> Spinner
      </span>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Forlad spillet?"
        description="Du kan ikke komme tilbage til denne runde."
      >
        <div className="mt-5 flex flex-col gap-2">
          <Button variant="destructive" block onClick={() => setOpen(false)}>
            <Glyph name="leave" />
            Forlad spil
          </Button>
          <Button variant="ghost" block onClick={() => setOpen(false)}>
            Bliv
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
