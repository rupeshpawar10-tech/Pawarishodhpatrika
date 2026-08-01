import React, { useState } from 'react';
import { ResearchPaper } from '../types';
import { StorageEngine } from '../lib/storage';
import { forceDownloadBase64Pdf } from '../lib/pdfUtils';
import { useNavigate } from 'react-router-dom';
import { X, Download, Copy, Check, FileText, ExternalLink, Share2, Award, Maximize2 } from 'lucide-react';

interface PdfViewerModalProps {
  paper: ResearchPaper | null;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ paper, onClose }) => {
  const navigate = useNavigate();
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [citationFormat, setCitationFormat] = useState<'APA' | 'MLA' | 'Chicago' | 'BibTeX'>('APA');

  if (!paper) return null;

  const handleDownload = () => {
    StorageEngine.incrementPaperMetric(paper.id, 'downloads');
    const safeName = `${paper.title.hi.replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '_')}.pdf`;
    forceDownloadBase64Pdf(paper.pdfUrl, safeName);
  };

  const handleOpenFullPage = () => {
    onClose();
    navigate(`/article/${paper.id}`);
  };

  const getCitation = () => {
    const authors = paper.authors.map(a => a.name).join(', ');
    const title = paper.title.hi;
    const year = paper.year;
    const doi = paper.doi;

    if (citationFormat === 'APA') {
      return `${authors} (${year}). ${title}. पवारी शोध पत्रिका, 1(${paper.issue}), ${paper.pages}. https://doi.org/${doi}`;
    }
    if (citationFormat === 'MLA') {
      return `${authors}. "${title}." पवारी शोध पत्रिका, vol. 1, no. ${paper.issue}, ${year}, pp. ${paper.pages}. DOI: ${doi}.`;
    }
    if (citationFormat === 'Chicago') {
      return `${authors}. "${title}." पवारी शोध पत्रिका 1, no. ${paper.issue} (${year}): ${paper.pages}. https://doi.org/${doi}.`;
    }
    return `@article{pawari_${paper.id},\n  author = {${authors}},\n  title = {${title}},\n  journal = {पवारी शोध पत्रिका (Pawari Research Journal)},\n  year = {${year}},\n  volume = {1},\n  number = {${paper.issue}},\n  pages = {${paper.pages}},\n  doi = {${doi}}\n}`;
  };

  const copyCitation = () => {
    navigator.clipboard.writeText(getCitation());
    setCopiedFormat(citationFormat);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-stone-900 border border-amber-500/30 text-stone-100 w-full max-w-5xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="bg-stone-950 p-4 border-b border-stone-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-950 text-amber-400 rounded-lg border border-amber-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-serif font-bold text-amber-100 line-clamp-1">
                {paper.title.hi}
              </h3>
              <p className="text-xs text-amber-400/90 font-mono">
                DOI: {paper.doi} • Vol. {paper.volume} Issue {paper.issue} ({paper.year})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleOpenFullPage}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold rounded-lg flex items-center gap-1.5 transition border border-amber-500/30"
              title="Full Page View"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline">फुल व्यू</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">डाउनलोड</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-100 rounded-lg bg-stone-800 hover:bg-stone-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Two Column / Viewer */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3">
          {/* PDF Frame / Dummy Reader */}
          <div className="lg:col-span-2 bg-stone-950 p-4 flex flex-col items-center justify-center border-r border-stone-800 relative">
            <div className="w-full h-full bg-stone-900 rounded-xl border border-stone-800 p-6 overflow-y-auto font-serif text-stone-200 leading-relaxed text-sm space-y-4">
              <div className="text-center pb-4 border-b border-stone-800">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-sans">
                  माँ ताप्ती शोध संस्थान • पवारी शोध पत्रिका
                </span>
                <h2 className="text-xl font-bold text-amber-100 mt-2">
                  {paper.title.hi}
                </h2>
                <p className="text-sm text-stone-400 mt-1 font-sans">
                  {paper.authors.map(a => `${a.name} (${a.affiliation})`).join('; ')}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-sans font-bold text-amber-400 uppercase tracking-wider mb-2">
                  सारांश (Abstract)
                </h4>
                <p className="text-stone-300 bg-stone-950/60 p-4 rounded-xl border border-stone-800/80">
                  {paper.abstract.hi}
                </p>
              </div>

              {paper.abstract.en && (
                <div>
                  <h4 className="text-xs font-sans font-bold text-amber-400 uppercase tracking-wider mb-2">
                    Abstract (English)
                  </h4>
                  <p className="text-stone-300 bg-stone-950/60 p-4 rounded-xl border border-stone-800/80 font-sans text-xs">
                    {paper.abstract.en}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-stone-800 flex flex-wrap gap-2 text-xs font-sans">
                <span className="font-bold text-amber-400">कीवर्ड्स:</span>
                {paper.keywords.map(k => (
                  <span key={k} className="px-2 py-0.5 bg-stone-800 rounded border border-stone-700 text-stone-300">
                    {k}
                  </span>
                ))}
              </div>

              <div className="p-4 bg-amber-950/30 border border-amber-500/20 rounded-xl text-center text-xs text-amber-200">
                <p>पूर्ण पीडीएफ दस्तावेज़ देखने तथा प्रिंट करने हेतु ऊपर डाउनलोड बटन का उपयोग करें।</p>
              </div>
            </div>
          </div>

          {/* Citation & Metadata Sidebar */}
          <div className="bg-stone-900 p-6 overflow-y-auto space-y-6">
            <div>
              <h4 className="text-xs font-sans font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>साइटेशन जनरेटर (Citation Generator)</span>
              </h4>

              <div className="flex gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs mb-3 font-mono">
                {(['APA', 'MLA', 'Chicago', 'BibTeX'] as const).map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setCitationFormat(fmt)}
                    className={`flex-1 py-1 rounded-lg transition ${
                      citationFormat === fmt
                        ? 'bg-amber-600 text-stone-950 font-bold'
                        : 'text-stone-400 hover:text-stone-100'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs text-stone-300 font-mono relative">
                <p className="pr-8 whitespace-pre-wrap leading-relaxed">{getCitation()}</p>
                <button
                  onClick={copyCitation}
                  className="absolute top-2 right-2 p-1.5 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-lg transition"
                  title="Copy Citation"
                >
                  {copiedFormat === citationFormat ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800 space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-stone-950 rounded-xl border border-stone-800">
                <span className="text-stone-400">कुल व्यूज (Views):</span>
                <span className="font-bold text-amber-300 font-mono">{paper.viewsCount}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-stone-950 rounded-xl border border-stone-800">
                <span className="text-stone-400">डाउनलोड्स (Downloads):</span>
                <span className="font-bold text-amber-300 font-mono">{paper.downloadsCount}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-stone-950 rounded-xl border border-stone-800">
                <span className="text-stone-400">प्रकाशन तिथि:</span>
                <span className="font-bold text-stone-200">{paper.publicationDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
