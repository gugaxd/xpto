import { useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n/lang";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { arcade } from "@/content/site";
import { sfx } from "@/audio/sfx";
import { Gugabyte, type Pose } from "../game/Gugabyte";
import { Toggles } from "../Toggles";

type Phase = "idle" | "coin" | "zoom";

/**
 * Tela de entrada: salão de fliperama. A pessoa só entra no site clicando em "Entrar"
 * (ou na tela do gabinete). A câmera então mergulha na tela e chama `onEnter`.
 */
export function Arcade({ onEnter }: { onEnter: () => void }) {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [pose, setPose] = useState<Pose>("idle");
  const roomRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // mascote piscando na tela do gabinete
  useEffect(() => {
    if (reduce) return;
    let n = 0;
    const id = setInterval(() => {
      n++;
      setPose(n % 14 === 0 ? "blink" : n % 28 > 22 ? "happy" : "idle");
    }, 220);
    return () => clearInterval(id);
  }, [reduce]);

  useEffect(() => {
    btnRef.current?.focus({ preventScroll: true });
  }, []);

  const enter = () => {
    if (phase !== "idle") return;
    sfx.unlock();
    sfx.coin();
    setPhase("coin");
    if (reduce) {
      setTimeout(onEnter, 250);
      return;
    }
    setTimeout(() => {
      const room = roomRef.current;
      const screen = screenRef.current;
      const rr = room?.getBoundingClientRect();
      const sr = screen?.getBoundingClientRect();
      // sem medidas (aba em segundo plano), entra direto
      if (!room || !rr || !sr || !sr.width) return onEnter();
      const cx = sr.left - rr.left + sr.width / 2;
      const cy = sr.top - rr.top + sr.height / 2;
      const s = Math.max(rr.width / sr.width, rr.height / sr.height) * 1.06;
      room.style.transform = `translate(${rr.width / 2 - s * cx}px, ${rr.height / 2 - s * cy}px) scale(${s})`;
      setPhase("zoom");
      setTimeout(onEnter, 1200);
    }, 380);
  };

  return (
    <div className="arcade" data-phase={phase}>
      <div className="arcade-room" ref={roomRef}>
        <div className="arcade-wall" />
        <div className="arcade-floor" />

        <div className="cab cab-ghost cab-ghost-l" aria-hidden>
          <CabinetShell />
        </div>
        <div className="cab cab-ghost cab-ghost-r" aria-hidden>
          <CabinetShell />
        </div>

        <div className="cab cab-main">
          <div className="cab-marquee">
            <span className="display">{arcade.marquee}</span>
          </div>
          <div className="cab-bezel">
            <div className="cab-screen" ref={screenRef} onClick={enter}>
              <Gugabyte pose={pose} className="cab-sprite" />
              <span className="hud cab-insert blink">{t(arcade.insertCoin)}</span>
            </div>
          </div>
          <div className="cab-panel" aria-hidden>
            <span className="cab-stick" />
            <span className="cab-btns">
              <i />
              <i />
              <i />
            </span>
          </div>
          <div className="cab-body" aria-hidden>
            <div className="cab-coin">
              <i />
              <i />
            </div>
          </div>
        </div>

        <div className="arcade-title">
          <span className="hud arcade-eyebrow">{t(arcade.eyebrow)}</span>
          <h1 className="display arcade-h1">
            {t(arcade.title)} <em>{t(arcade.titleAccent)}</em>
          </h1>
          <button ref={btnRef} type="button" className="arcade-enter hud" onClick={enter}>
            {t(arcade.enter)} ▶
          </button>
          <span className="hud arcade-credit">
            {t(arcade.credits)}: <b>01</b> · <span className="blink">{t(arcade.pressStart)}</span>
          </span>
        </div>
      </div>

      <div className="arcade-toggles">
        <Toggles />
      </div>
    </div>
  );
}

function CabinetShell() {
  return (
    <>
      <div className="cab-marquee" />
      <div className="cab-bezel">
        <div className="cab-screen" />
      </div>
      <div className="cab-panel" />
      <div className="cab-body" />
    </>
  );
}
