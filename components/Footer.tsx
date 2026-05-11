"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="w-full border-t border-zinc-800/50 bg-[#09090b]/80 backdrop-blur-2xl py-8 px-4 sm:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
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
          <Link href="#" className="hover:text-emerald-400 transition-colors">
            {lang === "ar" ? "الشروط والأحكام" : "Terms"}
          </Link>
          <Link href="#" className="hover:text-emerald-400 transition-colors">
            {lang === "ar" ? "سياسة الخصوصية" : "Privacy"}
          </Link>
          <Link href="#" className="hover:text-emerald-400 transition-colors">
            {lang === "ar" ? "اتصل بنا" : "Contact"}
          </Link>
        </div>

        <div className="flex items-center gap-4 text-zinc-500 text-sm">
          <span>&copy; {new Date().getFullYear()} ProposliGo.</span>
        </div>
      </div>
    </footer>
  );
}
