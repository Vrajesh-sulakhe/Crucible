"use client";

import React, { useEffect, useState } from "react";
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Terminal,
  Activity,
} from "lucide-react";
import { fetchMetrics, fetchProducts, fetchExplainField } from "@/lib/api";
import { MetricsResponse, ProductRecord, FieldDecision } from "@/lib/types";
import { PipelineTracker } from "@/components/PipelineTracker";
import { UploadPanel } from "@/components/UploadPanel";
import { ProductTable } from "@/components/ProductTable";
import { EvidenceInspector } from "@/components/EvidenceInspector";

export default function WorkspacePage() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Evidence Inspector state
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [selectedDecision, setSelectedDecision] = useState<FieldDecision | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prods, mets] = await Promise.all([
        fetchProducts(),
        fetchMetrics(),
      ]);
      setProducts(prods);
      setMetrics(mets);
    } catch (err) {
      console.error("Failed loading products from API", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectField = async (sku: string, fieldName: string) => {
    try {
      const decision = await fetchExplainField(sku, fieldName);
      setSelectedSku(sku);
      setSelectedDecision(decision);
    } catch (err) {
      console.error(`Failed inspecting evidence for ${sku}/${fieldName}`, err);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Tactical KPI Telemetry Blocks */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1 */}
        <div className="hud-panel corner-bracket rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <span>INDEXED SKUS</span>
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {metrics ? metrics.total_products : "—"}
            </span>
            <span className="text-[10px] text-cyan-400 font-bold">100% ENRICHED</span>
          </div>
          <span className="text-[10px] text-slate-500">
            {metrics ? `${metrics.populated_fields} specifications mapped` : "Loading..."}
          </span>
        </div>

        {/* Metric 2 */}
        <div className="hud-panel corner-bracket rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <span>WEIGHTED ACCURACY</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">
              {metrics ? `${Math.round(metrics.avg_confidence * 100)}%` : "—"}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">CONFIDENCE</span>
          </div>
          <span className="text-[10px] text-slate-500">
            Formula Verified (Ext + Auth + Val)
          </span>
        </div>

        {/* Metric 3 */}
        <div className="hud-panel corner-bracket rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <span>CONFLICT ARBITRATION</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-300">
              {metrics ? metrics.conflict_resolved_count : "—"}
            </span>
            <span className="text-[10px] text-slate-400">RESOLVED</span>
          </div>
          <span className="text-[10px] text-amber-400 font-bold">
            {metrics ? `// ${metrics.needs_review_count} IN REVIEW QUEUE` : "0 IN QUEUE"}
          </span>
        </div>

        {/* Metric 4 */}
        <div className="hud-panel corner-bracket rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <span>ENGINEERING TIME SAVED</span>
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {metrics ? `${metrics.estimated_hours_saved}h` : "—"}
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">ROI AUTOMATED</span>
          </div>
          <span className="text-[10px] text-slate-500">
            ~15m manual lookup saved per SKU
          </span>
        </div>
      </div>

      {/* 6-Stage Execution Pipeline Spine */}
      <PipelineTracker activeStage={6} />

      {/* Ingestion Console */}
      <UploadPanel
        onProcessed={(newProds) => {
          setProducts(newProds);
          fetchMetrics().then(setMetrics);
        }}
        onLoadBaked={loadData}
      />

      {/* Dense High-Precision Product Grid */}
      <ProductTable
        products={products}
        onSelectField={handleSelectField}
      />

      {/* Evidence Inspector Side Drawer */}
      <EvidenceInspector
        sku={selectedSku || ""}
        fieldDecision={selectedDecision}
        onClose={() => setSelectedDecision(null)}
      />
    </div>
  );
}
