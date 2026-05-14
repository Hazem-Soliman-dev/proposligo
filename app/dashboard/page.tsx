"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import type { GenerateRequest, GenerateResponse, Tone, Template, ProfileData } from "@/types";
import ProfileForm from "@/components/ProfileForm";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import MobileNav from "@/components/MobileNav";
import BuyCreditsDialog from "@/components/BuyCreditsDialog";

const TONE_OPTIONS: Tone[] = ["professional", "aggressive", "concise", "friendly", "bold"];

export default function Dashboard() {
  const { lang, toggleLang, t } = useLanguage();
  const [credits, setCredits] = useState(0);
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

  // Buy credits state
  const [showBuyCreditsModal, setShowBuyCreditsModal] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/profile?t=${new Date().getTime()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setProfileData(data.profile);
        if (typeof data.credits === 'number') {
          setCredits((prevCredits) => {
            // Only update if credits actually changed
            return data.credits;
          });
        }
        return data.credits;
      }
    } catch {
      // Profile fetch is non-critical, silently ignore
    }
    return null;
  }, []);

  useEffect(() => {
    // Check for purchase success in URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const isSuccess = params.get('purchase') === 'success';
      const checkoutId = params.get('checkout_id') || params.get('session_id');
      
      if (isSuccess) {
        setPurchaseSuccess(true);
        // Clean up URL without reloading
        window.history.replaceState({}, '', '/dashboard');
        
        // Hide success message after 5 seconds
        setTimeout(() => setPurchaseSuccess(false), 5000);

        // Verify the session immediately to grant credits (bypasses local webhook requirement)
        if (checkoutId) {
          fetch(`/api/checkout/verify?checkout_id=${checkoutId}`)
            .then(res => res.json())
            .then(data => {
              if (data.status === 'fulfilled' || data.status === 'already_fulfilled') {
                fetchProfile();
              }
            })
            .catch(console.error);
        }

        // The webhook might take a few seconds to update the database.
        // We'll poll the profile a few times to ensure the UI updates with the new credits.
        let attempts = 0;
        const initialCredits = credits;
        const intervalId = setInterval(async () => {
          attempts++;
          const currentCredits = await fetchProfile();
          if ((currentCredits !== null && currentCredits > initialCredits) || attempts >= 5) {
            clearInterval(intervalId);
          }
        }, 2000); // Poll every 2 seconds, max 5 times (10s total)
      }
    }
  }, [fetchProfile, credits]);

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
    <div className="min-h-screen relative overflow-hidden bg-zinc-950 selection:bg-emerald-500/30">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto p-4 lg:p-6 flex flex-col lg:flex-row gap-6 pb-6 lg:pb-8 relative z-10">
        {/* LEFT PANE - INPUT */}
        <div className="w-full lg:w-1/2 flex flex-col space-y-6">
          <div className="rounded-[2.5rem] border-0 sm:border border-zinc-800/40 bg-[#09090b]/80 p-0 sm:p-6 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between pb-6 border-b border-zinc-800/50 mb-6">
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="p-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all cursor-pointer group shadow-sm"
                  title={t.common.backToHome}
                >
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform rtl:group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={lang === "ar" ? "M14 5l7 7m0 0l-7 7m7-7H3" : "M10 19l-7-7m0 0l7-7m-7 7h18"} />
                  </svg>
                </Link>
                <div>
                  <h1 className="text-xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent tracking-tighter">ProposliGo</h1>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t.dashboard.title}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBuyCreditsModal(true)}
                  className={`flex items-center p-2 rounded-2xl border transition-all cursor-pointer group ${
                    credits === 0 
                      ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20" 
                      : credits <= 3
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 animate-pulse"
                      : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 shadow-inner"
                  }`}
                  title={t.credits.title}
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm font-black tracking-tight px-1">{credits}</span>
                </button>
                <button
                  onClick={toggleLang}
                  className="hidden sm:block p-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 text-emerald-400 hover:border-emerald-500/30 transition-all font-black text-xs tracking-widest shadow-sm cursor-pointer"
                >
                  {lang === "en" ? "AR" : "EN"}
                </button>
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="hidden sm:flex p-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all shadow-sm items-center justify-center cursor-pointer group"
                  title={t.common.profile}
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <div className="pl-1">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9 border-2 border-zinc-800 hover:border-emerald-500/50 transition-all shadow-lg rounded-2xl",
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-2xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            {purchaseSuccess && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">{t.credits.successTitle}</p>
                  <p className="text-xs opacity-80">{t.credits.successSubtitle}</p>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {/* Template Selector */}
              <div className="flex flex-col space-y-4">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">{t.dashboard.templateLabel}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(Object.keys(t.dashboard.templates) as Template[]).map((tempValue) => {
                    const temp = t.dashboard.templates[tempValue];
                    const isActive = template === tempValue;
                    return (
                      <button
                        key={tempValue}
                        type="button"
                        onClick={() => setTemplate(tempValue)}
                        className={`group relative p-4 rounded-[1.5rem] border transition-all duration-300 overflow-hidden ${isActive
                          ? "border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                          : "border-zinc-800/50 bg-zinc-900/30 hover:border-zinc-700"
                          }`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                        <p className={`text-xs font-black relative z-10 transition-colors duration-300 ${isActive ? "text-emerald-400" : "text-zinc-400 group-hover:text-zinc-200"}`}>
                          {temp.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Job Description */}
              <div className="flex flex-col space-y-4">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">{t.dashboard.jobDescriptionLabel}</label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-[1.5rem] blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                  <textarea
                    className="relative w-full h-48 p-5 rounded-[1.5rem] bg-zinc-900/50 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-0 focus:border-emerald-500/50 resize-none transition-all duration-300 text-sm font-medium leading-relaxed"
                    placeholder={t.dashboard.jobDescriptionPlaceholder}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
                <div className="flex justify-end items-center px-2">
                  <span className={`text-[10px] font-bold tracking-widest ${jobDescription.length > 4500 ? "text-red-400" : "text-zinc-600"}`}>
                    {jobDescription.length} / 5000
                  </span>
                </div>
              </div>

              {/* Tone Selector */}
              <div className="flex flex-col space-y-4">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">{t.dashboard.toneLabel}</label>
                <div className="flex flex-wrap gap-2">
                  {TONE_OPTIONS.map((toneValue) => {
                    const isActive = tone === toneValue;
                    return (
                      <button
                        key={toneValue}
                        type="button"
                        onClick={() => setTone(toneValue)}
                        className={`px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${isActive
                          ? "bg-emerald-500 text-zinc-950 shadow-[0_10px_20px_rgba(16,185,129,0.3)] scale-105"
                          : "bg-zinc-900/50 text-zinc-500 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-300"
                          }`}
                      >
                        {t.dashboard.tones[toneValue]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {credits === 0 ? (
                <button
                  onClick={() => setShowBuyCreditsModal(true)}
                  className="group relative w-full py-5 rounded-[1.5rem] bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 font-black text-lg hover:opacity-90 transition-all shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                  <svg className="w-6 h-6 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {t.credits.buyBtn}
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={isPending || jobDescription.length === 0}
                  className="group relative w-full py-5 rounded-[1.5rem] bg-emerald-500 text-zinc-950 font-black text-lg hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                  {isPending ? (
                    <div className="w-6 h-6 border-4 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                  ) : (
                    <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  {isPending ? t.dashboard.generatingBtn : t.dashboard.generateBtn}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANE - OUTPUT */}
        <div className="w-full lg:w-1/2 flex flex-col min-h-[500px] lg:min-h-0 lg:h-[calc(100vh-4rem)] rounded-[2.5rem] border border-zinc-800/40 bg-[#09090b]/80 backdrop-blur-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] lg:sticky lg:top-8 group/result">
          <div className="p-6 border-b border-zinc-800/50 bg-[#09090b]/40 flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">{t.dashboard.resultTitle}</h2>
            </div>
            {proposal && (
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all border duration-300 ${copied
                  ? "bg-emerald-500 border-emerald-500 text-zinc-950"
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40"
                  }`}
              >
                {copied ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
                {copied ? t.common.copied : t.common.copy}
              </button>
            )}
          </div>

          <div className="p-8 overflow-y-auto flex-1 relative z-10 selection:bg-emerald-500/30 custom-scrollbar">
            {isPending ? (
              <div className="animate-pulse space-y-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className={`h-4 bg-zinc-800/50 rounded-full ${i % 3 === 0 ? "w-2/3" : i % 2 === 0 ? "w-full" : "w-5/6"}`} />
                ))}
              </div>
            ) : proposal ? (
              <div className="whitespace-pre-wrap text-zinc-200 leading-relaxed font-medium animate-in fade-in duration-700">
                {proposal}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-6 animate-in fade-in duration-1000">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full" />
                  <svg className="w-20 h-20 relative z-10 text-zinc-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-center space-y-2">
                  <p className="font-black uppercase tracking-[0.2em] text-xs opacity-50">{t.dashboard.emptyResult}</p>
                  <p className="text-zinc-700 text-sm font-medium">{lang === "ar" ? "ابدأ بلصق وصف العمل على اليسار" : "Start by pasting a job description on the left"}</p>
                </div>
              </div>
            )}
          </div>
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

      {/* Buy Credits Modal */}
      <BuyCreditsDialog
        isOpen={showBuyCreditsModal}
        onClose={() => setShowBuyCreditsModal(false)}
      />

      <MobileNav
        items={[
          {
            label: t.common.dashboard,
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            ),
            isActive: true,
            onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' })
          },
          {
            label: t.common.home,
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            ),
            href: "/"
          },
          {
            label: lang === 'en' ? 'عربي' : 'EN',
            icon: (
              <div className="w-5 h-5 flex items-center justify-center font-black text-xs border border-emerald-500/30 rounded-md bg-emerald-500/5">
                {lang === 'en' ? 'AR' : 'EN'}
              </div>
            ),
            onClick: toggleLang
          },
          {
            label: t.common.profile,
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ),
            onClick: () => setShowProfileModal(true)
          }
        ]}
      />
    </div>
  );
}
