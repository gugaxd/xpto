import { forwardRef, useMemo, type ReactNode } from "react";

type Props = { width: number; height: number; seed: number; layer: "far" | "near" };

/** Silhueta de cidade gerada com semente fixa (o desenho é sempre o mesmo). */
export const Skyline = forwardRef<SVGSVGElement, Props>(function Skyline({ width, height, seed, layer }, ref) {
  const content = useMemo(() => {
    let s = seed;
    const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    const vbW = Math.max(100, (width / Math.max(1, height)) * 100);
    const far = layer === "far";
    const parts: ReactNode[] = [];
    let x = 0;
    let i = 0;
    while (x < vbW) {
      const w = far ? 4 + rnd() * 9 : 7 + rnd() * 14;
      const h = far ? 18 + rnd() * 34 : 10 + rnd() * 26;
      const top = 100 - h;
      parts.push(<rect key={`b${i}`} x={x} y={top} width={w} height={h} className={far ? "sky-b-far" : "sky-b-near"} />);
      const windows = far ? 5 : 3;
      for (let k = 0; k < windows; k++) {
        if (rnd() > (far ? 0.5 : 0.7)) {
          parts.push(
            <rect key={`w${i}-${k}`} x={x + 1 + rnd() * (w - 2.4)} y={top + 2 + rnd() * (h - 6)} width={0.7} height={0.7} className={far ? "sky-w-far" : "sky-w-near"} />,
          );
        }
      }
      // antena em alguns prédios
      if (!far && rnd() > 0.75) {
        parts.push(<rect key={`a${i}`} x={x + w / 2} y={top - 4} width={0.4} height={4} className="sky-b-near" />);
        // luz de sinalização piscando no topo da antena
        parts.push(
          <rect key={`l${i}`} x={x + w / 2 - 0.3} y={top - 5} width={1} height={1} className="sky-beacon" style={{ animationDelay: `${-rnd() * 3}s` }} />,
        );
      }
      x += w + (far ? 0.6 : 2) + rnd() * (far ? 2 : 10);
      i++;
    }
    return { vbW, parts };
  }, [width, height, seed, layer]);

  return (
    <svg ref={ref} className={`sky sky-${layer}`} width={width} height={height} viewBox={`0 0 ${content.vbW} 100`} preserveAspectRatio="none" aria-hidden>
      {content.parts}
    </svg>
  );
});
