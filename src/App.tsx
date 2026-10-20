import { useEffect, useState } from "react";
import Lenis from "lenis";
import { LangProvider } from "@/i18n/lang";
import { sfx } from "@/audio/sfx";
import { Arcade } from "@/components/arcade/Arcade";
import { Level } from "@/components/game/Level";
import "@/styles/arcade.css";
import "@/styles/game.css";

export default function App() {
  const [entered, setEntered] = useState(false);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // sempre começa no arcade, do início da fase
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const l = new Lenis({ autoRaf: true, smoothWheel: true, gestureOrientation: "both", lerp: 0.09 });
    l.stop();
    setLenis(l);
    return () => l.destroy();
  }, []);

  const onEnter = () => {
    setEntered(true);
    sfx.power();
    lenis?.start();
  };

  return (
    <LangProvider>
      <Level lenis={lenis} started={entered} />
      {!entered && <Arcade onEnter={onEnter} />}
      {entered && <div className="crt-on" aria-hidden />}
    </LangProvider>
  );
}
