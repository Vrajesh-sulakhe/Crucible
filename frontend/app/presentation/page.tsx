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
  Sparkles,
  Zap,
} from "lucide-react";
import { CrucibleLogo } from "@/components/CrucibleLogo";

const SLIDES = [
  {
    id: 1,
    tag: "UNILOG HACKATHON 2026",
    title: "CRUCIBLE",
    subtitle: "AI-Powered Product Intelligence for Industrial Commerce",
    content: (
      <div className="space-y-6 text-center max-w-3xl mx-auto">
        <div className="flex justify-center mb-2">
          <CrucibleLogo size={56} showText={false} />
        </div>
        <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 shadow-sm">
          <p className="text-lg text-slate-900 dark:text-white leading-relaxed font-bold">
            Transforming messy industrial catalogs, complex PDF datasheets, and legacy ERP dumps into{" "}
            <strong className="text-blue-600 dark:text-blue-400">verifiable, accurate, and commerce-ready product intelligence</strong>.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 text-xs">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08]">
            <span className="text-blue-600 dark:text-blue-400 font-extrabold block text-base mb-1 font-mono">0% MATH ERROR</span>
            <span className="text-slate-600 dark:text-white/50 font-medium">Deterministic Pint Unit Conversions</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08]">
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold block text-base mb-1 font-mono">PHYSICAL LAWS</span>
            <span className="text-slate-600 dark:text-white/50 font-medium">Automated Engineering Bounds Check</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08]">
            <span className="text-amber-600 dark:text-amber-400 font-extrabold block text-base mb-1 font-mono">VERBATIM PROOF</span>
            <span className="text-slate-600 dark:text-white/50 font-medium">Page-Numbered Citation Audit Trail</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    tag: "THE PROBLEM",
    title: "The $100M Industrial Catalog Bottleneck",
    subtitle: "Why manual industrial onboarding breaks at scale",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-left max-w-4xl mx-auto">
        <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 flex items-center justify-center font-bold font-mono">
            01
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Discrepant Multi-Source Claims</h3>
          <p className="text-slate-600 dark:text-white/60 leading-relaxed">
            Distributor catalogs quote gross packed weight (0.25 kg); engineering datasheets quote net mass (0.13 kg). Naive ingestion leads to massive catalog errors.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold font-mono">
            02
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Unit & Format Hallucinations</h3>
          <p className="text-slate-600 dark:text-white/60 leading-relaxed">
            Imperial fractions (1-1/4&quot;), European decimal commas (25,4 mm), and force vs mass (kN vs kg) cause LLMs to invent incorrect engineering specifications.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold font-mono">
            03
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Missing Auditability & Trust</h3>
          <p className="text-slate-600 dark:text-white/60 leading-relaxed">
            Industrial buyers require exact page-level PDF proof before ordering critical engineering components into mission-critical machinery.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    tag: "THE ARCHITECTURE",
    title: "The AI Reads. The Code Decides.",
    subtitle: "Hybrid Deterministic Architecture",
    content: (
      <div className="max-w-4xl mx-auto space-y-5 text-xs text-left">
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
              1. Perception Plane (Gemini 2.5)
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Structured Multimodal Extraction</h4>
            <p className="text-slate-600 dark:text-white/60 leading-relaxed">
              Extracts dimensional attributes, mechanical ratings, and page-numbered verbatim snippets from complex engineering PDFs and table layouts.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              2. Trust Plane (Python Core)
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Pure Deterministic Verification</h4>
            <p className="text-slate-600 dark:text-white/60 leading-relaxed">
              Pint unit dimensional algebra, ISO envelope geometric constraints, and Source Authority hierarchy (Datasheet 1.0 &gt; CSV 0.60).
            </p>
          </div>
        </div>
      </div>
    ),
  },
];

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, SLIDES.length - 1));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <div className="min-h-[85vh] flex flex-col justify-between space-y-6">
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <Link
          href="/workspace"
          className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-white/70 hover:text-slate-950 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Home className="w-4 h-4" />
          Workspace
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 dark:text-white/40 font-mono font-bold">
            Slide {currentSlide + 1} of {SLIDES.length}
          </span>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/[0.04] p-1 rounded-full border border-slate-200 dark:border-white/[0.08] shadow-xs">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/[0.08] disabled:opacity-30 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlide === SLIDES.length - 1}
              className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/[0.08] disabled:opacity-30 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="crucible-card p-8 sm:p-12 flex-1 flex flex-col justify-center animate-in fade-in duration-300">
        <div className="text-center mb-8 space-y-2.5">
          <span className="text-xs px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300 font-bold uppercase tracking-wider">
            {slide.tag}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {slide.title}
          </h1>
          <p className="text-sm text-slate-600 dark:text-white/50 max-w-xl mx-auto font-medium">
            {slide.subtitle}
          </p>
        </div>

        {slide.content}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-3.5 border-t border-slate-200 dark:border-white/[0.06] text-xs text-slate-500 dark:text-white/40">
        <span>Use Left/Right arrow keys or spacebar to navigate</span>
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentSlide ? "bg-blue-600 dark:bg-white w-7" : "bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40 w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
