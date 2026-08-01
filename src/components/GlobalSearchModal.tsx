import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageEngine } from '../lib/storage';
import { Search, X, BookOpen, FileText, Music, Users, Library, ArrowRight } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'paper' | 'dict' | 'lokgeet' | 'gotra' | 'book'>('all');

  const papers = useMemo(() => StorageEngine.getPapers(), []);
  const dictWords = useMemo(() => StorageEngine.getDictionary(), []);
  const lokgeets = useMemo(() => StorageEngine.getLokgeet(), []);
  const gotras = useMemo(() => StorageEngine.getGotras(), []);
  const books = useMemo(() => StorageEngine.getBooks(), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const res: Array<{
      type: 'paper' | 'dict' | 'lokgeet' | 'gotra' | 'book';
      id: string;
      title: string;
      subtitle: string;
      link: string;
    }> = [];

    // Papers
    if (activeTab === 'all' || activeTab === 'paper') {
      papers.forEach(p => {
        const matchTitle = p.title.hi.toLowerCase().includes(q) || p.title.en.toLowerCase().includes(q);
        const matchAbstract = p.abstract.hi.toLowerCase().includes(q) || p.abstract.en.toLowerCase().includes(q);
        const matchAuthor = p.authors.some(a => a.name.toLowerCase().includes(q));
        const matchKeywords = p.keywords.some(k => k.toLowerCase().includes(q));

        if (matchTitle || matchAbstract || matchAuthor || matchKeywords) {
          res.push({
            type: 'paper',
            id: p.id,
            title: p.title.hi,
            subtitle: `शोध पत्र • ${p.authors.map(a => a.name).join(', ')} (DOI: ${p.doi})`,
            link: `/paper/${p.id}`
          });
        }
      });
    }

    // Dictionary
    if (activeTab === 'all' || activeTab === 'dict') {
      dictWords.forEach(w => {
        if (
          w.wordPawari.toLowerCase().includes(q) ||
          w.meaningHindi.toLowerCase().includes(q) ||
          w.meaningEnglish.toLowerCase().includes(q)
        ) {
          res.push({
            type: 'dict',
            id: w.id,
            title: `${w.wordPawari} (${w.wordDevanagari})`,
            subtitle: `पवारी शब्दकोश • अर्थ: ${w.meaningHindi} / ${w.meaningEnglish}`,
            link: `/pawari/dictionary`
          });
        }
      });
    }

    // Lokgeet
    if (activeTab === 'all' || activeTab === 'lokgeet') {
      lokgeets.forEach(l => {
        if (
          l.titlePawari.toLowerCase().includes(q) ||
          l.titleHindi.toLowerCase().includes(q) ||
          l.lyricsDevanagari.toLowerCase().includes(q)
        ) {
          res.push({
            type: 'lokgeet',
            id: l.id,
            title: l.titleHindi,
            subtitle: `लोकगीत (${l.category}) • ${l.titlePawari}`,
            link: `/pawari/lokgeet`
          });
        }
      });
    }

    // Gotras
    if (activeTab === 'all' || activeTab === 'gotra') {
      gotras.forEach(g => {
        if (
          g.gotraName.toLowerCase().includes(q) ||
          g.dynasty.toLowerCase().includes(q) ||
          g.kuldevi.toLowerCase().includes(q) ||
          g.primaryLocation.toLowerCase().includes(q)
        ) {
          res.push({
            type: 'gotra',
            id: g.id,
            title: g.gotraName,
            subtitle: `वंशशास्त्र • राजवंश: ${g.dynasty} | कुलदेवी: ${g.kuldevi}`,
            link: `/pawari/gotras`
          });
        }
      });
    }

    // Books
    if (activeTab === 'all' || activeTab === 'book') {
      books.forEach(b => {
        if (
          b.title.hi.toLowerCase().includes(q) ||
          b.title.en.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
        ) {
          res.push({
            type: 'book',
            id: b.id,
            title: b.title.hi,
            subtitle: `डिजिटल पुस्तकालय • लेखक: ${b.author} (${b.year})`,
            link: `/library`
          });
        }
      });
    }

    return res.slice(0, 20);
  }, [query, activeTab, papers, dictWords, lokgeets, gotras, books]);

  if (!isOpen) return null;

  const handleSelect = (link: string) => {
    onClose();
    navigate(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 px-4">
      <div className="bg-stone-900 border border-amber-500/30 text-stone-100 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="p-4 border-b border-stone-800 flex items-center gap-3 bg-stone-950">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="शोध पत्र, शब्दकोश, लोकगीत, गोत्र या पुस्तकें खोजें..."
            autoFocus
            className="w-full bg-transparent text-amber-100 placeholder-stone-500 text-sm focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-stone-400 hover:text-stone-200">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-200 border-l border-stone-800 pl-3">
            <span className="text-xs font-mono uppercase">Esc</span>
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 p-2.5 bg-stone-900/80 border-b border-stone-800 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'सभी (All)' },
            { id: 'paper', label: 'शोध पत्र' },
            { id: 'dict', label: 'शब्दकोश' },
            { id: 'lokgeet', label: 'लोकगीत' },
            { id: 'gotra', label: 'गोत्र' },
            { id: 'book', label: 'पुस्तकें' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1 rounded-lg transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-amber-600 text-stone-950 font-bold'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          {!query.trim() && (
            <div className="text-center py-12 text-stone-500 text-xs">
              <Search className="w-8 h-8 text-stone-700 mx-auto mb-2" />
              <p>खोजने के लिए ऊपर मुख्य शब्द (Keywords) दर्ज करें...</p>
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <div className="text-center py-12 text-stone-400 text-xs">
              <p>"{query}" के लिए कोई परिणाम नहीं मिला।</p>
            </div>
          )}

          {results.map((res) => (
            <div
              key={`${res.type}-${res.id}`}
              onClick={() => handleSelect(res.link)}
              className="p-3 bg-stone-950 hover:bg-stone-800/80 rounded-xl border border-stone-800 hover:border-amber-500/40 cursor-pointer transition flex items-center justify-between gap-3 group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-950 text-amber-400 rounded-lg shrink-0 mt-0.5">
                  {res.type === 'paper' && <FileText className="w-4 h-4" />}
                  {res.type === 'dict' && <BookOpen className="w-4 h-4" />}
                  {res.type === 'lokgeet' && <Music className="w-4 h-4" />}
                  {res.type === 'gotra' && <Users className="w-4 h-4" />}
                  {res.type === 'book' && <Library className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-100 group-hover:text-amber-400 transition">
                    {res.title}
                  </h4>
                  <p className="text-xs text-stone-400 mt-0.5 font-serif line-clamp-1">
                    {res.subtitle}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-600 group-hover:text-amber-400 shrink-0 transition-transform group-hover:translate-x-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
