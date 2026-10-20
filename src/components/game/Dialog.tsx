import { useEffect, useState } from "react";
import { sfx } from "@/audio/sfx";

/** Caixa de diálogo de RPG: texto digitado letra a letra, com bip. */
export function Dialog({ text, instant }: { text: string; instant: boolean }) {
  const [n, setN] = useState(instant ? text.length : 0);

  useEffect(() => {
    if (instant) {
      setN(text.length);
      return;
    }
    setN(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setN(i);
      if (i % 2 === 0 && text[i - 1].trim()) sfx.blip();
      if (i >= text.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [text, instant]);

  return (
    <div className="dialog" role="status" aria-live="polite">
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        &gt; {text.slice(0, n)}
        {n < text.length && <span className="dialog-caret">▌</span>}
      </span>
      {n >= text.length && <span className="dialog-next blink" aria-hidden>▼</span>}
    </div>
  );
}
