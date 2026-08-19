"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
        isDark
          ? "bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 shadow-sm"
          : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 shadow-sm"
      }`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle color theme"
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform rotate-0 scale-100" />
      ) : (
        <Moon className="w-4 h-4 transition-transform rotate-0 scale-100 text-slate-700" />
      )}
    </button>
  );
};
