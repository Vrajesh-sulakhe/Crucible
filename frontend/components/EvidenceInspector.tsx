import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  FileText,
  CheckCircle2,
  Shield,
  Scale,
  Hash,
  ArrowRight,
  Copy,
  Check,
  Edit3,
  ExternalLink,
  Info,
} from "lucide-react";
import { FieldDecision } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { ConfidenceBar } from "./ConfidenceBar";
import { formatFieldName } from "@/lib/utils";
import { useToast } from "./Toast";

interface EvidenceInspectorProps {
  sku: string;
  fieldDecision: FieldDecision | null;
  onClose: () => void;
  onOpenReview?: (field: string) => void;
}

export const EvidenceInspector: React.FC<EvidenceInspectorProps> = ({
  sku,
  fieldDecision,
  onClose,
  onOpenReview,
}) => {
  const toast = useToast();
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!fieldDecision) return null;

  const topCandidate = fieldDecision.candidates[0];
  const cExt = topCandidate?.evidence.extraction_confidence || 0.95;
  const aAuth =
    topCandidate?.evidence.source_type === "manufacturer_datasheet"
      ? 1.0
      : topCandidate?.evidence.source_type === "technical_catalog"
      ? 0.8
      : topCandidate?.evidence.source_type === "erp_export"
      ? 0.6
      : 0.2;
  const vScore = fieldDecision.validation_notes.length === 0 ? 1.0 : 0.7;

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(text);
    toast.success(`Copied ${label}`, text.slice(0, 40) + "...");
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 animate-in fade-in duration-200"
      />

      {/* Slide-in Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white dark:bg-[#0a0a0a] border-l border-slate-200 dark:border-white/10 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#0a0a0a]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-600">
                  {sku}
                </span>
                <span className="text-slate-300 dark:text-zinc-600">·</span>
                <span className="text-[11px] text-slate-500 dark:text-zinc-500 font-medium">
                  Forensic Grounding Proof
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                {formatFieldName(fieldDecision.field)}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 flex items-center justify-center text-slate-600 dark:text-zinc-400 transition-colors"
            title="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Audit Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
          {/* Canonical Resolved Output */}
          <div className="p-5 rounded-3xl bg-blue-50/50 dark:bg-blue-500/10 border border-blue-200/80 dark:border-blue-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wide">
                Canonical Resolved Specification
              </span>
              <StatusBadge status={fieldDecision.status} />
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white flex items-baseline gap-2">
                <span>{fieldDecision.final_value !== null ? String(fieldDecision.final_value) : "—"}</span>
                {topCandidate?.unit && (
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 font-mono">
                    {topCandidate.unit}
                  </span>
                )}
              </div>

              <button
                onClick={() =>
                  copyText(
                    `${fieldDecision.final_value} ${topCandidate?.unit || ""}`.trim(),
                    "Specification Value"
                  )
                }
                className="px-3 py-1.5 rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/15 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white shadow-sm flex items-center gap-1.5 transition-colors"
              >
                {copiedSnippet === `${fieldDecision.final_value} ${topCandidate?.unit || ""}`.trim() ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                Copy
              </button>
            </div>

            <div className="pt-3 border-t border-blue-200/60 dark:border-blue-500/20">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-600 dark:text-zinc-400 font-medium">Composite Confidence Score</span>
                <span className="text-blue-700 dark:text-blue-400 font-mono font-bold">
                  {(fieldDecision.confidence * 100).toFixed(1)}% Verified
                </span>
              </div>
              <ConfidenceBar confidence={fieldDecision.confidence} />
            </div>
          </div>

          {/* Formula Breakdown Visualizer */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <Scale className="w-4 h-4" />
                Weighted Confidence Formula Proof
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/30 font-mono font-semibold">
                100% Explainable
              </span>
            </div>

            {/* Segmented Weight Bar */}
            <div className="space-y-2">
              <div className="flex h-2.5 rounded-full overflow-hidden bg-slate-200 dark:bg-white/10 border border-slate-300/60 dark:border-white/10">
                <div
                  className="bg-blue-600 hover:bg-blue-500 transition-all"
                  style={{ width: `${cExt * 50}%` }}
                  title={`Extraction Weight (50%): ${(cExt * 50).toFixed(1)}%`}
                />
                <div
                  className="bg-indigo-600 hover:bg-indigo-500 transition-all"
                  style={{ width: `${aAuth * 30}%` }}
                  title={`Authority Weight (30%): ${(aAuth * 30).toFixed(1)}%`}
                />
                <div
                  className="bg-emerald-500 hover:bg-emerald-400 transition-all"
                  style={{ width: `${vScore * 20}%` }}
                  title={`Physical Validation Weight (20%): ${(vScore * 20).toFixed(1)}%`}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-zinc-500 font-medium">
                <span className="text-blue-700 dark:text-blue-400">■ AI Extraction (50%)</span>
                <span className="text-indigo-700 dark:text-indigo-400">■ Authority Rating (30%)</span>
                <span className="text-emerald-700 dark:text-emerald-400">■ Physics Check (20%)</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 font-mono text-xs space-y-1.5 text-slate-700 dark:text-zinc-300">
              <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wide">
                Evaluation Equation:
              </div>
              <div className="text-blue-700 dark:text-blue-400 font-semibold">
                = (0.5 × {cExt.toFixed(2)}) + (0.3 × {aAuth.toFixed(2)}) + (0.2 × {vScore.toFixed(2)})
              </div>
              <div className="text-slate-900 dark:text-white font-bold pt-1.5 border-t border-slate-100 dark:border-white/10 flex justify-between">
                <span>Confidence Score:</span>
                <span className="text-emerald-600 font-mono font-bold">
                  {fieldDecision.confidence.toFixed(3)}
                </span>
              </div>
            </div>
          </div>

          {/* Decision Rationale */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-2">
            <span className="text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wide flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Decision Justification & Audit Rationale
            </span>
            <p className="text-slate-700 dark:text-zinc-300 bg-white dark:bg-white/5 p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 leading-relaxed text-xs">
              {fieldDecision.decision_reason}
            </p>
          </div>

          {/* Validation Checks */}
          {fieldDecision.validation_notes.length > 0 && (
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wide">
                Physical Laws & Normalization Checks
              </span>
              <div className="space-y-2">
                {fieldDecision.validation_notes.map((note, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-start gap-2.5 text-slate-700 dark:text-zinc-300 text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grounded Source Citations */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wide">
                Grounded Citations ({fieldDecision.candidates.length})
              </span>
            </div>

            <div className="space-y-3">
              {fieldDecision.candidates.map((cand, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                      <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      {cand.evidence.source_name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {cand.evidence.page && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 font-mono font-bold">
                          Page {cand.evidence.page}
                        </span>
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-zinc-400">
                        {cand.evidence.source_type.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] py-2 border-y border-slate-100 dark:border-white/10 font-mono">
                    <div>
                      <span className="text-slate-400 dark:text-zinc-500 block text-[10px]">RAW PARSED STRING</span>
                      <span className="text-slate-900 dark:text-white font-semibold">{String(cand.raw_value)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-zinc-500 block text-[10px]">PINT NORMALIZED</span>
                      <span className="text-emerald-600 font-semibold">
                        {cand.normalized_value !== null ? String(cand.normalized_value) : "—"}{" "}
                        {cand.unit || ""}
                      </span>
                    </div>
                  </div>

                  {/* Verbatim Snippet with 1-Click Copy */}
                  <div className="bg-slate-50 dark:bg-white/[0.03] p-3 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-zinc-300 relative">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-blue-700 font-bold text-[10px] uppercase tracking-wide">
                        Verbatim Grounded Citation:
                      </span>
                      <button
                        onClick={() => copyText(cand.evidence.snippet, "Verbatim Quote")}
                        className="text-slate-400 hover:text-slate-700 transition-colors p-0.5"
                        title="Copy Quote"
                      >
                        {copiedSnippet === cand.evidence.snippet ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <span className="italic leading-relaxed block text-slate-700 dark:text-zinc-300">
                      "{cand.evidence.snippet}"
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Quick Action */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-[#0a0a0a] flex items-center justify-between">
          <Link
            href={`/product/${encodeURIComponent(sku)}`}
            className="text-xs text-blue-600 hover:underline flex items-center gap-1.5 font-bold"
          >
            Open Full Spec Sheet <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {onOpenReview && (
            <button
              onClick={() => onOpenReview(fieldDecision.field)}
              className="px-4 py-2 bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/20 text-white rounded-full font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Arbitrate in Review Queue
            </button>
          )}
        </div>
      </div>
    </>
  );
};
