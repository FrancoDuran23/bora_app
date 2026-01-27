"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, LANGUAGES, detectLanguageFromLocation, t as translate } from "./i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  setLanguageFromLocation: (location: string) => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = "bora_language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");
  const [isInitialized, setIsInitialized] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && (stored === "es" || stored === "pt" || stored === "en")) {
        setLanguageState(stored as Language);
      }
      setIsInitialized(true);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  };

  const setLanguageFromLocation = (location: string) => {
    // Only auto-set if user hasn't manually chosen
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const detected = detectLanguageFromLocation(location);
        setLanguageState(detected);
        // Don't save to localStorage - let user override if they want
      }
    }
  };

  const t = (key: string) => translate(key, language);

  // Don't render children until initialized to avoid hydration mismatch
  if (!isInitialized) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, setLanguageFromLocation }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Language selector component
export function LanguageSelector({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all ${
            language === lang
              ? "bg-pink-100 ring-2 ring-pink-400 scale-110"
              : "hover:bg-gray-100"
          }`}
          title={LANGUAGES[lang].label}
        >
          {LANGUAGES[lang].flag}
        </button>
      ))}
    </div>
  );
}
