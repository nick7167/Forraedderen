import { t } from "@/lib/strings";

/**
 * The four game modes.
 *
 * Lifted out of SettingsPanel so the home screen's explainer and the host's mode picker
 * are the same list — a fifth mode should appear in both without anyone remembering to
 * add it twice. The emoji are the same ones the lobby and the reveal card use.
 *
 * `tagline` is the one-liner for a picker; `desc` is the fuller sentence shown once a mode
 * is selected. Both already existed in strings.ts.
 */
export const MODES = [
  {
    id: "spy",
    emoji: "🕵️",
    label: t.modeSpy,
    tagline: t.modeSpyTag,
    desc: t.modeSpyDesc,
  },
  {
    id: "undercover",
    emoji: "🦎",
    label: t.modeUndercover,
    tagline: t.modeUndercoverTag,
    desc: t.modeUndercoverDesc,
  },
  {
    id: "questions",
    emoji: "❓",
    label: t.modeQuestions,
    tagline: t.modeQuestionsTag,
    desc: t.modeQuestionsDesc,
  },
  {
    id: "scale",
    emoji: "📊",
    label: t.modeScale,
    tagline: t.modeScaleTag,
    desc: t.modeScaleDesc,
  },
] as const;

export type ModeId = (typeof MODES)[number]["id"];
