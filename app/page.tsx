"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProfileForm from "@/components/ProfileForm";

const DICTIONARY = {
  en: {
    hero_subtitle: "Stop writing proposals from scratch. Paste the job description, pick your tone, and get a winning proposal in seconds.",
    cta: "Go to Dashboard",
    feature1_title: "AI-Powered",
    feature1_desc: "Powered by Llama 3 on Groq for sub-second generation speeds.",
    feature2_title: "Personalized",
    feature2_desc: "Automatically injects your tech stack and portfolio into every pitch.",
    feature3_title: "Tone Matching",
    feature3_desc: "Choose between Aggressive, Professional, or Concise tones.",
    dashboard: "Dashboard",
    language: "Language",
    profile: "Profile",
    editProfile: "Edit Profile",
    setUpProfile: "Set Up Profile",
  },
  ar: {
    hero_subtitle: "توقف عن كتابة عروض العمل من الصفر. الصق وصف الوظيفة، اختر أسلوبك، واحصل على عرض فائز في ثوانٍ.",
    cta: "انتقل إلى لوحة التحكم",
    feature1_title: "مدعوم بالذكاء الاصطناعي",
    feature1_desc: "يعمل بواسطة Llama 3 على Groq لسرعات توليد فائقة.",
    feature2_title: "مخصص لك",
    feature2_desc: "يحقن تلقائياً مهاراتك التقنية ومعرض أعمالك في كل عرض.",
    feature3_title: "مطابقة الأسلوب",
    feature3_desc: "اختر بين الأساليب الهجومية، الاحترافية، أو المختصرة.",
    dashboard: "لوحة التحكم",
    language: "اللغة",
    profile: "الملف الشخصي",
    editProfile: "تعديل الملف الشخصي",
    setUpProfile: "إعداد الملف الشخصي",
  },
};

export default function Home() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("lang") as "en" | "ar";
    if (saved) setLang(saved);

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

  const toggleLang = () => {
    const newLang = lang === "en" ? "ar" : "en";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  const t = DICTIONARY[lang];

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-8 text-center sm:p-24 relative overflow-hidden pb-32 sm:pb-24"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full -z-10" />

      {/* Language Toggle - Hidden on Mobile */}
      <div className="hidden sm:block absolute top-8 right-8 left-auto rtl:right-auto rtl:left-8">
        <button
          onClick={toggleLang}
          className="px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 text-emerald-400 hover:border-zinc-700 transition-all font-bold text-sm shadow-lg backdrop-blur-md"
        >
          {lang === "en" ? "العربية" : "English"}
        </button>
      </div>

      <div className="z-10 w-full max-w-5xl items-center justify-center font-sans text-sm flex flex-col space-y-8 sm:space-y-12">
        <h1 className="text-6xl font-extrabold tracking-tight sm:text-8xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent pb-2 animate-in fade-in slide-in-from-bottom-8 duration-700">
          ProposliGo
        </h1>
        <p className="text-xl sm:text-2xl text-zinc-400 max-w-2xl text-balance animate-in fade-in slide-in-from-bottom-12 duration-1000">
          {t.hero_subtitle}
        </p>

        <div className="hidden sm:block animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
          <Link
            href="/dashboard"
            className="rounded-full bg-emerald-500 px-10 py-5 text-xl font-bold text-zinc-950 hover:bg-emerald-400 transition-all shadow-[0_0_40px_rgba(16,185,129,0.2)] hover:scale-105 active:scale-95"
          >
            {t.cta}
          </Link>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-3 mt-2 sm:mt-8 text-start w-full">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm hover:border-zinc-700 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-2">{t.feature1_title}</h3>
            <p className="text-zinc-400 leading-relaxed">{t.feature1_desc}</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm hover:border-zinc-700 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-2">{t.feature2_title}</h3>
            <p className="text-zinc-400 leading-relaxed">{t.feature2_desc}</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm hover:border-zinc-700 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-2">{t.feature3_title}</h3>
            <p className="text-zinc-400 leading-relaxed">{t.feature3_desc}</p>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/90 backdrop-blur-xl border-t border-zinc-800/50 pb-safe shadow-2xl">
        <div className="flex items-center justify-around h-16 max-w-md mx-auto px-6">
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-1 text-zinc-500 hover:text-emerald-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-[10px] font-medium uppercase tracking-wider">{t.dashboard}</span>
          </Link>

          <button
            onClick={toggleLang}
            className="flex flex-col items-center gap-1 text-emerald-400 transition-colors"
          >
            <div className="w-6 h-6 flex items-center justify-center font-bold text-sm">
              {lang === 'en' ? 'AR' : 'EN'}
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wider">{t.language}</span>
          </button>

          <button
            onClick={() => setShowProfileModal(true)}
            className="flex flex-col items-center gap-1 text-zinc-500 hover:text-emerald-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-medium uppercase tracking-wider">{t.profile}</span>
          </button>
        </div>
      </nav>

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileForm
          lang={lang}
          onClose={() => setShowProfileModal(false)}
          onSaved={() => {
            setShowProfileModal(false);
            // Refresh profile data if needed
          } } initialData={null}        />
      )}
    </main>
  );
}
