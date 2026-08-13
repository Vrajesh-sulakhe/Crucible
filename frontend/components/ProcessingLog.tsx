import React from "react";
import { Terminal, Check, Info } from "lucide-react";

interface LogEntry {
  stage: string;
  message: string;
  type?: "info" | "success" | "warn";
}

interface ProcessingLogProps {
  logs: LogEntry[];
  className?: string;
}

export const ProcessingLog: React.FC<ProcessingLogProps> = ({ logs, className }) => {
  return (
    <div className={`glass-panel rounded-xl p-4 font-mono text-xs ${className}`}>
      <div className="flex items-center gap-2 text-slate-400 pb-2 mb-3 border-b border-border">
        <Terminal className="w-4 h-4 text-brand-400" />
        <span className="font-semibold text-slate-200">Pipeline Execution Stream</span>
      </div>

      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-slate-500 italic">No active jobs running. Idle.</p>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px]">
              <span className="text-brand-400 shrink-0">[{log.stage}]</span>
              <span className={log.type === "success" ? "text-emerald-400" : "text-slate-300"}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
