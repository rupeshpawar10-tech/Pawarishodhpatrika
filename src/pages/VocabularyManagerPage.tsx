import React, { useState, useEffect } from 'react';
import { 
  Languages, Plus, Search, ShieldCheck, Tag, Trash2, CheckCircle2, Layers, Globe
} from 'lucide-react';
import { VocabularyRecord, VocabularyType } from '../types/enterprise';
import { VocabularyService } from '../services/vocabularyService';

export const VocabularyManagerPage: React.FC = () => {
  const [vocabularies, setVocabularies] = useState<VocabularyRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<VocabularyType | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [vocabType, setVocabType] = useState<VocabularyType>('languages');
  const [code, setCode] = useState('');
  const [hiLabel, setHiLabel] = useState('');
  const [enLabel, setEnLabel] = useState('');
  const [pawLabel, setPawLabel] = useState('');
  const [desc, setDesc] = useState('');

  const loadData = () => {
    setVocabularies(VocabularyService.getVocabularies());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('vocabularies_changed', handleUpdate);
    return () => window.removeEventListener('vocabularies_changed', handleUpdate);
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !hiLabel || !enLabel) return;

    const newVocab: VocabularyRecord = {
      vocabularyId: `VOC-${Math.floor(1000 + Math.random() * 9000)}`,
      type: vocabType,
      code,
      label: { hi: hiLabel, en: enLabel, paw: pawLabel },
      description: { hi: desc, en: desc },
      sortOrder: vocabularies.length + 1,
      status: 'approved',
      isSystem: false,
      createdBy: 'admin@taaptiresearch.org',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    VocabularyService.saveVocabulary(newVocab);
    setShowAddModal(false);
    setCode('');
    setHiLabel('');
    setEnLabel('');
    setPawLabel('');
    setDesc('');
    alert('नया नियंत्रित शब्दावली (Controlled Vocabulary) रिकॉर्ड सफलतापूर्वक जोड़ा गया!');
  };

  const filtered = vocabularies.filter(v => {
    const matchType = selectedType === 'all' || v.type === selectedType;
    const matchSearch = v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.label.hi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.label.en.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 sm:p-10 rounded-3xl border border-amber-500/35 flex flex-wrap items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Languages className="w-4 h-4" />
            <span>नियंत्रित शब्दावली प्रबंधन प्रणाली (Controlled Vocabulary Manager)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100">
            केंद्रीयकृत शब्दावली एवं बहुभाषीय मानक कोश
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl">
            प्लेटफॉर्म के सभी मॉड्यूल्स (भाषाएँ, बोलियाँ, विधाएँ, व्याकरण श्रेणियां, भू-भाग) के लिए कठोर रूप से नियंत्रित ड्रॉपडाउन मानों और बहुभाषीय (हिंदी, अंग्रेजी, पवारी) लेबल्स का प्रबंधन।
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl flex items-center gap-2 shadow-lg transition text-xs relative z-10"
        >
          <Plus className="w-4 h-4" />
          <span>नया शब्दावली टर्म जोड़ें</span>
        </button>
      </div>

      {/* Toolbar & Filter */}
      <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="कोड या लेबल द्वारा खोजें..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-200 outline-none focus:border-amber-500 w-64"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-stone-400 font-bold">शब्दावली प्रकार (Type):</span>
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value as any)}
            className="px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-amber-300 font-mono outline-none focus:border-amber-500"
          >
            <option value="all">सभी प्रकार (All Types)</option>
            <option value="languages">Languages</option>
            <option value="dialects">Dialects</option>
            <option value="genres">Genres</option>
            <option value="part_of_speech">Part of Speech</option>
            <option value="semantic_domains">Semantic Domains</option>
            <option value="districts">Districts</option>
          </select>
        </div>
      </div>

      {/* Vocabularies List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(vocab => (
          <div key={vocab.vocabularyId} className="bg-stone-900 p-6 rounded-2xl border border-stone-800 space-y-4 shadow-lg hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg text-[10px] font-bold font-mono uppercase">
                {vocab.type} • {vocab.code}
              </span>
              <button
                onClick={() => VocabularyService.deleteVocabulary(vocab.vocabularyId)}
                className="p-1.5 bg-red-950/40 hover:bg-red-950 text-red-400 rounded-lg transition"
                title="हटाएं"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-serif font-bold text-stone-100">{vocab.label.hi}</h3>
              <p className="text-xs text-amber-400 font-medium">EN: {vocab.label.en} {vocab.label.paw ? `• Paw: ${vocab.label.paw}` : ''}</p>
            </div>

            {vocab.description && (
              <p className="text-xs text-stone-400 leading-relaxed border-t border-stone-800 pt-3">
                {vocab.description.hi}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg p-6 space-y-6 text-stone-100 shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-amber-200">नया नियंत्रित शब्दावली टर्म जोड़ें</h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-300">शब्दावली प्रकार (Type):</label>
                  <select
                    value={vocabType}
                    onChange={e => setVocabType(e.target.value as VocabularyType)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  >
                    <option value="languages">Languages</option>
                    <option value="dialects">Dialects</option>
                    <option value="genres">Genres</option>
                    <option value="part_of_speech">Part of Speech</option>
                    <option value="semantic_domains">Semantic Domains</option>
                    <option value="districts">Districts</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-300">यूनीक कोड (Unique Code):</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="जैसे: folk_song_01"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-300">हिंदी लेबल (Hindi Label):</label>
                  <input
                    type="text"
                    required
                    value={hiLabel}
                    onChange={e => setHiLabel(e.target.value)}
                    placeholder="जैसे: लोकगीत"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-300">अंग्रेजी लेबल (English):</label>
                  <input
                    type="text"
                    required
                    value={enLabel}
                    onChange={e => setEnLabel(e.target.value)}
                    placeholder="जैसे: Folk Song"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">पवारी लेबल (Pawari Dialect):</label>
                <input
                  type="text"
                  value={pawLabel}
                  onChange={e => setPawLabel(e.target.value)}
                  placeholder="पवारी स्थानीय नाम..."
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">विवरण (Description):</label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="शब्दावली का विवरण..."
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
