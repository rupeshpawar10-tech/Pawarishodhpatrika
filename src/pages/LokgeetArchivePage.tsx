import React, { useState } from 'react';
import { StorageEngine } from '../lib/storage';
import { Lokgeet } from '../types';
import { Music, Search, Play, Pause, Disc, Plus, MapPin, Mic, FileText, Check } from 'lucide-react';

export const LokgeetArchivePage: React.FC = () => {
  const [lokgeets, setLokgeets] = useState<Lokgeet[]>(() => StorageEngine.getLokgeet());
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New recording/song state
  const [titlePawari, setTitlePawari] = useState('');
  const [titleHindi, setTitleHindi] = useState('');
  const [category, setCategory] = useState<Lokgeet['category']>('Vivah (विवाह)');
  const [lyrics, setLyrics] = useState('');
  const [meaning, setMeaning] = useState('');
  const [collector, setCollector] = useState('');
  const [region, setRegion] = useState('सतपुड़ा (मुलताई)');

  const handleAddLokgeet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleHindi || !lyrics) return;

    const newSong: Lokgeet = {
      id: `lok-${Date.now()}`,
      titlePawari: titlePawari || titleHindi,
      titleHindi,
      category,
      lyricsDevanagari: lyrics,
      meaningHindi: meaning,
      collectorName: collector || 'लोक संस्कृति शोध दल',
      region,
      tags: ['सतपुड़ा', 'पारंपरिक', category],
    };

    StorageEngine.saveLokgeet(newSong);
    setLokgeets(StorageEngine.getLokgeet());
    setShowAddModal(false);
    setTitlePawari('');
    setTitleHindi('');
    setLyrics('');
    setMeaning('');
    alert('लोकगीत प्रविष्टि सफलतापूर्वक सहेजी गई!');
  };

  const filteredSongs = lokgeets.filter(s => {
    const matchGenre = selectedGenre === 'all' || s.category.includes(selectedGenre);
    const matchSearch = s.titleHindi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.titlePawari.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.lyricsDevanagari.includes(searchTerm);
    return matchGenre && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 rounded-2xl border border-amber-500/35 flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Music className="w-4 h-4" />
            <span>सतपुड़ा लोकसंस्कृति एवं लोकगीत अभिलेखागार (Folklore & Lokgeet Archive)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
            पँवारी पारंपरिक गीत, विवाह गीत एवं लोकगाथाएँ
          </h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl flex items-center gap-2 shadow transition text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>नया लोकगीत / रिकॉर्डिंग जोड़ें</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-amber-50/70 dark:bg-stone-900 p-5 rounded-2xl border border-amber-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'Vivah', 'Gaoli', 'Sawan', 'Devotional'].map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-2 rounded-xl font-bold uppercase transition ${
                selectedGenre === genre
                  ? 'bg-amber-600 text-stone-950 shadow'
                  : 'bg-white dark:bg-stone-950 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
              }`}
            >
              {genre === 'all' ? 'सभी विधाएँ' : genre}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="गीत का शीर्षक या बोल खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-xs text-stone-200 w-64 outline-none"
          />
        </div>
      </div>

      {/* Lokgeet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSongs.map(song => (
          <div key={song.id} className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-5 shadow-sm hover:border-amber-500/50 transition">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full text-[10px] font-bold">
                {song.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>{song.region || 'सतपुड़ा क्षेत्र'}</span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-serif font-bold text-stone-900 dark:text-amber-100 text-lg">
                {song.titleHindi}
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-400 font-serif font-bold">({song.titlePawari})</p>
            </div>

            {/* Lyrics Preview */}
            <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
              <p className="text-xs font-serif text-stone-700 dark:text-stone-300 whitespace-pre-line leading-relaxed italic">
                "{song.lyricsDevanagari}"
              </p>
              {song.meaningHindi && (
                <p className="text-[11px] text-stone-500 font-sans pt-2 border-t border-stone-200 dark:border-stone-800">
                  <span className="font-bold text-stone-700 dark:text-stone-300">भावार्थ: </span>
                  {song.meaningHindi}
                </p>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-mono text-stone-500">
              <div className="flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-amber-600" />
                <span>संकलनकर्ता: {song.collectorName || 'संस्थान टीम'}</span>
              </div>

              <button
                onClick={() => setActivePlayingId(activePlayingId === song.id ? null : song.id)}
                className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition ${
                  activePlayingId === song.id
                    ? 'bg-red-600 text-white shadow-lg animate-pulse'
                    : 'bg-amber-600 text-stone-950 hover:bg-amber-500 shadow'
                }`}
              >
                {activePlayingId === song.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{activePlayingId === song.id ? 'प्लेइंग...' : 'ऑडियो सुनें'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 w-full max-w-xl rounded-2xl border border-stone-200 dark:border-stone-800 p-8 space-y-6 shadow-2xl font-sans text-xs">
            <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-amber-100">नया लोकगीत या रिकॉर्डिंग जोड़ें</h3>

            <form onSubmit={handleAddLokgeet} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">गीत का शीर्षक (हिंदी)*:</label>
                  <input
                    type="text"
                    required
                    value={titleHindi}
                    onChange={(e) => setTitleHindi(e.target.value)}
                    placeholder="उदा. बन्ना गीत / विवाह मंगल"
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">विधा (Genre):</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                  >
                    <option value="Vivah (विवाह)">Vivah (विवाह)</option>
                    <option value="Sagai (सगाई)">Sagai (सगाई)</option>
                    <option value="Gaoli (गौली)">Gaoli (गौली)</option>
                    <option value="Sawan (सावन)">Sawan (सावन)</option>
                    <option value="Devotional (भजन)">Devotional (भजन)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">पारंपरिक बोल (Lyrics in Devanagari)*:</label>
                <textarea
                  required
                  rows={4}
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  placeholder="गीत के बोल..."
                  className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200 font-serif"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">भावार्थ (Meaning):</label>
                <input
                  type="text"
                  value={meaning}
                  onChange={(e) => setMeaning(e.target.value)}
                  placeholder="गीत का संक्षिप्त अर्थ..."
                  className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">संकलनकर्ता (Collector):</label>
                  <input
                    type="text"
                    value={collector}
                    onChange={(e) => setCollector(e.target.value)}
                    placeholder="डॉ. रूपेश पवार"
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">क्षेत्र / गाँव (Region):</label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold rounded-xl"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-600 text-stone-950 font-bold rounded-xl hover:bg-amber-500 shadow"
                >
                  लोकगीत सहेजें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
