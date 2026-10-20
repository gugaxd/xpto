import { useEffect, useState } from "react";
import { useLang } from "@/i18n/lang";
import { start, origin, method, projectsCopy, sheet, continueCopy } from "@/content/site";
import { projects, placeholderSlots } from "@/content/projects";
import { contacts } from "@/content/contact";
import { sfx } from "@/audio/sfx";
import type { Geometry, Terrain } from "../layout";

type ZoneProps = { active: boolean };

/* ---------------- LV.0 · start ---------------- */
export function StartZone({ active }: ZoneProps) {
  const { t } = useLang();
  return (
    <div className="z-start" data-active={active || undefined}>
      <span className="hud z-eyebrow">{t(start.eyebrow)}</span>
      <h1 className="display z-start-title">
        {t(start.title)} <em>{t(start.titleAccent)}</em>
      </h1>
      <p className="z-lead">
        {start.sub.map((line, i) => (
          <span key={i} className="z-line">
            {t(line)}
          </span>
        ))}
      </p>
    </div>
  );
}

/* ---------------- LV.1 · origem ---------------- */
const codeLines = ['<Hero>', '  <Title size="xl" />', '  <Cta href="/play">', "    Entrar", "  </Cta>", "</Hero>"];

export function OriginZone({ active }: ZoneProps) {
  const { t } = useLang();
  return (
    <div className="z-origin" data-active={active || undefined}>
      <div className="z-copy">
        <h2 className="display z-title">{t(origin.title)}</h2>
        <p className="z-body">
          {origin.body.map((line, i) => (
            <span key={i} className="z-line">
              {t(line)}
            </span>
          ))}
        </p>
        <p className="z-turn">{t(origin.turn)}</p>
      </div>
      <div className="z-morph" aria-hidden>
        <div className="z-frame">
          <span className="hud z-tag">{t(origin.frameLabel)}</span>
          <div className="z-frame-hero">
            <i className="l1" />
            <i className="l2" />
            <b />
          </div>
          <svg viewBox="0 0 100 40" className="z-bezier">
            <path d="M5 35 C 30 0, 70 0, 95 35" />
            <rect x="2" y="32" width="6" height="6" />
            <rect x="92" y="32" width="6" height="6" />
            <circle cx="30" cy="4" r="2.5" />
            <line x1="5" y1="35" x2="30" y2="4" />
          </svg>
        </div>
        <span className="z-arrow hud">→</span>
        <pre className="z-code">
          <span className="hud z-tag">{t(origin.codeLabel)}</span>
          {codeLines.map((l, i) => (
            <span key={i} className="z-code-line" style={{ ["--i" as string]: i, ["--n" as string]: codeLines.length }}>
              {l}
            </span>
          ))}
        </pre>
      </div>
    </div>
  );
}

/* ---------------- LV.2 · método ---------------- */
export function MethodZone({ terrain, reached }: { terrain: Terrain; reached: number }) {
  const { t } = useLang();
  return (
    <div className="z-method">
      <h2 className="display z-title z-method-title">{t(method.title)}</h2>

      {terrain.ramps.map((r, i) => {
        const w = r.right - r.left;
        const top = r.to; // a rampa sempre sobe da esquerda pra direita
        return (
          <svg
            key={`ramp${i}`}
            className="z-ramp"
            data-on={i <= reached || undefined}
            style={{ left: r.left, width: w, height: top }}
            viewBox={`0 0 ${w} ${top}`}
            preserveAspectRatio="none"
            aria-hidden
          >
            <polygon points={`0,${top} 0,${top - r.from} ${w},0 ${w},${top}`} />
            <line x1={0} y1={top - r.from} x2={w} y2={0} />
          </svg>
        );
      })}

      {method.steps.map((s, i) => {
        const p = terrain.platforms[i];
        return (
          <div key={i} className="z-step" data-on={i <= reached || undefined} style={{ left: p.left, width: p.right - p.left }}>
            <div className="z-step-card" style={{ bottom: `calc(${p.height}px + var(--hero-h) + 26px)` }}>
              <span className="hud z-step-n">
                {String(i + 1).padStart(2, "0")} / 04
              </span>
              <strong className="z-step-name">{t(s.name)}</strong>
              <p>{t(s.text)}</p>
            </div>
            <div className="z-platform" style={{ height: p.height }} />
          </div>
        );
      })}

      {terrain.stairs.map((st, k) => (
        <div key={`stair${k}`} className="z-stair" data-on={reached >= 3 || undefined} style={{ left: st.left, width: st.width, height: st.height }} aria-hidden />
      ))}
    </div>
  );
}

