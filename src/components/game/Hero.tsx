import { useEffect, useState, type RefObject } from "react";
import { Gugabyte, type Pose } from "./Gugabyte";

export type HeroControl = { set: (pose: Pose, step: number, left: boolean) => void };

/**
 * O personagem na tela. Fica fora do render da fase pra que trocar de quadro
 * (≈10x por segundo) não re-renderize o mundo inteiro.
 */
export function Hero({ control, heroRef }: { control: RefObject<HeroControl | null>; heroRef: RefObject<HTMLDivElement | null> }) {
  const [state, setState] = useState<{ pose: Pose; step: number; left: boolean }>({ pose: "idle", step: 0, left: false });

  useEffect(() => {
    control.current = {
      set: (pose, step, left) =>
        setState((s) => (s.pose === pose && s.step === step && s.left === left ? s : { pose, step, left })),
    };
  }, [control]);

  return (
    <div ref={heroRef} className="hero" data-left={state.left || undefined}>
      <div className="hero-flip">
        <Gugabyte pose={state.pose} step={state.step} />
      </div>
      <span className="hero-shadow" />
    </div>
  );
}
