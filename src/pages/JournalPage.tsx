import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageEngine } from '../lib/storage';
import { ResearchPaper, JournalVolumeIssue } from '../types';
import { PdfViewerModal } from '../components/PdfViewerModal';
import { BookOpen, FileText, Download, Eye, Filter, Calendar, Award, CheckCircle, ExternalLink, Archive, Layers } from 'lucide-react';

export const JournalPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedIssueId, setSelectedIssueId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);

  const issues = StorageEngine.getIssues();
  const papers = StorageEngine.getPapers().filter(p => p.status === 'published');
  const categories = Array.from(new Set(papers.map(p => p.category)));

  const filteredPapers = papers.filter(p => {
    const matchIssue = selectedIssueId === 'all' || `issue-v${p.volume}i${p.issue}` === selectedIssueId;
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchIssue && matchCategory;
  });

  const handleRead = (paper: ResearchPaper) => {
    StorageEngine.incrementPaperMetric(paper.id, 'views');
    navigate(`/article/${paper.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Compact Journal Header & Current Vol / Archives Bar at Top */}
      <div className="bg-stone-900 text-stone-100 p-6 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <Award className="w-3.5 h-3.5" />
            <span>ISSN: 3048-XXXX • Peer-Reviewed Open Access Research Journal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
            पवारी शोध पत्रिका (Pawari Research Journal)
          </h1>
          <p className="text-xs text-stone-300 font-serif max-w-xl">
            सतपुड़ा एवं ताप्ती अंचल की संस्कृति, भाषाशास्त्र, इतिहास और लोक साहित्य पर आधिकारिक अकादमिक शोध प्रकाशन।
          </p>
        </div>

        {/* Current Vol & Archives Selector Box */}
        <div className="bg-stone-950 p-4 rounded-xl border border-amber-500/40 w-full md:w-auto space-y-2 shrink-0">
          <div className="flex items-center justify-between gap-3 text-xs font-bold text-amber-300">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Current Vol & Archives:</span>
            </span>
            <span className="bg-amber-950 text-amber-200 px-2 py-0.5 rounded text-[10px] font-mono">
              Active Issue
            </span>
          </div>
          <select
            value={selectedIssueId}
            onChange={(e) => setSelectedIssueId(e.target.value)}
            className="w-full md:w-64 bg-stone-900 text-stone-100 px-3 py-2 rounded-lg border border-stone-800 text-xs font-sans focus:outline-none focus:border-amber-500 font-medium"
          >
            <option value="all">📚 सभी अंक (All Volumes & Issues)</option>
            {issues.map(iss => (
              <option key={iss.id} value={iss.id}>
                {iss.title} {iss.isCurrentIssue ? '(Current Issue)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Compact Filter Toolbar */}
      <div className="bg-amber-50/90 dark:bg-stone-900 p-3.5 rounded-xl border border-amber-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs font-sans shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-stone-700 dark:text-stone-300">
            <Filter className="w-3.5 h-3.5 text-amber-600" />
            <span>विषय श्रेणी (Category):</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-stone-800 font-medium focus:outline-none"
          >
            <option value="all">सभी श्रेणियाँ (All Categories)</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="text-stone-500 font-mono text-xs">
          कुल प्रकाशित शोध पत्र: <span className="font-bold text-amber-700 dark:text-amber-400">{filteredPapers.length}</span>
        </div>
      </div>

      {/* Research Papers Compact List */}
      <div className="space-y-4">
        {filteredPapers.length === 0 ? (
          <div className="text-center py-12 bg-stone-900/50 rounded-2xl border border-stone-800 text-stone-400 text-xs">
            <BookOpen className="w-8 h-8 text-stone-600 mx-auto mb-2" />
            <p>चयनित फ़िल्टर के अनुसार कोई शोध पत्र उपलब्ध नहीं है।</p>
          </div>
        ) : (
          filteredPapers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white dark:bg-stone-900 p-5 sm:p-6 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 shadow-sm transition space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-amber-800 dark:text-amber-400">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 rounded font-bold">
                    Vol. {paper.volume}, Issue {paper.issue} ({paper.year})
                  </span>
                  <span className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded font-semibold">
                    {paper.category}
                  </span>
                </div>
                <span className="bg-stone-100 dark:bg-stone-950 px-2 py-0.5 rounded text-stone-500 font-mono">
                  DOI: {paper.doi}
                </span>
              </div>

              <h2
                onClick={() => handleRead(paper)}
                className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-amber-100 leading-snug cursor-pointer hover:text-amber-600 dark:hover:text-amber-300 transition"
              >
                {paper.title.hi}
              </h2>

              <p className="text-xs text-stone-600 dark:text-stone-400 font-sans font-medium">
                <span className="text-amber-700 dark:text-amber-400 font-bold">लेखक / Scholar:</span> {paper.authors.map(a => `${a.name} (${a.affiliation})`).join('; ')}
              </p>

              <div className="bg-stone-50 dark:bg-stone-950/60 p-3 rounded-lg border border-stone-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 font-serif leading-relaxed">
                <span className="font-bold text-amber-800 dark:text-amber-400 font-sans block mb-0.5 text-[10px] uppercase tracking-wider">
                  सारांश (Abstract):
                </span>
                {paper.abstract.hi}
              </div>

              <div className="pt-1 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4 text-stone-500 font-mono text-[11px]">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {paper.viewsCount} views</span>
                  <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" /> {paper.downloadsCount} downloads</span>
                  <span>Pages: {paper.pages}</span>
                </div>

                <button
                  onClick={() => handleRead(paper)}
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-amber-100 dark:bg-amber-600 dark:hover:bg-amber-500 dark:text-stone-950 font-bold rounded-lg flex items-center gap-1.5 transition text-xs shadow"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>शोध पत्र पढ़ें / PDF</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <PdfViewerModal paper={selectedPaper} onClose={() => setSelectedPaper(null)} />
    </div>
  );
};

