"use client";

import { useState, useEffect, useCallback } from "react";
import { Accessibility, Type, Contrast, Underline, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "accessibility-preferences";

type AccessibilityPrefs = {
  fontSize: number;
  highContrast: boolean;
  underlineLinks: boolean;
};

const DEFAULT_PREFS: AccessibilityPrefs = {
  fontSize: 100,
  highContrast: false,
  underlineLinks: false,
};

function loadPrefs(): AccessibilityPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<AccessibilityPrefs>;
      return { ...DEFAULT_PREFS, ...parsed };
    }
  } catch {
    // ignore
  }
  return DEFAULT_PREFS;
}

function savePrefs(prefs: AccessibilityPrefs) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

function applyPrefs(prefs: AccessibilityPrefs) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.fontSize = `${prefs.fontSize}%`;
  root.classList.toggle("accessibility-high-contrast", prefs.highContrast);
  root.classList.toggle("accessibility-underline-links", prefs.underlineLinks);
}

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [prefs, setPrefs] = useState<AccessibilityPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    const loaded = loadPrefs();
    setPrefs(loaded);
    applyPrefs(loaded);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const updatePrefs = useCallback((updates: Partial<AccessibilityPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...updates };
      savePrefs(next);
      applyPrefs(next);
      return next;
    });
  }, []);

  const increaseFont = () => updatePrefs({ fontSize: Math.min(prefs.fontSize + 10, 150) });
  const decreaseFont = () => updatePrefs({ fontSize: Math.max(prefs.fontSize - 10, 80) });
  const toggleContrast = () => updatePrefs({ highContrast: !prefs.highContrast });
  const toggleUnderline = () => updatePrefs({ underlineLinks: !prefs.underlineLinks });

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-2">
      <div
        className={cn(
          "overflow-hidden rounded-xl border border-border bg-card shadow-lg transition-all duration-200",
          isOpen ? "w-64 p-4" : "w-0 p-0 opacity-0"
        )}
      >
        {isOpen && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Accessibility</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground">Font size</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={decreaseFont}
                    className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Decrease font size"
                  >
                    <Type className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-medium w-8 text-center">{prefs.fontSize}%</span>
                  <button
                    type="button"
                    onClick={increaseFont}
                    className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Increase font size"
                  >
                    <Type className="w-4 h-4 scale-110" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleContrast}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  prefs.highContrast ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
                aria-pressed={prefs.highContrast}
                aria-label="Toggle high contrast mode"
              >
                <span className="flex items-center gap-2">
                  <Contrast className="w-4 h-4" />
                  High contrast
                </span>
                {prefs.highContrast && <span className="text-xs">On</span>}
              </button>
              <button
                type="button"
                onClick={toggleUnderline}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  prefs.underlineLinks ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
                aria-pressed={prefs.underlineLinks}
                aria-label="Toggle underline links"
              >
                <span className="flex items-center gap-2">
                  <Underline className="w-4 h-4" />
                  Underline links
                </span>
                {prefs.underlineLinks && <span className="text-xs">On</span>}
              </button>
            </div>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label={isOpen ? "Close accessibility menu" : "Open accessibility menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <ChevronDown className="w-5 h-5" /> : <Accessibility className="w-5 h-5" />}
      </button>
    </div>
  );
}
