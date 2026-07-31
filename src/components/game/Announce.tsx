/**
 * A polite live region.
 *
 * The whole game loop is "wait for something to change" — your turn arrives, a
 * clue lands, the phase moves on, the round resolves. All of that was conveyed
 * purely visually, so a screen-reader user had no way to know anything had
 * happened. This announces the current state in one short sentence.
 *
 * `aria-live="polite"` queues behind whatever the user is already reading
 * rather than interrupting; `aria-atomic` makes the whole message re-read even
 * when only part of it changed.
 */
export function Announce({ message }: { message: string }) {
  return (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  );
}
