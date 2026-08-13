import type { Metadata } from "next";
import Link from "next/link";
import { Cpu, Terminal, ShieldCheck, Download, Activity, FileSpreadsheet, ExternalLink } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRUCIBLE // Industrial Product Intelligence Engine",
  description:
    "Deterministic product data enrichment, physical constraint validation, and explainable citation grounding for industrial commerce.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-cad-grid text-slate-100 min-h-screen flex flex-col antialiased">
        {/* Tactical Mission Control Header */}
        <header className="sticky top-0 z-40 hud-panel border-b border-border/80 px-4 sm:px-6 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* System Identifier */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-black font-extrabold font-mono shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                  <Cpu className="w-5 h-5 text-slate-950" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold tracking-widest text-white text-sm font-mono group-hover:text-cyan-400 transition-colors">
                      CRUCIBLE
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 rounded">
                      v1.0.4-HYBRID
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block -mt-0.5 tracking-tight">
                    INDUSTRIAL DATA INTELLIGENCE // UNILOG
                  </span>
                </div>
              </Link>
            </div>

            {/* Tactical Navigation Controls */}
            <nav className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/"
                className="px-3 py-1.5 rounded bg-surface/40 hover:bg-surface-raised border border-border/40 hover:border-cyan-500/50 text-xs font-mono font-medium text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-1.5"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                WORKSPACE
              </Link>
              <Link
                href="/review"
                className="px-3 py-1.5 rounded bg-surface/40 hover:bg-surface-raised border border-border/40 hover:border-amber-500/50 text-xs font-mono font-medium text-slate-300 hover:text-amber-300 transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                REVIEW QUEUE
              </Link>
              <a
                href="http://127.0.0.1:8000/export/csv"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded bg-surface/40 hover:bg-emerald-950/40 border border-border/40 hover:border-emerald-500/50 text-xs font-mono font-medium text-slate-300 hover:text-emerald-300 transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                EXPORT CSV
              </a>
            </nav>

            {/* Live System Telemetry Status */}
            <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono border-l border-border/60 pl-4">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>PINT KERNEL: <strong className="text-emerald-400">100% OK</strong></span>
              </div>
              <div className="text-slate-600">|</div>
              <div className="text-slate-400">
                AI GATEWAY: <span className="text-cyan-400">GEMINI-2.5</span>
              </div>
            </div>
          </div>
        </header>

        {/* Workspace Canvas */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
          {children}
        </main>

        {/* High-Tech Terminal Footer */}
        <footer className="hud-panel border-t border-border/70 py-3 px-6 text-xs text-slate-500 font-mono">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>CRUCIBLE // "THE AI READS. THE CODE DECIDES."</span>
              <span className="text-slate-700">::</span>
              <span className="text-slate-400">UNILOG HACKATHON 2026</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <a
                href="http://127.0.0.1:8000/docs"
                target="_blank"
                rel="noreferrer"
                className="hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                API DOCS <ExternalLink className="w-3 h-3" />
              </a>
              <span>·</span>
              <span>ZERO-HALLUCINATION DETERMINISTIC GUARANTEE</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
