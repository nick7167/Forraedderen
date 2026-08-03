import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { t } from "@/lib/strings";

function Section({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-xl">{emoji}</span>
      <div>
        <p className="text-body text-paper font-semibold">{title}</p>
        <p className="text-body-sm text-muted">{body}</p>
      </div>
    </div>
  );
}

/** Danish rules explainer, opened from the lobby. `trigger` is the clickable. */
export function HowToPlay({ trigger }: { trigger: React.ReactNode }) {
  const h = t.howTo;
  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t.howToTitle}</DrawerTitle>
        </DrawerHeader>
        <div data-testid="how-to-content" className="no-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-[max(2rem,env(safe-area-inset-bottom))]">
          <Section emoji="🎯" title={h.goal.title} body={h.goal.body} />
          <Section emoji="💬" title={h.clues.title} body={h.clues.body} />
          <Section emoji="🗳️" title={h.vote.title} body={h.vote.body} />
          <Section emoji="🤝" title={h.tie.title} body={h.tie.body} />
          <Section emoji="⭐" title={h.points.title} body={h.points.body} />
          <div className="bg-line my-1 h-px" />
          <p className="text-label text-muted font-semibold tracking-[0.12em] uppercase">
            {t.mode}
          </p>
          <Section emoji="🦎" title={h.klassisk.title} body={h.klassisk.body} />
          <Section emoji="🎭" title={h.undercover.title} body={h.undercover.body} />
          <Section emoji="❓" title={h.questions.title} body={h.questions.body} />
          <Section emoji="📊" title={h.scale.title} body={h.scale.body} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
