"use client";

import { useActionState, useEffect, useRef } from "react";
import { upsertProfile } from "@/actions/profile";
import type { ProfileFormState } from "@/actions/profile";
import type { ProfileData } from "@/types";

interface ProfileFormProps {
  lang: "en" | "ar";
  initialData: ProfileData | null;
  onClose: () => void;
  onSaved: () => void;
}

const DICTIONARY = {
  en: {
    title: "Personal Profile",
    subtitle: "This info is woven into every proposal you generate.",
    jobTitleLabel: "Job Title",
    jobTitlePlaceholder: "e.g. Full-Stack Developer",
    bioLabel: "Bio",
    bioPlaceholder: "Describe your experience, specialties, and what you bring to the table...",
    techStackLabel: "Tech Stack",
    techStackPlaceholder: "e.g. React, Next.js, Node.js, TypeScript, PostgreSQL",
    techStackHint: "Comma-separated. Only relevant skills are injected per proposal.",
    portfolioUrlLabel: "Portfolio URL",
    portfolioUrlPlaceholder: "https://yourportfolio.com",
    cancel: "Cancel",
    save: "Save Profile",
    saving: "Saving...",
    success: "Profile saved successfully!",
  },
  ar: {
    title: "الملف الشخصي",
    subtitle: "يتم دمج هذه المعلومات في كل عرض عمل تقوم بإنشائه.",
    jobTitleLabel: "المسمى الوظيفي",
    jobTitlePlaceholder: "مثلاً: مطور فول ستاك",
    bioLabel: "نبذة شخصية",
    bioPlaceholder: "صف خبرتك، تخصصاتك، وما يمكنك تقديمه...",
    techStackLabel: "المهارات التقنية",
    techStackPlaceholder: "مثلاً: React, Next.js, Node.js, TypeScript, PostgreSQL",
    techStackHint: "افصل بينها بفواصل. يتم حقن المهارات ذات الصلة فقط في العرض.",
    portfolioUrlLabel: "رابط معرض الأعمال",
    portfolioUrlPlaceholder: "https://yourportfolio.com",
    cancel: "إلغاء",
    save: "حفظ الملف",
    saving: "جاري الحفظ...",
    success: "تم حفظ الملف الشخصي بنجاح!",
  },
};

const initialState: ProfileFormState = { success: false, error: null };

export default function ProfileForm({ lang, initialData, onClose, onSaved }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(upsertProfile, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const t = DICTIONARY[lang];

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
      dir={lang === "ar" ? "rtl" : "ltr"}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-bold text-zinc-100">{t.title}</h2>
            <p className="text-sm text-zinc-500 mt-0.5">
              {t.subtitle}
            </p>
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
              {t.success}
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
              {t.jobTitleLabel} <span className="text-red-400">*</span>
            </label>
            <input
              id="profile-jobTitle"
              name="jobTitle"
              type="text"
              required
              maxLength={120}
              defaultValue={initialData?.jobTitle ?? ""}
              placeholder={t.jobTitlePlaceholder}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow text-sm"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label htmlFor="profile-bio" className="text-sm font-semibold text-zinc-300 text-start block">
              {t.bioLabel} <span className="text-red-400">*</span>
            </label>
            <textarea
              id="profile-bio"
              name="bio"
              required
              maxLength={1000}
              rows={3}
              defaultValue={initialData?.bio ?? ""}
              placeholder={t.bioPlaceholder}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-shadow text-sm"
            />
          </div>

          {/* Tech Stack */}
          <div className="space-y-1.5">
            <label htmlFor="profile-techStack" className="text-sm font-semibold text-zinc-300 text-start block">
              {t.techStackLabel} <span className="text-red-400">*</span>
            </label>
            <input
              id="profile-techStack"
              name="techStack"
              type="text"
              required
              maxLength={500}
              defaultValue={initialData?.techStack ?? ""}
              placeholder={t.techStackPlaceholder}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow text-sm"
            />
            <p className="text-xs text-zinc-600">{t.techStackHint}</p>
          </div>

          {/* Portfolio URL */}
          <div className="space-y-1.5">
            <label htmlFor="profile-portfolioUrl" className="text-sm font-semibold text-zinc-300 text-start block">
              {t.portfolioUrlLabel}
            </label>
            <input
              id="profile-portfolioUrl"
              name="portfolioUrl"
              type="url"
              maxLength={255}
              defaultValue={initialData?.portfolioUrl ?? ""}
              placeholder={t.portfolioUrlPlaceholder}
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
              {t.cancel}
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
                  {t.saving}
                </span>
              ) : (
                t.save
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
