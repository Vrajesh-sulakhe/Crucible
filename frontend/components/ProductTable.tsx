import React, { useState } from "react";
import Link from "next/link";
import { Search, Eye, ExternalLink, Filter, Database, Hash } from "lucide-react";
import { ProductRecord, FieldStatus } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { ConfidenceBar } from "./ConfidenceBar";

interface ProductTableProps {
  products: ProductRecord[];
  onSelectField?: (sku: string, fieldName: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onSelectField,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = products.filter((p) => {
    const matchesSearch =
      searchTerm === "" ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.product_name && p.product_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "ALL" || p.overall_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="hud-panel corner-bracket rounded-lg overflow-hidden font-mono text-xs flex flex-col">
      {/* Search & Filter Header Bar */}
      <div className="p-3.5 border-b border-border/80 bg-surface-2/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by SKU, title, or ISO designation..."
            className="w-full pl-8 pr-4 py-1.5 rounded bg-surface-1 border border-border text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none"
          />
        </div>

        {/* Tactical Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: `ALL (${products.length})` },
            { id: "validated", label: "VALIDATED" },
            { id: "conflict_resolved", label: "RESOLVED" },
            { id: "needs_review", label: "IN REVIEW" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold tracking-tight transition-all uppercase ${
                statusFilter === tab.id
                  ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                  : "bg-surface-1 text-slate-400 hover:text-white border border-border/60 hover:border-cyan-500/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dense High-Precision Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-1/90 text-slate-400 text-[10px] uppercase tracking-wider border-b border-border/80 font-bold">
            <tr>
              <th className="py-2.5 px-4 text-cyan-400">DESIGNATION (SKU)</th>
              <th className="py-2.5 px-4">CANONICAL PRODUCT NAME</th>
              <th className="py-2.5 px-4 text-center">DIMENSIONS (d × D × B)</th>
              <th className="py-2.5 px-4 text-center">DYNAMIC LOAD</th>
              <th className="py-2.5 px-4 text-center">SPEED (RPM)</th>
              <th className="py-2.5 px-4">CONFIDENCE</th>
              <th className="py-2.5 px-4">STATUS</th>
              <th className="py-2.5 px-4 text-right">INSPECT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500 italic">
                  // No catalog items matched the query criteria.
                </td>
              </tr>
            ) : (
              filtered.map((prod) => {
                const bore = prod.fields?.bore_diameter?.final_value;
                const outer = prod.fields?.outer_diameter?.final_value;
                const width = prod.fields?.width?.final_value;
                const dyn = prod.fields?.dynamic_load_rating?.final_value;
                const speed = prod.fields?.limiting_speed?.final_value;

                return (
                  <tr
                    key={prod.sku}
                    className="hover:bg-surface-2/90 transition-colors group"
                  >
                    <td className="py-3 px-4 font-bold text-cyan-300 tracking-tight">
                      <Link
                        href={`/product/${encodeURIComponent(prod.sku)}`}
                        className="hover:underline hover:text-white flex items-center gap-1.5"
                      >
                        <Hash className="w-3 h-3 text-cyan-500" />
                        {prod.sku}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-slate-200 font-medium max-w-xs truncate">
                      {prod.product_name || "—"}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-300">
                      <span className="text-white font-bold">{bore ? `${bore}` : "—"}</span> ×{" "}
                      <span className="text-cyan-300 font-bold">{outer ? `${outer}` : "—"}</span> ×{" "}
                      <span className="text-emerald-300 font-bold">{width ? `${width}` : "—"}</span>{" "}
                      <span className="text-[10px] text-slate-500">mm</span>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-300 font-bold">
                      {dyn ? `${dyn} kN` : "—"}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-300">
                      {speed ? `${Number(speed).toLocaleString()}` : "—"}
                    </td>
                    <td className="py-3 px-4 min-w-[130px]">
                      <ConfidenceBar confidence={prod.overall_confidence} />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={prod.overall_status} />
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <button
                        onClick={() =>
                          onSelectField && onSelectField(prod.sku, "bore_diameter")
                        }
                        className="p-1.5 rounded bg-surface hover:bg-cyan-950/60 text-slate-400 hover:text-cyan-300 transition-colors border border-border/50"
                        title="Forensic Evidence Inspector"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        href={`/product/${encodeURIComponent(prod.sku)}`}
                        className="inline-block p-1.5 rounded bg-surface hover:bg-cyan-950/60 text-slate-400 hover:text-cyan-300 transition-colors border border-border/50"
                        title="CAD Spec Sheet"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Telemetry Footer */}
      <div className="p-2.5 border-t border-border/80 bg-surface-1 text-[10px] text-slate-500 flex items-center justify-between">
        <span>
          TELEMETRY // INDEXED {filtered.length} OF {products.length} INDUSTRIAL SPECIFICATIONS
        </span>
        <span className="text-cyan-400">
          NORMALIZATION POLICY: PINT METRIC BASE (ISO 15)
        </span>
      </div>
    </div>
  );
};
