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

  let barColor = "bg-emerald-500 shadow-glow-emerald";
  let textColor = "text-emerald-400";

  if (clamped < 0.7) {
    barColor = "bg-amber-500 shadow-glow-amber";
    textColor = "text-amber-400";
  }
  if (clamped < 0.4) {
    barColor = "bg-rose-500";
    textColor = "text-rose-400";
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden border border-border/50">
        <div
          className={cn("h-full rounded-full transition-all duration-500", barColor)}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showPercent && (
        <span className={cn("text-xs font-mono font-semibold min-w-[36px] text-right", textColor)}>
          {percent}%
        </span>
      )}
    </div>
  );
};
