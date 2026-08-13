"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, CheckCircle, RefreshCw, AlertTriangle, Scale } from "lucide-react";
import { fetchReviewQueue, submitReviewAction } from "@/lib/api";
import { ReviewQueueItem } from "@/lib/types";
import { ConflictResolver } from "@/components/ConflictResolver";

export default function ReviewQueuePage() {
  const [queue, setQueue] = useState<ReviewQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resolvedCount, setResolvedCount] = useState(0);

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

  return (
    <div className="space-y-5 font-mono">
      {/* Top Navigation */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Catalog Workspace
      </Link>

      {/* Header Banner */}
      <div className="hud-panel corner-bracket rounded-lg p-5 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold uppercase">
              HUMAN-IN-THE-LOOP CONTROL // ENTERPRISE ARBITRATION
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            CATALOG SPECIFICATION COLLISION QUEUE
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            The hybrid engine isolates multi-source spec discrepancies and ambiguous dynamic ratings here. Compare side-by-side citations with source authority rankings, approve winning candidates, or input manual engineering overrides with instant recalculation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadQueue}
            disabled={isLoading}
            className="p-2 rounded bg-surface-1 border border-border hover:border-cyan-500 text-slate-300 hover:text-cyan-300 transition-all"
            title="Refresh Conflict Queue"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Review Queue Listing */}
      {isLoading ? (
        <div className="py-20 text-center text-cyan-400 font-mono text-xs animate-pulse">
          // TELEMETRY: RETRIEVING SPECIFICATION COLLISION QUEUE...
        </div>
      ) : queue.length === 0 ? (
        <div className="hud-panel rounded-lg p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded bg-emerald-950/60 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 shadow-[0_0_20px_rgba(0,255,170,0.2)]">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Review Queue Clean // Zero Specification Collisions
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            All multi-source claims have been arbitrated and validated against physical constraints. Catalog is 100% commerce-ready.
          </p>
          <Link
            href="/"
            className="inline-block mt-3 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded font-bold text-xs uppercase"
          >
            Return to Mission Control
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 flex items-center justify-between px-1">
            <span className="text-amber-400 font-bold">
              [{queue.length} SPECIFICATION COLLISIONS REQUIRING ARBITRATION]
            </span>
            {resolvedCount > 0 && (
              <span className="text-emerald-400 font-bold">
                ✓ {resolvedCount} COLLISION(S) ARBITRATED IN THIS SESSION
              </span>
            )}
          </div>

          <div className="space-y-3">
            {queue.map((item, idx) => (
              <ConflictResolver
                key={`${item.sku}-${item.field}-${idx}`}
                item={item}
                onResolve={(action, val, notes) =>
                  handleResolveItem(item.sku, item.field, action, val, notes)
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
