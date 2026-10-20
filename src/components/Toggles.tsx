import { useLang } from "@/i18n/lang";
import { useMuted } from "@/hooks/useSound";
import { hud } from "@/content/site";
import { sfx } from "@/audio/sfx";

/** Seletor PT/EN + liga/desliga som. Aparece no arcade e no HUD da fase. */
export function Toggles() {
  const { lang, setLang, t } = useLang();
  const { muted, toggle } = useMuted();

  return (
    <div className="toggles hud">
      <div className="seg" role="group" aria-label="Idioma / Language">
        {(["pt", "en"] as const).map((l) => (
          <button
            key={l}
            type="button"
            aria-pressed={lang === l}
            onClick={() => {
              setLang(l);
              sfx.select();
            }}
          >
            {l}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="sound"
        aria-pressed={!muted}
        onClick={() => {
          sfx.unlock();
          toggle();
          if (muted) setTimeout(() => sfx.select(), 0);
        }}
      >
        <span aria-hidden className="sound-bars" data-on={!muted || undefined}>
          <i />
          <i />
          <i />
        </span>
        <span className="sound-label">
          {t(hud.sound)} {muted ? t(hud.off) : t(hud.on)}
        </span>
      </button>
    </div>
  );
}
