import type { Metadata } from "next";
import Link from "next/link";
import {
  Layers,
  ShieldCheck,
  Download,
  ExternalLink,
  Search,
  Bell,
  Zap,
  LayoutDashboard,
  Compass,
} from "lucide-react";
import { ToastProvider } from "@/components/Toast";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CrucibleLogo } from "@/components/CrucibleLogo";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crucible · Industrial Product Intelligence Platform",
  description:
    "Deterministic product data enrichment, physical constraint validation, and explainable citation grounding for industrial commerce.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased noise-overlay">
        <ThemeProvider>
          <ToastProvider>
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-3xl opacity-50 dark:opacity-100"
                style={{ background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)" }}
              />
              <div
                className="absolute bottom-0 right-0 w-[600px] h-[500px] rounded-full blur-3xl opacity-40 dark:opacity-100"
                style={{ background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)" }}
              />
            </div>

            {/* Sticky Floating Navigation Header */}
            <div className="sticky top-0 z-50 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-3 pb-2 transition-all">
              <header className="flex items-center justify-between px-5 py-3 rounded-2xl bg-white/85 dark:bg-[#06070a]/85 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-2xl shadow-sm dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]">
                {/* Brand Logo */}
                <Link href="/" className="group flex items-center gap-3">
                  <CrucibleLogo size={32} />
                </Link>

                {/* Centered Navigation */}
                <nav className="hidden md:flex items-center gap-1.5">
                  <Link
                    href="/"
                    className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-all"
                  >
                    Intro
                  </Link>
                  <Link
                    href="/workspace"
                    className="px-4 py-1.5 rounded-full text-[13px] font-semibold text-slate-900 bg-slate-100 border border-slate-200 dark:text-white/90 dark:bg-white/[0.08] dark:border-white/[0.1] transition-all hover:bg-slate-200 dark:hover:bg-white/[0.12] flex items-center gap-1.5 shadow-xs"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Workspace
                  </Link>
                  <Link
                    href="/workspace#catalog-upload-section"
                    className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-slate-600 hover:text-slate-900 dark:text-white/50 dark:hover:text-white/80 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-all flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    Ingest
                  </Link>
                  <Link
                    href="/review"
                    className="px-4 py-1.5 rounded-full text-[13px] font-medium text-slate-600 hover:text-slate-900 dark:text-white/50 dark:hover:text-white/80 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-all flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    Review Queue
                  </Link>
                  <a
                    href="http://127.0.0.1:8000/export/csv"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-1.5 rounded-full text-[13px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 dark:text-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-500/30 dark:hover:bg-emerald-900/50 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Export CSV
                  </a>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                  <ThemeToggle />

                  <Link
                    href="/workspace"
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:border-white/[0.08] flex items-center justify-center text-slate-600 hover:text-slate-900 dark:text-white/40 dark:hover:text-white/70 transition-all shadow-xs"
                    title="Search catalog"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href="/review"
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:border-white/[0.08] flex items-center justify-center text-slate-600 hover:text-slate-900 dark:text-white/40 dark:hover:text-white/70 relative transition-all shadow-xs"
                    title="Review Alerts"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
                  </Link>

                  <div className="flex items-center gap-2.5 pl-3 ml-1 border-l border-slate-200 dark:border-white/[0.06]">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 dark:from-emerald-500/30 dark:to-blue-500/30 border border-slate-300 dark:border-white/[0.1] flex items-center justify-center text-slate-800 dark:text-white/70 font-semibold text-[10px]">
                      AI
                    </div>
                    <div className="hidden lg:block text-left">
                      <span className="text-[11px] font-semibold text-slate-800 dark:text-white/70 block leading-tight">
                        AI Extraction · Gemini
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                        ✓ Deterministic Validation
                      </span>
                    </div>
                  </div>
                </div>
              </header>
            </div>

            {/* Main Content */}
            <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
              {children}
            </main>

            {/* Footer */}
            <footer className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 text-xs text-slate-500 dark:text-white/30 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200/80 dark:border-white/[0.04] mt-10">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                <span className="font-semibold text-slate-800 dark:text-white/50">Crucible</span>
                <span className="text-slate-300 dark:text-white/15">·</span>
                <span className="text-slate-600 dark:text-white/40">&quot;The AI reads. The code decides.&quot;</span>
                <span className="text-slate-300 dark:text-white/15">·</span>
                <span className="text-slate-400 dark:text-white/25">Unilog Hackathon 2026</span>
              </div>
              <div className="flex items-center gap-4 text-slate-500 dark:text-white/30">
                <a
                  href="http://127.0.0.1:8000/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-900 dark:hover:text-white/60 flex items-center gap-1 transition-colors font-medium"
                >
                  API Reference <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-slate-300 dark:text-white/10">·</span>
                <span className="text-slate-700 dark:text-white/50 font-medium" title="Canonical values require source evidence and deterministic validation">
                  Evidence-Grounded Outputs
                </span>
              </div>
            </footer>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
