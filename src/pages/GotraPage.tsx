import React, { useState } from 'react';
import { StorageEngine } from '../lib/storage';
import { Users, Search, ShieldCheck, MapPin, Compass, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GotraItem } from '../types';

export const GotraPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [gotraList, setGotraList] = useState<GotraItem[]>(() => StorageEngine.getGotras());
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [gotraName, setGotraName] = useState('');
  const [dynasty, setDynasty] = useState('परमार राजवंश');
  const [kuldevi, setKuldevi] = useState('');
  const [primaryLocation, setPrimaryLocation] = useState('');
  const [historicalNote, setHistoricalNote] = useState('');
  const [subClansStr, setSubClansStr] = useState('');

  const handleAddGotra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gotraName || !kuldevi) return;

    const newItem: GotraItem = {
      id: `gotra-${Date.now()}`,
      gotraName,
      dynasty,
      kuldevi,
      primaryLocation: primaryLocation || 'सतपुड़ा, म.प्र.',
      historicalNote,
      subClans: subClansStr ? subClansStr.split(',').map(s => s.trim()) : []
    };

    StorageEngine.saveGotra(newItem);
    setGotraList(StorageEngine.getGotras());
    setShowAddModal(false);
    setGotraName('');
    setKuldevi('');
    setPrimaryLocation('');
    setHistoricalNote('');
    setSubClansStr('');
    alert('नया गोत्र / वंशवली रिकॉर्ड सफलतापूर्वक जोड़ा गया!');
  };

  const filtered = gotraList.filter(g => {
    const q = searchTerm.trim().toLowerCase();
    return (
      g.gotraName.toLowerCase().includes(q) ||
      g.dynasty.toLowerCase().includes(q) ||
      g.kuldevi.toLowerCase().includes(q) ||
      g.primaryLocation.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 sm:p-10 rounded-2xl border border-amber-500/30 flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>परमार - पवार क्षत्रिय वंशशास्त्र</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100">
            पवार (भोयर) गोत्र एवं कुलायन डेटाबेस
          </h1>
          <p className="text-sm text-stone-300 font-serif max-w-2xl">
            धार एवं मालवा से सतपुड़ा (बैतूल, छिंदवाड़ा, बालाघाट, मुलताई) अंचल में प्रवासन करने वाले पवार समाज के गोत्रों, कुलदेवियों तथा राजवंशों का अभिलेखीय विवरण।
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl flex items-center gap-2 shadow-lg transition text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>नया गोत्र / वंशवली जोड़ें</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-amber-50/80 dark:bg-stone-900 p-4 rounded-xl border border-amber-200 dark:border-stone-800 flex items-center gap-3">
        <Search className="w-5 h-5 text-stone-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="गोत्र का नाम, कुलदेवी, राजवंश या क्षेत्र खोजें (Search Gotra name, Kuldevi, Dynasty)..."
          className="w-full bg-transparent text-stone-800 dark:text-stone-200 text-xs font-medium focus:outline-none placeholder-stone-500"
        />
      </div>

      {/* Gotra List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-amber-50/50 dark:bg-stone-900 p-6 sm:p-8 rounded-2xl border border-amber-200/80 dark:border-stone-800 hover:border-amber-500/50 shadow-sm transition space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-amber-200/60 dark:border-stone-800">
              <h3 className="text-xl font-serif font-bold text-amber-900 dark:text-amber-200">
                {item.gotraName}
              </h3>
              <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold rounded">
                {item.dynasty}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-sans">
              <div className="p-3 bg-stone-100 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800">
                <span className="text-amber-800 dark:text-amber-400 font-bold block mb-0.5">कुलदेवी:</span>
                <span className="text-stone-800 dark:text-stone-200 font-semibold">{item.kuldevi}</span>
              </div>
              <div className="p-3 bg-stone-100 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800">
                <span className="text-amber-800 dark:text-amber-400 font-bold block mb-0.5">मुख्य क्षेत्र:</span>
                <span className="text-stone-800 dark:text-stone-200 font-semibold">{item.primaryLocation}</span>
              </div>
            </div>

            <p className="text-xs text-stone-700 dark:text-stone-300 font-serif leading-relaxed">
              {item.historicalNote}
            </p>

            {item.subClans && item.subClans.length > 0 && (
              <div className="pt-2 flex flex-wrap gap-1.5 text-xs">
                <span className="text-amber-800 dark:text-amber-400 font-bold">उप-शाखाएँ:</span>
                {item.subClans.map(sub => (
                  <span key={sub} className="px-2 py-0.5 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded text-[11px]">
                    {sub}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Gotra Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg p-6 space-y-6 text-stone-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <h3 className="text-lg font-serif font-bold text-amber-200">नया गोत्र / वंशवली प्रविष्टि जोड़ें (सुपर एडमिन)</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGotra} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-300">गोत्र का नाम (Gotra Name):</label>
                <input
                  type="text"
                  required
                  value={gotraName}
                  onChange={e => setGotraName(e.target.value)}
                  placeholder="जैसे: पंवार, परमार, मोरे, धोटे"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-300">राजवंश (Dynasty):</label>
                  <input
                    type="text"
                    value={dynasty}
                    onChange={e => setDynasty(e.target.value)}
                    placeholder="जैसे: परमार राजवंश"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-300">कुलदेवी (Kuldevi):</label>
                  <input
                    type="text"
                    required
                    value={kuldevi}
                    onChange={e => setKuldevi(e.target.value)}
                    placeholder="जैसे: माँ महाकाली / चंडिका"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">मुख्य निवास / क्षेत्र (Primary Location):</label>
                <input
                  type="text"
                  value={primaryLocation}
                  onChange={e => setPrimaryLocation(e.target.value)}
                  placeholder="जैसे: मुलताई, बैतूल, छिंदवाड़ा"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">ऐतिहासिक विवरण / नोट (Historical Note):</label>
                <textarea
                  rows={3}
                  value={historicalNote}
                  onChange={e => setHistoricalNote(e.target.value)}
                  placeholder="इस गोत्र का इतिहास एवं प्रवासन विवरण..."
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">उप-शाखाएँ (Comma separated):</label>
                <input
                  type="text"
                  value={subClansStr}
                  onChange={e => setSubClansStr(e.target.value)}
                  placeholder="जैसे: शाखा 1, शाखा 2, शाखा 3"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                />
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

