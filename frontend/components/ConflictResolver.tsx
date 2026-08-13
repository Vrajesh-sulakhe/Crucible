import React, { useState } from "react";
import { GitMerge, Check, X, Edit3, ShieldAlert, FileText, ArrowRight, Scale, AlertTriangle } from "lucide-react";
import { ReviewQueueItem } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { ConfidenceBar } from "./ConfidenceBar";
import { formatFieldName } from "@/lib/utils";

interface ConflictResolverProps {
  item: ReviewQueueItem;
  onResolve: (action: "ACCEPT" | "REJECT" | "EDIT", value?: any, notes?: string) => Promise<void>;
}

export const ConflictResolver: React.FC<ConflictResolverProps> = ({
  item,
  onResolve,
}) => {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="hud-panel corner-bracket rounded-lg p-4 font-mono text-xs space-y-3">
      {/* Collision Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-cyan-300 tracking-tight text-sm">[{item.sku}]</span>
            <span className="text-slate-500">//</span>
            <span className="font-bold text-white uppercase text-xs">{formatFieldName(item.field)}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{item.product_name}</p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={item.status} />
          <div className="w-24">
            <ConfidenceBar confidence={item.confidence} />
          </div>
        </div>
      </div>

      {/* Collision Warning Banner */}
      <div className="p-2.5 rounded bg-amber-950/40 border border-amber-500/40 flex items-start gap-2 text-amber-300 text-[11px]">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold block uppercase tracking-wide">COLLISION REASON //</span>
          <p className="text-slate-300">{item.decision_reason}</p>
        </div>
      </div>

      {/* Side-by-Side Contending Candidates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {item.candidates.map((cand, idx) => {
          const isCurrentWinner = cand.normalized_value === item.current_value;
          const authority = cand.evidence.source_type === "manufacturer_datasheet" ? "1.00" : "0.60";

          return (
            <div
              key={idx}
              className={`p-3 rounded border transition-all ${
                isCurrentWinner
                  ? "bg-surface-2 border-cyan-500/80 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                  : "bg-surface-1 border-border"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between text-[10px] mb-2 pb-1.5 border-b border-border/50">
                <span className="font-bold text-white flex items-center gap-1.5 truncate">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  {cand.evidence.source_name}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-surface-card border border-border text-cyan-300">
                  AUTH: {authority}
                </span>
              </div>

              {/* Specification Value */}
              <div className="text-lg font-bold text-white my-1">
                {cand.normalized_value !== null ? String(cand.normalized_value) : "—"}{" "}
                <span className="text-xs font-normal text-cyan-400">{cand.unit || ""}</span>
              </div>

              {/* Quotation */}
              <div className="p-2 rounded bg-surface/90 border border-border/60 text-[10px] text-slate-400 mb-3">
                <span className="text-[9px] text-slate-500 block uppercase">ORIGINAL QUOTE:</span>
                "{cand.evidence.snippet}"
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
                className="w-full py-1.5 rounded bg-surface-card hover:bg-cyan-500 hover:text-black border border-border hover:border-cyan-400 text-xs font-bold text-slate-200 transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider"
              >
                <Check className="w-3.5 h-3.5" />
                Select Candidate
              </button>
            </div>
          );
        })}
      </div>

      {/* Manual Custom Override Input */}
      {isEditing ? (
        <div className="p-3.5 rounded bg-surface-2 border border-cyan-500/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-cyan-300">
              MANUAL ENGINEERING OVERRIDE FORM
            </span>
            <span className="text-[10px] text-slate-500">APPLIES CATALOG-WIDE RECALCULATION</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1 uppercase">
                Correct Value
              </label>
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-surface-1 border border-border text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1 uppercase">
                Engineering Notes / Reason
              </label>
              <input
                type="text"
                value={reviewerNotes}
                placeholder="e.g. Verified with physical sample measurement"
                onChange={(e) => setReviewerNotes(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-surface-1 border border-border text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => handleAction("EDIT", customValue, reviewerNotes)}
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded text-xs font-bold uppercase"
            >
              Apply Engineering Override
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11px]">
          <button
            onClick={() => setIsEditing(true)}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors font-bold uppercase"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Apply Custom Value Override
          </button>
          <button
            onClick={() => handleAction("REJECT", null, "Marked invalid by engineer")}
            className="text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors font-bold uppercase"
          >
            <X className="w-3.5 h-3.5" />
            Reject All Candidates
          </button>
        </div>
      )}
    </div>
  );
};
