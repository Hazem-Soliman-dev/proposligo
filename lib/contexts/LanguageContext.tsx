"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: any; // Using any for dictionary for now, can be typed later
}

const DICTIONARY = {
  en: {
    common: {
      home: "Home",
      dashboard: "Dashboard",
      profile: "Profile",
      language: "Language",
      editProfile: "Edit Profile",
      setUpProfile: "Set Up Profile",
      backToHome: "Back to Home",
      copy: "Copy",
      copied: "Copied!",
      save: "Save",
      cancel: "Cancel",
      loading: "Loading...",
      credits: "Credits",
    },
    home: {
      hero_subtitle: "Stop writing proposals from scratch. Paste the job description, pick your tone, and get a winning proposal in seconds.",
      cta: "Go to Dashboard",
      feature1_title: "AI-Powered",
      feature1_desc: "Powered by Llama 3 on Groq for sub-second generation speeds.",
      feature2_title: "Personalized",
      feature2_desc: "Automatically injects your tech stack and portfolio into every pitch.",
      feature3_title: "Tone Matching",
      feature3_desc: "Choose between Aggressive, Professional, or Concise tones.",
    },
    dashboard: {
      title: "Generate Proposal",
      subtitle: "Paste the job description, pick a template and tone, then hit generate.",
      templateLabel: "Template",
      jobDescriptionLabel: "Job Description",
      jobDescriptionPlaceholder: "Paste the job posting or describe the client's project here...",
      toneLabel: "Tone",
      generateBtn: "Generate",
      generatingBtn: "Generating...",
      resultTitle: "Result",
      emptyResult: "Paste a job description to generate your winning proposal",
      chars: "chars",
      errorShort: "Job description is too short (min 50 characters).",
      errorConnect: "Failed to connect to the server.",
      templates: {
        upwork_cover: { label: "Upwork Cover Letter" },
        cold_email: { label: "Cold Email Pitch" },
        follow_up: { label: "Follow-Up Message" },
        rfp_response: { label: "Formal RFP Response" },
        quick_intro: { label: "Quick Intro" },
        case_study_pitch: { label: "Case Study Pitch" },
      },
      tones: {
        professional: "Professional",
        aggressive: "Aggressive",
        concise: "Concise",
        friendly: "Friendly",
        bold: "Bold",
      },
    },
    profile: {
      title: "Personal Profile",
      bio: "Bio / Experience",
      techStack: "Tech Stack (comma separated)",
      portfolio: "Portfolio URL",
      jobTitle: "Current Job Title",
      saving: "Saving...",
    }
  },
  ar: {
    common: {
      home: "الرئيسية",
      dashboard: "لوحة التحكم",
      profile: "الملف الشخصي",
      language: "اللغة",
      editProfile: "تعديل الملف الشخصي",
      setUpProfile: "إعداد الملف الشخصي",
      backToHome: "العودة للرئيسية",
      copy: "نسخ",
      copied: "تم النسخ!",
      save: "حفظ",
      cancel: "إلغاء",
      loading: "جاري التحميل...",
      credits: "رصيد",
    },
    home: {
      hero_subtitle: "توقف عن كتابة عروض العمل من الصفر. الصق وصف الوظيفة، اختر أسلوبك، واحصل على عرض فائز في ثوانٍ.",
      cta: "انتقل إلى لوحة التحكم",
      feature1_title: "مدعوم بالذكاء الاصطناعي",
      feature1_desc: "يعمل بواسطة Llama 3 على Groq لسرعات توليد فائقة.",
      feature2_title: "مخصص لك",
      feature2_desc: "يحقن تلقائياً مهاراتك التقنية ومعرض أعمالك في كل عرض.",
      feature3_title: "مطابقة الأسلوب",
      feature3_desc: "اختر بين الأساليب الهجومية، الاحترافية، أو المختصرة.",
    },
    dashboard: {
      title: "إنشاء عرض عمل",
      subtitle: "الصق وصف الوظيفة، اختر القالب والأسلوب، ثم اضغط على إنشاء.",
      templateLabel: "القالب",
      jobDescriptionLabel: "وصف الوظيفة",
      jobDescriptionPlaceholder: "الصق وصف الوظيفة أو صف مشروع العميل هنا...",
      toneLabel: "أسلوب الكتابة",
      generateBtn: "إنشاء",
      generatingBtn: "جاري الإنشاء...",
      resultTitle: "النتيجة",
      emptyResult: "الصق وصف الوظيفة لإنشاء عرضك الفائز",
      chars: "حرف",
      errorShort: "وصف الوظيفة قصير جداً (على الأقل 50 حرفاً).",
      errorConnect: "فشل الاتصال بالخادم.",
      templates: {
        upwork_cover: { label: "رسالة تغطية Upwork" },
        cold_email: { label: "بريد إلكتروني بارد" },
        follow_up: { label: "رسالة متابعة" },
        rfp_response: { label: "رد رسمي على RFP" },
        quick_intro: { label: "مقدمة سريعة" },
        case_study_pitch: { label: "عرض دراسة حالة" },
      },
      tones: {
        professional: "احترافي",
        aggressive: "هجومي",
        concise: "مختصر",
        friendly: "ودي",
        bold: "جريء",
      },
    },
    profile: {
      title: "الملف الشخصي",
      bio: "النبذة التعريفية / الخبرة",
      techStack: "المهارات التقنية (مفصولة بفاصلة)",
      portfolio: "رابط معرض الأعمال",
      jobTitle: "المسمى الوظيفي الحالي",
      saving: "جاري الحفظ...",
    }
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Language;
    if (saved && (saved === "en" || saved === "ar")) {
      setLangState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
  };

  const toggleLang = () => {
    const newLang = lang === "en" ? "ar" : "en";
    setLang(newLang);
  };

  const t = DICTIONARY[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      <div dir={lang === "ar" ? "rtl" : "ltr"} className={lang === "ar" ? "font-arabic" : ""}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
