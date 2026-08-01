import React, { useState } from 'react';
import { StorageEngine } from '../lib/storage';
import { ResearchPaper } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  FileText, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Send, 
  BookOpen, 
  Calendar, 
  Plus, 
  Award,
  Layers,
  Check
} from 'lucide-react';

export const EditorPortalPage: React.FC = () => {
  const { user } = useAuth();
  const [papers, setPapers] = useState<ResearchPaper[]>(() => StorageEngine.getPapers());
  const [activeTab, setActiveTab] = useState<'submissions' | 'screening' | 'reviewers' | 'decisions' | 'volumes'>('submissions');
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);

  // Decision state
  const [decisionType, setDecisionType] = useState<'accepted' | 'minor_revision' | 'major_revision' | 'rejected'>('minor_revision');
  const [decisionNote, setDecisionNote] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateStatus = (paperId: string, newStatus: ResearchPaper['status']) => {
    const paper = papers.find(p => p.id === paperId);
    if (paper) {
      paper.status = newStatus;
      StorageEngine.savePaper(paper);
      setPapers(StorageEngine.getPapers());
      showToast(`शोध पत्र की स्थिति बदलकर "${newStatus}" कर दी गई है।`);
    }
  };

  const handleIssueDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaper) return;

    let status: ResearchPaper['status'] = 'under_review';
    if (decisionType === 'accepted') status = 'accepted';
    else if (decisionType === 'rejected') status = 'rejected';
    else status = 'under_review';

    selectedPaper.status = status;
    StorageEngine.savePaper(selectedPaper);
    setPapers(StorageEngine.getPapers());
    showToast(`निर्णय पत्र (${decisionType}) सफलताપूर्वक जारी किया गया!`);
    setSelectedPaper(null);
    setDecisionNote('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-amber-600 text-stone-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 rounded-2xl border border-amber-500/35 flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>संपादकीय कार्यक्षेत्र (Editorial Workspace & Workflow Engine)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
            मुख्य संपादक पोर्टल (Editor-in-Chief & Managing Editor Portal)
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-mono font-bold">
            भूमिका: {user.role}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-amber-200 dark:border-stone-800 gap-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'submissions', label: `नई सबमिशन (${papers.filter(p => p.status === 'submitted').length})`, icon: FileText },
          { id: 'screening', label: `स्क्रीनिंग कतार (${papers.filter(p => p.status === 'draft' || p.status === 'submitted').length})`, icon: CheckCircle },
          { id: 'reviewers', label: `समीक्षक असाइनमेंट (${papers.filter(p => p.status === 'under_review').length})`, icon: Users },
          { id: 'decisions', label: 'संपादकीय निर्णय (Decisions)', icon: Award },
          { id: 'volumes', label: 'खंड एवं अंक (Volumes & Issues)', icon: Layers },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-amber-600 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-stone-900/50'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SUBMISSIONS & SCREENING */}
      {(activeTab === 'submissions' || activeTab === 'screening') && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <h3 className="font-serif font-bold text-stone-900 dark:text-amber-100 text-sm">
                शोध पत्र सबमिशन कतार (Submission & Screening Queue)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 dark:bg-stone-950 text-stone-700 dark:text-stone-300 uppercase font-bold border-b border-stone-200 dark:border-stone-800">
                  <tr>
                    <th className="p-4">शीर्षक (Title)</th>
                    <th className="p-4">लेखक</th>
                    <th className="p-4">श्रेणी</th>
                    <th className="p-4">स्थिति (Status)</th>
                    <th className="p-4 text-right">संपादकीय कार्रवाई (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {papers.map(paper => (
                    <tr key={paper.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition">
                      <td className="p-4 font-serif font-bold text-stone-900 dark:text-stone-100 max-w-xs truncate">
                        {paper.title.hi}
                      </td>
                      <td className="p-4 text-stone-600 dark:text-stone-400">
                        {paper.authors.map(a => a.name).join(', ')}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded text-[10px] font-bold">
                          {paper.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          paper.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300' :
                          paper.status === 'accepted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                          paper.status === 'under_review' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                          'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300'
                        }`}>
                          {paper.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleUpdateStatus(paper.id, 'under_review')}
                          className="px-2.5 py-1 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded font-bold hover:bg-blue-200 transition"
                        >
                          समीक्षा हेतु भेजें (Review)
                        </button>
                        <button
                          onClick={() => setSelectedPaper(paper)}
                          className="px-2.5 py-1 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 rounded font-bold hover:bg-amber-200 transition"
                        >
                          निर्णय दें (Decision)
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REVIEWER ASSIGNMENT */}
      {activeTab === 'reviewers' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-6 shadow-sm">
          <h3 className="font-serif font-bold text-stone-900 dark:text-amber-100 text-sm">
            पीयर-रिव्यूअर असाइनमेंट एवं डबल-ब्लाइंड नियंत्रण (Reviewer Management)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {papers.map(paper => (
              <div key={paper.id} className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 space-y-3">
                <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded text-[10px] font-bold">
                  {paper.category}
                </span>
                <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">{paper.title.hi}</h4>
                <div className="text-xs text-stone-500 font-mono">DOI: {paper.doi}</div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300">असाइन समीक्षक: डॉ. रामेश्वर पवार, प्रो. एस. के. वर्मा</span>
                  <button
                    onClick={() => showToast(`समीक्षक आमंत्रण फिर से भेजा गया: ${paper.title.hi}`)}
                    className="px-3 py-1.5 bg-amber-600 text-stone-950 font-bold rounded-lg text-xs hover:bg-amber-500 transition"
                  >
                    समीक्षक बदलें / जोड़ें
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: EDITORIAL DECISIONS */}
      {activeTab === 'decisions' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-sm">
          <h3 className="font-serif font-bold text-stone-900 dark:text-amber-100 text-base">
            औपचारिक संपादकीय निर्णय एवं पत्र जारी करना (Editorial Decision Engine)
          </h3>
          {selectedPaper ? (
            <form onSubmit={handleIssueDecision} className="space-y-4 text-xs font-sans">
              <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
                <span className="font-bold text-amber-600">चयनित शोध पत्र:</span>
                <p className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">{selectedPaper.title.hi}</p>
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">निर्णय प्रकार (Decision Type)*:</label>
                <select
                  value={decisionType}
                  onChange={(e) => setDecisionType(e.target.value as any)}
                  className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200 font-bold"
                >
                  <option value="accepted">Accept (स्वीकृत - प्रकाशन हेतु)</option>
                  <option value="minor_revision">Minor Revision (आंशिक संशोधन आवश्यक)</option>
                  <option value="major_revision">Major Revision (व्यापक संशोधन आवश्यक)</option>
                  <option value="rejected">Reject (अस्वीकृत)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">संपादकीय पत्र / टिप्पणियाँ (Decision Letter)*:</label>
                <textarea
                  required
                  rows={4}
                  value={decisionNote}
                  onChange={(e) => setDecisionNote(e.target.value)}
                  placeholder="समीक्षकों की टिप्पणियों के साथ लेखक को पत्र..."
                  className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200 font-serif"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPaper(null)}
                  className="px-5 py-2.5 bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold rounded-xl"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-600 text-stone-950 font-bold rounded-xl hover:bg-amber-500 shadow font-bold"
                >
                  निर्णय पत्र जारी करें (Issue Decision)
                </button>
              </div>
            </form>
          ) : (
            <p className="text-xs text-stone-500 py-6 text-center">
              निर्णय जारी करने के लिए ऊपर 'सबमिशन' टैब से किसी शोध पत्र पर 'निर्णय दें' क्लिक करें।
            </p>
          )}
        </div>
      )}

      {/* TAB 5: VOLUMES & ISSUES MANAGEMENT */}
      {activeTab === 'volumes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-stone-900 dark:text-amber-100 text-base">
              शोध पत्रिका खंड एवं अंक प्रबंधन (Volume & Issue Management)
            </h3>
            <button
              onClick={() => showToast('नया खंड/अंक सृजन फॉर्म खुला।')}
              className="px-4 py-2 bg-amber-600 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>नया खंड (New Volume)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded text-xs font-bold">
                  Volume 2, Issue 1 (2026)
                </span>
                <span className="text-xs font-bold text-green-600">प्रकाशित (Published)</span>
              </div>
              <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base">
                पवारी भाषा, लोकसाहित्य एवं सतपुड़ा संस्कृति विशेषांक
              </h4>
              <p className="text-xs text-stone-500 font-mono">ISSN: 3048-5291 • कुल लेख: 12 • ऑनलाइन DOI लिंक्ड</p>
            </div>

            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 rounded text-xs font-bold">
                  Volume 2, Issue 2 (2026 - आगामी)
                </span>
                <span className="text-xs font-bold text-amber-600">प्रगति पर (In Progress)</span>
              </div>
              <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base">
                ऐतिहासिक अभिलेख एवं पवारी व्याकरण विशेषांक
              </h4>
              <p className="text-xs text-stone-500 font-mono">असाइन लेख: 5 • प्रकाशन तिथि: दिसंबर 2026</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
