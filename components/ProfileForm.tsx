"use client";

import { useActionState, useEffect, useRef } from "react";
import { upsertProfile } from "@/actions/profile";
import type { ProfileFormState } from "@/actions/profile";
import type { ProfileData } from "@/types";
import { useLanguage } from "@/lib/contexts/LanguageContext";

interface ProfileFormProps {
  initialData: ProfileData | null;
  onClose: () => void;
  onSaved: () => void;
}

const initialState: ProfileFormState = { success: false, error: null };

export default function ProfileForm({ initialData, onClose, onSaved }: ProfileFormProps) {
  const { lang, t } = useLanguage();
  const [state, formAction, isPending] = useActionState(upsertProfile, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      onSaved();
    }
  }, [state.success, onSaved]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-bold text-zinc-100">{t.profile.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close profile form"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form ref={formRef} action={formAction} className="px-6 py-5 space-y-5">
          {/* Success */}
          {state.success && (
            <div className="p-3 bg-emerald-900/30 border border-emerald-800 text-emerald-200 rounded-lg text-sm">
              {lang === "ar" ? "تم حفظ الملف الشخصي بنجاح!" : "Profile saved successfully!"}
            </div>
          )}

          {/* Error */}
          {state.error && (
            <div className="p-3 bg-red-900/30 border border-red-800 text-red-200 rounded-lg text-sm">
              {state.error}
            </div>
          )}

          {/* Job Title */}
          <div className="space-y-1.5">
            <label htmlFor="profile-jobTitle" className="text-sm font-semibold text-zinc-300 text-start block">
              {t.profile.jobTitle} <span className="text-red-400">*</span>
            </label>
            <input
              id="profile-jobTitle"
              name="jobTitle"
              type="text"
              required
              maxLength={120}
              defaultValue={initialData?.jobTitle ?? ""}
              placeholder={lang === "ar" ? "مثلاً: مطور فول ستاك" : "e.g. Full-Stack Developer"}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow text-sm"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label htmlFor="profile-bio" className="text-sm font-semibold text-zinc-300 text-start block">
              {t.profile.bio} <span className="text-red-400">*</span>
            </label>
            <textarea
              id="profile-bio"
              name="bio"
              required
              maxLength={1000}
              rows={3}
              defaultValue={initialData?.bio ?? ""}
              placeholder={lang === "ar" ? "صف خبرتك، تخصصاتك، وما يمكنك تقديمه..." : "Describe your experience, specialties, and what you bring to the table..."}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-shadow text-sm"
            />
          </div>

          {/* Tech Stack */}
          <div className="space-y-1.5">
            <label htmlFor="profile-techStack" className="text-sm font-semibold text-zinc-300 text-start block">
              {t.profile.techStack} <span className="text-red-400">*</span>
            </label>
            <input
              id="profile-techStack"
              name="techStack"
              type="text"
              required
              maxLength={500}
              defaultValue={initialData?.techStack ?? ""}
              placeholder={lang === "ar" ? "مثلاً: React, Next.js, Node.js, TypeScript, PostgreSQL" : "e.g. React, Next.js, Node.js, TypeScript, PostgreSQL"}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow text-sm"
            />
            <p className="text-xs text-zinc-600">{lang === "ar" ? "افصل بينها بفواصل. يتم حقن المهارات ذات الصلة فقط في العرض." : "Comma-separated. Only relevant skills are injected per proposal."}</p>
          </div>

          {/* Portfolio URL */}
          <div className="space-y-1.5">
            <label htmlFor="profile-portfolioUrl" className="text-sm font-semibold text-zinc-300 text-start block">
              {t.profile.portfolio}
            </label>
            <input
              id="profile-portfolioUrl"
              name="portfolioUrl"
              type="url"
              maxLength={255}
              defaultValue={initialData?.portfolioUrl ?? ""}
              placeholder="https://yourportfolio.com"
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-300 font-medium hover:bg-zinc-800 transition-colors cursor-pointer text-sm"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-3 rounded-xl bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20 cursor-pointer text-sm"
            >
              {isPending ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t.profile.saving}
                </span>
              ) : (
                lang === "ar" ? "حفظ الملف" : "Save Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
