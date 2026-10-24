"use client";

import { useEffect, useState, useRef } from "react";

export default function IntroLoader() {
  const [mounted, setMounted] = useState(false);
  const [fading, setFading] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    // 1. Check if user already saw the intro loader during this session
    try {
      if (typeof window !== "undefined" && sessionStorage.getItem("bmk_intro_dismissed") === "1") {
        setDismissed(true);
        return;
      }
    } catch {}

    // 2. Immediately respect prefers-reduced-motion
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDismissed(true);
      return;
    }

    setMounted(true);

    // 3. Display animation once on initial session visit (850ms reveal + 450ms fade)
    timerRef.current = setTimeout(() => {
      setFading(true);

      fadeTimerRef.current = setTimeout(() => {
        setDismissed(true);
        try {
          sessionStorage.setItem("bmk_intro_dismissed", "1");
        } catch {}
      }, 450);
    }, 850);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, []);

  if (dismissed || !mounted) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A241B] text-[#F7F5EF] transition-opacity duration-500 ease-out ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="text-center px-6 max-w-md animate-fade-up">
        {/* Official Clinic Logo Emblem */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-sm overflow-hidden border border-[#B69A61]/50 shadow-md bg-[#202622]">
          <img
            src="/media/logo.jpeg"
            alt="BMK Clinic Emblem"
            className="w-full h-full object-cover"
          />
        </div>

        <span className="text-[10px] tracking-[0.28em] uppercase text-[#B69A61] font-sans block mb-2 font-medium">
          Specialist Oral &bull; Maxillofacial Practice
        </span>

        <h1 className="font-serif text-2xl sm:text-3xl tracking-wide font-normal mb-1.5 text-ivory-50">
          BMK DENTAL &amp; MAXILLOFACIAL
        </h1>

        <div className="w-12 h-[1px] bg-[#B69A61] mx-auto my-3" />

        <p className="font-sans text-[11px] text-ivory-300 tracking-[0.16em] uppercase font-light">
          Led by Dr Vishal Lohana &bull; FCPS, BDS
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          setFading(true);
          try {
            sessionStorage.setItem("bmk_intro_dismissed", "1");
          } catch {}
          setTimeout(() => setDismissed(true), 150);
        }}
        className="absolute bottom-8 text-[10px] uppercase tracking-[0.2em] text-ivory-400 hover:text-[#B69A61] transition-colors py-1.5 px-3.5 border border-white/10 rounded-sm font-sans"
        aria-label="Skip introduction animation"
      >
        Skip
      </button>
    </div>
  );
}
