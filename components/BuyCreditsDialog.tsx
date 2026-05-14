"use client";

import { useState } from "react";
import { CREDIT_TIERS, CreditTier } from "@/lib/credits";
import { useLanguage } from "@/lib/contexts/LanguageContext";

interface BuyCreditsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BuyCreditsDialog({ isOpen, onClose }: BuyCreditsDialogProps) {
  const { lang, toggleLang, t } = useLanguage();
  const [selectedTier, setSelectedTier] = useState<string>("tier-1");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tierId: selectedTier, lang }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t.credits.error);
      }

      // Redirect to Polar checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message || t.credits.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-emerald-500/10 blur-[50px] -z-10" />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-zinc-100 tracking-tight">{t.credits.title}</h2>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={toggleLang}
              className="p-2 text-xs font-bold text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 rounded-xl transition-all"
              title={lang === "en" ? "Switch to Arabic" : "التحويل للإنجليزية"}
            >
              {lang === "en" ? "AR" : "EN"}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <p className="text-sm text-zinc-400 mb-6">
          {t.credits.subtitle}
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-8">
          {Object.values(CREDIT_TIERS).map((tier: CreditTier) => {
            const isSelected = selectedTier === tier.id;
            const translatedName = (t.credits.tiers as any)[tier.id] || tier.name;
            
            return (
              <label
                key={tier.id}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    : "bg-zinc-950/50 border-zinc-800 hover:border-zinc-700"
                }`}
                onClick={() => setSelectedTier(tier.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected ? "border-emerald-500" : "border-zinc-600"
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-100">{translatedName}</h3>
                  </div>
                </div>
                <div className="text-emerald-400 font-black text-sm bg-emerald-500/10 px-3 py-1 rounded-lg">
                  ${(tier.priceAmount / 100).toFixed(2)} 
                </div>
              </label>
            );
          })}
        </div>

        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className="relative w-full py-4 rounded-2xl bg-emerald-500 text-zinc-950 font-black text-lg hover:bg-emerald-400 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-[0_10px_30px_rgba(16,185,129,0.2)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
          
          {isLoading ? (
            <div className="w-5 h-5 border-3 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
          {isLoading ? t.credits.redirecting : t.credits.checkoutBtn}
        </button>
      </div>
    </div>
  );
}
