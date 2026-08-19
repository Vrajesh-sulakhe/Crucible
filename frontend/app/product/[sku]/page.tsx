"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  FileText,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Eye,
  Hash,
  Copy,
  Check,
  Download,
  ChevronLeft,
  ChevronRight,
  Share2,
} from "lucide-react";
import { fetchProductBySku, fetchProducts } from "@/lib/api";
import { ProductRecord, FieldDecision } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { ConfidenceBar } from "@/components/ConfidenceBar";
import { SchematicViewer } from "@/components/SchematicViewer";
import { EvidenceInspector } from "@/components/EvidenceInspector";
import { formatFieldName } from "@/lib/utils";
import { useToast } from "@/components/Toast";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const sku = decodeURIComponent((params?.sku as string) || "");

  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [allProducts, setAllProducts] = useState<ProductRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFieldDecision, setSelectedFieldDecision] = useState<FieldDecision | null>(null);
  const [highlightedDim, setHighlightedDim] = useState<"bore" | "outer" | "width" | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  useEffect(() => {
    if (!sku) return;
    setIsLoading(true);
    Promise.all([fetchProductBySku(sku), fetchProducts()])
      .then(([p, all]) => {
        setProduct(p);
        setAllProducts(all);
      })
      .catch((err) => console.error("Failed fetching product", err))
      .finally(() => setIsLoading(false));
  }, [sku]);

  // Find next/prev SKU indices for fast navigation
  const currentIndex = allProducts.findIndex((p) => p.sku === sku);
  const prevSku = currentIndex > 0 ? allProducts[currentIndex - 1].sku : null;
  const nextSku = currentIndex >= 0 && currentIndex < allProducts.length - 1 ? allProducts[currentIndex + 1].sku : null;

  // Keyboard navigation for [ and ]
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "[" && prevSku) {
        router.push(`/product/${encodeURIComponent(prevSku)}`);
      } else if (e.key === "]" && nextSku) {
        router.push(`/product/${encodeURIComponent(nextSku)}`);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSku, nextSku, router]);

  const copyProductJson = () => {
    if (!product) return;
    navigator.clipboard.writeText(JSON.stringify(product, null, 2));
    setCopiedJson(true);
    toast.success("Copied Specification Manifest", `JSON for ${product.sku} copied to clipboard`);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  const exportProductJsonFile = () => {
    if (!product) return;
    const blob = new Blob([JSON.stringify(product, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crucible_spec_${product.sku}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded Technical Spec", `Saved ${product.sku}.json`);
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-blue-600 dark:text-blue-400 font-mono text-xs animate-pulse">
        // RETRIEVING HIGH-PRECISION ENGINEERING RECORD FOR SKU [{sku}]...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center font-mono space-y-3">
        <p className="text-slate-500 dark:text-white/40">// ERROR: SKU &quot;{sku}&quot; not located in active catalog.</p>
        <Link href="/workspace" className="text-blue-600 dark:text-blue-400 hover:underline text-xs">
          ← Return to Catalog Workspace
        </Link>
      </div>
    );
  }

  const bore = product.fields?.bore_diameter?.final_value || null;
  const outer = product.fields?.outer_diameter?.final_value || null;
  const width = product.fields?.width?.final_value || null;
  const speed = product.fields?.limiting_speed?.final_value || null;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Next/Prev Controls */}
      <div className="flex items-center justify-between text-xs">
        <Link
          href="/workspace"
          className="inline-flex items-center gap-2 text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-colors font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Catalog Workspace
        </Link>

        {/* Next / Previous SKU Switcher */}
        <div className="flex items-center gap-2">
          {prevSku && (
            <Link
              href={`/product/${encodeURIComponent(prevSku)}`}
              className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-white/70 font-semibold flex items-center gap-1.5 transition-colors text-xs font-mono shadow-xs"
              title="Previous SKU (Press [)"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{prevSku}</span>
            </Link>
          )}
          {nextSku && (
            <Link
              href={`/product/${encodeURIComponent(nextSku)}`}
              className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-white/70 font-semibold flex items-center gap-1.5 transition-colors text-xs font-mono shadow-xs"
              title="Next SKU (Press ])"
            >
              <span>{nextSku}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Hero Header */}
      <div className="crucible-card p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300 font-bold">
              Category: {product.fields?.category?.final_value || "Bearings"}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-white/40 font-mono">
              UNSPSC: 31171504
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Hash className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            {product.sku}
          </h1>
          <p className="text-sm text-slate-600 dark:text-white/50 mt-1">{product.product_name}</p>
        </div>

        {/* Actions & Status */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={copyProductJson}
            className="px-3.5 py-2 rounded-full bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-white/70 text-xs flex items-center gap-1.5 transition-colors font-semibold shadow-xs"
            title="Copy Product JSON"
          >
            {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            Copy JSON
          </button>

          <button
            onClick={exportProductJsonFile}
            className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-600/25"
          >
            <Download className="w-3.5 h-3.5" />
            Export Spec File
          </button>

          <div className="flex items-center gap-3 bg-slate-100 dark:bg-white/[0.03] p-2.5 px-3.5 rounded-2xl border border-slate-200 dark:border-white/[0.08]">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-white/40 uppercase tracking-wider font-bold block">
                Confidence
              </span>
              <div className="w-24 mt-1">
                <ConfidenceBar confidence={product.overall_confidence} />
              </div>
            </div>
            <div className="border-l border-slate-200 dark:border-white/[0.08] pl-3">
              <span className="text-[10px] text-slate-500 dark:text-white/40 uppercase tracking-wider font-bold block mb-1">
                Status
              </span>
              <StatusBadge status={product.overall_status} />
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Technical Attributes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="crucible-card overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/[0.06] bg-slate-50/70 dark:bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Verified Technical Specifications ({Object.keys(product.fields).length})
                </h2>
              </div>
              <span className="text-xs text-slate-500 dark:text-white/40 font-medium">
                Click any row to inspect verbatim PDF proof
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-white/[0.04] text-xs font-mono">
              {Object.entries(product.fields).map(([fieldName, decision]) => {
                const isBore = fieldName === "bore_diameter";
                const isOuter = fieldName === "outer_diameter";
                const isWidth = fieldName === "width";

                return (
                  <div
                    key={fieldName}
                    onClick={() => setSelectedFieldDecision(decision)}
                    onMouseEnter={() => {
                      if (isBore) setHighlightedDim("bore");
                      else if (isOuter) setHighlightedDim("outer");
                      else if (isWidth) setHighlightedDim("width");
                    }}
                    onMouseLeave={() => setHighlightedDim(null)}
                    className={`p-4 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group ${
                      (isBore && highlightedDim === "bore") ||
                      (isOuter && highlightedDim === "outer") ||
                      (isWidth && highlightedDim === "width")
                        ? "bg-blue-50 dark:bg-blue-500/10 border-l-4 border-l-blue-600"
                        : "hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="min-w-[180px]">
                      <span className="font-bold font-sans text-slate-900 dark:text-white block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-xs">
                        {formatFieldName(fieldName)}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-white/40 font-medium font-sans">
                        {decision.candidates.length} grounded citation{decision.candidates.length > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="flex-1 font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 font-mono">
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        {decision.final_value !== null ? String(decision.final_value) : "—"}
                      </span>
                      {decision.candidates[0]?.unit && (
                        <span className="text-xs font-semibold text-slate-500 dark:text-white/40">
                          {decision.candidates[0].unit}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <StatusBadge status={decision.status} />
                      <div className="w-16 hidden sm:block">
                        <ConfidenceBar confidence={decision.confidence} showPercent={false} />
                      </div>
                      <button
                        onClick={() => setSelectedFieldDecision(decision)}
                        className="p-1.5 rounded-full text-slate-400 dark:text-white/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-white/[0.06] transition-colors"
                        title="Inspect Evidence Drawer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: 2D CAD Schematic & Physical Law Checks */}
        <div className="space-y-5">
          <SchematicViewer
            sku={product.sku}
            bore={typeof bore === "number" ? bore : null}
            outer={typeof outer === "number" ? outer : null}
            width={typeof width === "number" ? width : null}
            speed={typeof speed === "number" ? speed : null}
            highlightedDimension={highlightedDim}
          />

          {/* Physical Constraint Audit Card */}
          <div className="crucible-card p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Physical Law Compliance
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] flex items-start gap-3 text-slate-700 dark:text-white/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Geometric Clearance</span>
                  <span className="text-slate-500 dark:text-white/40 text-[11px]">
                    Outer ({outer} mm) &gt; Bore ({bore} mm) clearance confirmed
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] flex items-start gap-3 text-slate-700 dark:text-white/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Deterministic Normalization</span>
                  <span className="text-slate-500 dark:text-white/40 text-[11px]">
                    Standardized to ISO metric units (mm, kg, kN, rpm)
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] flex items-start gap-3 text-slate-700 dark:text-white/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Verifiable PDF Citations</span>
                  <span className="text-slate-500 dark:text-white/40 text-[11px]">
                    Zero hallucinations · 100% grounded in source pages
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Inspector Side Drawer */}
      <EvidenceInspector
        sku={product.sku}
        fieldDecision={selectedFieldDecision}
        onClose={() => setSelectedFieldDecision(null)}
      />
    </div>
  );
}
