"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  FileCode,
  Layers,
  Zap,
  Scale,
  Activity,
  Database,
  ExternalLink,
  ChevronRight,
  Check,
  Gauge,
} from "lucide-react";
import { CrucibleLogo } from "@/components/CrucibleLogo";

export default function LandingPage() {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);

  const lifecycleStages = [
    {
      num: "01",
      name: "INGEST",
      label: "Multi-Modal Intake",
      summary: "Ingests unstandardized distributor CSVs, ERP spreadsheets, and multi-page manufacturer engineering PDFs simultaneously.",
      badge: "Intake Plane",
      badgeColor: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20",
      recordState: {
        sku: "6205-2RSH",
        bore: '1" (unnormalized)',
        weight: "0.25 kg (gross legacy)",
        cr: "missing in CSV",
        status: "Raw Ingested",
        statusColor: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20",
      },
    },
    {
      num: "02",
      name: "EXTRACT",
      label: "Gemini 2.5 Structured Extract",
      summary: "Gemini 2.5 Flash extracts exact structured attributes from technical PDF pages with verbatim page citations and snippets.",
      badge: "LLM Extraction",
      badgeColor: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20",
      recordState: {
        sku: "6205-2RSH",
        bore: "25 mm (Page 2)",
        weight: "0.13 kg (Page 2, ISO 15)",
        cr: "14.8 kN (Page 2)",
        status: "Claims Extracted",
        statusColor: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20",
      },
    },
    {
      num: "03",
      name: "NORMALIZE",
      label: "Pint Unit Registry",
      summary: "Converts imperial fractions (1-1/4\"), European decimal commas (25,4 mm), and force units into canonical SI metrics with 0% math error.",
      badge: "Deterministic Math",
      badgeColor: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20",
      recordState: {
        sku: "6205-2RSH",
        bore: "25.0 mm (Exact Canonical)",
        weight: "0.13 kg (Normalized)",
        cr: "14.8 kN (SI Standard)",
        status: "Pint Verified",
        statusColor: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20",
      },
    },
    {
      num: "04",
      name: "VALIDATE",
      label: "Physical Constraint Checking",
      summary: "Executes non-negotiable physical law checks: Outer Diameter > Bore Diameter, Width <= Envelope, and Dynamic Load Cr >= Cor.",
      badge: "Physical Laws",
      badgeColor: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20",
      recordState: {
        sku: "6205-2RSH",
        bore: "d = 25.0 mm (Pass)",
        weight: "D = 52.0 mm (OD > d Pass)",
        cr: "Cr (14.8) >= C0 (7.8) (Pass)",
        status: "100% Validated",
        statusColor: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20",
      },
    },
    {
      num: "05",
      name: "RESOLVE",
      label: "Source Authority Arbitration",
      summary: "Manufacturer Datasheets (Authority 1.00) automatically outrank legacy distributor CSV dumps (Authority 0.60).",
      badge: "The Money Shot",
      badgeColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
      recordState: {
        sku: "6205-2RSH",
        bore: "25.0 mm (Auth 1.00 Winner)",
        weight: "0.13 kg (Datasheet > 0.25 kg CSV)",
        cr: "14.8 kN (Enriched & Verified)",
        status: "Auto-Resolved",
        statusColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
      },
    },
    {
      num: "06",
      name: "COMMERCE",
      label: "Commerce-Ready Export",
      summary: "Outputs standardized, evidence-grounded JSON and CSV catalogs directly consumable by SAP, BigCommerce, Shopify, and PIM systems.",
      badge: "Export Plane",
      badgeColor: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/20",
      recordState: {
        sku: "6205-2RSH",
        bore: "25.0 mm (100% Confidence)",
        weight: "0.13 kg (Net Mass ISO 15)",
        cr: "14.8 kN · 8,500 RPM",
        status: "Commerce Ready",
        statusColor: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/20",
      },
    },
  ];

  // Auto-advance lifecycle stage every 3.5 seconds if autoPlay is active
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setActiveStageIndex((prev) => (prev + 1) % lifecycleStages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [autoPlay, lifecycleStages.length]);

  const activeStage = lifecycleStages[activeStageIndex];

  return (
    <div className="space-y-16 py-6 animate-fade-in-up">
      {/* ═══ 1. CINEMATIC HERO SECTION ═══ */}
      <section className="relative text-center max-w-4xl mx-auto space-y-7 pt-8 pb-4">
        {/* Floating annotation markers */}
        <div className="hidden sm:flex absolute top-4 left-2 items-center gap-2 text-[10px] text-slate-400 dark:text-white/25">
          <span className="float-dot float-dot-green" />
          <span className="font-mono">Cortex · Ingestion</span>
        </div>
        <div className="hidden sm:flex absolute top-8 right-4 items-center gap-2 text-[10px] text-slate-400 dark:text-white/25">
          <span className="font-mono">Guard · Validation</span>
          <span className="float-dot float-dot-blue" />
        </div>

        {/* Brand Kicker */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-600 dark:text-white/60 font-medium">UniLog Hackathon 2026</span>
          <span className="text-slate-300 dark:text-white/20">·</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Industrial Intelligence Platform</span>
        </div>

        {/* Main Brand Title */}
        <div className="space-y-3">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.08]">
            CRUCIBLE
          </h1>
          <p className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:via-white/80 dark:to-white/40 dark:bg-clip-text tracking-tight">
            AI-Powered Product Intelligence for Industrial Commerce
          </p>
        </div>

        {/* Thesis Statement */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-white/45 max-w-2xl mx-auto leading-relaxed">
          Turn fragmented, noisy industrial catalogs into verified, commerce-ready intelligence.
          <span className="block text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            &quot;The AI reads. The code decides.&quot;
          </span>
        </p>

        {/* Multi-Source Convergence Visual */}
        <div className="pt-3 pb-2">
          <div className="inline-flex flex-col items-center">
            {/* Top Source Tags */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono text-slate-600 dark:text-white/60">
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08]">Messy CSVs</span>
              <span className="text-slate-400 dark:text-white/20">+</span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08]">PDF Datasheets</span>
              <span className="text-slate-400 dark:text-white/20">+</span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08]">ERP Dumps</span>
              <span className="text-slate-400 dark:text-white/20">+</span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08]">PIM Specs</span>
            </div>

            {/* Convergence arrow */}
            <div className="py-2 flex flex-col items-center text-slate-400 dark:text-white/20">
              <div className="w-px h-6 bg-gradient-to-b from-slate-300 dark:from-white/20 to-emerald-500/50" />
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest my-1">
                CRUCIBLE DETERMINISTIC ENGINE
              </span>
              <div className="w-px h-6 bg-gradient-to-b from-emerald-500/50 to-slate-300 dark:to-white/20" />
            </div>

            {/* Output Pillar Banner */}
            <div className="px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/[0.08] border border-emerald-200 dark:border-emerald-500/[0.2] text-emerald-800 dark:text-emerald-300 font-mono text-[11px] font-semibold flex items-center gap-2 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>STRUCTURE · NORMALIZE · VALIDATE · RESOLVE · ENRICH</span>
            </div>
          </div>
        </div>

        {/* Primary Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          {/* Primary High-Contrast Emerald Green CTA Button */}
          <Link
            href="/workspace"
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/50 hover:scale-[1.02] transition-all"
          >
            <span>ENTER WORKSPACE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/workspace"
            className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-white/[0.04] hover:bg-slate-50 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.1] text-slate-800 dark:text-white font-semibold rounded-full text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <span>LOAD 20-SKU BENCHMARK</span>
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </Link>
        </div>
      </section>

      {/* ═══ 2. INTERACTIVE 6-STAGE LIFECYCLE TRANSFORMATION ═══ */}
      <section className="crucible-card glow-blue p-6 sm:p-9 space-y-8">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Interactive Lifecycle Demonstration
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-[10px] text-slate-500 dark:text-white/40 font-mono">
                The 6 Transformation Stages
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Watch a Messy Industrial Record Become Verified Commerce Data
            </h2>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all border ${
                autoPlay
                  ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold"
                  : "border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-white/40"
              }`}
            >
              {autoPlay ? "● Auto-Playing" : "○ Paused"}
            </button>
          </div>
        </div>

        {/* Lifecycle Stage Tabs */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {lifecycleStages.map((st, idx) => (
            <button
              key={st.num}
              onClick={() => {
                setActiveStageIndex(idx);
                setAutoPlay(false);
              }}
              className={`p-3 rounded-xl text-left transition-all border flex flex-col justify-between space-y-1.5 ${
                activeStageIndex === idx
                  ? "bg-slate-100 dark:bg-white/[0.08] border-slate-300 dark:border-white/[0.2] shadow-sm scale-[1.02]"
                  : "bg-slate-50/50 dark:bg-white/[0.01] border-slate-200 dark:border-white/[0.06] hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-600 dark:text-white/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-500 dark:text-white/50">{st.num}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-medium border ${st.badgeColor}`}>
                  {st.name}
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white/90 truncate block">
                {st.label}
              </span>
            </button>
          ))}
        </div>

        {/* Active Stage Deep-Dive Visualizer */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Stage Explanation (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black font-mono text-slate-800 dark:text-white/80">
                {activeStage.num}
              </span>
              <div>
                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${activeStage.badgeColor}`}>
                  {activeStage.badge}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {activeStage.label}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-white/50 leading-relaxed">
              {activeStage.summary}
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-500 dark:text-white/30 font-mono">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" /> 100% Traceable Evidence
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold">
                <Zap className="w-3.5 h-3.5" /> 0.0% Math Hallucination
              </span>
            </div>
          </div>

          {/* Live Record Transformation Box (5 cols) */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200 dark:border-white/[0.06]">
              <span className="font-mono font-bold text-slate-900 dark:text-white/90">
                SKU: {activeStage.recordState.sku}
              </span>
              <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${activeStage.recordState.statusColor}`}>
                {activeStage.recordState.status}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded-lg bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-transparent">
                <span className="text-slate-500 dark:text-white/40">Bore (d):</span>
                <span className="text-slate-900 dark:text-white/90 font-medium">{activeStage.recordState.bore}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-transparent">
                <span className="text-slate-500 dark:text-white/40">Weight / Mass:</span>
                <span className="text-slate-900 dark:text-white/90 font-medium">{activeStage.recordState.weight}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-transparent">
                <span className="text-slate-500 dark:text-white/40">Dynamic Load (Cr):</span>
                <span className="text-slate-900 dark:text-white/90 font-medium">{activeStage.recordState.cr}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3. TECHNICAL PILLARS GRID ═══ */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
            Deterministic Architecture
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Why Industrial Commerce Requires Crucible
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 1 */}
          <div className="crucible-card hover-glow p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Source Authority Hierarchy
            </h3>
            <p className="text-xs text-slate-600 dark:text-white/40 leading-relaxed">
              When distributors claim 0.25 kg gross packaged weight and manufacturer engineering datasheets state 0.13 kg net mass, Crucible deterministic authority scoring (1.00 &gt; 0.60) resolves conflicts automatically.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="crucible-card hover-glow p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Pint Dimensional Algebra
            </h3>
            <p className="text-xs text-slate-600 dark:text-white/40 leading-relaxed">
              Eliminates LLM unit hallucination. All fractional inches (1&quot;, 1-1/4&quot;), European commas (25,4 mm), and force conversions (14,800 N → 14.8 kN) are computed deterministically in pure Python.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="crucible-card hover-glow p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Physical Law Verification
            </h3>
            <p className="text-xs text-slate-600 dark:text-white/40 leading-relaxed">
              Automated physical constraint validation checks that outer diameter exceeds bore diameter, width conforms to ISO 15/355 geometry envelopes, and dynamic ratings exceed static ratings.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 4. FOOTER CTA SECTION ═══ */}
      <section className="crucible-card glow-blue p-8 sm:p-12 text-center space-y-5">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Ready to Explore the Live Intelligence Workspace?
        </h2>
        <p className="text-sm text-slate-600 dark:text-white/50 max-w-lg mx-auto leading-relaxed">
          Inspect live candidate arbitration, explore forensic verbatim citations, and run live extraction on messy industrial catalogs.
        </p>
        <div className="pt-2">
          <Link
            href="/workspace"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full text-sm shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/50 transition-all hover:scale-105"
          >
            <span>Launch Crucible Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
