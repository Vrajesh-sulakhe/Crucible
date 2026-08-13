import React, { useState } from "react";
import { Compass, Crosshair, Cpu, Layers } from "lucide-react";

interface SchematicViewerProps {
  sku: string;
  bore: number | null;
  outer: number | null;
  width: number | null;
  speed?: number | null;
}

export const SchematicViewer: React.FC<SchematicViewerProps> = ({
  sku,
  bore,
  outer,
  width,
  speed,
}) => {
  const d = bore || 25;
  const D = outer || 52;
  const B = width || 15;

  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  // Physical calculations
  const sectionThickness = ((D - d) / 2).toFixed(2);
  const pitchDiameter = ((d + D) / 2).toFixed(1);
  const ndmIndex = speed ? Math.round(speed * ((d + D) / 2)) : null;

  // Normalized visual radii for SVG
  const scale = 130 / Math.max(D, 60);
  const outerR = Math.min(68, Math.max(42, (D / 2) * scale));
  const innerR = Math.min(outerR - 12, Math.max(16, (d / 2) * scale));
  const ballR = (outerR - innerR) / 2.7;
  const pitchR = (outerR + innerR) / 2;

  // 8 rolling element balls
  const balls = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i * 2 * Math.PI) / 8;
    const cx = 100 + pitchR * Math.cos(angle);
    const cy = 100 + pitchR * Math.sin(angle);
    return { cx, cy, id: i };
  });

  return (
    <div className="hud-panel corner-bracket rounded-lg p-4 font-mono flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/70 text-xs">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span className="font-bold text-white uppercase tracking-wider">
            CAD Engineering Cross-Section
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-surface-card border border-border text-cyan-300">
          ISO 15 SCHEMATIC
        </span>
      </div>

      {/* Interactive Blueprint Vector */}
      <div className="relative flex items-center justify-center py-2 bg-surface-1/90 rounded border border-border/60">
        {/* Technical Coordinate Grid Lines */}
        <svg viewBox="0 0 200 200" className="w-52 h-52 drop-shadow-[0_0_12px_rgba(0,240,255,0.15)]">
          {/* Background Crosshairs */}
          <line x1="100" y1="10" x2="100" y2="190" stroke="#1e2b45" strokeDasharray="3 3" />
          <line x1="10" y1="100" x2="190" y2="100" stroke="#1e2b45" strokeDasharray="3 3" />

          {/* Pitch Circle Guide */}
          <circle
            cx="100"
            cy="100"
            r={pitchR}
            fill="none"
            stroke="#2d3f66"
            strokeWidth="0.75"
            strokeDasharray="2 2"
          />

          {/* Outer Ring Outer Diameter */}
          <circle
            cx="100"
            cy="100"
            r={outerR}
            fill="none"
            stroke="#00f0ff"
            strokeWidth="3.5"
            onMouseEnter={() => setHoveredPart(`Outer Ring (Ø ${D} mm)`)}
            onMouseLeave={() => setHoveredPart(null)}
            className="cursor-pointer hover:stroke-white transition-colors"
          />
          <circle
            cx="100"
            cy="100"
            r={outerR - 5}
            fill="#090d16"
            stroke="#1e2b45"
            strokeWidth="1.5"
          />

          {/* Inner Ring */}
          <circle
            cx="100"
            cy="100"
            r={innerR + 5}
            fill="#0d121d"
            stroke="#1e2b45"
            strokeWidth="1.5"
          />
          <circle
            cx="100"
            cy="100"
            r={innerR}
            fill="#07090e"
            stroke="#00f0ff"
            strokeWidth="3"
            onMouseEnter={() => setHoveredPart(`Inner Bore Ring (Ø ${d} mm)`)}
            onMouseLeave={() => setHoveredPart(null)}
            className="cursor-pointer hover:stroke-white transition-colors"
          />

          {/* Rolling Element Spheres */}
          {balls.map((b) => (
            <circle
              key={b.id}
              cx={b.cx}
              cy={b.cy}
              r={ballR}
              fill="#00f0ff"
              stroke="#fff"
              strokeWidth="0.75"
              onMouseEnter={() => setHoveredPart("Precision Grade Rolling Ball")}
              onMouseLeave={() => setHoveredPart(null)}
              className="cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
            />
          ))}

          {/* Center Pivot Point */}
          <circle cx="100" cy="100" r="2.5" fill="#ffb800" />
        </svg>

        {/* Dynamic Part Label Overlay */}
        <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] text-cyan-300 bg-surface-card/90 py-1 rounded border border-border/80 truncate">
          {hoveredPart || `Active Model: ${sku} (Conforms to DIN 625)`}
        </div>
      </div>

      {/* Engineering Dimensional Telemetry */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-surface/80 p-2 rounded border border-border/60">
          <span className="text-[9px] text-slate-500 block uppercase">Bore Ø (d)</span>
          <span className="text-xs font-bold text-white">{d} mm</span>
        </div>
        <div className="bg-surface/80 p-2 rounded border border-border/60">
          <span className="text-[9px] text-slate-500 block uppercase">Outer Ø (D)</span>
          <span className="text-xs font-bold text-cyan-400">{D} mm</span>
        </div>
        <div className="bg-surface/80 p-2 rounded border border-border/60">
          <span className="text-[9px] text-slate-500 block uppercase">Width (B)</span>
          <span className="text-xs font-bold text-emerald-400">{B} mm</span>
        </div>
      </div>

      {/* Advanced Engineering Calculations */}
      <div className="space-y-1.5 pt-2 border-t border-border/60 text-[11px] text-slate-400">
        <div className="flex items-center justify-between">
          <span>Radial Section Thickness:</span>
          <span className="text-slate-200 font-bold">{sectionThickness} mm</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Pitch Diameter (dm):</span>
          <span className="text-slate-200 font-bold">{pitchDiameter} mm</span>
        </div>
        {ndmIndex && (
          <div className="flex items-center justify-between">
            <span>Velocity Index (n·dm):</span>
            <span className="text-cyan-300 font-bold">{ndmIndex.toLocaleString()} mm/min</span>
          </div>
        )}
      </div>
    </div>
  );
};
