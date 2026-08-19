"use client";

import React from "react";

interface CrucibleLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const CrucibleLogo: React.FC<CrucibleLogoProps> = ({
  size = 32,
  className = "",
  showText = true,
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Crucible Foundry Emblem */}
      <div
        className="relative flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="crucibleVessel" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="moltenCore" x1="50" y1="20" x2="50" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Hexagonal Vessel */}
          <path
            d="M50 6 L88 28 L88 72 L50 94 L12 72 L12 28 Z"
            fill="url(#crucibleVessel)"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Inner Chamber */}
          <path
            d="M50 18 L76 34 L76 66 L50 82 L24 66 L24 34 Z"
            fill="rgba(5, 5, 5, 0.8)"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1.5"
          />

          {/* Flame Silhouette */}
          <path
            d="M50 26 C53 38 66 45 66 58 C66 70 58 76 50 76 C42 76 34 70 34 58 C34 46 44 38 50 26 Z"
            fill="url(#moltenCore)"
          />

          {/* White-Hot Core */}
          <path
            d="M50 42 C52 48 58 52 58 60 C58 66 54 70 50 70 C46 70 42 66 42 60 C42 54 48 48 50 42 Z"
            fill="#ffffff"
            opacity="0.7"
          />

          {/* Vertex Dots */}
          <circle cx="50" cy="18" r="2" fill="rgba(255,255,255,0.25)" />
          <circle cx="76" cy="34" r="1.5" fill="rgba(255,255,255,0.15)" />
          <circle cx="76" cy="66" r="1.5" fill="rgba(255,255,255,0.15)" />
          <circle cx="50" cy="82" r="2" fill="rgba(255,255,255,0.25)" />
          <circle cx="24" cy="66" r="1.5" fill="rgba(255,255,255,0.15)" />
          <circle cx="24" cy="34" r="1.5" fill="rgba(255,255,255,0.15)" />
        </svg>
      </div>

      {/* Logotype */}
      {showText && (
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 dark:text-white text-[15px] tracking-tight group-hover:text-blue-600 dark:group-hover:text-emerald-400 transition-colors">
            CRUCIBLE
          </span>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-white/40 tracking-wider">
            ENTERPRISE
          </span>
        </div>
      )}
    </div>
  );
};
