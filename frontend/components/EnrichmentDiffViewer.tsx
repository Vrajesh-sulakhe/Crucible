"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  Check,
  Download,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { ProductRecord } from "@/lib/types";

interface EnrichmentDiffViewerProps {
  products?: ProductRecord[];
  onExportClick?: () => void;
}

export const EnrichmentDiffViewer: React.FC<EnrichmentDiffViewerProps> = ({
  products = [],
  onExportClick,
}) => {
  // Extract all unique SKUs from available products
  const availableSkus = useMemo(() => {
    if (!products || products.length === 0) return ["6205-2RSH", "32005-X", "UCP205-16"];
    return products.map((p) => p.sku);
  }, [products]);

  const [selectedSku, setSelectedSku] = useState<string>(availableSkus[0] || "6205-2RSH");

  // Keep selectedSku valid when products update
  const activeSku = availableSkus.includes(selectedSku) ? selectedSku : availableSkus[0] || "6205-2RSH";

  const activeProduct = useMemo(() => {
    return products.find((p) => p.sku === activeSku) || null;
  }, [products, activeSku]);

  // Compute dynamic before/after attributes for the active product
  const diffData = useMemo(() => {
    if (!activeProduct || !activeProduct.fields) {
      // Default sample fallback
      return {
        title: "SKF Explorer 6205-2RSH Deep Groove Ball Bearing",
        totalFields: 14,
        beforeCount: 6,
        afterCount: 14,
        rows: [
          { key: "product_name", label: "Product Title", before: "SKF bearing 6205", after: "SKF Explorer 6205-2RSH Deep Groove Ball Bearing", isEnriched: false, isCorrected: true },
          { key: "category", label: "Taxonomy Category", before: "Ball Bearings", after: "Bearings", isEnriched: false, isCorrected: true },
          { key: "subcategory", label: "Sub-Category", before: null, after: "Deep Groove Ball Bearings", isEnriched: true, isCorrected: false },
          { key: "bore_diameter", label: "Bore Diameter (d)", before: "25 mm", after: "25.0 mm", isEnriched: false, isCorrected: false },
          { key: "outer_diameter", label: "Outer Diameter (D)", before: "52 mm", after: "52.0 mm", isEnriched: false, isCorrected: false },
          { key: "width", label: "Width / Height (B)", before: "15 mm", after: "15.0 mm", isEnriched: false, isCorrected: false },
          { key: "weight", label: "Net Mass / Weight", before: "0.25 kg (Gross packaged)", after: "0.13 kg (Net mass, ISO 15)", isEnriched: false, isCorrected: true },
          { key: "dynamic_load_rating", label: "Dynamic Load Rating (Cr)", before: null, after: "14.8 kN (ISO 281)", isEnriched: true, isCorrected: false },
          { key: "static_load_rating", label: "Static Load Rating (C0)", before: null, after: "7.8 kN (ISO 76)", isEnriched: true, isCorrected: false },
          { key: "limiting_speed", label: "Limiting Speed (RPM)", before: null, after: "8,500 rpm", isEnriched: true, isCorrected: false },
          { key: "material", label: "Steel / Material Spec", before: null, after: "Chrome Steel (100Cr6 / 52100)", isEnriched: true, isCorrected: false },
          { key: "seals", label: "Sealing & Enclosure", before: "2RSH", after: "Rubber Contact Seal (2RSH)", isEnriched: false, isCorrected: true },
          { key: "standards", label: "Engineering Standards", before: null, after: "ISO 15:2017 / DIN 625", isEnriched: true, isCorrected: false },
          { key: "applications", label: "Recommended Applications", before: null, after: "Electric drives, pumps, gearboxes", isEnriched: true, isCorrected: false },
        ],
      };
    }

    const fieldEntries = Object.entries(activeProduct.fields);
    const totalFields = fieldEntries.length;
    let beforeCount = 0;
    let afterCount = 0;

    const rows = fieldEntries.map(([key, dec]) => {
      const csvCand = dec.candidates.find((c) => c.evidence?.source_type === "csv");
      const beforeRaw = csvCand ? (csvCand.raw_value ? String(csvCand.raw_value) : null) : null;
      const afterVal = dec.final_value !== null ? `${dec.final_value}` : null;

      if (beforeRaw) beforeCount++;
      if (afterVal) afterCount++;

      const isEnriched = !beforeRaw && afterVal !== null;
      const isCorrected = beforeRaw !== null && afterVal !== null && beforeRaw !== afterVal;

      const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

      return {
        key,
        label,
        before: beforeRaw,
        after: afterVal,
        isEnriched,
        isCorrected,
      };
    });

    return {
      title: activeProduct.product_name || `Product ${activeProduct.sku}`,
      totalFields: Math.max(totalFields, 1),
      beforeCount,
      afterCount,
      rows,
    };
  }, [activeProduct]);

  const beforePct = Math.round((diffData.beforeCount / diffData.totalFields) * 100);
  const afterPct = Math.round((diffData.afterCount / diffData.totalFields) * 100);

  return (
    <div className="crucible-card glow-emerald p-6 sm:p-7 space-y-6">
      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-[16px] font-bold text-slate-900 dark:text-white tracking-tight">
              Catalog Enrichment Transformation
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-white/40 mt-1 max-w-xl leading-relaxed">
            See how Crucible takes sparse, unstandardized distributor entries and automatically expands them into rich, verified commerce records.
          </p>
        </div>

        {/* Clean SKU Selector Bar */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] overflow-x-auto max-w-full">
          {availableSkus.slice(0, 5).map((sku) => (
            <button
              key={sku}
              onClick={() => setSelectedSku(sku)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                activeSku === sku
                  ? "bg-white dark:bg-white/[0.12] border border-slate-200 dark:border-white/[0.15] text-slate-900 dark:text-white font-bold shadow-sm"
                  : "text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white/80 hover:bg-slate-200/50 dark:hover:bg-white/[0.04]"
              }`}
            >
              {sku}
            </button>
          ))}
        </div>
      </div>

      {/* Product Subhead */}
      <div className="relative z-10 flex items-center justify-between text-xs pb-1">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-white/40 font-medium">Inspecting:</span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{activeSku}</span>
          <span className="text-slate-300 dark:text-white/20">·</span>
          <span className="text-slate-800 dark:text-white/70 font-semibold truncate max-w-lg">{diffData.title}</span>
        </div>
        <span className="text-xs font-mono text-slate-500 dark:text-white/40">
          Enrichment Delta: <strong className="text-emerald-600 dark:text-emerald-400">+{afterPct - beforePct}% density</strong>
        </span>
      </div>

      {/* Before / After Summary Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Before Metric Card */}
        <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-500/[0.04] border border-amber-200 dark:border-amber-500/[0.15] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Raw Legacy Input (Before)
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/[0.1] border border-amber-200 dark:border-amber-500/[0.2] text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold">
              Sparse Ingest ({beforePct}%)
            </span>
          </div>

          <div>
            <div className="text-3xl font-extrabold font-mono text-amber-950 dark:text-amber-300 tracking-tight">
              {diffData.beforeCount} <span className="text-lg text-amber-700/70 dark:text-amber-400/60 font-normal">/ {diffData.totalFields} Attributes</span>
            </div>
            <p className="text-xs text-amber-800/80 dark:text-amber-400/50 mt-1">
              Low catalog completeness · Missing critical engineering tolerances & load ratings
            </p>
          </div>
        </div>

        {/* After Metric Card */}
        <div className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-500/[0.04] border border-emerald-200 dark:border-emerald-500/[0.15] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Crucible Enriched Output (After)
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/[0.1] border border-emerald-200 dark:border-emerald-500/[0.2] text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold">
              Commerce Ready ({afterPct}%)
            </span>
          </div>

          <div>
            <div className="text-3xl font-extrabold font-mono text-emerald-950 dark:text-emerald-300 tracking-tight">
              {diffData.afterCount} <span className="text-lg text-emerald-700/70 dark:text-emerald-400/60 font-normal">/ {diffData.totalFields} Attributes</span>
            </div>
            <p className="text-xs text-emerald-800/80 dark:text-emerald-400/50 mt-1">
              100% attribute density · Standardized to ISO 15 / Pint Canonical SI units
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Attribute Comparison Table */}
      <div className="relative z-10 rounded-2xl border border-slate-200 dark:border-white/[0.06] overflow-hidden bg-slate-50/50 dark:bg-white/[0.01]">
        <div className="grid grid-cols-12 bg-slate-100/70 dark:bg-white/[0.03] p-3 text-[11px] font-semibold text-slate-700 dark:text-white/50 uppercase tracking-wider border-b border-slate-200 dark:border-white/[0.06]">
          <div className="col-span-4 font-sans">Attribute Name</div>
          <div className="col-span-4 text-amber-800 dark:text-amber-400/80 font-mono">Legacy Raw Ingest</div>
          <div className="col-span-4 text-emerald-800 dark:text-emerald-400/80 font-mono">Crucible Normalized & Enriched</div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/[0.04] text-xs max-h-96 overflow-y-auto font-mono">
          {diffData.rows.map(({ key, label, before, after, isEnriched, isCorrected }) => (
            <div
              key={key}
              className={`grid grid-cols-12 p-3 items-center transition-colors ${
                isEnriched
                  ? "bg-emerald-50/50 dark:bg-emerald-500/[0.02] hover:bg-emerald-100/50 dark:hover:bg-emerald-500/[0.05]"
                  : "hover:bg-slate-100/50 dark:hover:bg-white/[0.02]"
              }`}
            >
              <div className="col-span-4 font-sans font-medium text-slate-900 dark:text-white/80 text-xs">
                {label}
              </div>

              {/* Before Column */}
              <div className="col-span-4 text-slate-500 dark:text-white/40 truncate pr-2">
                {before ? (
                  <span className={isCorrected ? "line-through text-amber-700 dark:text-amber-400/60" : ""}>
                    {before}
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-white/[0.03] border border-slate-300 dark:border-white/[0.05] text-slate-600 dark:text-white/30 italic font-sans">
                    Missing in CSV
                  </span>
                )}
              </div>

              {/* After Column */}
              <div className="col-span-4 font-semibold flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                {after ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="truncate">{after}</span>
                    {isEnriched && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/[0.12] border border-emerald-200 dark:border-emerald-500/[0.25] text-emerald-800 dark:text-emerald-300 font-sans font-bold shrink-0">
                        Enriched
                      </span>
                    )}
                    {isCorrected && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/[0.12] border border-blue-200 dark:border-blue-500/[0.25] text-blue-800 dark:text-blue-300 font-sans font-bold shrink-0">
                        Resolved
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-slate-400 dark:text-white/20 italic font-sans text-[11px]">No value decided</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
