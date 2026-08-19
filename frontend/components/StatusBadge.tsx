import React from "react";
import { FieldStatus } from "@/lib/types";
import { getStatusColor, cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: FieldStatus;
  className?: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  showDot = true,
}) => {
  const style = getStatusColor(status);

  return (
    <span
      title={style.description}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors cursor-help",
        style.bg,
        style.text,
        style.border,
        className
      )}
    >
      {showDot && (
        <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", style.dot)} />
      )}
      {style.label}
    </span>
  );
};
