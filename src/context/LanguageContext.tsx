import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  journalTitle: {
    hi: 'पवारी शोध पत्रिका',
    en: 'Pawari Research Journal',
    paw: 'पवारी सोध पतरीका'
  },
  publisher: {
    hi: 'माँ ताप्ती शोध संस्थान, मुलताई',
    en: 'Maa Tapti Shodh Sansthan, Multai',
    paw: 'माँ ताप्ती सोध संस्थान, मुलताई'
  },
  home: {
    hi: 'मुख्य पृष्ठ',
    en: 'Home',
    paw: 'मुख्य घर'
  },
  journal: {
    hi: 'शोध पत्रिका',
    en: 'Research Journal',
    paw: 'सोध पतरीका'
  },
  volumesAndIssues: {
    hi: 'अंक एवं वॉल्यूम',
    en: 'Volumes & Issues',
    paw: 'अंक अउर वाल्युम'
  },
  library: {
    hi: 'डिजिटल पुस्तकालय',
    en: 'Digital Library',
    paw: 'डिजिटल पोथीघर'
  },
  pawariArchive: {
    hi: 'पवारी धरोहर आर्काइव',
    en: 'Pawari Cultural Archive',
    paw: 'पवारी धरोहर'
  },
  dictionary: {
    hi: 'पवारी शब्दकोश',
    en: 'Pawari Dictionary',
    paw: 'पवारी भाखाकोस'
  },
  grammar: {
    hi: 'व्याकरण निर्देशिका',
    en: 'Grammar Guide',
    paw: 'व्याकरण'
  },
  lokgeet: {
    hi: 'लोकगीत संग्रह',
    en: 'Lokgeet Archive',
    paw: 'लोकगीत'
  },
  paheli: {
    hi: 'पहेलियाँ (बूझौ)',
    en: 'Pawari Riddles',
    paw: 'बुझौ-बुझौ'
  },
  gotraDatabase: {
    hi: 'गोत्र एवं वंशावली',
    en: 'Gotra & Genealogy',
    paw: 'गोत अउर वंशावली'
  },
  historicalDocs: {
    hi: 'ऐतिहासिक दस्तावेज',
    en: 'Historical Documents',
    paw: 'पुराना कागज-पत्र'
  },
  sansthan: {
    hi: 'संस्थान परिचय',
    en: 'About Sansthan',
    paw: 'संस्थान री बात'
  },
  gallery: {
    hi: 'चित्र दीर्घा',
    en: 'Gallery',
    paw: 'फोटो दीर्घा'
  },
  events: {
    hi: 'कार्यक्रम एवं समाचार',
    en: 'Events & News',
    paw: 'कार्यक्रम अउर खबर'
  },
  submitPaper: {
    hi: 'शोध पत्र सबमिट करें',
    en: 'Submit Research Paper',
    paw: 'सोध पत्र भेजौ'
  },
  adminCMS: {
    hi: 'सीएमएस एडमिन',
    en: 'CMS Admin',
    paw: 'सीएमएस एडमिन'
  },
  searchPlaceholder: {
    hi: 'शोध पत्र, शब्दकोश, लोकगीत, गोत्र या पुस्तकें खोजें...',
    en: 'Search research papers, dictionary words, folk songs, gotras, books...',
    paw: 'सोध पत्र, भाखाकोस, लोकगीत, गोत या पोथी खोजौ...'
  },
  peerReviewed: {
    hi: 'पीयर रिव्यूड एवं ओपन एक्सेस',
    en: 'Peer Reviewed & Open Access',
    paw: 'पीयर रिव्यूड अउर खुला एक्सेस'
  },
  downloadPdf: {
    hi: 'पीडीएफ डाउनलोड करें',
    en: 'Download PDF',
    paw: 'पीडीएफ डाउनलोड करौ'
  },
  readPaper: {
    hi: 'शोध पत्र पढ़ें',
    en: 'Read Research Paper',
    paw: 'सोध पत्र पढ़ौ'
  },
  citePaper: {
    hi: 'साइटेशन (Citation) प्राप्त करें',
    en: 'Get Citation',
    paw: 'साइटेशन लेवौ'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('pawari_language');
    return (saved as Language) || 'hi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('pawari_language', lang);
  };

  const t = (key: string, fallback?: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