/* ---------------- LV.3 · projetos ---------------- */
export function ProjectsZone({ geo, vw, active }: { geo: Geometry; vw: number; active: boolean }) {
  const { t } = useLang();
  const slots = Math.max(projects.length, placeholderSlots);
  return (
    <div className="z-projects" data-active={active || undefined}>
      <div className="z-copy z-projects-copy">
        <h2 className="display z-title">{t(projectsCopy.title)}</h2>
        <p className="z-body">{t(projectsCopy.sub)}</p>
      </div>
      {Array.from({ length: slots }, (_, i) => {
        const p = projects[i];
        const left = (geo.slotStart + i * geo.slotSpacing) * vw;
        const inner = (
          <>
            <div className="cab-mini-marquee hud">{p ? p.title : `slot ${String(i + 1).padStart(2, "0")}`}</div>
            <div className="cab-mini-screen">
              {p?.image ? (
                <img src={p.image} alt="" loading="lazy" />
              ) : (
                <span className="hud">
                  {p ? p.title : t(projectsCopy.soon)}
                  {!p && <span className="blink">_</span>}
                </span>
              )}
            </div>
            <div className="cab-mini-panel" />
            <div className="cab-mini-body">
              <span className="hud">{p ? (p.client ?? t(p.description)) : t(projectsCopy.emptySlot)}</span>
            </div>
          </>
        );
        return p ? (
          <a key={i} className="cab-mini" style={{ left }} href={p.url} target="_blank" rel="noreferrer" aria-label={`${t(projectsCopy.open)}: ${p.title}`} onClick={() => sfx.select()}>
            {inner}
          </a>
        ) : (
          <div key={i} className="cab-mini cab-mini-empty" style={{ left }} aria-hidden>
            {inner}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- LV.4 · ficha ---------------- */
export function SheetZone({ active }: ZoneProps) {
  const { t } = useLang();
  return (
    <div className="z-sheet" data-active={active || undefined}>
      <h2 className="display z-sheet-title">{t(sheet.title)}</h2>
      <div className="z-sheet-grid">
        <div>
          <span className="hud z-sheet-label">{t(sheet.gearLabel)}</span>
          <ul className="z-gear">
            {sheet.gear.map((g) => (
              <li key={g} className="hud">
                {g}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className="hud z-sheet-label">{t(sheet.statsLabel)}</span>
          <ul className="z-stats">
            {sheet.stats.map((s, i) => (
              <li key={i}>
                <span className="hud">{t(s.name)}</span>
                <span className="z-bar" role="meter" aria-valuemin={0} aria-valuemax={10} aria-valuenow={s.value} aria-label={t(s.name)}>
                  {Array.from({ length: 10 }, (_, k) => (
                    <i key={k} data-on={k < s.value || undefined} style={{ ["--k" as string]: k }} />
                  ))}
                </span>
                <span className="hud z-val">{s.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------------- LV.5 · continue? ---------------- */
export function ContinueZone({ active, reduce, onRestart }: ZoneProps & { reduce: boolean; onRestart: () => void }) {
  const { t } = useLang();
  const [count, setCount] = useState(9);

  useEffect(() => {
    if (!active) {
      setCount(9);
      return;
    }
    if (reduce) return;
    const id = setInterval(() => setCount((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [active, reduce]);

  useEffect(() => {
    if (!active || count === 9) return;
    if (count === 0) sfx.gameOver();
    else sfx.tick();
  }, [active, count]);

  const over = count === 0;

  return (
    <div className="z-continue" data-active={active || undefined}>
      <h2 className="display z-continue-title">{over ? continueCopy.gameOver : continueCopy.title}</h2>
      <div className="z-count hud" aria-hidden>
        {over ? "0" : count}
      </div>
      <p className="z-lead">{over ? t(continueCopy.joke) : t(continueCopy.sub)}</p>
      <ul className="z-contacts">
        {contacts.map((c) => (
          <li key={c.label}>
            <a className="btn hud" data-primary={c.primary || undefined} href={c.href} onClick={() => sfx.select()}>
              {c.label}
            </a>
          </li>
        ))}
      </ul>
      {over && (
        <button type="button" className="btn-ghost hud" onClick={onRestart}>
          ↺ {t(continueCopy.restart)}
        </button>
      )}
    </div>
  );
}
