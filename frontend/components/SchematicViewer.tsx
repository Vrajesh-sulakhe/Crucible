"use client";

import React, { useState } from "react";
import { Crosshair, Play, Pause, Download, ShieldCheck } from "lucide-react";
import { useToast } from "./Toast";

interface SchematicViewerProps {
  sku: string;
  bore?: number | null;
  outer?: number | null;
  width?: number | null;
  speed?: number | null;
  highlightedDimension?: "bore" | "outer" | "width" | null;
}

export const SchematicViewer: React.FC<SchematicViewerProps> = ({
  sku,
  bore,
  outer,
  width,
  speed,
  highlightedDimension,
}) => {
  const toast = useToast();
  const [isRotating, setIsRotating] = useState(true);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  // Geometric fallbacks if missing
  const d = bore || 25;
  const D = outer || 52;
  const B = width || 15;

  // Scale dimensions proportionally into SVG canvas coordinates (0-200 viewBox)
  const maxDim = Math.max(D, 50);
  const scale = 80 / maxDim;

  const innerR = Math.max((d / 2) * scale, 12);
  const outerR = Math.min((D / 2) * scale, 88);
  const pitchR = (innerR + outerR) / 2;
  const ballR = Math.max((outerR - innerR) / 4, 3.5);

  // Rolling element count
  const ballCount = 8;
  const balls = Array.from({ length: ballCount }).map((_, i) => {
    const angle = (i * 2 * Math.PI) / ballCount;
    return {
      cx: 100 + pitchR * Math.cos(angle),
      cy: 100 + pitchR * Math.sin(angle),
    };
  });

  const copySchematicInfo = () => {
    const info = `SKU: ${sku}\nCAD Cross-Section:\n- Bore Diameter (d): ${d} mm\n- Outer Diameter (D): ${D} mm\n- Width (B): ${B} mm\n- Pitch Diameter (dm): ${((d + D) / 2).toFixed(1)} mm\n- ndm factor: ${speed ? Math.round(speed * ((d + D) / 2)) : "N/A"}`;
    navigator.clipboard.writeText(info);
    toast.success("CAD Data Copied", `Exported vector dimensions for ${sku}`);
  };

  const sectionThickness = ((D - d) / 2).toFixed(1);
  const pitchDiameter = ((d + D) / 2).toFixed(1);
  const ndmIndex = speed ? Math.round(speed * ((d + D) / 2)) : null;

  return (
    <div className="crucible-card p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="font-bold text-slate-900 dark:text-white tracking-tight text-xs">
            CAD Vector Cross-Section · {sku}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-700 dark:text-white/70 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-white/[0.08]"
            title={isRotating ? "Pause rotational simulation" : "Start rotational simulation"}
          >
            {isRotating ? <Pause className="w-3 h-3 text-blue-600 dark:text-blue-400" /> : <Play className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
            {isRotating ? "Active" : "Paused"}
          </button>
        </div>
      </div>

      {/* Interactive Blueprint Vector */}
      <div className="relative flex items-center justify-center py-4 bg-slate-950 rounded-2xl overflow-hidden shadow-inner border border-slate-800 dark:border-white/[0.06]">
        {/* Technical Coordinate Grid Lines */}
        <svg viewBox="0 0 200 200" className="w-52 h-52 drop-shadow-[0_0_20px_rgba(56,189,248,0.2)]">
          {/* Background Crosshairs */}
          <line x1="100" y1="10" x2="100" y2="190" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="10" y1="100" x2="190" y2="100" stroke="#1e293b" strokeDasharray="3 3" />

          {/* Pitch Circle Guide */}
          <circle
            cx="100"
            cy="100"
            r={pitchR}
            fill="none"
            stroke="#334155"
            strokeWidth="0.75"
            strokeDasharray="2 2"
          />

          {/* Outer Ring Outer Diameter */}
          <circle
            cx="100"
            cy="100"
            r={outerR}
            fill="none"
            stroke={highlightedDimension === "outer" ? "#38bdf8" : "#94a3b8"}
            strokeWidth={highlightedDimension === "outer" ? "2.5" : "1.75"}
            className="transition-all duration-300"
          />

          {/* Outer Ring Inner Raceway */}
          <circle
            cx="100"
            cy="100"
            r={outerR - ballR * 1.6}
            fill="#0f172a"
            stroke="#475569"
            strokeWidth="1"
          />

          {/* Inner Ring Outer Raceway */}
          <circle
            cx="100"
            cy="100"
            r={innerR + ballR * 1.6}
            fill="#020617"
            stroke="#475569"
            strokeWidth="1"
          />

          {/* Inner Ring Bore Diameter */}
          <circle
            cx="100"
            cy="100"
            r={innerR}
            fill="#050508"
            stroke={highlightedDimension === "bore" ? "#38bdf8" : "#94a3b8"}
            strokeWidth={highlightedDimension === "bore" ? "2.5" : "1.75"}
            className="transition-all duration-300"
          />

          {/* Rolling Balls Assembly with rotation */}
          <g
            className={isRotating ? "animate-spin" : ""}
            style={{
              transformOrigin: "100px 100px",
              animationDuration: speed ? `${Math.max(12000 / speed, 3)}s` : "8s",
              animationTimingFunction: "linear",
            }}
          >
            {balls.map((b, idx) => (
              <g key={idx}>
                <circle
                  cx={b.cx}
                  cy={b.cy}
                  r={ballR}
                  fill="url(#ballGrad)"
                  stroke="#38bdf8"
                  strokeWidth="0.75"
                  className="hover:scale-110 transition-transform"
                />
                <circle
                  cx={b.cx - ballR * 0.3}
                  cy={b.cy - ballR * 0.3}
                  r={ballR * 0.25}
                  fill="#ffffff"
                  opacity="0.8"
                />
              </g>
            ))}
          </g>

          {/* Linear Gradient for Spheres */}
          <defs>
            <radialGradient id="ballGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </radialGradient>
          </defs>
        </svg>

        {/* Dynamic Hover Tooltip */}
        {hoveredPart && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 text-center text-[11px] text-sky-300 bg-slate-900/90 py-1.5 px-3 rounded-full border border-white/10 truncate backdrop-blur-md font-mono">
            {hoveredPart}
          </div>
        )}
      </div>

      {/* Engineering Dimensional Telemetry */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div
          onMouseEnter={() => setHoveredPart(`Bore Diameter (d): ${d} mm (Shaft fit: h6)`)}
          onMouseLeave={() => setHoveredPart(null)}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            highlightedDimension === "bore"
              ? "bg-blue-50 dark:bg-blue-500/20 border-2 border-blue-600 dark:border-blue-400 shadow-sm"
              : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] hover:border-blue-300 dark:hover:border-white/[0.15]"
          }`}
        >
          <span className="text-[10px] text-slate-500 dark:text-white/40 block font-semibold">Bore Ø (d)</span>
          <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">{d} mm</span>
        </div>

        <div
          onMouseEnter={() => setHoveredPart(`Outer Diameter (D): ${D} mm (Housing fit: H7)`)}
          onMouseLeave={() => setHoveredPart(null)}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            highlightedDimension === "outer"
              ? "bg-blue-50 dark:bg-blue-500/20 border-2 border-blue-600 dark:border-blue-400 shadow-sm"
              : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] hover:border-blue-300 dark:hover:border-white/[0.15]"
          }`}
        >
          <span className="text-[10px] text-slate-500 dark:text-white/40 block font-semibold">Outer Ø (D)</span>
          <span className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400">{D} mm</span>
        </div>

        <div
          onMouseEnter={() => setHoveredPart(`Width / Section Depth (B): ${B} mm`)}
          onMouseLeave={() => setHoveredPart(null)}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            highlightedDimension === "width"
              ? "bg-blue-50 dark:bg-blue-500/20 border-2 border-blue-600 dark:border-blue-400 shadow-sm"
              : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] hover:border-blue-300 dark:hover:border-white/[0.15]"
          }`}
        >
          <span className="text-[10px] text-slate-500 dark:text-white/40 block font-semibold">Width (B)</span>
          <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">{B} mm</span>
        </div>
      </div>

      {/* Advanced Engineering Calculations */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-white/[0.06] text-xs text-slate-500 dark:text-white/40">
        <div className="flex items-center justify-between">
          <span>Radial Section Thickness:</span>
          <span className="text-slate-900 dark:text-white font-mono font-bold">{sectionThickness} mm</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Pitch Diameter (dm):</span>
          <span className="text-slate-900 dark:text-white font-mono font-bold">{pitchDiameter} mm</span>
        </div>
        {ndmIndex && (
          <div className="flex items-center justify-between">
            <span>Speed Factor (n·dm):</span>
            <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">{ndmIndex.toLocaleString()} mm/min</span>
          </div>
        )}
      </div>

      {/* Footer Copy Coordinates Button */}
      <button
        onClick={copySchematicInfo}
        className="w-full py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-xs text-white flex items-center justify-center gap-1.5 transition-colors font-bold shadow-md shadow-emerald-600/25"
      >
        <Download className="w-3.5 h-3.5" />
        Copy CAD Coordinate Manifest
      </button>
    </div>
  );
};
