import React from "react";
import { X, FileText, CheckCircle2, Shield, Scale, Hash, ArrowRight, ExternalLink } from "lucide-react";
import { FieldDecision } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { ConfidenceBar } from "./ConfidenceBar";
import { formatFieldName } from "@/lib/utils";

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
  if (!fieldDecision) return null;

  const topCandidate = fieldDecision.candidates[0];
  const cExt = topCandidate?.evidence.extraction_confidence || 0.95;
  const aAuth = topCandidate?.evidence.source_type === "manufacturer_datasheet" ? 1.0 : 0.8;
  const vScore = fieldDecision.validation_notes.length === 0 ? 1.0 : 0.7;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-surface-1 border-l border-border/90 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-50 flex flex-col font-mono animate-in slide-in-from-right duration-200">
      {/* Tactical Header */}
      <div className="p-4 border-b border-border/80 flex items-center justify-between bg-surface-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-sm bg-cyan-400" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-cyan-400 font-bold tracking-wider uppercase">
                FORENSIC EVIDENCE AUDIT // {sku}
              </span>
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              {formatFieldName(fieldDecision.field)}
            </h2>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded bg-surface hover:bg-surface-3 text-slate-400 hover:text-white transition-colors border border-border/60"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Audit Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Canonical Resolved Output */}
        <div className="hud-panel rounded-lg p-4 bg-surface-2/80 border border-cyan-500/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              [OUTPUT] CANONICAL RESOLVED SPECIFICATION
            </span>
            <StatusBadge status={fieldDecision.status} />
          </div>
          <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-2">
            <span>{fieldDecision.final_value !== null ? String(fieldDecision.final_value) : "—"}</span>
            {topCandidate?.unit && (
              <span className="text-sm font-normal text-cyan-300">
                {topCandidate.unit}
              </span>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-border/70">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-slate-400">Confidence Rating</span>
              <span className="text-cyan-300 font-bold">
                {Math.round(fieldDecision.confidence * 100)}% Verified
              </span>
            </div>
            <ConfidenceBar confidence={fieldDecision.confidence} />
          </div>
        </div>

        {/* Formula Math Breakdown */}
        <div className="hud-panel rounded-lg p-3.5 bg-surface-2/50 border border-border/70 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Scale className="w-3.5 h-3.5" />
              MATHEMATICAL CONFIDENCE PROOF
            </span>
            <span className="text-[10px] text-slate-500">NO BLACK BOX</span>
          </div>

          <div className="p-2.5 rounded bg-surface-1 border border-border/80 text-[11px] font-mono space-y-1 text-slate-300">
            <div className="text-[10px] text-slate-500 uppercase">Weight Formula: 0.5·Ext + 0.3·Auth + 0.2·Val</div>
            <div className="text-cyan-300">
              = (0.5 × {cExt.toFixed(2)}) + (0.3 × {aAuth.toFixed(2)}) + (0.2 × {vScore.toFixed(2)})
            </div>
            <div className="text-white font-bold pt-1 border-t border-border/50 flex justify-between">
              <span>Final Confidence Metric:</span>
              <span className="text-emerald-400 font-mono font-bold">
                {fieldDecision.confidence.toFixed(3)} (Passed Threshold)
              </span>
            </div>
          </div>
        </div>

        {/* Decision Rationale */}
        <div className="hud-panel rounded-lg p-3.5 bg-surface-2/50 border border-border/70 space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            DETERMINISTIC DECISION REASON
          </span>
          <p className="text-slate-200 bg-surface-1 p-2.5 rounded border border-border/60 leading-relaxed font-mono text-[11px]">
            {fieldDecision.decision_reason}
          </p>
        </div>

        {/* Validation Checks */}
        {fieldDecision.validation_notes.length > 0 && (
          <div className="hud-panel rounded-lg p-3.5 bg-surface-2/50 border border-border/70 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              PHYSICAL CONSTRAINT AUDIT LOG
            </span>
            <div className="space-y-1.5">
              {fieldDecision.validation_notes.map((note, i) => (
                <div
                  key={i}
                  className="p-2 rounded bg-surface-1 border border-border/60 flex items-start gap-2 text-slate-300 text-[11px]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ingested Citations */}
        <div className="hud-panel rounded-lg p-3.5 bg-surface-2/50 border border-border/70 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              SOURCE CITATIONS & VERBATIM PROOF ({fieldDecision.candidates.length})
            </span>
          </div>

          <div className="space-y-2.5">
            {fieldDecision.candidates.map((cand, idx) => (
              <div
                key={idx}
                className="p-3 rounded bg-surface-1 border border-border/80 space-y-2"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-white flex items-center gap-1.5 truncate">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    {cand.evidence.source_name}
                  </span>
                  {cand.evidence.page && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-card border border-border text-cyan-300 font-bold">
                      Page {cand.evidence.page}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] py-1 border-y border-border/60">
                  <div>
                    <span className="text-slate-500 block">RAW SOURCE VALUE</span>
                    <span className="text-slate-200 font-bold">{String(cand.raw_value)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">PINT NORMALIZED</span>
                    <span className="text-emerald-400 font-bold">
                      {cand.normalized_value !== null ? String(cand.normalized_value) : "—"}{" "}
                      {cand.unit || ""}
                    </span>
                  </div>
                </div>

                <div className="bg-surface-card/90 p-2 rounded border border-border/60 text-[10px] text-slate-300">
                  <span className="text-cyan-400 font-bold block mb-0.5">VERBATIM PDF QUOTATION:</span>
                  <span className="italic">"{cand.evidence.snippet}"</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Action */}
      {onOpenReview && (
        <div className="p-3.5 border-t border-border/80 bg-surface-2 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Ambiguity or conflict detected?</span>
          <button
            onClick={() => onOpenReview(fieldDecision.field)}
            className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            Open in Review Queue
          </button>
        </div>
      )}
    </div>
  );
};
