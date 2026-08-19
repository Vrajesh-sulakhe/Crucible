"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  FileCode,
  Sparkles,
  Loader2,
  Check,
  Zap,
  RotateCcw,
  Activity,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
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
  const [activeStage, setActiveStage] = useState<number>(0);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "info" | "error" } | null>(null);

  const stages = [
    "1. Multi-Source Intake & Ingestion",
    "2. Gemini 2.5 Structured Extraction",
    "3. Pint Unit Algebra Normalization",
    "4. Cross-Field Physical Law Validation",
    "5. Authority Conflict Arbitration",
    "6. Commerce Store Commit",
  ];

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

  const simulateStagesAndProcess = async (processFn: () => Promise<{ products: ProductRecord[]; count: number }>) => {
    setIsLoading(true);
    setActiveStage(1);
    setStatusMsg({ text: "Parsing multi-source inputs...", type: "info" });

    // Step through pipeline stages visually
    const timer1 = setTimeout(() => { setActiveStage(2); setStatusMsg({ text: "Gemini 2.5 Flash extracting structured specifications with citations...", type: "info" }); }, 400);
    const timer2 = setTimeout(() => { setActiveStage(3); setStatusMsg({ text: "Pint dimensional algebra normalizing imperial & metric units...", type: "info" }); }, 900);
    const timer3 = setTimeout(() => { setActiveStage(4); setStatusMsg({ text: "Validating geometry against ISO physical envelopes...", type: "info" }); }, 1400);
    const timer4 = setTimeout(() => { setActiveStage(5); setStatusMsg({ text: "Arbitrating source authority conflicts...", type: "info" }); }, 1800);

    try {
      const res = await processFn();
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      setActiveStage(6);

      onProcessed(res.products);
      setStatusMsg({
        text: `[PIPELINE COMPLETE] Successfully processed & verified ${res.count} products live.`,
        type: "success",
      });
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      setActiveStage(0);
      console.error("Live extraction error", err);
      setStatusMsg({
        text: `[ERROR] Live extraction failed: ${err.message || "Unknown error"}. Check backend connection.`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessLive = async () => {
    if (!csvFile && pdfFiles.length === 0) {
      setStatusMsg({ text: "Please select a CSV catalog or PDF datasheet first.", type: "info" });
      return;
    }
    await simulateStagesAndProcess(() => uploadAndProcess(csvFile, pdfFiles));
  };

  const handleRunSampleLive = async () => {
    await simulateStagesAndProcess(async () => {
      const sampleCsvText = `sku,product_name,category,bore_diameter,outer_diameter,width,weight,dynamic_load_rating,limiting_speed
6205-2RSH,SKF Deep Groove Ball Bearing,Bearings,25 mm,52 mm,15 mm,0.25 kg,14.8 kN,8500 rpm
6000-ZZ,NSK Miniature Ball Bearing,Bearings,10 mm,26 mm,8 mm,19 g,4750 N,22000 rpm
32005-X,Timken Tapered Roller Bearing,Bearings,25 mm,50 mm,15 mm,0.11 kg,28.5 kN,10000 rpm
6308-2RS,FAG Deep Groove Bearing,Bearings,40 mm,90 mm,23 mm,0.64 kg,40.5 kN,5600 rpm
UCP205-16,Dodge Pillow Block Unit,Mounted Units,1",5.5 in,1.5 in,1.8 lbs,,5000 rpm`;

      const csvBlob = new Blob([sampleCsvText], { type: "text/csv" });
      const sampleCsv = new File([csvBlob], "sample_industrial_catalog.csv", { type: "text/csv" });
      return uploadAndProcess(sampleCsv, []);
    });
  };

  const handleResetToBenchmark = async () => {
    setIsLoading(true);
    setActiveStage(0);
    try {
      const res = await resetCatalog();
      onProcessed(res.products);
      setStatusMsg({
        text: "[BENCHMARK RESTORED] Catalog reset to verified ground-truth 20-SKU golden benchmark.",
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
    <div className="crucible-card glow-blue p-6 sm:p-7 space-y-6">
      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
              <Zap className="w-4 h-4" />
            </div>
            <h2 className="text-[15px] font-bold text-slate-900 dark:text-white tracking-tight">
              Live Input Sources & Ingestion Pipeline
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-white/40 mt-1 max-w-xl">
            Multi-modal intake combining messy distributor spreadsheets with technical manufacturer engineering datasheets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunSampleLive}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-white/[0.08] dark:hover:bg-white/[0.14] border border-blue-600 dark:border-white/[0.12] text-white font-semibold rounded-full text-xs flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 dark:text-amber-400" />
            Run Sample Live Pipeline
          </button>

          <button
            onClick={handleResetToBenchmark}
            disabled={isLoading}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-transparent dark:hover:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-white/50 dark:hover:text-white/80 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            title="Reset catalog to golden baseline"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-white/40" />
            Reset Baseline (20 SKUs)
          </button>
        </div>
      </div>

      {/* Dropzones */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CSV Dropzone */}
        <label className="border border-dashed border-slate-300 dark:border-white/[0.1] hover:border-blue-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50 dark:bg-white/[0.01] hover:bg-blue-50/50 dark:hover:bg-blue-500/[0.03] transition-all group shadow-xs">
          <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-105 transition-transform">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {csvFile ? csvFile.name : "ERP / Distributor Catalog (CSV)"}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-white/40 mt-0.5 text-center">
            {csvFile ? `${(csvFile.size / 1024).toFixed(1)} KB` : "Messy CSV product records (OD, d, WT, Cr)"}
          </span>
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvChange}
            className="hidden"
          />
        </label>

        {/* PDF Dropzone */}
        <label className="border border-dashed border-slate-300 dark:border-white/[0.1] hover:border-indigo-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50 dark:bg-white/[0.01] hover:bg-indigo-50/50 dark:hover:bg-indigo-500/[0.03] transition-all group shadow-xs">
          <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-105 transition-transform">
            <FileCode className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {pdfFiles.length > 0
              ? `${pdfFiles.length} PDF Datasheet(s) Selected`
              : "Manufacturer Technical Datasheets (PDF)"}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-white/40 mt-0.5 text-center">
            {pdfFiles.length > 0
              ? pdfFiles.map((f) => f.name).join(", ").slice(0, 45) + "..."
              : "Technical PDF specifications with verbatim citations"}
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

      {/* Live Pipeline Stepper during loading */}
      {isLoading && (
        <div className="relative z-10 p-4.5 rounded-2xl bg-blue-50 dark:bg-blue-500/[0.04] border border-blue-200 dark:border-blue-500/[0.15] space-y-3 animate-fade-in-up">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-blue-700 dark:text-blue-400 font-bold flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Live Pipeline Execution in Progress...
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-white/40">
              Stage {activeStage} of 6
            </span>
          </div>

          <div className="grid grid-cols-6 gap-1.5">
            {stages.map((stageName, idx) => (
              <div
                key={stageName}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeStage > idx + 1
                    ? "bg-emerald-500"
                    : activeStage === idx + 1
                    ? "bg-blue-600 dark:bg-blue-400 animate-pulse"
                    : "bg-slate-200 dark:bg-white/[0.08]"
                }`}
              />
            ))}
          </div>

          <p className="text-[11px] text-slate-700 dark:text-white/60 font-mono">
            {stages[activeStage - 1] || "Initializing pipeline..."}
          </p>
        </div>
      )}

      {/* Action Trigger Bar */}
      {(csvFile || pdfFiles.length > 0) && !isLoading && (
        <div className="relative z-10 flex items-center justify-between bg-blue-50 dark:bg-white/[0.03] p-4 rounded-2xl border border-blue-200 dark:border-white/[0.08]">
          <div className="text-xs text-slate-800 dark:text-white/80 font-medium">
            Ready to process: <span className="font-bold text-slate-950 dark:text-white">{csvFile?.name || "No CSV"}</span> +{" "}
            <span className="font-bold text-slate-950 dark:text-white">{pdfFiles.length} PDF(s)</span>
          </div>
          <button
            onClick={handleProcessLive}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/30"
          >
            ⚡ Process Files Live
          </button>
        </div>
      )}

      {/* Status Message */}
      {statusMsg && !isLoading && (
        <div
          className={`relative z-10 p-3.5 rounded-2xl text-xs flex items-center gap-2.5 ${
            statusMsg.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-500/[0.06] border border-emerald-200 dark:border-emerald-500/[0.15] text-emerald-800 dark:text-emerald-400"
              : statusMsg.type === "error"
              ? "bg-rose-50 dark:bg-rose-500/[0.06] border border-rose-200 dark:border-rose-500/[0.15] text-rose-800 dark:text-rose-400"
              : "bg-blue-50 dark:bg-blue-500/[0.06] border border-blue-200 dark:border-blue-500/[0.15] text-blue-800 dark:text-blue-400"
          }`}
        >
          {statusMsg.type === "success" ? (
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          )}
          <span className="font-semibold">{statusMsg.text}</span>
        </div>
      )}
    </div>
  );
};
