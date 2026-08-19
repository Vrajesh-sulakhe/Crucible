"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  CheckSquare,
  Square,
  Download,
  Filter,
  Sparkles,
  Hash,
} from "lucide-react";
import { ProductRecord, FieldStatus } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { ConfidenceBar } from "./ConfidenceBar";
import { useToast } from "./Toast";

interface ProductTableProps {
  products: ProductRecord[];
  onSelectField?: (sku: string, field: string) => void;
  onCheckGaps?: (sku: string) => void;
  activeStatusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
}

type SortField =
  | "sku"
  | "product_name"
  | "bore"
  | "dynamic_load"
  | "limiting_speed"
  | "confidence"
  | "status";

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onSelectField,
  onCheckGaps,
  activeStatusFilter = "ALL",
  onStatusFilterChange,
}) => {
  const toast = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [internalStatusFilter, setInternalStatusFilter] = useState("ALL");
  const [sortField, setSortField] = useState<SortField>("sku");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [copiedSku, setCopiedSku] = useState<string | null>(null);
  const [selectedSkus, setSelectedSkus] = useState<Set<string>>(new Set());

  const effectiveStatusFilter = onStatusFilterChange ? activeStatusFilter : internalStatusFilter;

  const handleStatusChange = (status: string) => {
    if (onStatusFilterChange) {
      onStatusFilterChange(status);
    } else {
      setInternalStatusFilter(status);
    }
  };

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSku(text);
    toast.success("Copied to clipboard", `${label}: ${text}`);
    setTimeout(() => setCopiedSku(null), 2000);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleSelectSku = (sku: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSkus((prev) => {
      const next = new Set(prev);
      if (next.has(sku)) {
        next.delete(sku);
      } else {
        next.add(sku);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedSkus.size === filteredAndSorted.length && filteredAndSorted.length > 0) {
      setSelectedSkus(new Set());
    } else {
      setSelectedSkus(new Set(filteredAndSorted.map((p) => p.sku)));
    }
  };

  const filteredAndSorted = useMemo(() => {
    return products
      .filter((p) => {
        // Status filter
        if (effectiveStatusFilter !== "ALL" && p.overall_status !== effectiveStatusFilter) {
          return false;
        }
        // Search term
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchSku = p.sku.toLowerCase().includes(term);
          const matchName = (p.product_name || "").toLowerCase().includes(term);
          const matchFields = Object.entries(p.fields || {}).some(
            ([k, v]) =>
              k.toLowerCase().includes(term) ||
              String(v.final_value || "").toLowerCase().includes(term)
          );
          return matchSku || matchName || matchFields;
        }
        return true;
      })
      .sort((a, b) => {
        let valA: any = "";
        let valB: any = "";

        switch (sortField) {
          case "sku":
            valA = a.sku;
            valB = b.sku;
            break;
          case "product_name":
            valA = a.product_name;
            valB = b.product_name;
            break;
          case "bore":
            valA = a.fields?.bore_diameter?.final_value || 0;
            valB = b.fields?.bore_diameter?.final_value || 0;
            break;
          case "dynamic_load":
            valA = a.fields?.dynamic_load_rating?.final_value || 0;
            valB = b.fields?.dynamic_load_rating?.final_value || 0;
            break;
          case "limiting_speed":
            valA = a.fields?.limiting_speed?.final_value || 0;
            valB = b.fields?.limiting_speed?.final_value || 0;
            break;
          case "confidence":
            valA = a.overall_confidence;
            valB = b.overall_confidence;
            break;
          case "status":
            valA = a.overall_status;
            valB = b.overall_status;
            break;
        }

        if (typeof valA === "number" && typeof valB === "number") {
          return sortDirection === "asc" ? valA - valB : valB - valA;
        }
        return sortDirection === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
  }, [products, searchTerm, effectiveStatusFilter, sortField, sortDirection]);

  // Export selected items as JSON
  const exportSelectedJson = () => {
    const selected = products.filter((p) => selectedSkus.has(p.sku));
    const blob = new Blob([JSON.stringify(selected, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crucible_export_${selected.length}_skus.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported JSON", `Saved ${selected.length} items to file`);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-slate-400 dark:text-white/30" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 text-blue-600 dark:text-blue-400" />
    ) : (
      <ArrowDown className="w-3 h-3 text-blue-600 dark:text-blue-400" />
    );
  };

  const statusCounts = useMemo(() => {
    return {
      all: products.length,
      validated: products.filter((p) => p.overall_status === "validated").length,
      conflict: products.filter((p) => p.overall_status === "conflict_resolved").length,
      review: products.filter((p) => p.overall_status === "needs_review").length,
    };
  }, [products]);

  return (
    <div className="crucible-card overflow-hidden">
      {/* Search & Filter Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.01] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 dark:text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search SKU, title, standard (Press '/' to focus)..."
            className="w-full pl-9 pr-12 py-2 rounded-full bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:border-blue-500 dark:focus:border-white/20 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
          />
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-white/40 hover:text-slate-800 dark:hover:text-white text-[10px] bg-slate-200 dark:bg-white/[0.08] px-1.5 py-0.5 rounded-full"
            >
              ESC
            </button>
          ) : (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-white/30 bg-slate-100 dark:bg-white/[0.04] px-2 py-0.5 rounded-full border border-slate-200 dark:border-white/[0.06] font-mono">
              /
            </span>
          )}
        </div>

        {/* Filter Tabs with Counts */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: `All (${statusCounts.all})` },
            { id: "validated", label: `Validated (${statusCounts.validated})` },
            { id: "conflict_resolved", label: `Resolved (${statusCounts.conflict})` },
            { id: "needs_review", label: `In Review (${statusCounts.review})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleStatusChange(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs tracking-tight transition-all flex items-center gap-1.5 whitespace-nowrap ${
                effectiveStatusFilter === tab.id
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm font-bold"
                  : "bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/[0.08] font-medium"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Batch Action Floating Toolbar (When items selected) */}
      {selectedSkus.size > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-500/20 p-3 px-5 flex items-center justify-between text-xs text-blue-900 dark:text-blue-300 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <span className="font-bold">{selectedSkus.size} items selected</span>
            <button
              onClick={() => setSelectedSkus(new Set())}
              className="text-xs underline hover:text-blue-700 dark:hover:text-blue-200 ml-2 text-blue-600 dark:text-blue-400"
            >
              Clear selection
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportSelectedJson}
              className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Export Selected JSON ({selectedSkus.size})
            </button>
          </div>
        </div>
      )}

      {/* Dense High-Precision Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-100/60 dark:bg-white/[0.02] text-slate-600 dark:text-white/40 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-white/[0.06] select-none">
            <tr>
              <th className="py-3 px-3.5 w-8 text-center">
                <button
                  onClick={toggleSelectAll}
                  className="text-slate-400 hover:text-slate-700 dark:text-white/30 dark:hover:text-white p-0.5"
                  title="Select all filtered items"
                >
                  {selectedSkus.size === filteredAndSorted.length && filteredAndSorted.length > 0 ? (
                    <CheckSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Square className="w-3.5 h-3.5" />
                  )}
                </button>
              </th>
              <th
                onClick={() => handleSort("sku")}
                className="py-3 px-3.5 text-slate-800 dark:text-white/70 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Designation (SKU)</span>
                  {getSortIcon("sku")}
                </div>
              </th>
              <th
                onClick={() => handleSort("product_name")}
                className="py-3 px-3.5 text-slate-800 dark:text-white/70 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Product Name</span>
                  {getSortIcon("product_name")}
                </div>
              </th>
              <th
                onClick={() => handleSort("bore")}
                className="py-3 px-3.5 text-slate-800 dark:text-white/70 text-center cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Dimensions (d × D × B)</span>
                  {getSortIcon("bore")}
                </div>
              </th>
              <th
                onClick={() => handleSort("dynamic_load")}
                className="py-3 px-3.5 text-slate-800 dark:text-white/70 text-center cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Dynamic Load</span>
                  {getSortIcon("dynamic_load")}
                </div>
              </th>
              <th
                onClick={() => handleSort("limiting_speed")}
                className="py-3 px-3.5 text-slate-800 dark:text-white/70 text-center cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Speed Limit</span>
                  {getSortIcon("limiting_speed")}
                </div>
              </th>
              <th
                onClick={() => handleSort("confidence")}
                className="py-3 px-3.5 text-slate-800 dark:text-white/70 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors min-w-[130px]"
              >
                <div className="flex items-center gap-1.5">
                  <span>Confidence</span>
                  {getSortIcon("confidence")}
                </div>
              </th>
              <th
                onClick={() => handleSort("status")}
                className="py-3 px-3.5 text-slate-800 dark:text-white/70 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  {getSortIcon("status")}
                </div>
              </th>
              <th className="py-3 px-3.5 text-right text-slate-800 dark:text-white/70">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04] text-xs">
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-14 text-center text-slate-500 dark:text-white/40 space-y-2">
                  <p>No products matched the query criteria: &quot;{searchTerm}&quot;</p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      handleStatusChange("ALL");
                    }}
                    className="text-blue-600 dark:text-blue-400 underline text-xs font-semibold"
                  >
                    Reset all filters
                  </button>
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((prod) => {
                const isSelected = selectedSkus.has(prod.sku);
                const bore = prod.fields?.bore_diameter?.final_value;
                const outer = prod.fields?.outer_diameter?.final_value;
                const width = prod.fields?.width?.final_value;
                const dyn = prod.fields?.dynamic_load_rating?.final_value;
                const speed = prod.fields?.limiting_speed?.final_value;

                return (
                  <tr
                    key={prod.sku}
                    onClick={() => onSelectField && onSelectField(prod.sku, "bore_diameter")}
                    className={`transition-colors cursor-pointer group ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-500/10 border-l-2 border-l-blue-600"
                        : "hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-3.5 text-center" onClick={(e) => toggleSelectSku(prod.sku, e)}>
                      <button className="text-slate-400 dark:text-white/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 p-0.5">
                        {isSelected ? (
                          <CheckSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Square className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>

                    {/* SKU with Quick Copy */}
                    <td className="py-3.5 px-3.5 font-bold font-mono text-blue-600 dark:text-blue-400 tracking-tight">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/product/${encodeURIComponent(prod.sku)}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:underline flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400"
                        >
                          <Hash className="w-3 h-3 text-slate-400 dark:text-white/30" />
                          {prod.sku}
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(prod.sku, "SKU");
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 dark:text-white/40 hover:text-blue-600 dark:hover:text-blue-400 transition-opacity"
                          title="Copy SKU"
                        >
                          {copiedSku === prod.sku ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Product Name */}
                    <td className="py-3.5 px-3.5 text-slate-800 dark:text-white/80 font-medium max-w-xs truncate">
                      {prod.product_name || "—"}
                    </td>

                    {/* Dimensions (d x D x B) */}
                    <td className="py-3.5 px-3.5 text-center text-slate-700 dark:text-white/70 font-mono">
                      <span className="text-slate-900 dark:text-white font-semibold">{bore !== null && bore !== undefined ? `${bore}` : "—"}</span> ×{" "}
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">{outer !== null && outer !== undefined ? `${outer}` : "—"}</span> ×{" "}
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{width !== null && width !== undefined ? `${width}` : "—"}</span>{" "}
                      <span className="text-[10px] text-slate-400 dark:text-white/30">mm</span>
                    </td>

                    {/* Dynamic Load */}
                    <td className="py-3.5 px-3.5 text-center text-slate-800 dark:text-white/80 font-mono font-semibold">
                      {dyn !== null && dyn !== undefined ? `${dyn} kN` : "—"}
                    </td>

                    {/* Speed Limit */}
                    <td className="py-3.5 px-3.5 text-center text-slate-800 dark:text-white/80 font-mono">
                      {speed !== null && speed !== undefined ? (
                        <span>{Number(speed).toLocaleString()} rpm</span>
                      ) : (
                        <span className="text-slate-400 dark:text-white/25">—</span>
                      )}
                    </td>

                    {/* Confidence Gauge */}
                    <td className="py-3.5 px-3.5 min-w-[130px]" onClick={(e) => e.stopPropagation()}>
                      <ConfidenceBar confidence={prod.overall_confidence} />
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3.5" onClick={(e) => e.stopPropagation()}>
                      <StatusBadge status={prod.overall_status} />
                    </td>

                    {/* Row Actions */}
                    <td className="py-3.5 px-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {onCheckGaps && (
                          <button
                            onClick={() => onCheckGaps(prod.sku)}
                            className="p-1.5 rounded-full text-slate-400 dark:text-white/30 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
                            title="Diagnose Attribute Gaps & Recovery Sources"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onSelectField && onSelectField(prod.sku, "bore_diameter")}
                          className="p-1.5 rounded-full text-slate-400 dark:text-white/30 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors"
                          title="Inspect verbatim evidence citations"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/product/${encodeURIComponent(prod.sku)}`}
                          className="p-1.5 rounded-full text-slate-400 dark:text-white/30 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors"
                          title="Open SKU product intelligence page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Telemetry Footer */}
      <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.01] text-xs text-slate-500 dark:text-white/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span>
            Displaying <strong className="text-slate-900 dark:text-white font-mono">{filteredAndSorted.length}</strong> of <strong className="text-slate-900 dark:text-white font-mono">{products.length}</strong> SKUs
          </span>
          {effectiveStatusFilter !== "ALL" && (
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs">
              Filtered: {effectiveStatusFilter}
            </span>
          )}
        </div>
        <span className="text-slate-400 dark:text-white/30 text-[11px]">
          Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-white/70 font-mono">/</kbd> to search · Click any row to inspect proof
        </span>
      </div>
    </div>
  );
};
