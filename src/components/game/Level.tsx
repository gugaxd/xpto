import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type Lenis from "lenis";
import { useLang } from "@/i18n/lang";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { hud, lines } from "@/content/site";
import { projects, placeholderSlots } from "@/content/projects";
import { sfx } from "@/audio/sfx";
import { Toggles } from "../Toggles";
import { Dialog } from "./Dialog";
import { Hero, type HeroControl } from "./Hero";
import { Skyline } from "./Skyline";
import { Kaijus, Meteors, Ships } from "./SkyLife";
import { geometry, methodTerrain, stepHeight, zoneLabels, zoneOrder, type ZoneId } from "./layout";
import { ContinueZone, MethodZone, OriginZone, ProjectsZone, SheetZone, StartZone } from "./zones/Zones";
import type { Pose } from "./Gugabyte";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function viewport() {
  return { w: document.documentElement.clientWidth, h: window.innerHeight };
}

/**
 * A fase horizontal. A página tem uma altura "falsa" e o scroll vertical
 * vira deslocamento da câmera pra direita — 1px de scroll = 1px andado.
 */
export function Level({ lenis, started }: { lenis: Lenis | null; started: boolean }) {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const [size, setSize] = useState(viewport);
  const [zone, setZone] = useState<ZoneId>("start");
  const [reached, setReached] = useState(-1);
  const [moved, setMoved] = useState(false);

  const worldRef = useRef<HTMLDivElement>(null);
  const farRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<SVGSVGElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const xpRef = useRef<HTMLSpanElement>(null);
  const heroCtl = useRef<HeroControl>(null);
  const zoneEls = useRef<Partial<Record<ZoneId, HTMLElement>>>({});

  const slots = Math.max(projects.length, placeholderSlots);
  const geo = useMemo(() => geometry(size.w, slots), [size.w, slots]);
  const stepH = stepHeight(size.h);
  const terrain = useMemo(() => methodTerrain(geo, size.w, stepH), [geo, size.w, stepH]);

  // posição inicial (px) de cada zona e largura total do mundo
  const { xs, worldW } = useMemo(() => {
    const out = {} as Record<ZoneId, number>;
    let acc = 0;
    for (const id of zoneOrder) {
      out[id] = acc;
      acc += geo.widths[id] * size.w;
    }
    return { xs: out, worldW: acc };
  }, [geo, size.w]);
  const maxCam = Math.max(1, worldW - size.w);

  // Ao redimensionar, as zonas mudam de tamanho em px. Guardamos onde o personagem está
  // (zona + fração dentro dela) e recolocamos a câmera no mesmo ponto, sem animar a caminhada.
  const anchor = useRef<{ zone: ZoneId; f: number; end: boolean }>({ zone: "start", f: 0, end: false });
  const resizingUntil = useRef(0);
  const pinned = useRef<number | null>(null);
  useEffect(() => {
    let lastW = viewport().w;
    const onResize = () => {
      const v = viewport();
      // só a largura muda a geometria; a barra do celular (só altura) não deve travar a câmera
      if (v.w !== lastW) {
        lastW = v.w;
        resizingUntil.current = performance.now() + 350;
      }
      setSize(v);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const firstLayout = useRef(true);
  useLayoutEffect(() => {
    if (firstLayout.current) {
      firstLayout.current = false;
      return;
    }
    const a = anchor.current;
    const target = a.end ? maxCam : clamp(xs[a.zone] + a.f * geo.widths[a.zone] * size.w - geo.heroX * size.w, 0, maxCam);
    resizingUntil.current = performance.now() + 350;
    pinned.current = target;
    lenis?.resize();
    if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
    else window.scrollTo(0, target);
  }, [maxCam, xs, geo, size.w, lenis]);

  // laço principal: câmera, parallax, zona atual, degraus e animação do personagem
  const movedRef = useRef(false);
  const zoneRef = useRef<ZoneId>("start");
  useEffect(() => {
    let raf = 0;
    let prevCam = -1;
    let acc = 0;
    let step = 0;
    let pose: Pose = "idle";
    let left = false;
    let lastMove = 0;
    let reachedNow = -2;
    let lift = -1;
    let ground = -1;

    const tick = (time: number) => {
      const resizing = performance.now() < resizingUntil.current;
      // enquanto redimensiona, segura a câmera no ponto calculado (o navegador e o Lenis podem mexer no scroll)
      if (resizing && pinned.current !== null && Math.abs(window.scrollY - pinned.current) > 1) {
        if (lenis) lenis.scrollTo(pinned.current, { immediate: true, force: true });
        else window.scrollTo(0, pinned.current);
      }
      if (!resizing) pinned.current = null;
      const cam = clamp(window.scrollY, 0, maxCam);
      const heroX = cam + geo.heroX * size.w;

      if (worldRef.current) worldRef.current.style.transform = `translate3d(${-cam}px,0,0)`;
      if (farRef.current) farRef.current.style.transform = `translate3d(${-cam * 0.06}px,0,0)`;
      if (nearRef.current) nearRef.current.style.transform = `translate3d(${-cam * 0.2}px,0,0)`;
      if (xpRef.current) xpRef.current.style.transform = `scaleX(${cam / maxCam})`;

      // zona atual + progresso local (--p) de cada zona
      let current: ZoneId = "start";
      for (const id of zoneOrder) {
        if (heroX >= xs[id] - 1) current = id;
        const el = zoneEls.current[id];
        if (el) el.style.setProperty("--p", clamp((heroX - xs[id]) / (geo.widths[id] * size.w), 0, 1).toFixed(3));
      }
      if (!resizing) {
        anchor.current = {
          zone: current,
          f: clamp((heroX - xs[current]) / (geo.widths[current] * size.w), 0, 1),
          end: cam >= maxCam - 2,
        };
      }
      if (current !== zoneRef.current && !resizing) {
        zoneRef.current = current;
        setZone(current);
        if (started && !resizing) sfx.zone();
      }

      // terreno do método: rampas sobem suave, a escadinha desce degrau a degrau
      const localX = heroX - xs.method;
      const h = terrain.heightAt(localX);
      let r = -1;
      terrain.platforms.forEach((p, i) => {
        if (localX >= p.left - 4) r = i;
      });
      if (r !== reachedNow) {
        reachedNow = r;
        setReached(r);
      }
      // degrau da escada (salto discreto de altura) = passinho com som
      if (ground >= 0 && Math.abs(h - ground) >= stepH * 0.5 && started && !resizing) sfx.step(true);
      ground = h;
      // a altura mostrada persegue a do terreno: acompanha a rampa e amacia cada degrau
      const next = lift < 0 || reduce || resizing ? h : lift + (h - lift) * 0.35;
      if (Math.abs(next - lift) > 0.05) {
        lift = Math.abs(next - h) < 0.3 ? h : next;
        heroRef.current?.style.setProperty("--lift", `${-lift}px`);
      }

      // andar: de perfil enquanto se move, de frente quando para
      // durante o redimensionamento a câmera é reposicionada, não é o personagem andando
      const dv = prevCam < 0 || resizing ? 0 : cam - prevCam;
      prevCam = cam;
      const ctl = heroCtl.current;
      if (Math.abs(dv) > 0.15) {
        left = dv < 0;
        lastMove = time;
        acc += Math.abs(dv);
        const stride = Math.max(16, size.w * 0.014);
        if (acc > stride) {
          acc = 0;
          step++;
          if (step % 2 === 0) sfx.step(step % 4 === 0);
        }
        pose = "walk";
        ctl?.set("walk", step, left);
        if (!movedRef.current && cam > 24) {
          movedRef.current = true;
          setMoved(true);
        }
      } else if (pose === "walk" && time - lastMove > 180) {
        pose = "idle";
        ctl?.set("idle", 0, false);
      } else if (pose !== "walk" && !reduce) {
        const blinking = (time - lastMove) % 3400 > 3250;
        const want: Pose = blinking ? "blink" : "idle";
        if (want !== pose) {
          pose = want;
          ctl?.set(want, 0, false);
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [geo, xs, maxCam, size.w, stepH, terrain, reduce, started, lenis]);

  // teclado e botões de toque
  const nudge = (px: number) => {
    if (!lenis) return;
    lenis.scrollTo(clamp(lenis.targetScroll + px, 0, maxCam));
  };
  useEffect(() => {
    if (!started) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea")) return;
      if (e.key === "ArrowRight" || e.key === "d") {
        e.preventDefault();
        nudge(size.w * 0.3);
      } else if (e.key === "ArrowLeft" || e.key === "a") {
        e.preventDefault();
        nudge(-size.w * 0.3);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const hold = useRef<number | undefined>(undefined);
  const startHold = (dir: number) => {
    nudge(dir * 60);
    window.clearInterval(hold.current);
    hold.current = window.setInterval(() => nudge(dir * 60), 70);
  };
  const stopHold = () => window.clearInterval(hold.current);

  const goTo = (id: ZoneId) => {
    sfx.select();
    // a última zona só aparece inteira no fim da fase
    const target = id === "continue" ? maxCam : xs[id] - geo.heroX * size.w + 8;
    lenis?.scrollTo(clamp(target, 0, maxCam));
  };

  const zoneContent: Record<ZoneId, ReactNode> = {
    start: <StartZone active={zone === "start"} />,
    origin: <OriginZone active={zone === "origin"} />,
    method: <MethodZone terrain={terrain} reached={reached} />,
    projects: <ProjectsZone geo={geo} vw={size.w} active={zone === "projects"} />,
    sheet: <SheetZone active={zone === "sheet"} />,
    continue: <ContinueZone active={zone === "continue"} reduce={reduce} onRestart={() => goTo("start")} />,
  };

  const line = zone === "projects" && projects.length ? lines.projectsReady : lines[zone];

  return (
    <main className="level" style={{ height: maxCam + size.h }} inert={!started} aria-hidden={!started}>
      <div className="stage" style={{ ["--hero-x" as string]: `${geo.heroX * 100}%` }}>
        <div className="sky-wrap" aria-hidden>
          <div className="sky-glow" />
          <Meteors />
          {/* cidade distante + monstros andam juntos */}
          <div className="sky-layer" ref={farRef} style={{ width: size.w + maxCam * 0.06 + 40, height: size.h * 0.62 }}>
            <Skyline width={size.w + maxCam * 0.06 + 40} height={size.h * 0.62} seed={11} layer="far" />
            <Kaijus />
          </div>
          <Ships />
          <Skyline ref={nearRef} width={size.w + maxCam * 0.2 + 40} height={size.h * 0.5} seed={29} layer="near" />
        </div>

        <div className="world" ref={worldRef} style={{ width: worldW }}>
          {zoneOrder.map((id) => (
            <section
              key={id}
              ref={(el) => {
                if (el) zoneEls.current[id] = el;
              }}
              className={`zone zone-${id}`}
              style={{ left: xs[id], width: geo.widths[id] * size.w }}
              aria-label={t(zoneLabels[id])}
            >
              {zoneContent[id]}
            </section>
          ))}
          <div className="ground" aria-hidden />
        </div>

        <Hero control={heroCtl} heroRef={heroRef} />
        {!moved && started && <span className="walk-hint hud blink">{t(hud.walkHint)}</span>}

        <header className="game-hud">
          <span className="display game-logo">GH</span>
          <nav className="xp" aria-label="Fases">
            <span className="xp-fill" ref={xpRef} />
            {zoneOrder.map((id) => (
              <button
                key={id}
                type="button"
                className="xp-mark"
                data-on={id === zone || undefined}
                style={{ left: `${(clamp(xs[id] - geo.heroX * size.w, 0, maxCam) / maxCam) * 100}%` }}
                onClick={() => goTo(id)}
                aria-label={t(zoneLabels[id])}
                title={t(zoneLabels[id])}
              />
            ))}
          </nav>
          <span className="hud game-zone">{t(zoneLabels[zone])}</span>
          <Toggles />
        </header>

        {started && <Dialog key={zone + t(line)} text={t(line)} instant={reduce} />}

        <div className="pad">
          <button type="button" aria-label={t(hud.left)} onPointerDown={() => startHold(-1)} onPointerUp={stopHold} onPointerLeave={stopHold} onPointerCancel={stopHold}>
            ◀
          </button>
          <button type="button" aria-label={t(hud.right)} onPointerDown={() => startHold(1)} onPointerUp={stopHold} onPointerLeave={stopHold} onPointerCancel={stopHold}>
            ▶
          </button>
        </div>
      </div>
    </main>
  );
}
