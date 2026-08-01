import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { StorageEngine } from '../lib/storage';
import { ResearchPaper } from '../types';
import { PdfViewerModal } from '../components/PdfViewerModal';
import {
  BookOpen,
  FileText,
  Library,
  Music,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  Download,
  Eye,
  Calendar,
  Building2,
  Volume2,
  HelpCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [paheliAnswerRevealed, setPaheliAnswerRevealed] = useState(false);

  const siteConfig = StorageEngine.getSiteConfig();
  const papers = StorageEngine.getPapers().filter(p => p.status === 'published');
  const books = StorageEngine.getBooks();
  const dictWords = StorageEngine.getDictionary();
  const lokgeets = StorageEngine.getLokgeet();
  const gotras = StorageEngine.getGotras();
  const events = StorageEngine.getEvents();
  const news = StorageEngine.getNews();

  // Pick word of the day & featured lokgeet
  const wordOfTheDay = dictWords[0] || null;
  const featuredLokgeet = lokgeets[0] || null;
  const featuredPaheli = StorageEngine.getPaheli()[0] || null;

  const navigate = useNavigate();

  const handleReadPaper = (paper: ResearchPaper) => {
    StorageEngine.incrementPaperMetric(paper.id, 'views');
    navigate(`/article/${paper.id}`);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-stone-100 py-16 sm:py-24 border-b border-amber-500/20">
        {/* Subtle Decorative Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Publisher Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-serif shadow-lg">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>{siteConfig.publisherName.hi}</span>
            </div>

            {/* Main Journal Title */}
            <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-amber-100 tracking-tight leading-tight">
              {siteConfig.journalTitle.hi}
            </h1>
            <p className="text-lg sm:text-xl font-serif text-amber-400/90 font-medium">
              {siteConfig.journalTitle.en}
            </p>

            <p className="text-sm sm:text-base text-stone-300 font-serif leading-relaxed max-w-2xl mx-auto">
              {siteConfig.heroBannerSubtitle.hi}
            </p>

            {/* ISSN Badges & Stats */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-amber-300">
              <span className="px-3 py-1 bg-stone-950/80 rounded-lg border border-stone-800">
                Online ISSN: {siteConfig.issnOnline}
              </span>
              <span className="px-3 py-1 bg-stone-950/80 rounded-lg border border-stone-800">
                Print ISSN: {siteConfig.issnPrint}
              </span>
              <span className="px-3 py-1 bg-amber-900/60 text-amber-200 rounded-lg border border-amber-500/30">
                द्विवार्षिक प्रकाशन (June & Dec)
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/journal"
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 text-sm font-sans font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>नवीनतम शोध पत्र पढ़ें (Read Papers)</span>
              </Link>
              <Link
                to="/submit-paper"
                className="px-6 py-3 bg-red-950 hover:bg-red-900 text-amber-100 border border-amber-500/30 text-sm font-sans font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{t('submitPaper')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-amber-900/90 dark:bg-stone-900 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-amber-500/30 text-amber-100 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">2</div>
            <div className="text-xs text-amber-200/80 font-sans mt-1">प्रकाशित अंक (Issues)</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">{papers.length}</div>
            <div className="text-xs text-amber-200/80 font-sans mt-1">शोध पत्र (Papers)</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">{dictWords.length}+</div>
            <div className="text-xs text-amber-200/80 font-sans mt-1">पवारी शब्दकोश (Words)</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">{lokgeets.length}+</div>
            <div className="text-xs text-amber-200/80 font-sans mt-1">लोकगीत आर्काइव</div>
          </div>
          <div className="col-span-2 md:col-span-1">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">{gotras.length}</div>
            <div className="text-xs text-amber-200/80 font-sans mt-1">पवार गोत्र (Clans)</div>
          </div>
        </div>
      </div>

      {/* LATEST RESEARCH PAPERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-widest font-sans">
              <FileText className="w-4 h-4" />
              <span>पीयर-रिव्यूड प्रकाशन</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-amber-100 mt-1">
              नवीनतम शोध पत्र (Latest Papers)
            </h2>
          </div>
          <Link
            to="/journal"
            className="text-xs font-sans font-bold text-amber-800 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>सभी शोध पत्र देखें</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {papers.slice(0, 4).map((paper) => (
            <div
              key={paper.id}
              className="bg-amber-50/50 dark:bg-stone-900 p-6 rounded-2xl border border-amber-200/80 dark:border-stone-800 hover:border-amber-500/50 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-amber-800 dark:text-amber-400">
                  <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950 rounded font-semibold">
                    {paper.category}
                  </span>
                  <span>DOI: {paper.doi}</span>
                </div>

                <h3
                  onClick={() => handleReadPaper(paper)}
                  className="text-lg font-serif font-bold text-stone-900 dark:text-amber-100 leading-snug cursor-pointer hover:text-amber-600 dark:hover:text-amber-300 transition"
                >
                  {paper.title.hi}
                </h3>

                <p className="text-xs text-stone-600 dark:text-stone-300 font-sans font-medium">
                  लेखक: {paper.authors.map(a => a.name).join(', ')}
                </p>

                <p className="text-xs text-stone-700 dark:text-stone-400 font-serif line-clamp-3 leading-relaxed">
                  {paper.abstract.hi}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-amber-200/60 dark:border-stone-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-stone-500 font-mono text-[11px]">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {paper.viewsCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" /> {paper.downloadsCount}
                  </span>
                </div>

                <button
                  onClick={() => handleReadPaper(paper)}
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-amber-100 dark:bg-amber-600 dark:hover:bg-amber-500 dark:text-stone-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition"
                >
                  <span>पढ़ें एवं डाउनलोड करें</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PAWARI CULTURAL PRESERVATION SHOWCASE */}
      <section className="bg-stone-900 text-stone-100 py-16 border-y border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-sans">
              माँ ताप्ती शोध संस्थान आर्काइव
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
              पवारी (भोयरी) भाषा एवं सांस्कृतिक धरोहर
            </h2>
            <p className="text-xs text-stone-400 font-serif">
              सतपुड़ा अंचल की प्राचीन बोली, लोकगीतों, मुहावरों एवं गोत्र प्रणाली का स्थायी डिजिटल संग्रह
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Word of the Day */}
            {wordOfTheDay && (
              <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" /> शब्दकोश (Word of the Day)
                    </span>
                    <span className="px-2 py-0.5 bg-stone-900 rounded text-[10px] text-amber-300 font-mono">
                      {wordOfTheDay.partOfSpeech}
                    </span>
                  </div>

                  <div className="mt-4 pb-3 border-b border-stone-800">
                    <h3 className="text-2xl font-serif font-bold text-amber-200">
                      {wordOfTheDay.wordPawari}
                    </h3>
                    <p className="text-xs text-stone-400 font-mono mt-0.5">
                      Phonetic: {wordOfTheDay.phoneticEn}
                    </p>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div>
                      <span className="text-amber-400 font-semibold">हिंदी अर्थ: </span>
                      <span className="text-stone-200 font-serif">{wordOfTheDay.meaningHindi}</span>
                    </div>
                    <div>
                      <span className="text-amber-400 font-semibold">English Meaning: </span>
                      <span className="text-stone-300 font-sans">{wordOfTheDay.meaningEnglish}</span>
                    </div>
                    {wordOfTheDay.exampleSentencePawari && (
                      <div className="pt-2 italic text-stone-400 font-serif border-t border-stone-900">
                        "{wordOfTheDay.exampleSentencePawari}"
                      </div>
                    )}
                  </div>
                </div>

                <Link
                  to="/pawari/dictionary"
                  className="mt-4 pt-3 border-t border-stone-800 text-xs text-amber-400 font-bold flex items-center justify-between hover:underline"
                >
                  <span>पूरा शब्दकोश खोजें</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Card 2: Featured Lokgeet */}
            {featuredLokgeet && (
              <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Music className="w-4 h-4" /> लोकगीत (Folk Song)
                    </span>
                    <span className="px-2 py-0.5 bg-amber-950 text-amber-300 rounded text-[10px]">
                      {featuredLokgeet.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-amber-200 mt-3">
                    {featuredLokgeet.titleHindi}
                  </h3>

                  <div className="mt-3 p-3 bg-stone-900 rounded-xl border border-stone-800 font-serif text-xs text-stone-300 whitespace-pre-wrap leading-relaxed line-clamp-4">
                    {featuredLokgeet.lyricsDevanagari}
                  </div>
                </div>

                <Link
                  to="/pawari/lokgeet"
                  className="mt-4 pt-3 border-t border-stone-800 text-xs text-amber-400 font-bold flex items-center justify-between hover:underline"
                >
                  <span>सभी लोकगीत सुनें एवं पढ़ें</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Card 3: Paheli Riddle */}
            {featuredPaheli && (
              <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> बुझौ-बुझौ (Riddle)
                    </span>
                  </div>

                  <div className="mt-4 p-4 bg-amber-950/40 rounded-xl border border-amber-500/20 text-center font-serif text-amber-100 text-sm">
                    "{featuredPaheli.questionPawari}"
                  </div>

                  <div className="mt-4 text-center">
                    {!paheliAnswerRevealed ? (
                      <button
                        onClick={() => setPaheliAnswerRevealed(true)}
                        className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold rounded-lg border border-stone-700 transition"
                      >
                        उत्तर देखें (Show Answer)
                      </button>
                    ) : (
                      <div className="p-3 bg-stone-900 rounded-xl border border-amber-500/40 text-xs space-y-1">
                        <span className="text-stone-400">उत्तर: </span>
                        <span className="font-serif font-bold text-amber-300 text-sm">
                          {featuredPaheli.answerHindi}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Link
                  to="/pawari/paheli"
                  className="mt-4 pt-3 border-t border-stone-800 text-xs text-amber-400 font-bold flex items-center justify-between hover:underline"
                >
                  <span>और पहेलियाँ सुलझाएं</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* DIGITAL LIBRARY SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-widest font-sans">
              <Library className="w-4 h-4" />
              <span>डिजिटल पुस्तकालय</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-amber-100 mt-1">
              प्रकाशन एवं संदर्भ ग्रंथ (Books & Manuscripts)
            </h2>
          </div>
          <Link
            to="/library"
            className="text-xs font-sans font-bold text-amber-800 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>पुस्तकालय देखें</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-amber-50/50 dark:bg-stone-900 rounded-2xl border border-amber-200/80 dark:border-stone-800 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition"
            >
              <div className="p-6 space-y-3">
                <div className="w-full h-44 rounded-xl overflow-hidden bg-stone-900 mb-3 border border-stone-800">
                  <img
                    src={book.coverUrl}
                    alt={book.title.hi}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                </div>

                <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-bold rounded">
                  {book.category}
                </span>

                <h3 className="text-base font-serif font-bold text-stone-900 dark:text-amber-100 leading-snug">
                  {book.title.hi}
                </h3>

                <p className="text-xs text-stone-600 dark:text-stone-400 font-sans">
                  लेखक: <span className="font-semibold">{book.author}</span> ({book.year})
                </p>

                <p className="text-xs text-stone-700 dark:text-stone-300 font-serif line-clamp-3 leading-relaxed">
                  {book.description}
                </p>
              </div>

              <div className="p-6 pt-0">
                <a
                  href={book.pdfUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-950 text-amber-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-amber-500/30 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>निशुल्क डाउनलोड (PDF)</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ANNOUNCEMENTS & EVENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <div className="bg-stone-900 text-stone-100 p-8 rounded-2xl border border-amber-500/20 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-lg font-serif font-bold text-amber-200 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <span>आगामी अकादमिक संगोष्ठी एवं कार्यक्रम</span>
              </h3>
              <Link to="/events" className="text-xs text-amber-400 hover:underline">
                सभी देखें
              </Link>
            </div>

            <div className="space-y-4">
              {events.map((evt) => (
                <div key={evt.id} className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                    <span>{evt.date}</span>
                    <span>{evt.location}</span>
                  </div>
                  <h4 className="text-sm font-serif font-bold text-amber-100">
                    {evt.title}
                  </h4>
                  <p className="text-xs text-stone-400 font-serif line-clamp-2">
                    {evt.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Press & News */}
          <div className="bg-stone-900 text-stone-100 p-8 rounded-2xl border border-amber-500/20 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-lg font-serif font-bold text-amber-200 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>सूचना एवं प्रेस विज्ञप्ति</span>
              </h3>
              <Link to="/events" className="text-xs text-amber-400 hover:underline">
                सभी देखें
              </Link>
            </div>

            <div className="space-y-4">
              {news.map((item) => (
                <div key={item.id} className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                    <span className="px-2 py-0.5 bg-red-950 text-amber-300 rounded text-[10px]">
                      {item.category}
                    </span>
                    <span>{item.date}</span>
                  </div>
                  <h4 className="text-sm font-serif font-bold text-amber-100">
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-400 font-serif line-clamp-2">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PDF VIEWER MODAL */}
      <PdfViewerModal
        paper={selectedPaper}
        onClose={() => setSelectedPaper(null)}
      />
    </div>
  );
};
