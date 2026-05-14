"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function Footer() {
  const { lang, t } = useLanguage();

  return (
    <footer className="w-full border-t border-zinc-800/50 bg-[#09090b]/80 backdrop-blur-2xl py-8 px-4 sm:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link href="/" className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent tracking-tighter">
            ProposliGo
          </Link>
          <p className="text-zinc-500 text-sm max-w-xs text-center md:text-start leading-relaxed">
            {lang === "ar"
              ? "توقف عن كتابة عروض العمل من الصفر. احصل على عروض احترافية في ثوانٍ."
              : "Stop writing proposals from scratch. Get professional pitches in seconds."}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-sm font-semibold text-zinc-400">
          <Link
            href="mailto:hazem.soliman.dev@gmail.com"
            className="flex items-center gap-2 hover:text-emerald-400 transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {t.common.email}
          </Link>
          <Link
            href="https://github.com/Hazem-Soliman-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-emerald-400 transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            {t.common.github}
          </Link>
          <Link
            href="tel:+201156534378"
            className="flex items-center gap-2 hover:text-emerald-400 transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {t.common.phone}
          </Link>
        </div>

        <div className="flex items-center gap-4 text-zinc-500 text-sm">
          <span>&copy; {new Date().getFullYear()} ProposliGo.</span>
        </div>
      </div>
    </footer>
  );
}
