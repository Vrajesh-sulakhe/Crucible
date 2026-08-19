import React from "react";
import { cn } from "@/lib/utils";

interface ConfidenceBarProps {
  confidence: number;
  className?: string;
  showPercent?: boolean;
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  confidence,
  className,
  showPercent = true,
}) => {
  const clamped = Math.max(0, Math.min(1, confidence));
  const percent = Math.round(clamped * 100);

  let barColor = "bg-emerald-500";
  let textColor = "text-emerald-700 dark:text-emerald-400";

  if (clamped < 0.8) {
    barColor = "bg-blue-500";
    textColor = "text-blue-700 dark:text-blue-400";
  }
  if (clamped < 0.6) {
    barColor = "bg-amber-500";
    textColor = "text-amber-700 dark:text-amber-400";
  }
  if (clamped < 0.4) {
    barColor = "bg-rose-500";
    textColor = "text-rose-700 dark:text-rose-400";
  }

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      title="Crucible Confidence: Calculated from Extraction Quality (50%) + Source Authority (30%) + Deterministic Validation (20%)"
    >
      <div className="flex-1 h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden border border-slate-200/50 dark:border-white/10">
        <div
          className={cn("h-full rounded-full transition-all duration-500", barColor)}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showPercent && (
        <span className={cn("text-xs font-mono font-bold min-w-[32px] text-right", textColor)}>
          {percent}%
        </span>
      )}
    </div>
  );
};
