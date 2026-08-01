import React, { useState } from 'react';
import { StorageEngine } from '../lib/storage';
import { ResearchPaper } from '../types';
import { useAuth } from '../context/AuthContext';
import { FileText, Plus, Clock, CheckCircle, AlertTriangle, Upload, ChevronRight, Eye } from 'lucide-react';

export const AuthorPortalPage: React.FC = () => {
  const { user } = useAuth();
  const [papers, setPapers] = useState<ResearchPaper[]>(() => StorageEngine.getPapers());
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'submitted' | 'review' | 'published'>('all');
  const [showNewModal, setShowNewModal] = useState(false);

  // New Paper form state
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [category, setCategory] = useState('Linguistics');
  const [keywords, setKeywords] = useState('');
  const [pdfUrl, setPdfUrl] = useState('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');

  const handleCreatePaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !abstract) return;

    const newPaper: ResearchPaper = {
      id: `paper-${Date.now()}`,
      title: { hi: title, en: title },
      abstract: { hi: abstract, en: abstract },
      authors: [
        {
          name: user?.name || 'शोधार्थी',
          affiliation: user?.affiliation || 'माँ ताप्ती शोध संस्थान',
          email: user?.email,
        }
      ],
      category,
      keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
      doi: `10.5281/pawari.${Date.now().toString().slice(-4)}`,
      volume: 2,
      issue: 1,
      year: 2026,
      month: 'June',
      pages: '01-15',
      pdfUrl,
      publicationDate: new Date().toISOString().split('T')[0],
      viewsCount: 0,
      downloadsCount: 0,
      status: 'submitted',
    };

    StorageEngine.savePaper(newPaper);
    setPapers(StorageEngine.getPapers());
    setShowNewModal(false);
    setTitle('');
    setAbstract('');
    setKeywords('');
    alert('शोध पत्र सफलतापूर्वक सबमिट किया गया!');
  };

  const myPapers = papers; // In real app, filtered by user ID or author name

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 rounded-2xl border border-amber-500/35 flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>लेखक सबमिशन पोर्टल (Author Portal)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
            मेरे शोध पत्र एवं पांडुलिपि प्रबंधन
          </h1>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl flex items-center gap-2 shadow transition text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>नया शोध पत्र सबमिट करें</span>
        </button>
      </div>

      {/* Stats & Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-sans">
        <div className="bg-amber-50/60 dark:bg-stone-900 p-5 rounded-2xl border border-amber-200 dark:border-stone-800 space-y-1">
          <span className="text-stone-500 font-bold">कुल सबमिशन</span>
          <p className="text-2xl font-serif font-bold text-amber-700 dark:text-amber-400">{myPapers.length}</p>
        </div>
        <div className="bg-amber-50/60 dark:bg-stone-900 p-5 rounded-2xl border border-amber-200 dark:border-stone-800 space-y-1">
          <span className="text-stone-500 font-bold">समीक्षाधीन (Under Review)</span>
          <p className="text-2xl font-serif font-bold text-blue-600 dark:text-blue-400">
            {myPapers.filter(p => p.status === 'under_review' || p.status === 'submitted').length}
          </p>
        </div>
        <div className="bg-amber-50/60 dark:bg-stone-900 p-5 rounded-2xl border border-amber-200 dark:border-stone-800 space-y-1">
          <span className="text-stone-500 font-bold">स्वीकृत (Accepted)</span>
          <p className="text-2xl font-serif font-bold text-green-600 dark:text-green-400">
            {myPapers.filter(p => p.status === 'accepted').length}
          </p>
        </div>
        <div className="bg-amber-50/60 dark:bg-stone-900 p-5 rounded-2xl border border-amber-200 dark:border-stone-800 space-y-1">
          <span className="text-stone-500 font-bold">प्रकाशित (Published)</span>
          <p className="text-2xl font-serif font-bold text-amber-600 dark:text-amber-400">
            {myPapers.filter(p => p.status === 'published').length}
          </p>
        </div>
      </div>

      {/* Papers List */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <h3 className="font-serif font-bold text-stone-900 dark:text-amber-100 text-sm">सबमिशन सूची (Submissions)</h3>
        </div>
        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {myPapers.map(paper => (
            <div key={paper.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50 dark:hover:bg-stone-800/40 transition">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2 text-[11px] font-mono text-amber-700 dark:text-amber-400">
                  <span>DOI: {paper.doi}</span>
                  <span>•</span>
                  <span>{paper.category}</span>
                </div>
                <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base">{paper.title.hi}</h4>
                <p className="text-xs text-stone-500 line-clamp-1">{paper.abstract.hi}</p>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  paper.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300' :
                  paper.status === 'accepted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                  paper.status === 'under_review' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                  'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300'
                }`}>
                  {paper.status}
                </span>

                <a
                  href={paper.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-lg text-xs font-bold hover:bg-amber-100 dark:hover:bg-stone-700 transition flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>पीडीएफ देखें</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Submission Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 w-full max-w-2xl rounded-2xl border border-stone-200 dark:border-stone-800 p-8 space-y-6 shadow-2xl font-sans text-xs">
            <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-amber-100">नया शोध पत्र सबमिट करें</h3>
            
            <form onSubmit={handleCreatePaper} className="space-y-4">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">शोध पत्र का शीर्षक (Title)*:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="उदा. पवारी भाषा और लोकसंस्कृति..."
                  className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">श्रेणी (Category):</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                  >
                    <option value="Linguistics">Linguistics (भाषाविज्ञान)</option>
                    <option value="History">History (इतिहास)</option>
                    <option value="Folklore">Folklore (लोकसाहित्य)</option>
                    <option value="Culture">Culture (संस्कृति)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">कीवर्ड्स (Keywords):</label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="पवारी, सतपुड़ा, व्याकरण"
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">सारांश (Abstract)*:</label>
                <textarea
                  required
                  rows={4}
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  placeholder="शोध पत्र का सारांश..."
                  className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">पांडुलिपि पीडीएफ लिंक (PDF URL):</label>
                <input
                  type="text"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200 font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-5 py-2.5 bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold rounded-xl"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-600 text-stone-950 font-bold rounded-xl hover:bg-amber-500 shadow"
                >
                  सबमिट करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
