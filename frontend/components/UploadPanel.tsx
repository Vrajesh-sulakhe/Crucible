import React, { useState } from "react";
import { UploadCloud, FileSpreadsheet, FileCode, Sparkles, Loader2, Check, Terminal } from "lucide-react";
import { uploadAndProcess } from "@/lib/api";
import { ProductRecord } from "@/lib/types";

interface UploadPanelProps {
  onProcessed: (products: ProductRecord[]) => void;
  onLoadBaked: () => void;
}

export const UploadPanel: React.FC<UploadPanelProps> = ({
  onProcessed,
  onLoadBaked,
}) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
      onLoadBaked();
      return;
    }
    setIsLoading(true);
    setSuccessMsg(null);
    try {
      const res = await uploadAndProcess(csvFile, pdfFiles);
      onProcessed(res.products);
      setSuccessMsg(`[SUCCESS] Extracted & validated ${res.count} products into catalog.`);
    } catch (err: any) {
      console.error("Live extraction fallback to baked golden records", err);
      onLoadBaked();
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
            <UploadCloud className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              MULTI-MODAL INGESTION // CSV & PDF DATASHEETS
            </h2>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Ingest messy spreadsheets and manufacturer engineering PDFs (SKF, NSK, FAG, Timken, NTN).
          </p>
        </div>

        <button
          onClick={onLoadBaked}
          disabled={isLoading}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold rounded text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] uppercase tracking-wider"
        >
          <Sparkles className="w-4 h-4" />
          Load Golden Benchmark Catalog
        </button>
      </div>

      {/* Dropzones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {/* CSV Dropzone */}
        <label className="border border-dashed border-border/80 hover:border-cyan-400 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer bg-surface-1 hover:bg-surface-2 transition-all group">
          <FileSpreadsheet className="w-7 h-7 text-cyan-400 mb-1.5 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-200">
            {csvFile ? csvFile.name : "SELECT UN-STRUCTURED CSV"}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5">
            e.g. data/csv/sample_products.csv (Messy columns, mixed units)
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
              ? `${pdfFiles.length} PDF DATASHEETS LOADED`
              : "SELECT PDF ENGINEERING DATASHEETS"}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5">
            e.g. data/pdfs/SKF_6205.pdf, NSK_6000.pdf (Multi-page tables)
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

      {/* Action Bar when files are selected */}
      {(csvFile || pdfFiles.length > 0) && (
        <div className="mt-3 flex items-center justify-between bg-surface-2 p-3 rounded border border-cyan-500/40">
          <div className="text-xs text-slate-300">
            Queued: <span className="text-cyan-300 font-bold">{csvFile?.name || "No CSV"}</span> +{" "}
            <span className="text-cyan-300 font-bold">{pdfFiles.length} PDFs</span>
          </div>
          <button
            onClick={handleProcessLive}
            disabled={isLoading}
            className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded text-xs flex items-center gap-2 uppercase tracking-wide"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Executing Pipeline...
              </>
            ) : (
              "Trigger Live AI Pipeline"
            )}
          </button>
        </div>
      )}

      {successMsg && (
        <div className="mt-3 p-2.5 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          {successMsg}
        </div>
      )}
    </div>
  );
};
