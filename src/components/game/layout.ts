import type { T } from "@/i18n/lang";

/**
 * Geometria da fase. Tudo em frações da largura da tela (1 = 100vw),
 * pra que o mesmo cálculo sirva pra desenhar e pra posicionar o personagem.
 */
export type ZoneId = "start" | "origin" | "method" | "projects" | "sheet" | "continue";

export const zoneOrder: ZoneId[] = ["start", "origin", "method", "projects", "sheet", "continue"];

export const zoneLabels: Record<ZoneId, T> = {
  start: { pt: "LV.0 · start", en: "LV.0 · start" },
  origin: { pt: "LV.1 · origem", en: "LV.1 · origin" },
  method: { pt: "LV.2 · método", en: "LV.2 · method" },
  projects: { pt: "LV.3 · projetos", en: "LV.3 · projects" },
  sheet: { pt: "LV.4 · ficha", en: "LV.4 · sheet" },
  continue: { pt: "LV.5 · continue?", en: "LV.5 · continue?" },
};

export type Geometry = {
  mobile: boolean;
  /** posição do personagem na tela (fração da largura) */
  heroX: number;
  widths: Record<ZoneId, number>;
  /** degraus do método: início e largura (fração da tela, relativo à zona) */
  stepStart: number;
  stepSpacing: number;
  stepWidth: number;
  /** espaçamento entre gabinetes de projeto */
  slotStart: number;
  slotSpacing: number;
};

export function geometry(vw: number, slots: number): Geometry {
  const mobile = vw < 720;
  const stepSpacing = mobile ? 0.82 : 0.3;
  const slotSpacing = mobile ? 0.78 : 0.26;
  const stepStart = mobile ? 0.3 : 0.24;
  const slotStart = mobile ? 0.3 : 0.36;
  return {
    mobile,
    heroX: mobile ? 0.16 : 0.22,
    stepStart,
    stepSpacing,
    stepWidth: stepSpacing * (mobile ? 0.62 : 0.74),
    slotStart,
    slotSpacing,
    widths: {
      start: 1,
      origin: mobile ? 1.6 : 1.3,
      method: stepStart + stepSpacing * 4 + (mobile ? 0.75 : 0.26),
      projects: slotStart + slotSpacing * slots + (mobile ? 0.2 : 0.14),
      sheet: mobile ? 1.5 : 1.25,
      continue: 1,
    },
  };
}

/** altura de cada degrau do método, em px */
export function stepHeight(vh: number) {
  return Math.round(Math.min(60, Math.max(26, vh * 0.06)));
}

/**
 * Terreno do método, em px relativos ao início da zona:
 * rampa → plataforma 1 → rampa → plataforma 2 … → plataforma 4 → escadinha até o chão.
 * A mesma função serve pra desenhar e pra saber a altura do chão sob o personagem.
 */
export type Terrain = {
  platforms: { left: number; right: number; height: number }[];
  ramps: { left: number; right: number; from: number; to: number }[];
  stairs: { left: number; width: number; height: number }[];
  heightAt: (x: number) => number;
};

export const STAIR_STEPS = 4;

export function methodTerrain(geo: Geometry, vw: number, stepH: number): Terrain {
  const platforms = Array.from({ length: 4 }, (_, i) => {
    const left = (geo.stepStart + i * geo.stepSpacing) * vw;
    return { left, right: left + geo.stepWidth * vw, height: (i + 1) * stepH };
  });
  const gap = (geo.stepSpacing - geo.stepWidth) * vw;

  const ramps = platforms.map((p, i) => ({
    left: i === 0 ? p.left - gap : platforms[i - 1].right,
    right: p.left,
    from: i === 0 ? 0 : platforms[i - 1].height,
    to: p.height,
  }));

  const last = platforms[platforms.length - 1];
  // degraus largos o bastante pro personagem pisar
  const stairW = Math.max(gap * 2, STAIR_STEPS * 56);
  const sw = stairW / STAIR_STEPS;
  // degraus descendo; o último "degrau" já é o chão
  const stairs = Array.from({ length: STAIR_STEPS - 1 }, (_, k) => ({
    left: last.right + k * sw,
    width: sw,
    height: (last.height * (STAIR_STEPS - 1 - k)) / STAIR_STEPS,
  }));

  const heightAt = (x: number) => {
    for (const r of ramps) if (x >= r.left && x < r.right) return r.from + ((x - r.left) / (r.right - r.left)) * (r.to - r.from);
    for (const p of platforms) if (x >= p.left && x <= p.right) return p.height;
    for (const s of stairs) if (x > s.left && x <= s.left + s.width) return s.height;
    return 0;
  };

  return { platforms, ramps, stairs, heightAt };
}
