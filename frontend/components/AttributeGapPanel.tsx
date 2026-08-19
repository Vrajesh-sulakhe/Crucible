import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  FileText,
  Search,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  Database,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  X,
} from "lucide-react";
import { GapAnalysisResult, AttributeGap } from "@/lib/types";
import { fetchProductGaps } from "@/lib/api";

interface AttributeGapPanelProps {
  sku: string | null;
  onClose?: () => void;
  onUploadDatasheetClick?: () => void;
}

export const AttributeGapPanel: React.FC<AttributeGapPanelProps> = ({
  sku,
  onClose,
  onUploadDatasheetClick,
}) => {
  const [gapData, setGapData] = useState<GapAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sku) {
      setGapData(null);
      return;
    }

    setLoading(true);
    fetchProductGaps(sku)
      .then((data) => setGapData(data))
      .catch((err) => {
        console.error("Failed fetching gaps", err);
      })
      .finally(() => setLoading(false));
  }, [sku]);

  if (!sku) return null;

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30";
      case "HIGH":
        return "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30";
      case "MEDIUM":
        return "bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30";
      case "LOW":
      default:
        return "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-white/10";
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white dark:bg-[#0a0a0a] border-l border-slate-200 dark:border-white/10 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-250">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#0a0a0a]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-50 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                {sku}
              </span>
              <span className="text-slate-300 dark:text-zinc-600">·</span>
              <span className="text-[11px] text-slate-500 dark:text-zinc-500 font-medium">
                Attribute Gap Intelligence
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Catalog Enrichment Diagnosis
            </h2>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 flex items-center justify-center text-slate-600 dark:text-zinc-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3 text-slate-400">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium">Analyzing product attribute completeness...</span>
          </div>
        ) : gapData ? (
          <>
            {/* Commerce Readiness Score Box */}
            <div className="p-5 rounded-3xl bg-amber-50/50 dark:bg-amber-500/10 border border-amber-200/80 dark:border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wide">
                  Commerce Readiness Score
                </span>
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20 px-2 py-0.5 rounded-full">
                  {gapData.commerce_readiness_score}% Complete
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${gapData.commerce_readiness_score}%` }}
                />
              </div>

              <p className="text-xs text-slate-700 dark:text-zinc-300 font-medium leading-relaxed">
                {gapData.recommended_action}
              </p>
            </div>

            {/* Gap List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                  Missing Attributes & Prescriptive Sources ({gapData.gaps.length})
                </h3>
              </div>

              {gapData.gaps.length === 0 ? (
                <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                    100% Specification Complete
                  </h4>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    All 14 standard dimensions, physical load ratings, and materials are populated and verified.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {gapData.gaps.map((gap, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          {gap.field_label}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(
                            gap.severity
                          )}`}
                        >
                          {gap.severity}
                        </span>
                      </div>

                      {/* Commercial Impact */}
                      <p className="text-slate-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                        <strong className="text-slate-800 dark:text-zinc-200">Impact: </strong>
                        {gap.commercial_impact}
                      </p>

                      {/* Recommended Recovery Sources */}
                      <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
                          Recommended Recovery Sources:
                        </span>
                        <ul className="space-y-1">
                          {gap.recommended_sources.map((src, sIdx) => (
                            <li
                              key={sIdx}
                              className="text-[11px] font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1.5"
                            >
                              <FileText className="w-3 h-3 shrink-0" />
                              <span>{src}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>

      {/* Footer */}
      <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-[#0a0a0a] flex items-center justify-between">
        <span className="text-[11px] text-slate-400 dark:text-zinc-500">
          Crucible Attribute Gap Intelligence
        </span>
        <button
          onClick={() => {
            onClose?.();
            onUploadDatasheetClick?.();
          }}
          className="px-4 py-2 bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/20 text-white rounded-full font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Ingest Datasheet to Fill Gaps
        </button>
      </div>
    </div>
  );
};
