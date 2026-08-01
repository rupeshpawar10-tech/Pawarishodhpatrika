import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, MapPin, Mail, Phone, Award, ShieldCheck, Download, ArrowUp, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 font-sans transition-colors duration-300">
      {/* Top Banner Accent */}
      <div className="bg-gradient-to-r from-red-900 via-amber-700 to-red-950 h-1.5 w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Publisher & Journal Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-900 flex items-center justify-center text-amber-400 border border-amber-500/40">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-amber-100">
                  {t('journalTitle')}
                </h3>
                <p className="text-xs text-amber-400 font-serif">
                  {t('publisher')}
                </p>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-serif">
              सतपुड़ा अंचल की प्राचीन पवारी (भोयरी) भाषा, लोक संस्कृति, परमार-पवार राजवंश का इतिहास एवं सांस्कृतिक धरोहर का प्रामाणिक द्विवार्षिक अनुसंधान मंच।
            </p>
            <div className="pt-2 space-y-1 text-xs text-stone-400 font-mono">
              <p className="flex items-center gap-1.5 text-amber-300/90">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>ISSN Online: 2583-987X</span>
              </p>
              <p className="flex items-center gap-1.5 text-amber-300/90">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>ISSN Print: 2583-9861</span>
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-serif font-bold text-amber-200 uppercase tracking-wider mb-4 pb-1 border-b border-stone-800">
              त्वरित लिंक (Navigation)
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  • {t('home')}
                </Link>
              </li>
              <li>
                <Link to="/journal" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  • {t('journal')} (Volumes & Issues)
                </Link>
              </li>
              <li>
                <Link to="/submit-paper" className="hover:text-amber-400 transition flex items-center gap-1.5 text-amber-300 font-medium">
                  • {t('submitPaper')}
                </Link>
              </li>
              <li>
                <Link to="/library" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  • {t('library')}
                </Link>
              </li>
              <li>
                <Link to="/sansthan" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  • {t('sansthan')}
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  • {t('events')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Pawari Digital Archive */}
          <div>
            <h4 className="text-sm font-serif font-bold text-amber-200 uppercase tracking-wider mb-4 pb-1 border-b border-stone-800">
              {t('pawariArchive')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/pawari/dictionary" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  • {t('dictionary')}
                </Link>
              </li>
              <li>
                <Link to="/pawari/grammar" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  • {t('grammar')}
                </Link>
              </li>
              <li>
                <Link to="/pawari/lokgeet" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  • {t('lokgeet')}
                </Link>
              </li>
              <li>
                <Link to="/pawari/paheli" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  • {t('paheli')}
                </Link>
              </li>
              <li>
                <Link to="/pawari/gotras" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  • {t('gotraDatabase')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Open Access */}
          <div className="space-y-4">
            <h4 className="text-sm font-serif font-bold text-amber-200 uppercase tracking-wider mb-4 pb-1 border-b border-stone-800">
              संपर्क (Contact Us)
            </h4>
            <div className="space-y-2 text-xs text-stone-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>ताप्ती सरोवर मार्ग, मुलताई, जिला बैतूल (म.प्र.) 460661</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>editor@pawariresearch.org</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 94250 84720, +91 7147 223401</span>
              </p>
            </div>

            <div className="pt-2 border-t border-stone-800">
              <span className="inline-block px-2.5 py-1 bg-amber-950/80 text-amber-300 border border-amber-500/30 rounded text-[11px] font-mono">
                Open Access Policy (CC BY 4.0)
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} माँ ताप्ती शोध संस्थान, मुलताई (मध्यप्रदेश)। सर्वाधिकार सुरक्षित।
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition"
            >
              <span>ऊपर जाएँ (Top)</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
