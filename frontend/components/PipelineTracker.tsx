import React from "react";
import { FileText, Cpu, CheckCircle2, ShieldCheck, GitMerge, Download, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PipelineTrackerProps {
  activeStage?: number;
  className?: string;
}

const STAGES = [
  {
    step: "01",
    name: "PARSE",
    engine: "PDF & CSV Parser",
    tag: "DETERMINISTIC",
    latency: "< 4ms",
    icon: FileText,
    type: "deterministic",
  },
  {
    step: "02",
    name: "EXTRACT",
    engine: "Gemini 2.5 Flash",
    tag: "STRICT SCHEMA",
    latency: "~850ms",
    icon: Cpu,
    type: "ai",
  },
  {
    step: "03",
    name: "NORMALIZE",
    engine: "Pint Physics Engine",
    tag: "ZERO MATH ERROR",
    latency: "< 1ms",
    icon: CheckCircle2,
    type: "deterministic",
  },
  {
    step: "04",
    name: "VALIDATE",
    engine: "Physical Law Checker",
    tag: "Outer Ø > Bore Ø",
    latency: "< 1ms",
    icon: ShieldCheck,
    type: "deterministic",
  },
  {
    step: "05",
    name: "RESOLVE",
    engine: "Authority Arbiter",
    tag: "VERBATIM PROOF",
    latency: "< 2ms",
    icon: GitMerge,
    type: "trust",
  },
  {
    step: "06",
    name: "EXPORT",
    engine: "Commerce PIM / ERP",
    tag: "JSON / CSV SYNC",
    latency: "INSTANT",
    icon: Download,
    type: "commerce",
  },
];

export const PipelineTracker: React.FC<PipelineTrackerProps> = ({
  activeStage = 6,
  className,
}) => {
  return (
    <div className={cn("hud-panel rounded-2xl p-5", className)}>
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/[0.06] text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span className="font-semibold text-slate-200">
            Deterministic Pipeline Architecture
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">6-Stage Live Execution Spine</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 font-mono">
            Pipeline Latency: <strong className="text-sky-300">~858ms</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isComplete = idx + 1 <= activeStage;
          const isCurrent = idx + 1 === activeStage;

          return (
            <div
              key={stage.step}
              className={cn(
                "p-3.5 rounded-xl border flex flex-col justify-between transition-all relative overflow-hidden",
                isComplete
                  ? "bg-slate-900/60 border-white/[0.08] hover:border-sky-500/40 shadow-sm"
                  : "bg-slate-950/40 border-white/[0.03] opacity-40",
                isCurrent && "border-sky-500/60 bg-sky-950/20 shadow-[0_0_20px_rgba(56,189,248,0.1)] ring-1 ring-sky-500/30"
              )}
            >
              {/* Top Row: Stage Step + Latency */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-[11px] font-semibold text-sky-400">
                  {stage.step}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{stage.latency}</span>
              </div>

              {/* Middle: Icon & Title */}
              <div className="my-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon
                    className={cn(
                      "w-3.5 h-3.5",
                      stage.type === "ai"
                        ? "text-indigo-400"
                        : stage.type === "trust"
                        ? "text-sky-400"
                        : "text-emerald-400"
                    )}
                  />
                  <span className="font-semibold text-xs text-white">
                    {stage.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">{stage.engine}</p>
              </div>

              {/* Bottom Tag */}
              <div className="mt-2.5 pt-2 border-t border-white/[0.06]">
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-md block truncate text-center font-medium",
                    stage.type === "ai"
                      ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                      : stage.type === "trust"
                      ? "bg-sky-500/10 text-sky-300 border border-sky-500/20"
                      : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  )}
                >
                  {stage.tag}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
