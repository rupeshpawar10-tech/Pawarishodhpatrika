import React, { useState } from 'react';
import { StorageEngine } from '../lib/storage';
import { ResearchPaper } from '../types';
import { ShieldCheck, FileText, CheckCircle, Clock, Star, MessageSquare, Download, Eye, Send } from 'lucide-react';

export const ReviewerPortalPage: React.FC = () => {
  const [papers] = useState<ResearchPaper[]>(() => StorageEngine.getPapers().filter(p => p.status === 'under_review' || p.status === 'submitted'));
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);

  // Review Form state
  const [recommendation, setRecommendation] = useState<'accept' | 'minor_revision' | 'major_revision' | 'reject'>('minor_revision');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [commentsToAuthor, setCommentsToAuthor] = useState('');
  const [confidentialEditor, setConfidentialEditor] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaper) return;

    setReviewSubmitted(true);
    alert('समीक्षा (Peer Review) सफलतापूर्वक सबमिट कर दी गई है!');
    setTimeout(() => {
      setReviewSubmitted(false);
      setSelectedPaper(null);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 rounded-2xl border border-amber-500/35 flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>समीक्षक कार्यक्षेत्र (Reviewer Portal & Double-Blind Review)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
            असाइन किए गए शोध पत्र एवं पीयर-रिव्यू
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assigned Papers List */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-4 shadow-sm">
          <h3 className="font-serif font-bold text-stone-900 dark:text-amber-100 text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-600" />
            <span>लंबित समीक्षाएँ ({papers.length})</span>
          </h3>

          <div className="space-y-3">
            {papers.length === 0 ? (
              <p className="text-xs text-stone-500 py-6 text-center">वर्तमान में कोई शोध पत्र समीक्षा हेतु असाइन नहीं है।</p>
            ) : (
              papers.map(paper => (
                <div
                  key={paper.id}
                  onClick={() => setSelectedPaper(paper)}
                  className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
                    selectedPaper?.id === paper.id
                      ? 'border-amber-600 bg-amber-50/50 dark:bg-stone-800'
                      : 'border-stone-200 dark:border-stone-800 hover:border-amber-400'
                  }`}
                >
                  <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded text-[10px] font-bold">
                    {paper.category}
                  </span>
                  <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-xs line-clamp-2">
                    {paper.title.hi}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
                    <span>DOI: {paper.doi}</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">समीक्षा करें →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Review Workspace Form */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-sm">
          {selectedPaper ? (
            <div className="space-y-6">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-600">
                  <span>Double-Blind Peer Review Workspace</span>
                  <span>•</span>
                  <span>{selectedPaper.category}</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-amber-100">
                  {selectedPaper.title.hi}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 font-serif leading-relaxed">
                  <span className="font-bold text-stone-900 dark:text-amber-200">सारांश: </span>
                  {selectedPaper.abstract.hi}
                </p>
                <div className="pt-2">
                  <a
                    href={selectedPaper.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-800 text-amber-100 dark:bg-amber-600 dark:text-stone-950 font-bold rounded-xl text-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>पूर्ण पांडुलिपि (PDF Manuscript) डाउनलोड करें</span>
                  </a>
                </div>
              </div>

              {/* Review Form */}
              <form onSubmit={handleSubmitReview} className="space-y-5 text-xs font-sans">
                <h4 className="font-serif font-bold text-stone-900 dark:text-amber-100 text-sm">
                  मूल्यांकन एवं संस्तुति (Review Evaluation Form)
                </h4>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">अंतिम संस्तुति (Recommendation)*:</label>
                  <select
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value as any)}
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200 font-bold"
                  >
                    <option value="accept">Accept (स्वीकृत)</option>
                    <option value="minor_revision">Minor Revision (आंशिक संशोधन आवश्यक)</option>
                    <option value="major_revision">Major Revision (व्यापक संशोधन आवश्यक)</option>
                    <option value="reject">Reject (अस्वीकृत)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">शोध की प्रमुख ताकतें (Strengths):</label>
                    <textarea
                      rows={3}
                      value={strengths}
                      onChange={(e) => setStrengths(e.target.value)}
                      placeholder="शोध की मौलिकता, डेटा संग्रह, भाषा विश्लेषण..."
                      className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">कमियां व सुधार (Weaknesses / Issues):</label>
                    <textarea
                      rows={3}
                      value={weaknesses}
                      onChange={(e) => setWeaknesses(e.target.value)}
                      placeholder="संदर्भ, व्याकरण या विश्लेषण में सुधार..."
                      className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">लेखक के लिए टिप्पणियाँ (Comments to Author):</label>
                  <textarea
                    rows={4}
                    value={commentsToAuthor}
                    onChange={(e) => setCommentsToAuthor(e.target.value)}
                    placeholder="रचनात्मक सुझाव..."
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">संपादक के लिए गोपनीय टिप्पणियाँ (Confidential to Editor):</label>
                  <textarea
                    rows={2}
                    value={confidentialEditor}
                    onChange={(e) => setConfidentialEditor(e.target.value)}
                    placeholder="गोपनीय नोट्स..."
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>समीक्षा रिपोर्ट फाइनल सबमिट करें</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-24 text-stone-500 space-y-3">
              <FileText className="w-12 h-12 text-stone-600 mx-auto" />
              <p className="text-sm font-serif">समीक्षा करने के लिए बाईं सूची से कोई शोध पत्र चुनें।</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
