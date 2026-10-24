"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "bmk-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [mounted, setMounted] = useState(false);

  // Sync theme with DOM and localStorage
  const applyTheme = (targetTheme: ThemeMode) => {
    let active: ResolvedTheme = "light";

    if (targetTheme === "system") {
      const isSystemDark =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      active = isSystemDark ? "dark" : "light";
    } else {
      active = targetTheme;
    }

    setResolvedTheme(active);

    const root = document.documentElement;
    if (active === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
  };

  useEffect(() => {
    setMounted(true);
    let initialTheme: ThemeMode = "system";

    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (saved && (saved === "light" || saved === "dark" || saved === "system")) {
        initialTheme = saved;
      }
    } catch {
      // LocalStorage unavailable
    }

    setThemeState(initialTheme);
    applyTheme(initialTheme);

    // Listen for system color preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved || saved === "system") {
          applyTheme("system");
        }
      } catch {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // Ignore localStorage errors
    }
  };

  const toggleTheme = () => {
    const nextTheme: ResolvedTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
      className={`relative inline-flex items-center gap-2 p-2 rounded-sm border transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B69A61] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0A1B14] ${
        isDark
          ? "bg-[#143026] hover:bg-[#18382C] text-[#CBB584] border-[#1E4234]"
          : "bg-[#EFECE3] hover:bg-[#E4E0D6] text-[#103629] border-[#E4E0D6]"
      } ${className}`}
    >
      <span className="sr-only">{label}</span>
      <div className="relative w-4 h-4 flex items-center justify-center">
        {/* Render placeholder during SSR to prevent hydration mismatch */}
        {!mounted ? (
          <div className="w-4 h-4" />
        ) : isDark ? (
          <Sun className="w-4 h-4 text-[#CBB584] animate-fade-in" />
        ) : (
          <Moon className="w-4 h-4 text-[#103629] animate-fade-in" />
        )}
      </div>

      {showLabel && mounted && (
        <span className="text-xs font-sans tracking-wider uppercase font-medium">
          {isDark ? "Light" : "Dark"}
        </span>
      )}
    </button>
  );
}
