import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Search, ShieldCheck, Download, Copy, Check, FileText, ExternalLink, 
  Trash2, Edit3, AlertCircle, Database, RefreshCw, Layers
} from 'lucide-react';
import { CitationRecord, CitationStyle } from '../types/enterprise';
import { CitationService } from '../services/citationService';

export const CitationManagerPage: React.FC = () => {
  const [citations, setCitations] = useState<CitationRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<CitationStyle>('apa7');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New citation form state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [authorsStr, setAuthorsStr] = useState('');
  const [publisher, setPublisher] = useState('');
  const [year, setYear] = useState('2025');
  const [doi, setDoi] = useState('');
  const [isbn, setIsbn] = useState('');

  const loadData = () => {
    setCitations(CitationService.getCitations());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('citations_changed', handleUpdate);
    return () => window.removeEventListener('citations_changed', handleUpdate);
  }, []);

  const handleCopy = (citation: CitationRecord) => {
    const formatted = CitationService.formatCitation(citation, selectedStyle);
    navigator.clipboard.writeText(formatted);
    setCopiedId(citation.citationId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !authorsStr) return;

    const newCitation: CitationRecord = {
      citationId: `CIT-${Math.floor(10000 + Math.random() * 90000)}`,
      persistentId: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      module: 'papers',
      recordId: `rec-${Date.now()}`,
      title,
      subtitle,
      authors: authorsStr.split(',').map((name, idx) => ({
        id: `auth-${idx}`,
        name: name.trim(),
        role: 'author'
      })),
      publisher: publisher || 'माँ ताप्ती शोध संस्थान',
      publicationDate: `${year}-01-01`,
      language: 'hi',
      identifiers: [
        ...(doi ? [{ id: 'd1', type: 'doi' as const, value: doi, verified: true }] : []),
        ...(isbn ? [{ id: 'i1', type: 'isbn' as const, value: isbn, verified: true }] : [])
      ],
      keywords: ['Research', 'Satpura', 'Humanities'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin@taaptiresearch.org'
    };

    CitationService.saveCitation(newCitation);
    setShowAddModal(false);
    setTitle('');
    setSubtitle('');
    setAuthorsStr('');
    setPublisher('');
    setDoi('');
    setIsbn('');
    alert('नया академиक उद्धरण (Citation) सफलतापूर्वक जोड़ा गया!');
  };

  const filtered = citations.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.authors.some(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 sm:p-10 rounded-3xl border border-amber-500/35 flex flex-wrap items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>एंटरप्राइज सिटेशन मैनेजमेंट सिस्टम (Enterprise Citation Manager)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100">
            शैक्षणिक उद्धरण एवं ग्रंथसूची जनरेटर
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl">
            APA 7, MLA 9, Chicago, Harvard, IEEE, BibTeX, RIS, CSL JSON और Dublin Core शैलियों में स्वचालित उद्धरण सृजन एवं सत्यापन प्रणाली।
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl flex items-center gap-2 shadow-lg transition text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>नया उद्धरण जोड़ें</span>
          </button>
        </div>
      </div>

      {/* Toolbar & Style Selector */}
      <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="शीर्षक या लेखक द्वारा खोजें..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-200 outline-none focus:border-amber-500 w-64"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-stone-400 font-bold">उद्धरण शैली (Citation Style):</span>
          <select
            value={selectedStyle}
            onChange={e => setSelectedStyle(e.target.value as CitationStyle)}
            className="px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-amber-300 font-mono outline-none focus:border-amber-500"
          >
            <option value="apa7">APA 7th Edition</option>
            <option value="mla9">MLA 9th Edition</option>
            <option value="chicago_author_date">Chicago (Author-Date)</option>
            <option value="chicago_notes">Chicago (Notes & Bibliography)</option>
            <option value="harvard">Harvard Referencing</option>
            <option value="ieee">IEEE Format</option>
            <option value="bibtex">BibTeX Export</option>
            <option value="ris">RIS Format</option>
            <option value="csl_json">CSL JSON</option>
            <option value="dublin_core">Dublin Core</option>
          </select>
        </div>
      </div>

      {/* Citations List */}
      <div className="space-y-4">
        {filtered.map(cit => {
          const formattedText = CitationService.formatCitation(cit, selectedStyle);
          const validation = CitationService.validateMetadata(cit);

          return (
            <div key={cit.citationId} className="bg-stone-900 p-6 rounded-2xl border border-stone-800 space-y-4 shadow-lg hover:border-amber-500/40 transition">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg text-[10px] font-bold font-mono uppercase">
                    {cit.module} • {cit.persistentId}
                  </span>
                  {!validation.isValid && (
                    <span className="px-2 py-0.5 bg-red-950 text-red-400 border border-red-900 rounded text-[10px] flex items-center gap-1 font-bold">
                      <AlertCircle className="w-3 h-3" />
                      <span>Missing: {validation.missing.join(', ')}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(cit)}
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-xl flex items-center gap-1.5 transition text-xs"
                  >
                    {copiedId === cit.citationId ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedId === cit.citationId ? 'कॉपीड!' : 'उद्धरण कॉपी करें'}</span>
                  </button>
                  <button
                    onClick={() => CitationService.deleteCitation(cit.citationId)}
                    className="p-2 bg-red-950/40 hover:bg-red-950 text-red-400 rounded-xl transition"
                    title="हटाएं"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Formatted Citation Output */}
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-sm font-mono text-amber-200/90 whitespace-pre-wrap leading-relaxed">
                {formattedText}
              </div>

              {/* Identifiers & DOI */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400 font-mono">
                {cit.identifiers.map(id => (
                  <span key={id.id} className="bg-stone-950 px-2.5 py-1 rounded border border-stone-800">
                    <strong className="text-amber-400 uppercase">{id.type}:</strong> {id.value}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg p-6 space-y-6 text-stone-100 shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-amber-200">नया शैक्षणिक उद्धरण जोड़ें</h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-300">शीर्षक (Title):</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="शोध पत्र या ग्रंथ का शीर्षक..."
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">लेखक (Authors, comma separated):</label>
                <input
                  type="text"
                  required
                  value={authorsStr}
                  onChange={e => setAuthorsStr(e.target.value)}
                  placeholder="डॉ. रूपेश पवार, प्रो. रमेश चंद्र"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-300">प्रकाशन वर्ष (Year):</label>
                  <input
                    type="text"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-300">प्रकाशक (Publisher):</label>
                  <input
                    type="text"
                    value={publisher}
                    onChange={e => setPublisher(e.target.value)}
                    placeholder="माँ ताप्ती शोध संस्थान"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-300">DOI (यदि हो):</label>
                  <input
                    type="text"
                    value={doi}
                    onChange={e => setDoi(e.target.value)}
                    placeholder="10.5281/zenodo..."
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-300">ISBN (यदि हो):</label>
                  <input
                    type="text"
                    value={isbn}
                    onChange={e => setIsbn(e.target.value)}
                    placeholder="978-81-..."
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold rounded-xl"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl shadow"
                >
                  सहेजें (Save)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
