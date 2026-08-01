import React, { useState } from 'react';
import { StorageEngine } from '../lib/storage';
import { DictionaryWord } from '../types';
import { BookOpen, Search, Volume2, Plus, FileSpreadsheet, Download, Check, Sparkles, Languages } from 'lucide-react';

export const DictionaryModulePage: React.FC = () => {
  const [dictionary, setDictionary] = useState<DictionaryWord[]>(() => StorageEngine.getDictionary());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPOS, setSelectedPOS] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [pawari, setPawari] = useState('');
  const [devanagari, setDevanagari] = useState('');
  const [phonetic, setPhonetic] = useState('');
  const [pos, setPos] = useState<DictionaryWord['partOfSpeech']>('noun');
  const [meaningHi, setMeaningHi] = useState('');
  const [meaningEn, setMeaningEn] = useState('');
  const [examplePaw, setExamplePaw] = useState('');
  const [exampleHi, setExampleHi] = useState('');
  const [category, setCategory] = useState('सामान्य बोलचाल');

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pawari || !meaningHi) return;

    const newWord: DictionaryWord = {
      id: `dict-${Date.now()}`,
      wordPawari: pawari,
      wordDevanagari: devanagari || pawari,
      phoneticEn: phonetic || pawari,
      partOfSpeech: pos,
      meaningHindi: meaningHi,
      meaningEnglish: meaningEn || '-',
      exampleSentencePawari: examplePaw,
      exampleSentenceHindi: exampleHi,
      category,
    };

    StorageEngine.saveDictionaryWord(newWord);
    setDictionary(StorageEngine.getDictionary());
    setShowAddModal(false);
    setPawari('');
    setDevanagari('');
    setMeaningHi('');
    setMeaningEn('');
    alert('नया शब्दकोश प्रविष्टि सफलतापूर्वक जोड़ी गई!');
  };

  const filteredWords = dictionary.filter(w => {
    const matchSearch = w.wordPawari.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        w.wordDevanagari.includes(searchTerm) ||
                        w.meaningHindi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        w.meaningEnglish.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPOS = selectedPOS === 'all' || w.partOfSpeech === selectedPOS;
    return matchSearch && matchPOS;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 rounded-2xl border border-amber-500/35 flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Languages className="w-4 h-4" />
            <span>शोध-स्तरीय डिजिटल शब्दकोश (Research-Grade Digital Dictionary)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
            पँवारी (भoyari) - हिंदी - अंग्रेजी शब्दकोश
          </h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl flex items-center gap-2 shadow transition text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>नया शब्द जोड़ें (Contribute)</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-amber-50/70 dark:bg-stone-900 p-5 rounded-2xl border border-amber-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="पँवारी शब्द, हिंदी अर्थ या अंग्रेजी में खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-xs text-stone-200 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'noun', 'verb', 'adjective', 'idiom'].map(pos => (
            <button
              key={pos}
              onClick={() => setSelectedPOS(pos)}
              className={`px-3 py-2 rounded-xl font-bold uppercase transition ${
                selectedPOS === pos
                  ? 'bg-amber-600 text-stone-950 shadow'
                  : 'bg-white dark:bg-stone-950 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* Dictionary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWords.map(word => (
          <div key={word.id} className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 shadow-sm hover:border-amber-500/50 transition">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded text-[10px] font-bold uppercase">
                {word.partOfSpeech}
              </span>
              <span className="text-xs font-mono text-stone-400">{word.category}</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-stone-900 dark:text-amber-100 text-xl">
                  {word.wordDevanagari || word.wordPawari}
                </h3>
                <button
                  onClick={() => alert(`ऑडियो उच्चारण प्ले हो रहा है: ${word.wordDevanagari}`)}
                  className="p-2 bg-amber-50 dark:bg-stone-950 border border-amber-200 dark:border-stone-800 rounded-xl text-amber-600 hover:bg-amber-100 transition"
                  title="उच्चारण सुनें"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs font-mono text-amber-700 dark:text-amber-400">IPA: [{word.phoneticEn}]</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
              <div>
                <span className="font-bold text-stone-500">हिंदी अर्थ: </span>
                <span className="text-stone-800 dark:text-stone-200 font-serif font-bold">{word.meaningHindi}</span>
              </div>
              <div>
                <span className="font-bold text-stone-500">English: </span>
                <span className="text-stone-600 dark:text-stone-400">{word.meaningEnglish}</span>
              </div>
              {word.exampleSentencePawari && (
                <div className="p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1 text-[11px] font-serif">
                  <p className="text-amber-800 dark:text-amber-300">" {word.exampleSentencePawari} "</p>
                  <p className="text-stone-500">({word.exampleSentenceHindi})</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 w-full max-w-xl rounded-2xl border border-stone-200 dark:border-stone-800 p-8 space-y-6 shadow-2xl font-sans text-xs">
            <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-amber-100">नया शब्द जोड़ें (Contribute Dictionary Entry)</h3>

            <form onSubmit={handleAddWord} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">पँवारी शब्द (Devanagari)*:</label>
                  <input
                    type="text"
                    required
                    value={devanagari}
                    onChange={(e) => setDevanagari(e.target.value)}
                    placeholder="उदा. बन्ना / जावण"
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">उच्चारण (IPA):</label>
                  <input
                    type="text"
                    value={phonetic}
                    onChange={(e) => setPhonetic(e.target.value)}
                    placeholder="bənnɑː"
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">व्याकरणिक कोटि (Part of Speech):</label>
                  <select
                    value={pos}
                    onChange={(e) => setPos(e.target.value as any)}
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                  >
                    <option value="noun">Noun (संज्ञा)</option>
                    <option value="verb">Verb (क्रिया)</option>
                    <option value="adjective">Adjective (विशेषण)</option>
                    <option value="adverb">Adverb (क्रियाविशेषण)</option>
                    <option value="idiom">Idiom (मुहावरा)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">श्रेणी (Category):</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">हिंदी अर्थ (Hindi Meaning)*:</label>
                  <input
                    type="text"
                    required
                    value={meaningHi}
                    onChange={(e) => setMeaningHi(e.target.value)}
                    placeholder="दूल्हा / जाना"
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">English Meaning:</label>
                  <input
                    type="text"
                    value={meaningEn}
                    onChange={(e) => setMeaningEn(e.target.value)}
                    placeholder="Groom / To go"
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">उदाहरण वाक्य (पवारी):</label>
                  <input
                    type="text"
                    value={examplePaw}
                    onChange={(e) => setExamplePaw(e.target.value)}
                    placeholder="पवारी में वाक्य..."
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200 font-serif"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">उदाहरण अनुवाद (हिंदी):</label>
                  <input
                    type="text"
                    value={exampleHi}
                    onChange={(e) => setExampleHi(e.target.value)}
                    placeholder="हिंदी अनुवाद..."
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
                  प्रविष्टि सुरक्षित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
