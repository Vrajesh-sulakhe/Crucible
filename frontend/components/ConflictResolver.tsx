import React, { useState } from "react";
import { GitMerge, Check, X, Edit3, ShieldAlert, FileText, ArrowRight, Scale, AlertTriangle, Percent } from "lucide-react";
import { ReviewQueueItem } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { ConfidenceBar } from "./ConfidenceBar";
import { formatFieldName } from "@/lib/utils";
import { useToast } from "./Toast";

interface ConflictResolverProps {
  item: ReviewQueueItem;
  onResolve: (action: "ACCEPT" | "REJECT" | "EDIT", value?: any, notes?: string) => Promise<void>;
}

export const ConflictResolver: React.FC<ConflictResolverProps> = ({
  item,
  onResolve,
}) => {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [customValue, setCustomValue] = useState(String(item.current_value || ""));
  const [reviewerNotes, setReviewerNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = async (
    action: "ACCEPT" | "REJECT" | "EDIT",
    val?: any,
    notes?: string
  ) => {
    setIsSubmitting(true);
    try {
      await onResolve(action, val, notes);
      if (action === "ACCEPT") {
        toast.success("Conflict Arbitrated", `Selected ${val} for ${item.sku} (${formatFieldName(item.field)})`);
      } else if (action === "EDIT") {
        toast.success("Manual Override Applied", `Set ${formatFieldName(item.field)} = ${val}`);
      } else {
        toast.warning("Candidates Rejected", `Marked ${formatFieldName(item.field)} as missing`);
      }
    } catch (err: any) {
      toast.error("Arbitration Failed", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate percentage variance if both candidates are numeric
  const val1 = item.candidates[0]?.normalized_value;
  const val2 = item.candidates[1]?.normalized_value;
  let variancePct: string | null = null;
  if (typeof val1 === "number" && typeof val2 === "number" && (val1 + val2) > 0) {
    const delta = Math.abs(val1 - val2);
    const mean = (val1 + val2) / 2;
    variancePct = ((delta / mean) * 100).toFixed(1);
  }

  return (
    <div className="outcrowd-card p-6 sm:p-7 text-xs space-y-4">
      {/* Collision Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold font-mono text-blue-600 dark:text-blue-400 tracking-tight text-sm">
              [{item.sku}]
            </span>
            <span className="text-slate-300 dark:text-zinc-700">·</span>
            <span className="font-bold text-slate-900 dark:text-white text-xs">
              {formatFieldName(item.field)}
            </span>
            {variancePct && (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold flex items-center gap-1">
                <Percent className="w-3 h-3" />
                Δ {variancePct}% Variance
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{item.product_name}</p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={item.status} />
          <div className="w-24">
            <ConfidenceBar confidence={item.confidence} />
          </div>
        </div>
      </div>

      {/* Collision Warning Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 flex items-start gap-2.5 text-xs">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold block text-[11px] uppercase tracking-wide text-amber-900 dark:text-amber-300">
            Collision Reason & Conflict Context
          </span>
          <p className="text-amber-800 dark:text-amber-200/90 leading-relaxed font-medium">{item.decision_reason}</p>
        </div>
      </div>

      {/* Side-by-Side Contending Candidates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {item.candidates.map((cand, idx) => {
          const isCurrentWinner = cand.normalized_value === item.current_value;
          const authority =
            cand.evidence.source_type === "manufacturer_datasheet"
              ? "1.00 (High)"
              : cand.evidence.source_type === "technical_catalog"
              ? "0.80 (Med)"
              : "0.60 (Low)";

          return (
            <div
              key={idx}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                isCurrentWinner
                  ? "bg-blue-50/60 dark:bg-blue-950/30 border-2 border-blue-600 dark:border-blue-500 shadow-sm"
                  : "bg-slate-50 dark:bg-[#121215] border-slate-200 dark:border-white/10"
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between text-xs mb-3 pb-2.5 border-b border-slate-200/70 dark:border-white/10">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                    <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    {cand.evidence.source_name}
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-blue-700 dark:text-blue-300 font-mono font-bold">
                    Auth: {authority}
                  </span>
                </div>

                {/* Specification Value */}
                <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white my-2 flex items-baseline gap-1.5">
                  <span>{cand.normalized_value !== null ? String(cand.normalized_value) : "—"}</span>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{cand.unit || ""}</span>
                  {cand.raw_value && cand.raw_value !== cand.normalized_value && (
                    <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-normal">
                      (raw: {String(cand.raw_value)})
                    </span>
                  )}
                </div>

                {/* Quotation */}
                <div className="p-3 rounded-2xl bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-zinc-300 mb-3">
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 block font-bold mb-1 uppercase tracking-wide">
                    Original Quotation:
                  </span>
                  <span className="italic leading-relaxed">"{cand.evidence.snippet}"</span>
                </div>

                {/* Compact Reasoning Badges */}
                <div className="flex flex-wrap gap-1 mb-4 text-[10px]">
                  {cand.evidence.source_type === "manufacturer_datasheet" ? (
                    <>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100/80 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-medium">
                        ✓ Manufacturer Source
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100/80 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-medium">
                        ✓ Exact SKU Match
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100/80 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-medium">
                        ✓ Engineering Spec
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100/80 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-medium">
                        ✓ Citation Available
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="px-2 py-0.5 rounded-md bg-amber-100/80 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 font-medium">
                        ⚠ Legacy ERP
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-100/80 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 font-medium">
                        ⚠ Lower Authority (0.60)
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-100/80 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 font-medium">
                        ⚠ Conflicting Claim
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Selection Button */}
              <button
                onClick={() =>
                  handleAction(
                    "ACCEPT",
                    cand.normalized_value,
                    `Human engineer arbitrated in favor of ${cand.evidence.source_name}`
                  )
                }
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border dark:border-white/10 text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                Select Candidate {idx + 1}
              </button>
            </div>
          );
        })}
      </div>

      {/* Manual Custom Override Input */}
      {isEditing ? (
        <div className="p-5 rounded-3xl bg-slate-50 dark:bg-[#121215] border border-slate-200 dark:border-white/10 space-y-3.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Manual Engineering Override Form
            </span>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">Applies catalog-wide recalculation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[11px] text-slate-600 dark:text-zinc-400 block mb-1 font-semibold">
                Correct Value
              </label>
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#09090b] border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none font-medium"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 dark:text-zinc-400 block mb-1 font-semibold">
                Engineering Notes / Audit Reason
              </label>
              <input
                type="text"
                value={reviewerNotes}
                placeholder="e.g. Verified with physical sample measurement"
                onChange={(e) => setReviewerNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#09090b] border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3.5 py-1.5 text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => handleAction("EDIT", customValue, reviewerNotes)}
              disabled={isSubmitting}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-slate-950 rounded-full text-xs font-bold shadow-sm"
            >
              Apply Engineering Override
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/10 text-xs">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5 transition-colors font-bold"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Enter Custom Engineering Value
          </button>
          <button
            onClick={() => handleAction("REJECT", null, "Marked invalid by engineer")}
            className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1.5 transition-colors font-bold"
          >
            <X className="w-3.5 h-3.5" />
            Reject All Candidates
          </button>
        </div>
      )}
    </div>
  );
};
