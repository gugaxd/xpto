import { memo } from "react";

/**
 * Gugabyte — mascote em pixel art 16×16, desenhado a partir de matrizes.
 * Letras → cores (todas via tokens, então o mascote acompanha a paleta).
 */
const FILL: Record<string, string> = {
  A: "var(--acc)", // led da antena
  D: "var(--dim)", // haste
  B: "var(--text)", // casco
  K: "var(--dim)", // sombra
  S: "var(--carbon)", // tela-rosto
  E: "var(--acc)", // olhos
  V: "var(--acc-dim)", // braços
};

export type Pose = "idle" | "blink" | "happy" | "walk";

const head = [".......A........", ".......D........", "...BBBBBBBBBB...", "..BBBBBBBBBBBB..", "..BSSSSSSSSSSB..", "..BSSSSSSSSSSB.."];
const faces: Record<Exclude<Pose, "walk">, string[]> = {
  idle: ["SSESSSSESS", "SSESSSSESS", "SSSSSSSSSS", "SSSSSSSSSS"],
  blink: ["SSSSSSSSSS", "SSESSSSESS", "SSSSSSSSSS", "SSSSSSSSSS"],
  happy: ["SSESSSSESS", "SESESSESES", "SSSSSSSSSS", "SSSSEESSSS"],
};
const body = ["..BBBBBBBBBBBB..", "...KKKKKKKKKK...", "...VBBBBBBBBV...", "...V.BBBBBB.V...", ".....BB..BB.....", ".....KK..KK....."];

/* perfil olhando pra direita: lateral do gabinete à esquerda, olhos puxados pra frente */
const sideHead = [
  ...head.slice(0, 4),
  ...["KBSSSSSSSS", "KBSSSSSSSS", "KBSSSSESSE", "KBSSSSESSE", "KBSSSSSSSS", "KBSSSSSSSS"].map((r) => "..B" + r + "B.."),
  "..BBBBBBBBBBBB..",
  "...KKKKKKKKKK...",
];
const walkCycle = [
  ["....BBBBBBBB....", "....BBBBBBBBV...", ".....BB...BB....", ".....KKK..KKK..."], // passo, braço na frente
  ["....BBBBBBBB....", "....BBBBBBBB....", "......BBB.......", "......KKKK......"], // pernas juntas
  ["....BBBBBBBB....", "...VBBBBBBBB....", ".....BB...BB....", ".....KKK..KKK..."], // passo, braço atrás
  ["....BBBBBBBB....", "....BBBBBBBB....", "......BBB.......", "......KKKK......"],
];

function rowsFor(pose: Pose, step: number) {
  if (pose === "walk") return [...sideHead, ...walkCycle[step % 4]];
  return [...head, ...faces[pose].map((r) => "..B" + r + "B.."), ...body];
}

type Props = { pose?: Pose; step?: number; className?: string; title?: string };

export const Gugabyte = memo(function Gugabyte({ pose = "idle", step = 0, className, title }: Props) {
  const rows = rowsFor(pose, step);
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {rows.flatMap((r, y) =>
        [...r].map((c, x) => (c === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} style={{ fill: FILL[c] }} />)),
      )}
    </svg>
  );
});
