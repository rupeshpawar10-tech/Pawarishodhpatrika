import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  BookOpen,
  Search,
  Languages,
  Moon,
  Sun,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  FileText,
  Library,
  Music,
  Users,
  Compass,
  Building2,
  Calendar,
  Sparkles,
  Award,
  Landmark,
  Folder,
  Network,
  Database,
  FolderTree,
  Trophy
} from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, isDark, onToggleTheme }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, setRole, canManageCMS } = useAuth();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const rolesList: { role: UserRole; label: string }[] = [
    { role: 'super_admin', label: 'Super Admin (मुख्य प्रशासक)' },
    { role: 'editor', label: 'Editor (संपादक)' },
    { role: 'reviewer', label: 'Reviewer (समीक्षक)' },
    { role: 'author', label: 'Author / Scholar (शोधार्थी)' },
    { role: 'reader', label: 'Reader / Guest (पाठक)' },
  ];

  const handleDropdown = (name: string) => {
    setActiveDropdown(prev => (prev === name ? null : name));
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-amber-50/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-amber-200/60 dark:border-stone-800 transition-colors duration-300">
      {/* Top Banner - Institution Name & Role Switcher */}
      <div className="bg-gradient-to-r from-red-900 via-amber-900 to-red-950 text-amber-100 text-xs py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-3 font-medium">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>माँ ताप्ती शोध संस्थान, मुलताई (बैतूल), म.प्र. • ISSN 2583-987X</span>
          </div>

          <Link
            to="/sitemap"
            className="hidden md:flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 rounded-full text-[11px] font-bold transition"
          >
            <FolderTree className="w-3.5 h-3.5 text-amber-400" />
            <span>साइट निर्देशिका (Sitemap)</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Quick Role Switcher */}
          <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-amber-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] text-amber-200 font-sans hidden sm:inline">भूमिका (Role):</span>
            <select
              value={user.role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="bg-transparent text-amber-100 text-xs border-none focus:ring-0 cursor-pointer py-0 pr-4 font-semibold"
            >
              {rolesList.map(r => (
                <option key={r.role} value={r.role} className="bg-stone-900 text-amber-100">
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/20">
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <button
              onClick={() => setLanguage('hi')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition ${
                language === 'hi' ? 'bg-amber-600 text-white font-bold' : 'text-amber-200 hover:text-white'
              }`}
            >
              हिं
            </button>
            <span className="text-amber-600">|</span>
            <button
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition ${
                language === 'en' ? 'bg-amber-600 text-white font-bold' : 'text-amber-200 hover:text-white'
              }`}
            >
              EN
            </button>
            <span className="text-amber-600">|</span>
            <button
              onClick={() => setLanguage('paw')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition ${
                language === 'paw' ? 'bg-amber-600 text-white font-bold' : 'text-amber-200 hover:text-white'
              }`}
            >
              पवारी
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <Link to="/" onClick={closeMenus} className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-800 to-amber-700 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-stone-900 rounded-[10px] flex items-center justify-center text-amber-400 border border-amber-500/30">
                <BookOpen className="w-6 h-6 stroke-[2.2]" />
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-red-950 dark:text-amber-100 tracking-tight leading-tight group-hover:text-amber-700 dark:group-hover:text-amber-400 transition">
                {t('journalTitle')}
              </h1>
              <p className="text-xs text-amber-900 dark:text-amber-300/80 font-serif font-medium">
                {t('publisher')}
              </p>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-1 font-serif text-sm font-medium text-stone-800 dark:text-stone-200">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg hover:bg-amber-100 dark:hover:bg-stone-800 transition ${
                isActive('/') ? 'text-red-800 dark:text-amber-400 font-bold bg-amber-100/60 dark:bg-stone-800' : ''
              }`}
            >
              {t('home')}
            </Link>

            {/* Research Journal Dropdown */}
            <div className="relative group">
              <button
                onClick={() => handleDropdown('journal')}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-amber-100 dark:hover:bg-stone-800 transition ${
                  isActive('/journal') || isActive('/submit-paper') ? 'text-red-800 dark:text-amber-400 font-bold' : ''
                }`}
              >
                <span>{t('journal')}</span>
                <ChevronDown className="w-4 h-4 opacity-70" />
              </button>
              <div className="absolute left-0 top-full hidden group-hover:block w-56 pt-2 z-50">
                <div className="bg-stone-900 text-stone-100 rounded-xl shadow-xl border border-stone-800 py-2">
                  <Link
                    to="/journal"
                    onClick={closeMenus}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-stone-800 text-xs transition"
                  >
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>सभी वॉल्यूम एवं अंक (Volumes)</span>
                  </Link>
                  <Link
                    to="/editorial-board"
                    onClick={closeMenus}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-stone-800 text-xs transition"
                  >
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>संपादकीय मंडल (Editorial Board)</span>
                  </Link>
                  <Link
                    to="/submit-paper"
                    onClick={closeMenus}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-stone-800 text-xs transition"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{t('submitPaper')}</span>
                  </Link>
                  <Link
                    to="/reviewer-portal"
                    onClick={closeMenus}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-stone-800 text-xs transition"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>समीक्षक पोर्टल (Reviewer Portal)</span>
                  </Link>
                  <Link
                    to="/editor-portal"
                    onClick={closeMenus}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-stone-800 text-xs transition"
                  >
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>संपादक पोर्टल (Editor Portal)</span>
                  </Link>
                  <Link
                    to="/modules/dictionary"
                    onClick={closeMenus}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-stone-800 text-xs transition"
                  >
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>डिजिटल शब्दकोश (Dictionary Module)</span>
                  </Link>
                  <Link
                    to="/modules/lokgeet"
                    onClick={closeMenus}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-stone-800 text-xs transition"
                  >
                    <Music className="w-4 h-4 text-amber-400" />
                    <span>लोकगीत अभिलेखागार (Lokgeet Archive)</span>
                  </Link>
                  <Link
                    to="/modules/books"
                    onClick={closeMenus}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-stone-800 text-xs transition"
                  >
                    <Library className="w-4 h-4 text-amber-400" />
                    <span>ग्रंथालय एवं मोनोग्राफ (Books)</span>
                  </Link>
                  <Link
                    to="/modules/history"
                    onClick={closeMenus}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-stone-800 text-xs transition"
                  >
                    <Landmark className="w-4 h-4 text-amber-400" />
                    <span>इतिहास एवं धरोहर (History Archive)</span>
                  </Link>
                  <Link
                    to="/media-library"
                    onClick={closeMenus}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-stone-800 text-xs transition"
                  >
                    <Folder className="w-4 h-4 text-amber-400" />
                    <span>मीडिया लाइब्रेरी (DAM)</span>
                  </Link>
                  <Link
                    to="/modules/corpus"
                    onClick={closeMenus}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-stone-800 text-xs transition"
                  >
                    <Database className="w-4 h-4 text-amber-400" />
                    <span>शोध कॉर्पस मैनेजर (Corpus Manager)</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quiz & Certification */}
            <Link
              to="/quiz"
              className={`px-3 py-2 rounded-lg hover:bg-amber-100 dark:hover:bg-stone-800 transition flex items-center gap-1 ${
                isActive('/quiz') ? 'text-red-800 dark:text-amber-400 font-bold bg-amber-100/60 dark:bg-stone-800' : ''
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>क्विज़ & प्रमाण-पत्र</span>
            </Link>



            {/* Pawari Archive Dropdown */}
            <div className="relative group">
              <button
                onClick={() => handleDropdown('archive')}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-amber-100 dark:hover:bg-stone-800 transition ${
                  location.pathname.startsWith('/pawari') ? 'text-red-800 dark:text-amber-400 font-bold' : ''
                }`}
              >
                <span>{t('pawariArchive')}</span>
                <ChevronDown className="w-4 h-4 opacity-70" />
              </button>
              <div className="absolute left-0 top-full hidden group-hover:block w-60 pt-2 z-50">
                <div className="bg-stone-900 text-stone-100 rounded-xl shadow-xl border border-stone-800 py-2">
                  <Link
                    to="/pawari/dictionary"
                    onClick={closeMenus}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-stone-800 text-xs transition"
                  >
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>{t('dictionary')}</span>
                  </Link>
                  <Link
                    to="/pawari/grammar"
                    onClick={closeMenus}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-stone-800 text-xs transition"
                  >
                    <Compass className="w-4 h-4 text-amber-400" />
                    <span>{t('grammar')}</span>
                  </Link>
                  <Link
                    to="/pawari/lokgeet"
                    onClick={closeMenus}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-stone-800 text-xs transition"
                  >
                    <Music className="w-4 h-4 text-amber-400" />
                    <span>{t('lokgeet')}</span>
                  </Link>
                  <Link
                    to="/pawari/paheli"
                    onClick={closeMenus}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-stone-800 text-xs transition"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{t('paheli')}</span>
                  </Link>
                  <Link
                    to="/pawari/gotras"
                    onClick={closeMenus}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-stone-800 text-xs transition"
                  >
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>{t('gotraDatabase')}</span>
                  </Link>
                </div>
              </div>
            </div>



            <Link
              to="/sansthan"
              className={`px-3 py-2 rounded-lg hover:bg-amber-100 dark:hover:bg-stone-800 transition ${
                isActive('/sansthan') ? 'text-red-800 dark:text-amber-400 font-bold bg-amber-100/60 dark:bg-stone-800' : ''
              }`}
            >
              {t('sansthan')}
            </Link>

            {/* Admin CMS Button */}
            {canManageCMS && (
              <Link
                to="/admin"
                className="ml-2 px-3.5 py-1.5 rounded-lg bg-red-900 hover:bg-red-950 text-amber-100 text-xs font-sans font-semibold flex items-center gap-1.5 shadow-sm transition"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{t('adminCMS')}</span>
              </Link>
            )}
          </nav>

          {/* Action Buttons (Search & Theme Toggle) */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-xl bg-amber-100/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-200 dark:hover:bg-stone-700 transition flex items-center gap-2 text-xs font-sans px-3"
              title="Global Search"
            >
              <Search className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span className="hidden sm:inline text-stone-600 dark:text-stone-400 font-medium">खोजें (Search)</span>
            </button>

            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-amber-100/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-200 dark:hover:bg-stone-700 transition"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-amber-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-amber-200 dark:hover:bg-stone-700 active:scale-95 transition border border-amber-300/40 dark:border-stone-700 shadow-xs"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-amber-600 dark:text-amber-400 stroke-[2.2] animate-in fade-in zoom-in-90 duration-200" />
              ) : (
                <Menu className="w-6 h-6 text-stone-800 dark:text-amber-400 stroke-[2.2] animate-in fade-in zoom-in-90 duration-200" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu - Complete Public Site Tree Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-950 text-stone-100 px-4 pt-3 pb-8 space-y-4 border-b border-amber-500/30 max-h-[80vh] overflow-y-auto divide-y divide-stone-800 shadow-2xl">
          {/* Main Pages */}
          <div className="space-y-1">
            <Link
              to="/"
              onClick={closeMenus}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-stone-900 text-sm font-bold text-amber-200"
            >
              <span>मुख्य पृष्ठ (Home)</span>
              <Compass className="w-4 h-4 text-amber-400" />
            </Link>
            <Link
              to="/sansthan"
              onClick={closeMenus}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-stone-900 text-sm font-medium text-stone-300"
            >
              <span>संस्थान परिचय (About)</span>
              <Users className="w-4 h-4 text-stone-400" />
            </Link>
          </div>

          {/* Journal Section */}
          <div className="pt-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-wider px-2">
              <span>पवारी शोध पत्रिका (Journal)</span>
              <Award className="w-4 h-4" />
            </div>
            <div className="pl-3 space-y-1 text-xs">
              <Link to="/journal" onClick={closeMenus} className="block py-1.5 text-stone-300 hover:text-amber-300">• शोध पत्रिका परिचय (About Journal)</Link>
              <Link to="/journal" onClick={closeMenus} className="block py-1.5 text-stone-300 hover:text-amber-300">• उद्देश्य एवं कार्यक्षेत्र (Aims & Scope)</Link>
              <Link to="/editorial-board" onClick={closeMenus} className="block py-1.5 text-stone-300 hover:text-amber-300">• संपादकीय मंडल (Editorial Board)</Link>
              <Link to="/submit-paper" onClick={closeMenus} className="block py-1.5 text-amber-400 font-bold">• शोध पत्र सबमिट करें (Author Guidelines)</Link>
              <Link to="/journal" onClick={closeMenus} className="block py-1.5 text-stone-300 hover:text-amber-300">• वॉल्यूम एवं अंक संग्रह (Volumes & Issues)</Link>
            </div>
          </div>

          {/* Language & Culture Digital Humanities */}
          <div className="pt-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-wider px-2">
              <span>भाषाकोश एवं डिजिटल मानविकी</span>
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="pl-3 space-y-1 text-xs">
              <Link to="/pawari/dictionary" onClick={closeMenus} className="block py-1.5 text-stone-300 hover:text-amber-300">• पवारी भाषाकोश (Dictionary & Pronunciation)</Link>
              <Link to="/modules/corpus" onClick={closeMenus} className="block py-1.5 text-stone-300 hover:text-amber-300">• पवारी भाषा कॉर्पस (Corpus & KWIC)</Link>
              <Link to="/pawari/lokgeet" onClick={closeMenus} className="block py-1.5 text-stone-300 hover:text-amber-300">• पवारी लोकगीत संग्रह (Lokgeet Audio & Lyrics)</Link>
              <Link to="/modules/history" onClick={closeMenus} className="block py-1.5 text-stone-300 hover:text-amber-300">• इतिहास, वंशावली व ग्राम (History & Migration)</Link>
              <Link to="/pawari/gotras" onClick={closeMenus} className="block py-1.5 text-stone-300 hover:text-amber-300">• पवार गोत्र वंशावली डेटाबेस (Gotra Database)</Link>
            </div>
          </div>

          {/* Interactive Learning & Tools */}
          <div className="pt-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-wider px-2">
              <span>ज्ञान परीक्षा, डिजिटल टूल व मीडिया</span>
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="pl-3 space-y-1 text-xs">
              <Link to="/quiz" onClick={closeMenus} className="block py-1.5 text-amber-300 font-bold">• क्विज़ एवं ऑनलाइन प्रमाण-पत्र (Quiz & Certification)</Link>
              <Link to="/knowledge-graph" onClick={closeMenus} className="block py-1.5 text-stone-300 hover:text-amber-300">• ज्ञान आरेख (Knowledge Graph Engine)</Link>
              <Link to="/media-library" onClick={closeMenus} className="block py-1.5 text-stone-300 hover:text-amber-300">• मीडिया लाइब्रेरी एवं ऑडियो संग्रह (DAM)</Link>
              <Link to="/modules/books" onClick={closeMenus} className="block py-1.5 text-stone-300 hover:text-amber-300">• ग्रंथालय एवं मोनोग्राफ (Digital Books)</Link>
            </div>
          </div>

          {/* Directory & Admin */}
          <div className="pt-3 space-y-2 text-xs">
            <Link
              to="/sitemap"
              onClick={closeMenus}
              className="flex items-center justify-between py-2 px-3 bg-stone-900 border border-stone-800 rounded-xl text-amber-200 font-bold"
            >
              <span>साइट मैप एवं सम्पूर्ण निर्देशिका (Sitemap)</span>
              <FolderTree className="w-4 h-4 text-amber-400" />
            </Link>

            <Link
              to="/gallery"
              onClick={closeMenus}
              className="block py-1 text-stone-300 hover:text-amber-300"
            >
              चित्र-वीथिका एवं वीडियो संग्रह (Gallery)
            </Link>
            <Link
              to="/events"
              onClick={closeMenus}
              className="block py-1 text-stone-300 hover:text-amber-300"
            >
              समाचार एवं शोध संगोष्ठी (Events & News)
            </Link>

            {canManageCMS && (
              <Link
                to="/admin"
                onClick={closeMenus}
                className="flex items-center justify-center gap-2 py-2.5 mt-3 bg-gradient-to-r from-red-900 to-amber-900 text-amber-100 rounded-xl font-bold text-xs shadow-lg"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>एडमिन सीएमएस कंट्रोल पैनल (Admin Panel)</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
