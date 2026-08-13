import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FieldStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFieldName(field: string): string {
  return field
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getStatusColor(status: FieldStatus) {
  switch (status) {
    case "validated":
      return {
        bg: "bg-emerald-500/15",
        text: "text-emerald-400",
        border: "border-emerald-500/40",
        dot: "bg-emerald-400",
        label: "Validated",
      };
    case "conflict_resolved":
      return {
        bg: "bg-cyan-500/15",
        text: "text-cyan-400",
        border: "border-cyan-500/40",
        dot: "bg-cyan-400",
        label: "Conflict Resolved",
      };
    case "needs_review":
      return {
        bg: "bg-amber-500/15",
        text: "text-amber-400",
        border: "border-amber-500/40",
        dot: "bg-amber-400",
        label: "Needs Review",
      };
    case "missing":
    default:
      return {
        bg: "bg-slate-500/15",
        text: "text-slate-400",
        border: "border-slate-500/30",
        dot: "bg-slate-500",
        label: "Missing",
      };
  }
}
