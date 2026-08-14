import React, { useState } from "react";
import { UploadCloud, FileSpreadsheet, FileCode, Sparkles, Loader2, Check, Zap, RotateCcw } from "lucide-react";
import { uploadAndProcess, resetCatalog } from "@/lib/api";
import { ProductRecord } from "@/lib/types";

interface UploadPanelProps {
  onProcessed: (products: ProductRecord[]) => void;
  onReset: () => void;
}

export const UploadPanel: React.FC<UploadPanelProps> = ({
  onProcessed,
  onReset,
}) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "info" | "error" } | null>(null);

  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdfFiles(Array.from(e.target.files));
    }
  };

  const handleProcessLive = async () => {
    if (!csvFile && pdfFiles.length === 0) {
      setStatusMsg({ text: "Please select a CSV catalog or PDF datasheet first.", type: "info" });
      return;
    }
    setIsLoading(true);
    setStatusMsg({ text: "Processing files live with Gemini 2.5 Flash + Pint normalizer...", type: "info" });
    try {
      const res = await uploadAndProcess(csvFile, pdfFiles);
      onProcessed(res.products);
      setStatusMsg({
        text: `[LIVE EXTRACTION COMPLETE] Successfully processed ${res.count} products from uploaded files.`,
        type: "success",
      });
    } catch (err: any) {
      console.error("Live extraction error", err);
      setStatusMsg({
        text: `[ERROR] Live extraction failed: ${err.message || "Unknown error"}. Check API connection.`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunSampleLive = async () => {
    setIsLoading(true);
    setStatusMsg({ text: "Loading sample CSV & PDF into live Gemini 2.5 pipeline...", type: "info" });
    try {
      // Create sample files in memory
      const sampleCsvText = `sku,product_name,category,bore_diameter,outer_diameter,width,weight,dynamic_load_rating,limiting_speed
6205-2RSH,SKF Deep Groove Ball Bearing,Bearings,25 mm,52 mm,15 mm,0.13 kg,14.8 kN,8500 rpm
6000-ZZ,NSK Miniature Ball Bearing,Bearings,10 mm,26 mm,8 mm,19 g,4750 N,22000 rpm
32005-X,Timken Tapered Roller Bearing,Bearings,25 mm,47 mm,15 mm,0.11 kg,28.5 kN,10000 rpm
6308-2RS,FAG Deep Groove Bearing,Bearings,40 mm,90 mm,23 mm,0.64 kg,40.5 kN,5600 rpm`;

      const csvBlob = new Blob([sampleCsvText], { type: "text/csv" });
      const sampleCsv = new File([csvBlob], "sample_industrial_catalog.csv", { type: "text/csv" });

      const res = await uploadAndProcess(sampleCsv, []);
      onProcessed(res.products);
      setStatusMsg({
        text: `[LIVE PIPELINE SUCCESS] Extracted & normalized ${res.count} products in real time!`,
        type: "success",
      });
    } catch (err: any) {
      console.error("Sample pipeline error", err);
      setStatusMsg({
        text: `Live pipeline error: ${err.message}`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToBenchmark = async () => {
    setIsLoading(true);
    try {
      const res = await resetCatalog();
      onProcessed(res.products);
      setStatusMsg({
        text: "[BENCHMARK RESTORED] Catalog reset to verified ground-truth golden dataset.",
        type: "success",
      });
      onReset();
    } catch (err: any) {
      console.error("Reset error", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="hud-panel corner-bracket rounded-lg p-5 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              LIVE INGESTION CONSOLE // GEMINI 2.5 FLASH ENGINE
            </h2>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Drop messy CSV spreadsheets or PDF engineering datasheets to run live extraction, normalization, and validation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunSampleLive}
            disabled={isLoading}
            className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold rounded text-[11px] flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)] uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Run Live Sample Pipeline
          </button>

          <button
            onClick={handleResetToBenchmark}
            disabled={isLoading}
            className="px-3 py-1.5 bg-surface-1 hover:bg-surface-2 border border-border/80 text-slate-300 hover:text-white rounded text-[11px] flex items-center gap-1.5 transition-all uppercase"
            title="Reset catalog to golden baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Baseline
          </button>
        </div>
      </div>

      {/* Dropzones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {/* CSV Dropzone */}
        <label className="border border-dashed border-border/80 hover:border-cyan-400 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer bg-surface-1 hover:bg-surface-2 transition-all group">
          <FileSpreadsheet className="w-7 h-7 text-cyan-400 mb-1.5 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-200">
            {csvFile ? csvFile.name : "SELECT UN-STRUCTURED CSV FILE"}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5">
            {csvFile ? `${(csvFile.size / 1024).toFixed(1)} KB` : "Supports arbitrary column names (OD, d, WT, Cr)"}
          </span>
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvChange}
            className="hidden"
          />
        </label>

        {/* PDF Dropzone */}
        <label className="border border-dashed border-border/80 hover:border-cyan-400 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer bg-surface-1 hover:bg-surface-2 transition-all group">
          <FileCode className="w-7 h-7 text-cyan-400 mb-1.5 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-200">
            {pdfFiles.length > 0
              ? `${pdfFiles.length} PDF DATASHEETS SELECTED`
              : "SELECT PDF DATASHEETS (MULTI-PAGE)"}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5">
            {pdfFiles.length > 0
              ? pdfFiles.map((f) => f.name).join(", ").slice(0, 45) + "..."
              : "Extracts tables, drawings, and text with page grounding"}
          </span>
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={handlePdfChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Action Trigger Bar */}
      {(csvFile || pdfFiles.length > 0) && (
        <div className="mt-3 flex items-center justify-between bg-surface-2 p-3 rounded border border-cyan-500/40 animate-in fade-in">
          <div className="text-xs text-slate-300">
            Selected: <span className="text-cyan-300 font-bold">{csvFile?.name || "No CSV"}</span> +{" "}
            <span className="text-cyan-300 font-bold">{pdfFiles.length} PDFs</span>
          </div>
          <button
            onClick={handleProcessLive}
            disabled={isLoading}
            className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded text-xs flex items-center gap-2 uppercase tracking-wide transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Executing Live AI Pipeline...
              </>
            ) : (
              "⚡ Process Files Live"
            )}
          </button>
        </div>
      )}

      {statusMsg && (
        <div
          className={`mt-3 p-2.5 rounded text-xs flex items-center gap-2 font-mono ${
            statusMsg.type === "success"
              ? "bg-emerald-950/40 border border-emerald-500/40 text-emerald-300"
              : statusMsg.type === "error"
              ? "bg-rose-950/40 border border-rose-500/40 text-rose-300"
              : "bg-cyan-950/40 border border-cyan-500/40 text-cyan-300"
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          ) : statusMsg.type === "success" ? (
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <Zap className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}
    </div>
  );
};
