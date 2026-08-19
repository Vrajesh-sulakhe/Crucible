"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle,
  Check,
  RefreshCw,
  AlertTriangle,
  Scale,
  Sparkles,
  CheckCheck,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { fetchReviewQueue, submitReviewAction } from "@/lib/api";
import { ReviewQueueItem } from "@/lib/types";
import { ConflictResolver } from "@/components/ConflictResolver";
import { useToast } from "@/components/Toast";

export default function ReviewQueuePage() {
  const toast = useToast();
  const [queue, setQueue] = useState<ReviewQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoApproving, setIsAutoApproving] = useState(false);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [showResolvedHistory, setShowResolvedHistory] = useState(false);

  const loadQueue = async () => {
    setIsLoading(true);
    try {
      const items = await fetchReviewQueue();
      setQueue(items);
    } catch (err) {
      console.error("Failed loading review queue", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleResolveItem = async (
    sku: string,
    field: string,
    action: "ACCEPT" | "REJECT" | "EDIT",
    value?: any,
    notes?: string
  ) => {
    try {
      await submitReviewAction(sku, field, { action, value, notes });
      setResolvedCount((prev) => prev + 1);
      // Refresh review queue
      await loadQueue();
    } catch (err) {
      console.error(`Failed resolving field ${field} for ${sku}`, err);
    }
  };

  // 1-Click Batch Action: Accept recommended candidates
  const handleAcceptRecommended = async () => {
    const pending = queue.filter((i) => i.status === "needs_review");
    if (pending.length === 0) return;
    setIsAutoApproving(true);
    try {
      let count = 0;
      for (const item of pending) {
        const topCand = item.candidates[0];
        if (topCand) {
          await submitReviewAction(item.sku, item.field, {
            action: "ACCEPT",
            value: topCand.normalized_value,
            notes: `Accepted recommended high-authority candidate (${topCand.evidence.source_name})`,
          });
          count++;
        }
      }
      setResolvedCount((prev) => prev + count);
      toast.success("Batch Arbitration Complete", `Accepted ${count} recommended candidate(s)`);
      await loadQueue();
    } catch (err: any) {
      toast.error("Batch Arbitration Failed", err.message);
    } finally {
      setIsAutoApproving(false);
    }
  };

  // Strict semantic separation
  const pendingItems = queue.filter((item) => item.status === "needs_review");
  const resolvedItems = queue.filter((item) => item.status === "conflict_resolved" || item.status === "validated");

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <Link
        href="/workspace"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Catalog Workspace
      </Link>

      {/* Header Banner */}
      <div className="crucible-card p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 font-bold font-mono">
              Human Engineering Review
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5 tracking-tight">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            Specification Collision Arbitration
          </h1>
          <p className="text-xs text-slate-600 dark:text-white/40 mt-1 max-w-2xl leading-relaxed">
            Deterministic multi-source conflict resolution. When candidate authorities are tied or rating standards diverge (e.g. ISO 1M vs C90 90M), exceptions route here for human verification.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          {pendingItems.length > 0 && (
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={handleAcceptRecommended}
                disabled={isAutoApproving || isLoading}
                className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-white/[0.08] dark:hover:bg-white/[0.14] dark:border dark:border-white/10 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
              >
                <CheckCheck className="w-4 h-4 text-emerald-300" />
                Accept Recommended Candidates ({pendingItems.length})
              </button>
              <span className="text-[10px] text-slate-500 dark:text-white/40">
                {pendingItems.length} candidate(s) meet automatic resolution criteria
              </span>
            </div>
          )}

          <button
            onClick={loadQueue}
            disabled={isLoading}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-700 dark:text-white/70 flex items-center justify-center transition-all self-end sm:self-auto shadow-xs"
            title="Refresh Conflict Queue"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Review Queue Listing */}
      {isLoading ? (
        <div className="py-24 text-center text-blue-600 dark:text-blue-400 text-xs font-mono animate-pulse">
          Retrieving specification collision manifest...
        </div>
      ) : (
        <div className="space-y-6">
          {/* SECTION 1: REQUIRES HUMAN REVIEW */}
          {pendingItems.length === 0 ? (
            <div className="crucible-card p-10 text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-500/30">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Review Queue Clean · Zero Pending Collisions
                </h3>
                <p className="text-xs text-slate-600 dark:text-white/40 max-w-md mx-auto mt-1">
                  All multi-source claims across indexed catalogs have been deterministically arbitrated via source authority weighting.
                </p>
              </div>
              <Link
                href="/workspace"
                className="inline-block mt-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-xs transition-all shadow-md shadow-emerald-600/25"
              >
                Return to Catalog Workspace
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                    Requires Human Review ({pendingItems.length})
                  </h2>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-white/40">
                  Authority tie or conflicting engineering standard
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {pendingItems.map((item) => (
                  <ConflictResolver
                    key={`${item.sku}-${item.field}`}
                    item={item}
                    onResolve={(action, val, notes) =>
                      handleResolveItem(item.sku, item.field, action, val, notes)
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2: RESOLVED AUDIT TRAIL */}
          {resolvedItems.length > 0 && (
            <div className="pt-4 border-t border-slate-200 dark:border-white/[0.06] space-y-4">
              <button
                onClick={() => setShowResolvedHistory(!showResolvedHistory)}
                className="flex items-center justify-between w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-all text-xs text-slate-700 dark:text-white/60"
              >
                <div className="flex items-center gap-2 font-mono">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-slate-900 dark:text-white">
                    Arbitrated & Resolved Specifications ({resolvedItems.length})
                  </span>
                  <span className="text-slate-400 dark:text-white/30 text-[11px]">
                    — Resolved by authority rule or engineering review
                  </span>
                </div>
                {showResolvedHistory ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 dark:text-white/40" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 dark:text-white/40" />
                )}
              </button>

              {showResolvedHistory && (
                <div className="grid grid-cols-1 gap-3 animate-in fade-in">
                  {resolvedItems.map((item) => (
                    <div
                      key={`resolved-${item.sku}-${item.field}`}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 opacity-90"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{item.sku}</span>
                          <span className="text-slate-300 dark:text-white/20">·</span>
                          <span className="font-semibold text-slate-900 dark:text-white/90">{item.field}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-bold">
                            ✓ {item.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-white/40 mt-1">
                          {item.decision_reason}
                        </p>
                      </div>

                      <div className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-white dark:bg-white/[0.04] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.08] shrink-0 shadow-xs">
                        Final: {String(item.current_value)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
