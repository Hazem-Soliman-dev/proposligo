"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProfileForm from "@/components/ProfileForm";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function Home() {
  const { lang, toggleLang, t } = useLanguage();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    // Fetch profile to see if it exists
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfileData(data.profile);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-8 text-center sm:p-24 relative overflow-hidden pb-32 sm:pb-24"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full -z-10" />

      {/* Language Toggle - Desktop */}
      <div className="hidden sm:block absolute top-8 right-8 left-auto rtl:right-auto rtl:left-8">
        <button
          onClick={toggleLang}
          className="px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900/50 text-emerald-400 hover:border-zinc-700 transition-all font-bold text-sm shadow-lg backdrop-blur-md min-w-[50px] flex items-center justify-center"
        >
          {lang === "en" ? "AR" : "EN"}
        </button>
      </div>

      <div className="z-10 w-full max-w-5xl items-center justify-center font-sans text-sm flex flex-col space-y-8 sm:space-y-12">
        <h1 className="text-6xl font-extrabold tracking-tight sm:text-8xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent pb-2 animate-in fade-in slide-in-from-bottom-8 duration-700">
          ProposliGo
        </h1>
        <p className="text-xl sm:text-2xl text-zinc-400 max-w-2xl text-balance animate-in fade-in slide-in-from-bottom-12 duration-1000">
          {t.home.hero_subtitle}
        </p>

        <div className="hidden sm:block animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
          <Link
            href="/dashboard"
            className="rounded-full bg-emerald-500 px-10 py-5 text-xl font-bold text-zinc-950 hover:bg-emerald-400 transition-all shadow-[0_0_40px_rgba(16,185,129,0.2)] hover:scale-105 active:scale-95"
          >
            {t.home.cta}
          </Link>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-3 mt-2 sm:mt-8 text-start w-full">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm hover:border-zinc-700 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-2">{t.home.feature1_title}</h3>
            <p className="text-zinc-400 leading-relaxed">{t.home.feature1_desc}</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm hover:border-zinc-700 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-2">{t.home.feature2_title}</h3>
            <p className="text-zinc-400 leading-relaxed">{t.home.feature2_desc}</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm hover:border-zinc-700 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-2">{t.home.feature3_title}</h3>
            <p className="text-zinc-400 leading-relaxed">{t.home.feature3_desc}</p>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-around h-16 px-4">
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-1 text-zinc-500 hover:text-emerald-400 transition-colors flex-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-tight">{t.common.dashboard}</span>
          </Link>

          <button
            onClick={toggleLang}
            className="flex flex-col items-center gap-1 text-emerald-400 transition-colors flex-1"
          >
            <div className="w-5 h-5 flex items-center justify-center font-black text-xs border border-emerald-500/30 rounded-md bg-emerald-500/5">
              {lang === 'en' ? 'AR' : 'EN'}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tight">{lang === 'en' ? 'عربي' : 'EN'}</span>
          </button>

          <button
            onClick={() => setShowProfileModal(true)}
            className="flex flex-col items-center gap-1 text-zinc-500 hover:text-emerald-400 transition-colors flex-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-tight">{t.common.profile}</span>
          </button>
        </div>
      </nav>

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileForm
          onClose={() => setShowProfileModal(false)}
          onSaved={() => {
            setShowProfileModal(false);
          }} 
          initialData={profileData}        
        />
      )}
    </main>
  );
}
