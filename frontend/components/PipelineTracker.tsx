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
    <div className={cn("hud-panel corner-bracket rounded-lg p-4 font-mono", className)}>
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/70 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm bg-cyan-400 animate-pulse" />
          <span className="font-bold tracking-wider text-slate-300 uppercase">
            Execution Pipeline Architecture // 6-Stage Deterministic Flow
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span className="px-2 py-0.5 rounded bg-surface-card border border-border/80 text-cyan-300">
            TOTAL PIPELINE LATENCY: ~858ms
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 relative">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isComplete = idx + 1 <= activeStage;
          const isCurrent = idx + 1 === activeStage;

          return (
            <div
              key={stage.step}
              className={cn(
                "p-3 rounded border flex flex-col justify-between transition-all relative overflow-hidden",
                isComplete
                  ? "bg-surface/90 border-border hover:border-cyan-500/50"
                  : "bg-surface/30 border-border/30 opacity-50",
                isCurrent && "border-cyan-400 bg-surface-raised shadow-[0_0_15px_rgba(0,240,255,0.15)]"
              )}
            >
              {/* Top Row: Stage Step + Latency */}
              <div className="flex items-center justify-between text-[10px] mb-2">
                <span className="font-bold text-cyan-400">[{stage.step}]</span>
                <span className="text-slate-500">{stage.latency}</span>
              </div>

              {/* Middle: Icon & Title */}
              <div className="my-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Icon
                    className={cn(
                      "w-3.5 h-3.5",
                      stage.type === "ai"
                        ? "text-purple-400"
                        : stage.type === "trust"
                        ? "text-cyan-400"
                        : "text-emerald-400"
                    )}
                  />
                  <span className="font-bold text-xs text-white tracking-wide">
                    {stage.name}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">{stage.engine}</p>
              </div>

              {/* Bottom Tag */}
              <div className="mt-2 pt-2 border-t border-border/50">
                <span
                  className={cn(
                    "text-[9px] px-1.5 py-0.5 rounded block truncate text-center font-bold tracking-tight",
                    stage.type === "ai"
                      ? "bg-purple-950/80 text-purple-300 border border-purple-800/40"
                      : stage.type === "trust"
                      ? "bg-cyan-950/80 text-cyan-300 border border-cyan-800/40"
                      : "bg-emerald-950/80 text-emerald-300 border border-emerald-800/40"
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
