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
        bg: "bg-emerald-50 dark:bg-emerald-500/15",
        text: "text-emerald-700 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-500/30",
        dot: "bg-emerald-500",
        label: "Validated",
        description: "Passed deterministic validation and physical consistency checks",
      };
    case "conflict_resolved":
      return {
        bg: "bg-sky-50 dark:bg-sky-500/15",
        text: "text-sky-700 dark:text-sky-400",
        border: "border-sky-200 dark:border-sky-500/30",
        dot: "bg-sky-500",
        label: "Resolved",
        description: "Multiple source claims detected and automatically arbitrated via Source Authority",
      };
    case "needs_review":
      return {
        bg: "bg-amber-50 dark:bg-amber-500/15",
        text: "text-amber-700 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-500/30",
        dot: "bg-amber-500",
        label: "Needs Review",
        description: "Conflicting candidates cannot be safely resolved automatically without engineering review",
      };
    case "missing":
    default:
      return {
        bg: "bg-slate-100 dark:bg-white/10",
        text: "text-slate-600 dark:text-slate-400",
        border: "border-slate-200 dark:border-white/15",
        dot: "bg-slate-400",
        label: "Missing",
        description: "Required commerce attribute unavailable across indexed sources",
      };
  }
}
