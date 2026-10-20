import { memo, type CSSProperties } from "react";

/**
 * Vida no fundo da cidade: meteoros, naves e um monstro que espia atrás dos prédios.
 * Tudo é animação CSS (só transform/opacity) e fica atrás do conteúdo da fase.
 */

type Palette = Record<string, string>;

/** Desenha uma matriz de pixels (uma letra por cor, "." = vazio). */
const PixelSprite = memo(function PixelSprite({ rows, palette, className, style }: { rows: string[]; palette: Palette; className?: string; style?: CSSProperties }) {
  const w = rows[0].length;
  const h = rows.length;
  return (
    <svg className={className} style={style} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges" aria-hidden>
      {rows.flatMap((r, y) =>
        [...r].map((c, x) => (c === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} className={palette[c]} />)),
      )}
    </svg>
  );
});

/* ---------- naves (todas desenhadas olhando pra direita) ---------- */
const SHIP_PAL: Palette = { B: "px-hull", D: "px-hull-dark", A: "px-glass", E: "px-light", F: "px-flame" };

const ufo = [
  "....DDDD....",
  "...DAAAAD...",
  ".BBBBBBBBBB.",
  "BBEBBEBBEBBB",
  "..DDDDDDDD..",
];
const fighter = [
  "FBB...........",
  "FFBBBBBB......",
  ".FBBBBBBBBAA..",
  "FFBBBBBBBBBBBE",
  "FBB...........",
];
const car = [
  "....BBBB....",
  "...BAAAAB...",
  "FBBBBBBBBBBE",
  ".DD......DD.",
];

type Ship = { rows: string[]; top: string; size: number; dur: number; delay: number; rev?: boolean; beam?: boolean };
const ships: Ship[] = [
  { rows: car, top: "34%", size: 46, dur: 26, delay: -4, beam: true },
  { rows: ufo, top: "14%", size: 54, dur: 48, delay: -30, rev: true },
  { rows: fighter, top: "22%", size: 50, dur: 19, delay: -12 },
  { rows: car, top: "46%", size: 34, dur: 34, delay: -20, rev: true, beam: true },
  { rows: car, top: "40%", size: 28, dur: 41, delay: -8 },
];

/* ---------- monstro ---------- */
const KAIJU_PAL: Palette = { X: "px-kaiju", E: "px-eye", T: "px-teeth", S: "px-spike" };
const kaiju = [
  "......S.....S.......",
  ".....SS....SS.......",
  "....SSSS..SSSS......",
  "...XXXXXXXXXXXX.....",
  "..XXXXXXXXXXXXXX....",
  "..XXXEEXXXXEEXXXX...",
  "..XXXXXXXXXXXXXXX...",
  "..XXXXXXXXXXXXXXXX..",
  "..XXTXTXTXTXTXXXXX..",
  "..XXXXXXXXXXXXXXXXX.",
  ".XXXXXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXXXXXX",
];

/** Monstros ficam na camada da cidade distante (andam junto com ela). */
export function Kaijus() {
  return (
    <>
      <div className="kaiju" style={{ left: "34%", ["--dur" as string]: "26s", ["--delay" as string]: "-9s" }}>
        <PixelSprite rows={kaiju} palette={KAIJU_PAL} />
      </div>
      <div className="kaiju kaiju-small" style={{ left: "78%", ["--dur" as string]: "31s", ["--delay" as string]: "-22s" }}>
        <PixelSprite rows={kaiju} palette={KAIJU_PAL} style={{ transform: "scaleX(-1)" }} />
      </div>
    </>
  );
}

/* ---------- meteoros ---------- */
const meteors = [
  { top: "6%", left: "72%", len: 140, dur: 9, delay: -2 },
  { top: "12%", left: "40%", len: 90, dur: 13, delay: -7 },
  { top: "3%", left: "95%", len: 180, dur: 17, delay: -12 },
  { top: "18%", left: "60%", len: 70, dur: 11, delay: -4 },
];

export function Meteors() {
  return (
    <div className="meteors" aria-hidden>
      {meteors.map((m, i) => (
        <span
          key={i}
          className="meteor"
          style={{ top: m.top, left: m.left, width: m.len, ["--dur" as string]: `${m.dur}s`, ["--delay" as string]: `${m.delay}s` }}
        />
      ))}
    </div>
  );
}

export function Ships() {
  return (
    <div className="ships" aria-hidden>
      {ships.map((s, i) => (
        <div
          key={i}
          className="ship"
          data-rev={s.rev || undefined}
          style={{ top: s.top, ["--dur" as string]: `${s.dur}s`, ["--delay" as string]: `${s.delay}s` }}
        >
          <div className="ship-bob" style={{ width: s.size }}>
            {s.beam && <span className="ship-beam" />}
            <PixelSprite rows={s.rows} palette={SHIP_PAL} />
          </div>
        </div>
      ))}
    </div>
  );
}
