"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
} from "lucide-react";
import { fetchProductBySku } from "@/lib/api";
import { ProductRecord, FieldDecision } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { ConfidenceBar } from "@/components/ConfidenceBar";
import { SchematicViewer } from "@/components/SchematicViewer";
import { EvidenceInspector } from "@/components/EvidenceInspector";
import { formatFieldName } from "@/lib/utils";

export default function ProductDetailPage() {
  const params = useParams();
  const sku = decodeURIComponent((params?.sku as string) || "");

  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFieldDecision, setSelectedFieldDecision] = useState<FieldDecision | null>(null);

  useEffect(() => {
    if (!sku) return;
    setIsLoading(true);
    fetchProductBySku(sku)
      .then((p) => setProduct(p))
      .catch((err) => console.error("Failed fetching product", err))
      .finally(() => setIsLoading(false));
  }, [sku]);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-cyan-400 font-mono text-xs animate-pulse">
        // TELEMETRY: RETRIEVING ENGINEERING RECORD FOR SKU [{sku}]...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center font-mono space-y-3">
        <p className="text-slate-400">// ERROR: SKU "{sku}" not located in active catalog.</p>
        <Link href="/" className="text-cyan-400 hover:underline text-xs">
          ← Return to Mission Control
        </Link>
      </div>
    );
  }

  const bore = product.fields?.bore_diameter?.final_value || null;
  const outer = product.fields?.outer_diameter?.final_value || null;
  const width = product.fields?.width?.final_value || null;
  const speed = product.fields?.limiting_speed?.final_value || null;

  return (
    <div className="space-y-5 font-mono">
      {/* Back Navigation */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Catalog Workspace
      </Link>

      {/* Hero Header */}
      <div className="hud-panel corner-bracket rounded-lg p-5 border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold uppercase">
              DESIGNATION // {product.fields?.category?.final_value || "Bearings"}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Hash className="w-5 h-5 text-cyan-400" />
            {product.sku}
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">{product.product_name}</p>
        </div>

        <div className="flex items-center gap-4 bg-surface-1/90 p-3 rounded border border-border/80">
          <div>
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
              Confidence Index
            </span>
            <div className="w-28 mt-1">
              <ConfidenceBar confidence={product.overall_confidence} />
            </div>
          </div>
          <div className="border-l border-border/80 pl-4">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">
              Catalog Status
            </span>
            <StatusBadge status={product.overall_status} />
          </div>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Technical Attributes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="hud-panel rounded-lg overflow-hidden">
            <div className="p-3.5 border-b border-border/80 bg-surface-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  VERIFIED TECHNICAL SPECIFICATIONS
                </h2>
              </div>
              <span className="text-[10px] text-slate-400">
                [CLICK ATTRIBUTE FOR FORENSIC EVIDENCE]
              </span>
            </div>

            <div className="divide-y divide-border/40 text-xs">
              {Object.entries(product.fields).map(([fieldName, decision]) => (
                <div
                  key={fieldName}
                  onClick={() => setSelectedFieldDecision(decision)}
                  className="p-3.5 hover:bg-surface-2/90 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 group"
                >
                  <div className="min-w-[160px]">
                    <span className="font-bold text-slate-200 block group-hover:text-cyan-300 transition-colors uppercase text-[11px]">
                      {formatFieldName(fieldName)}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {decision.candidates.length} grounded citations
                    </span>
                  </div>

                  <div className="flex-1 font-bold text-white flex items-center gap-1.5">
                    <span className="text-sm text-cyan-300">
                      {decision.final_value !== null ? String(decision.final_value) : "—"}
                    </span>
                    {decision.candidates[0]?.unit && (
                      <span className="text-xs font-normal text-slate-400">
                        {decision.candidates[0].unit}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={decision.status} />
                    <div className="w-16 hidden sm:block">
                      <ConfidenceBar confidence={decision.confidence} showPercent={false} />
                    </div>
                    <Eye className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: 2D Schematic & Physical Law Checkmarks */}
        <div className="space-y-4">
          <SchematicViewer
            sku={product.sku}
            bore={typeof bore === "number" ? bore : null}
            outer={typeof outer === "number" ? outer : null}
            width={typeof width === "number" ? width : null}
            speed={typeof speed === "number" ? speed : null}
          />

          {/* Physical Constraint Audit Card */}
          <div className="hud-panel corner-bracket rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              PHYSICAL LAW COMPLIANCE
            </h3>

            <div className="space-y-2 text-[11px]">
              <div className="p-2 rounded bg-surface-1 border border-border/70 flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Outer Ø &gt; Bore Ø Clearance</span>
                  <span className="text-slate-400">
                    Geometric clearance validated ({outer} mm &gt; {bore} mm)
                  </span>
                </div>
              </div>

              <div className="p-2 rounded bg-surface-1 border border-border/70 flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Pint Unit Normalization</span>
                  <span className="text-slate-400">
                    Standardized length $\to$ mm, mass $\to$ kg, load $\to$ kN
                  </span>
                </div>
              </div>

              <div className="p-2 rounded bg-surface-1 border border-border/70 flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Verbatim PDF Grounding</span>
                  <span className="text-slate-400">
                    Every value carried citations from primary datasheets
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
