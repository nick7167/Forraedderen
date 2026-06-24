/** Brief full-bleed splash announcing a new phase. Tap to skip. */
export function PhaseBanner({
  emoji,
  label,
  onDone,
}: {
  emoji: string;
  label: string;
  onDone: () => void;
}) {
  return (
    <div
      onClick={onDone}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-md duration-200 animate-in fade-in"
    >
      <div className="flex flex-col items-center gap-3 duration-500 animate-in zoom-in-75">
        <span className="text-7xl drop-shadow-lg">{emoji}</span>
        <span className="bg-gradient-to-br from-violet-300 to-fuchsia-400 bg-clip-text text-5xl font-black tracking-tight text-transparent">
          {label}
        </span>
      </div>
    </div>
  );
}
