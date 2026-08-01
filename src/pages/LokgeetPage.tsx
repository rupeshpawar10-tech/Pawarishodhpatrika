import React, { useState } from 'react';
import { StorageEngine } from '../lib/storage';
import { Lokgeet } from '../types';
import { Music, Play, Pause, Volume2, Filter, Plus, X } from 'lucide-react';

export const LokgeetPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSongId, setActiveSongId] = useState<string | null>(null);
  const [songs, setSongs] = useState<Lokgeet[]>(() => StorageEngine.getLokgeet());
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [titleHindi, setTitleHindi] = useState('');
  const [lyricsDevanagari, setLyricsDevanagari] = useState('');
  const [meaningHindi, setMeaningHindi] = useState('');
  const [category, setCategory] = useState('विवाह गीत');
  const [region, setRegion] = useState('मुलताई अंचल');
  const [collectorName, setCollectorName] = useState('');

  const categories = Array.from(new Set(songs.map(s => s.category).concat(['विवाह गीत', 'गौली गीत', 'सावन हिंडोला', 'श्रम गीत', 'पर्व-उत्सव'])));

  const handleAddLokgeet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleHindi || !lyricsDevanagari) return;

    const newSong: Lokgeet = {
      id: `lokgeet-${Date.now()}`,
      titlePawari: titleHindi,
      titleHindi,
      lyricsDevanagari,
      meaningHindi: meaningHindi || titleHindi,
      category: (category as any) || 'Vivah (विवाह)',
      region: region || 'मुलताई अंचल',
      collectorName: collectorName || 'शोध संस्थान एवं लोक गायक',
      tags: ['lokgeet', 'pawari', category]
    };

    StorageEngine.saveLokgeet(newSong);
    setSongs(StorageEngine.getLokgeet());
    setShowAddModal(false);
    setTitleHindi('');
    setLyricsDevanagari('');
    setMeaningHindi('');
    setCollectorName('');
    alert('नया लोकगीत सफलतापूर्वक संग्रहित किया गया!');
  };

  const filteredSongs = songs.filter(s => selectedCategory === 'all' || s.category === selectedCategory);

  const toggleAudio = (id: string) => {
    if (activeSongId === id) {
      setActiveSongId(null);
    } else {
      setActiveSongId(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 sm:p-10 rounded-2xl border border-amber-500/30 flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Music className="w-4 h-4" />
            <span>मौखिक साहित्य एवं लोकसंगीत</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100">
            पवारी (भोयरी) लोकगीत आर्काइव
          </h1>
          <p className="text-sm text-stone-300 font-serif max-w-2xl">
            सतपुड़ा एवं ताप्ती अंचल के पारंपरिक विवाह गीतों, गौली गीतों, सावन हिंडोला गीतों एवं श्रम गीतों का मूल बोल तथा हिंदी अर्थ सहित संकलन।
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl flex items-center gap-2 shadow-lg transition text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>नया लोकगीत जोड़ें</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-amber-50/80 dark:bg-stone-900 p-4 rounded-xl border border-amber-200 dark:border-stone-800 flex items-center justify-between gap-4 text-xs font-sans">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-600" />
          <span className="font-bold text-stone-700 dark:text-stone-300">श्रेणी अनुसार देखें:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-stone-800 font-medium"
          >
            <option value="all">सभी लोकगीत (All Folk Songs)</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <span className="text-stone-500 font-mono">
          कुल गीत: <span className="font-bold text-amber-700 dark:text-amber-400">{filteredSongs.length}</span>
        </span>
      </div>

      {/* Songs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredSongs.map((song) => (
          <div
            key={song.id}
            className="bg-amber-50/50 dark:bg-stone-900 p-6 sm:p-8 rounded-2xl border border-amber-200/80 dark:border-stone-800 hover:border-amber-500/50 shadow-sm transition space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold rounded">
                  {song.category}
                </span>
                <span className="text-stone-500">क्षेत्र: {song.region || 'मुलताई अंचल'}</span>
              </div>

              <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-amber-100">
                {song.titleHindi}
              </h3>

              <div className="p-4 bg-stone-900 text-stone-100 rounded-xl border border-stone-800 font-serif text-sm leading-relaxed whitespace-pre-wrap">
                {song.lyricsDevanagari}
              </div>

              <div className="p-3 bg-amber-100/60 dark:bg-stone-950/80 rounded-xl text-xs text-stone-700 dark:text-stone-300 font-serif border border-amber-200 dark:border-stone-800">
                <span className="font-bold text-amber-800 dark:text-amber-400 block mb-1">भावार्थ (Meaning):</span>
                {song.meaningHindi}
              </div>
            </div>

            <div className="pt-3 border-t border-amber-200/60 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500">
              <span>संकलनकर्ता: {song.collectorName || 'शोध संस्थान'}</span>
              <button
                onClick={() => toggleAudio(song.id)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition ${
                  activeSongId === song.id
                    ? 'bg-amber-600 text-stone-950 animate-pulse'
                    : 'bg-stone-800 text-amber-300 hover:bg-stone-700'
                }`}
              >
                {activeSongId === song.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{activeSongId === song.id ? 'चल रहा है...' : 'ऑडियो सुनें'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Lokgeet Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg p-6 space-y-6 text-stone-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <h3 className="text-lg font-serif font-bold text-amber-200">नया पवारी लोकगीत जोड़ें</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLokgeet} className="space-y-4 text-xs">
              <div>
                <label className="block text-amber-400 font-bold mb-1">लोकगीत का शीर्षक (Hindi Title) *</label>
                <input
                  type="text"
                  required
                  value={titleHindi}
                  onChange={(e) => setTitleHindi(e.target.value)}
                  placeholder="उदा. सावन हिंडोला गीत / बन्ना-बन्नी विवाह गीत"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-400 font-bold mb-1">श्रेणी (Category)</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="विवाह गीत">विवाह गीत</option>
                    <option value="गौली गीत">गौली गीत</option>
                    <option value="सावन हिंडोला">सावन हिंडोला</option>
                    <option value="श्रम गीत">श्रम गीत</option>
                    <option value="पर्व-उत्सव">पर्व-उत्सव</option>
                  </select>
                </div>

                <div>
                  <label className="block text-amber-400 font-bold mb-1">अंचल / क्षेत्र (Region)</label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="उदा. मुलताई, बैतूल"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-400 font-bold mb-1">मूल लोकगीत के बोल (Lyrics Devanagari) *</label>
                <textarea
                  rows={4}
                  required
                  value={lyricsDevanagari}
                  onChange={(e) => setLyricsDevanagari(e.target.value)}
                  placeholder="पवारी / देवनागरी लिपि में लोकगीत की पंक्तियाँ दर्ज करें..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-amber-400 font-bold mb-1">हिंदी भावार्थ (Meaning)</label>
                <textarea
                  rows={2}
                  value={meaningHindi}
                  onChange={(e) => setMeaningHindi(e.target.value)}
                  placeholder="गीत का अर्थ या सांस्कृतिक संदर्भ..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-amber-400 font-bold mb-1">संकलनकर्ता (Collector Name)</label>
                <input
                  type="text"
                  value={collectorName}
                  onChange={(e) => setCollectorName(e.target.value)}
                  placeholder="उदा. प्रो. रामेश्वर पवार"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-xl font-bold"
                >
                  सुरक्षित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
