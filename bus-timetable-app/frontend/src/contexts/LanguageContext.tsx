import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '../translations.ts';

type Language = 'en' | 'bg';

// Helper type to flatten the keys
type FlattenKeys<T, P extends string = ''> = {
  [K in keyof T]: T[K] extends object
    ? FlattenKeys<T[K], `${P}${K & string}.`>
    : `${P}${K & string}`;
}[keyof T];

type TranslationKey = FlattenKeys<typeof translations.en>;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, vars?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'bg') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: TranslationKey, vars: { [key: string]: string | number } = {}): string => {
    const keys = key.split('.');
    let result: any = translations[language];
    for (const k of keys) {
      result = result?.[k];
    }
    
    if (typeof result !== 'string') {
      return key; // Return key if not found
    }

    // Replace variables
    return Object.entries(vars).reduce(
      (acc, [k, v]) => acc.replace(`{{${k}}}`, String(v)),
      result
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 