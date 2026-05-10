"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import Link from "next/link";
import type { GenerateRequest, GenerateResponse, Tone, Template, ProfileData } from "@/types";
import ProfileForm from "@/components/ProfileForm";
import { useLanguage } from "@/lib/contexts/LanguageContext";

const TONE_OPTIONS: Tone[] = ["professional", "aggressive", "concise", "friendly", "bold"];

export default function Dashboard() {
  const { lang, toggleLang, t } = useLanguage();
  const [credits, setCredits] = useState(10);
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [template, setTemplate] = useState<Template>("upwork_cover");
  const [proposal, setProposal] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Profile modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfileData(data.profile);
      }
    } catch {
      // Profile fetch is non-critical, silently ignore
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleGenerate = () => {
    if (jobDescription.length < 50) {
      setError(t.dashboard.errorShort);
      return;
    }

    setError("");
    setProposal("");

    startTransition(async () => {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobDescription, tone, template, language: lang } as GenerateRequest),
        });

        const data = (await res.json()) as GenerateResponse;

        if (!res.ok) {
          setError(data.error || "An error occurred");
        } else {
          setProposal(data.proposal || "");
          setCredits((prev) => Math.max(0, prev - 1));
        }
      } catch {
        setError(t.dashboard.errorConnect);
      }
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row p-4 lg:p-8 gap-8 pb-24 sm:w-[95%] mx-auto">
      {/* LEFT PANE - INPUT */}
      <div className="w-full lg:w-1/2 flex flex-col space-y-6">
        <div className="flex flex-col space-y-4">
          <div className="hidden lg:flex items-center justify-between pb-4 border-b border-zinc-800/50 mb-2">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:text-zinc-200 hover:border-zinc-700 transition-all cursor-pointer shadow-sm group"
                title={t.common.backToHome}
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform rtl:group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={lang === "ar" ? "M14 5l7 7m0 0l-7 7m7-7H3" : "M10 19l-7-7m0 0l7-7m-7 7h18"} />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-zinc-100 tracking-tight">ProposliGo</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-xs font-bold whitespace-nowrap">
                  {credits}
                </span>
              </div>
              <button
                onClick={toggleLang}
                className="px-3 py-1.5 rounded-xl border border-zinc-700 bg-zinc-800/50 text-emerald-400 hover:bg-zinc-800 hover:border-zinc-600 transition-all cursor-pointer shadow-sm font-black text-xs min-w-[44px] flex items-center justify-center uppercase"
                title={lang === "en" ? "Switch to Arabic" : "التغيير إلى الإنجليزية"}
              >
                {lang === "en" ? "AR" : "EN"}
              </button>
              <button
                id="edit-profile-btn"
                type="button"
                onClick={() => setShowProfileModal(true)}
                className="p-2.5 rounded-xl border border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600 hover:text-zinc-100 transition-all cursor-pointer group shadow-sm flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="pt-2">
            <div className="flex items-center justify-between gap-4 mb-1">
              <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">{t.dashboard.title}</h2>
              {/* Mobile Credits Pill */}
              <div className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-xs font-bold whitespace-nowrap">
                  {credits}
                </span>
              </div>
            </div>
            <p className="text-zinc-400 text-sm opacity-80 leading-relaxed">{t.dashboard.subtitle}</p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-900/30 border border-red-800 text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Template Selector */}
        <div className="flex flex-col space-y-3">
          <label className="text-sm font-semibold text-zinc-300">{t.dashboard.templateLabel}</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(Object.keys(t.dashboard.templates) as Template[]).map((tempValue) => {
              const temp = t.dashboard.templates[tempValue];
              return (
                <button
                  key={tempValue}
                  type="button"
                  onClick={() => setTemplate(tempValue)}
                  className={`px-4 py-3 rounded-xl border text-center transition-all ${template === tempValue
                    ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/30"
                    : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                    }`}
                >
                  <p className={`text-sm font-medium ${template === tempValue ? "text-emerald-400" : "text-zinc-200"}`}>
                    {temp.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Job Description */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-zinc-300">{t.dashboard.jobDescriptionLabel}</label>
          <textarea
            className="w-full h-48 p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-shadow"
            placeholder={t.dashboard.jobDescriptionPlaceholder}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <div className="text-xs text-zinc-500 text-end">
            {jobDescription.length} / 5000 {t.dashboard.chars}
          </div>
        </div>

        {/* Tone Selector */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-zinc-300">{t.dashboard.toneLabel}</label>
          <div className="flex flex-wrap gap-2">
            {TONE_OPTIONS.map((toneValue) => (
              <button
                key={toneValue}
                type="button"
                onClick={() => setTone(toneValue)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tone === toneValue
                  ? "bg-emerald-500 text-zinc-950"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
              >
                {t.dashboard.tones[toneValue]}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isPending || jobDescription.length === 0 || credits === 0}
          className="w-full py-4 rounded-2xl bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer text-lg"
        >
          {isPending ? t.dashboard.generatingBtn : t.dashboard.generateBtn}
        </button>
      </div>

      {/* RIGHT PANE - OUTPUT */}
      <div className="w-full lg:w-1/2 flex flex-col min-h-[500px] lg:min-h-0 lg:h-[calc(100vh-4rem)] rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl lg:sticky lg:top-8">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm flex justify-between items-center">
          <h2 className="text-lg font-semibold text-zinc-100">{t.dashboard.resultTitle}</h2>
          {proposal && (
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 text-sm font-medium text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20 rounded-lg transition-colors border border-emerald-400/20"
            >
              {copied ? t.common.copied : t.common.copy}
            </button>
          )}
        </div>

        <div className="p-6 overflow-y-auto flex-1 text-zinc-300 leading-relaxed text-sm lg:text-base prose-custom">
          {isPending ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
              <div className="h-4 bg-zinc-800 rounded w-full"></div>
              <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
              <div className="h-4 bg-zinc-800 rounded w-full"></div>
              <div className="h-4 bg-zinc-800 rounded w-4/5"></div>
              <div className="h-4 bg-zinc-800 rounded w-2/3 mt-8"></div>
              <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
              <div className="h-4 bg-zinc-800 rounded w-full"></div>
            </div>
          ) : proposal ? (
            <div className="whitespace-pre-wrap">{proposal}</div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 opacity-50 space-y-4">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>{t.dashboard.emptyResult}</p>
            </div>
          )}
        </div>
      </div>
      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileForm
          initialData={profileData}
          onClose={() => setShowProfileModal(false)}
          onSaved={() => {
            setShowProfileModal(false);
            fetchProfile();
          }}
        />
      )}
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-around h-16 px-4">
          <Link
            href="/"
            className="flex flex-col items-center gap-1 text-zinc-500 hover:text-emerald-400 transition-colors flex-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-tight">{t.common.home}</span>
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
    </div>
  );
}
