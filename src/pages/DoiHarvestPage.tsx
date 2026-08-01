import React, { useState, useEffect } from 'react';
import { 
  FileSearch, Download, Plus, CheckCircle2, AlertCircle, RefreshCw, Search, ExternalLink, BookOpen, Layers, ShieldCheck, Database, Loader2, Trash2
} from 'lucide-react';
import { HarvestedPaper, ImportLog, MetadataProvider } from '../types/doiHarvesting';
import { DoiHarvestService } from '../services/doiHarvestService';
import { PdfReaderModal } from '../components/PdfReaderModal';

export const DoiHarvestPage: React.FC = () => {
  const [papers, setPapers] = useState<HarvestedPaper[]>([]);
  const [logs, setLogs] = useState<ImportLog[]>([]);
  const [identifierInput, setIdentifierInput] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<MetadataProvider>('crossref');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePdf, setActivePdf] = useState<{ url: string; title: string; author: string } | null>(null);

  const loadData = () => {
    setPapers(DoiHarvestService.getPapers());
    setLogs(DoiHarvestService.getLogs());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('papers_harvested', handleUpdate);
    return () => window.removeEventListener('papers_harvested', handleUpdate);
  }, []);

  const handleHarvest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifierInput.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const harvested = await DoiHarvestService.lookupIdentifier(identifierInput, selectedProvider);
      setSuccessMsg(`सफलतापूर्वक मेटाडेटा हार्वेस्ट किया गया: "${harvested.title}"`);
      setIdentifierInput('');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'मेटाडेटा हार्वेस्ट करने में विफल।');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (recordId: string) => {
    if (confirm('क्या आप वाकई इस शोध पत्र को हटाना चाहते हैं?')) {
      DoiHarvestService.deletePaper(recordId);
      loadData();
    }
  };

  const filteredPapers = papers.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.identifierValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.journalOrPublisher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 sm:p-10 rounded-3xl border border-amber-500/35 flex flex-wrap items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <FileSearch className="w-4 h-4" />
            <span>DOI & मेटाडेटा हार्वेस्टिंग इंजन (DOI Import & Metadata Engine)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100">
            स्वचालित DOI, ISBN एवं मेटाडेटा हार्वेस्टिंग
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl">
            Crossref, DataCite, OpenAlex, PubMed, और arXiv से सीधे DOI दर्ज कर शोध पत्रों का पूर्ण मेटाडेटा, लेखक क्रेडेंशियल, और पीडीएफ स्वतः संकलित करें।
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <span className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-bold font-mono">
            {papers.length} Harvested Records
          </span>
        </div>
      </div>

      {/* Harvest Form Card */}
      <div className="bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl space-y-6">
        <h2 className="text-lg font-serif font-bold text-amber-100">नया पहचानकर्ता दर्ज करें (Enter DOI, ISBN or arXiv ID)</h2>
        
        <form onSubmit={handleHarvest} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 absolute left-4 top-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="जैसे: 10.1016/j.culher.2025.04.012 या arXiv:2501.09842"
                value={identifierInput}
                onChange={e => setIdentifierInput(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-stone-200 outline-none focus:border-amber-500 font-mono"
                required
              />
            </div>

            <div>
              <select
                value={selectedProvider}
                onChange={e => setSelectedProvider(e.target.value as MetadataProvider)}
                className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-amber-300 font-mono outline-none focus:border-amber-500"
              >
                <option value="crossref">Crossref Provider</option>
                <option value="datacite">DataCite Provider</option>
                <option value="openalex">OpenAlex API</option>
                <option value="pubmed">PubMed / PMC</option>
                <option value="openaire">arXiv / OpenAIRE</option>
                <option value="semantic_scholar">Semantic Scholar</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="text-xs text-stone-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>स्वचालित रूप से DOI सत्यापन, SHA-256 चेकसम एवं डेटाबेस मैपिंग की जाएगी।</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-2xl shadow-lg transition flex items-center gap-2 text-xs disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>{loading ? 'मेटाडेटा हार्वेस्ट हो रहा है...' : 'मेटाडेटा हार्वेस्ट करें (Import)'}</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-950/80 border border-red-900 text-red-200 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-950/80 border border-emerald-900 text-emerald-200 rounded-2xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}
        </form>
      </div>

      {/* Papers Grid */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-serif font-bold text-amber-100">हार्वेस्ट किए गए शोध पत्र ({filteredPapers.length})</h2>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="शीर्षक या DOI खोजें..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-stone-900 rounded-xl border border-stone-800 text-xs text-stone-200 outline-none focus:border-amber-500 w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPapers.map(paper => (
            <div key={paper.recordId} className="bg-stone-900 p-6 rounded-3xl border border-stone-800 space-y-4 shadow-xl hover:border-amber-500/40 transition flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-bold font-mono uppercase">
                    {paper.identifierType.toUpperCase()} • {paper.provider}
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded text-[10px] font-bold">
                    {paper.isOpenAccess ? 'Open Access' : 'Subscribed'}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-serif font-bold text-stone-100 leading-snug">{paper.title}</h3>
                  <p className="text-xs text-amber-400/90 font-medium">
                    {paper.authors.map(a => a.fullName).join(', ')} • <span className="text-stone-400">{paper.journalOrPublisher} ({paper.publicationDate})</span>
                  </p>
                </div>

                <p className="text-xs text-stone-400 leading-relaxed line-clamp-3">
                  {paper.abstractText}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {paper.keywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 bg-stone-950 border border-stone-800 text-stone-300 rounded-md text-[10px] font-mono">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-amber-200 truncate max-w-[200px]" title={paper.identifierValue}>
                  {paper.identifierValue}
                </span>

                <div className="flex items-center gap-2">
                  {paper.pdfUrl && (
                    <button
                      onClick={() => setActivePdf({ url: paper.pdfUrl!, title: paper.title, author: paper.authors[0]?.fullName })}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl transition flex items-center gap-1 shadow"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>पढ़ें</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(paper.recordId)}
                    className="p-2 bg-red-950/60 hover:bg-red-950 text-red-300 border border-red-900 rounded-xl transition"
                    title="Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Built-in PDF Reader Modal */}
      <PdfReaderModal
        isOpen={!!activePdf}
        onClose={() => setActivePdf(null)}
        pdfUrl={activePdf?.url || ''}
        title={activePdf?.title || ''}
        author={activePdf?.author}
      />
    </div>
  );
};
