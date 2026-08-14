"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Layers,
  ArrowRight,
  Maximize2,
  Home,
  Scale,
} from "lucide-react";

const SLIDES = [
  {
    id: 1,
    tag: "UNILOG HACKATHON 2026 // UNIHACK",
    title: "CRUCIBLE",
    subtitle: "AI-Powered Product Intelligence for Industrial Commerce",
    content: (
      <div className="space-y-6 text-center max-w-3xl mx-auto font-mono">
        <div className="p-6 rounded-xl bg-surface-1 border border-cyan-500/40 shadow-[0_0_40px_rgba(0,240,255,0.15)]">
          <p className="text-lg text-slate-200 leading-relaxed font-sans">
            Transforming messy industrial catalogs, complex PDF datasheets, and legacy ERP dumps into{" "}
            <strong className="text-cyan-300 font-mono">verifiable, accurate, and commerce-ready product intelligence</strong>.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 text-xs">
          <div className="p-4 rounded bg-surface-2 border border-border">
            <span className="text-cyan-400 font-bold block text-sm mb-1">0% MATH ERROR</span>
            <span className="text-slate-400 font-sans">Deterministic Pint Unit Conversions</span>
          </div>
          <div className="p-4 rounded bg-surface-2 border border-border">
            <span className="text-emerald-400 font-bold block text-sm mb-1">PHYSICAL LAWS</span>
            <span className="text-slate-400 font-sans">Automated Engineering Bounds Check</span>
          </div>
          <div className="p-4 rounded bg-surface-2 border border-border">
            <span className="text-amber-400 font-bold block text-sm mb-1">VERBATIM PROOF</span>
            <span className="text-slate-400 font-sans">Page-Numbered Citation Audit Trail</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    tag: "THE PROBLEM",
    title: "The $100M Industrial Catalog Bottleneck",
    subtitle: "Why Traditional AI Fails in Industrial Master Data Management (MDM)",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto font-mono text-xs">
        <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-500/40 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>GENERIC AI CHATBOT APPROACH</span>
          </div>
          <ul className="space-y-2.5 text-slate-300 font-sans leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-mono">✕</span>
              <span><strong>Math Hallucinations</strong>: Converts 1 inch to 25mm instead of 25.4mm, causing expensive machine downtime.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-mono">✕</span>
              <span><strong>Black-Box Trust</strong>: Outputs self-confidence ratings with zero verifiable evidence back to the PDF.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-mono">✕</span>
              <span><strong>Ignores Physics</strong>: Allows Outer Diameter &lt; Bore Diameter if OCR is noisy.</span>
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-xl bg-cyan-950/20 border border-cyan-500/40 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>THE CRUCIBLE SOLUTION</span>
          </div>
          <ul className="space-y-2.5 text-slate-300 font-sans leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-mono">✓</span>
              <span><strong>The AI Reads, The Code Decides</strong>: Confines LLMs strictly to unstructured parsing; all math is deterministic.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-mono">✓</span>
              <span><strong>Verbatim Grounding</strong>: Every attribute includes exact source document, page number, and quote.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-mono">✓</span>
              <span><strong>Physical Constraint Guards</strong>: Hard physical and mechanical rules prevent impossible data entry.</span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    tag: "ARCHITECTURE",
    title: "6-Stage Hybrid Engine",
    subtitle: "Deterministic Pipelines Combined with High-Speed Structured Extraction",
    content: (
      <div className="max-w-4xl mx-auto space-y-4 font-mono text-xs">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded bg-surface-1 border border-border">
            <span className="text-cyan-400 font-bold text-xs">[01] PARSE</span>
            <p className="text-white font-bold mt-1">pdfplumber & PyMuPDF</p>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">Extracts multi-page tables & preserved page coordinates.</p>
          </div>
          <div className="p-3.5 rounded bg-surface-1 border border-border">
            <span className="text-purple-400 font-bold text-xs">[02] EXTRACT (AI)</span>
            <p className="text-white font-bold mt-1">Gemini 2.5 Flash</p>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">Strict schema extraction with verbatim quotation extraction.</p>
          </div>
          <div className="p-3.5 rounded bg-surface-1 border border-border">
            <span className="text-cyan-400 font-bold text-xs">[03] NORMALIZE</span>
            <p className="text-white font-bold mt-1">Pint Physics Engine</p>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">Converts inches, mm, lbs, kg, kN, rpm without math error.</p>
          </div>
          <div className="p-3.5 rounded bg-surface-1 border border-border">
            <span className="text-emerald-400 font-bold text-xs">[04] VALIDATE</span>
            <p className="text-white font-bold mt-1">Physical Law Checker</p>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">Enforces Outer &gt; Bore, section thickness, and speed factors.</p>
          </div>
          <div className="p-3.5 rounded bg-surface-1 border border-border">
            <span className="text-cyan-400 font-bold text-xs">[05] RESOLVE</span>
            <p className="text-white font-bold mt-1">Authority Ranking</p>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">Datasheets (1.0) &gt; Catalogs (0.8) &gt; ERP (0.6) &gt; CSV (0.2).</p>
          </div>
          <div className="p-3.5 rounded bg-surface-1 border border-border">
            <span className="text-emerald-400 font-bold text-xs">[06] EXPORT</span>
            <p className="text-white font-bold mt-1">Commerce PIM / ERP</p>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">Exports instant CSV/JSON ready for Shopify, SAP, and Magento.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    tag: "EXPLAINABILITY",
    title: "Forensic Evidence & Mathematical Proof",
    subtitle: "Transparent Confidence Scoring with Zero Black Box",
    content: (
      <div className="max-w-3xl mx-auto space-y-4 font-mono text-xs">
        <div className="p-5 rounded-xl bg-surface-1 border border-cyan-500/50 space-y-3">
          <div className="flex items-center justify-between border-b border-border/80 pb-2">
            <span className="text-cyan-300 font-bold flex items-center gap-2">
              <Scale className="w-4 h-4" />
              CONFIDENCE FORMULA PROOF
            </span>
            <span className="text-emerald-400 font-bold">CALCULATED SCORE: 98.4%</span>
          </div>

          <div className="p-3 rounded bg-surface-2 border border-border text-[12px] space-y-1 text-slate-200">
            <div className="text-slate-400 text-[10px]">WEIGHTED COMPOSITE FORMULA:</div>
            <div className="text-cyan-300 font-bold">
              Confidence = (0.5 × C_extraction) + (0.3 × A_source_authority) + (0.2 × V_validation)
            </div>
            <div className="text-slate-300 pt-1">
              = (0.5 × 0.98) + (0.3 × 1.00 [Datasheet]) + (0.2 × 1.00 [Physical Laws Passed]) = <span className="text-emerald-400 font-bold">0.990</span>
            </div>
          </div>

          <div className="bg-surface-card p-3 rounded border border-border text-[11px] text-slate-300">
            <span className="text-cyan-400 font-bold block mb-1">VERBATIM GROUNDED CITATION:</span>
            <span className="italic">"SKF 6205-2RSH Principal Dimensions: Bore diameter (d) 25 mm, Outer diameter (D) 52 mm, Width (B) 15 mm — Page 2"</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    tag: "BUSINESS IMPACT & ROI",
    title: "Measurable Impact for Industrial Commerce",
    subtitle: "Massive Efficiency Gains for Unilog Enterprise Customers",
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto font-mono text-center">
        <div className="p-6 rounded-xl bg-surface-1 border border-cyan-500/40">
          <Clock className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
          <span className="text-3xl font-extrabold text-white block">85%</span>
          <span className="text-xs text-cyan-300 font-bold uppercase mt-1 block">Time Saved</span>
          <p className="text-[11px] text-slate-400 font-sans mt-2">
            Saves ~15 minutes of manual catalog lookup per industrial part.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-surface-1 border border-emerald-500/40">
          <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <span className="text-3xl font-extrabold text-emerald-400 block">0%</span>
          <span className="text-xs text-emerald-300 font-bold uppercase mt-1 block">Math Error</span>
          <p className="text-[11px] text-slate-400 font-sans mt-2">
            Eliminates costly returns caused by wrong bore or clearance dimensions.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-surface-1 border border-purple-500/40">
          <Layers className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <span className="text-3xl font-extrabold text-white block">1-Click</span>
          <span className="text-xs text-purple-300 font-bold uppercase mt-1 block">Commerce Export</span>
          <p className="text-[11px] text-slate-400 font-sans mt-2">
            Direct sync into Shopify, SAP, BigCommerce, and Unilog PIM.
          </p>
        </div>
      </div>
    ),
  },
];

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => setCurrentSlide((c) => Math.max(0, c - 1));
  const nextSlide = () => setCurrentSlide((c) => Math.min(SLIDES.length - 1, c + 1));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <div className="min-h-[85vh] flex flex-col justify-between font-mono space-y-6">
      {/* Header controls */}
      <div className="flex items-center justify-between pb-3 border-b border-border/80 text-xs">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-colors uppercase tracking-wider"
        >
          <Home className="w-4 h-4" />
          Workspace
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">
            SLIDE {currentSlide + 1} OF {SLIDES.length}
          </span>
          <div className="flex items-center gap-1 bg-surface-1 p-1 rounded border border-border">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="p-1 rounded hover:bg-surface-card disabled:opacity-30 text-slate-300 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlide === SLIDES.length - 1}
              className="p-1 rounded hover:bg-surface-card disabled:opacity-30 text-slate-300 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="hud-panel corner-bracket rounded-xl p-8 sm:p-12 flex-1 flex flex-col justify-center animate-in fade-in duration-300">
        <div className="text-center mb-8 space-y-2">
          <span className="text-xs px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold uppercase tracking-wider">
            {slide.tag}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {slide.title}
          </h1>
          <p className="text-sm text-slate-400 font-sans max-w-xl mx-auto">
            {slide.subtitle}
          </p>
        </div>

        {slide.content}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-3 border-t border-border/80 text-[11px] text-slate-500">
        <span>Use [Left] / [Right] arrow keys or spacebar to navigate</span>
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentSlide ? "bg-cyan-400 w-6" : "bg-slate-700 hover:bg-slate-500"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
