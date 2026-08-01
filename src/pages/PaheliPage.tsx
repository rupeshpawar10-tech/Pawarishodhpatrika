import React, { useState } from 'react';
import { StorageEngine } from '../lib/storage';
import { Paheli } from '../types';
import { Sparkles, HelpCircle, Eye, EyeOff, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PaheliPage: React.FC = () => {
  const { user } = useAuth();
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [paheliList, setPaheliList] = useState<Paheli[]>(() => StorageEngine.getPaheli());
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [qPawari, setQPawari] = useState('');
  const [qHindi, setQHindi] = useState('');
  const [ansPawari, setAnsPawari] = useState('');
  const [ansHindi, setAnsHindi] = useState('');
  const [explanation, setExplanation] = useState('');
  const [difficulty, setDifficulty] = useState<Paheli['difficulty']>('medium');

  const handleAddPaheli = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qHindi || !ansHindi) return;

    const newPaheli: Paheli = {
      id: `paheli-${Date.now()}`,
      questionPawari: qPawari || qHindi,
      questionHindi: qHindi,
      answerPawari: ansPawari || ansHindi,
      answerHindi: ansHindi,
      explanation,
      difficulty
    };

    StorageEngine.savePaheli(newPaheli);
    setPaheliList(StorageEngine.getPaheli());
    setShowAddModal(false);
    setQPawari('');
    setQHindi('');
    setAnsPawari('');
    setAnsHindi('');
    setExplanation('');
    alert('नई पहेली सफलतापूर्वक जोड़ी गई!');
  };

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 sm:p-10 rounded-2xl border border-amber-500/30 flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>लोक ज्ञान एवं मनोरंजन</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100">
            पवारी पहेलियाँ (बुझौ-बुझौ आर्काइव)
          </h1>
          <p className="text-sm text-stone-300 font-serif max-w-2xl">
            सतपुड़ा अंचल की बुज़ुर्ग परंपरा में बच्चों एवं युवाओं की बौद्धिक क्षमता परखने वाली पवारी लोक पहेलियाँ।
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl flex items-center gap-2 shadow-lg transition text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>नया पहेली जोड़ें</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paheliList.map((item, index) => {
          const isRevealed = !!revealedIds[item.id];
          return (
            <div
              key={item.id}
              className="bg-amber-50/50 dark:bg-stone-900 p-6 rounded-2xl border border-amber-200/80 dark:border-stone-800 hover:border-amber-500/50 shadow-sm transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-amber-800 dark:text-amber-400">
                  <span className="font-bold">पहेली #{index + 1}</span>
                  <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 rounded capitalize">
                    {item.difficulty}
                  </span>
                </div>

                <div className="p-4 bg-stone-900 text-amber-100 rounded-xl font-serif text-sm border border-stone-800 leading-relaxed text-center">
                  "{item.questionPawari}"
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-400 text-center font-serif">
                  ({item.questionHindi})
                </p>
              </div>

              <div className="pt-2 border-t border-amber-200/60 dark:border-stone-800">
                {!isRevealed ? (
                  <button
                    onClick={() => toggleReveal(item.id)}
                    className="w-full py-2 bg-amber-800 hover:bg-amber-900 text-amber-100 dark:bg-amber-600 dark:hover:bg-amber-500 dark:text-stone-950 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    <Eye className="w-4 h-4" />
                    <span>उत्तर देखें (Show Answer)</span>
                  </button>
                ) : (
                  <div className="p-3 bg-stone-950 text-amber-300 rounded-xl text-center space-y-1 border border-amber-500/40">
                    <span className="text-[11px] text-stone-400 block font-mono">उत्तर (Answer):</span>
                    <span className="text-base font-serif font-bold text-amber-200">{item.answerHindi}</span>
                    {item.explanation && (
                      <p className="text-[11px] text-stone-400 font-sans italic pt-1 border-t border-stone-800">
                        {item.explanation}
                      </p>
                    )}
                    <button
                      onClick={() => toggleReveal(item.id)}
                      className="mt-2 text-[11px] text-stone-500 hover:text-stone-300 underline block mx-auto"
                    >
                      छिपाएँ
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Paheli Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg p-6 space-y-6 text-stone-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <h3 className="text-lg font-serif font-bold text-amber-200">नई पहेली जोड़ें (सुपर एडमिन)</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPaheli} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-300">पहेली (पवारी/स्थानीय बोलचाल):</label>
                <textarea
                  rows={2}
                  required
                  value={qPawari}
                  onChange={e => setQPawari(e.target.value)}
                  placeholder="पवारी भाषा में प्रश्न..."
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">पहेली (हिंदी अनुवाद):</label>
                <textarea
                  rows={2}
                  required
                  value={qHindi}
                  onChange={e => setQHindi(e.target.value)}
                  placeholder="हिंदी अर्थ..."
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-300">उत्तर (Answer):</label>
                  <input
                    type="text"
                    required
                    value={ansHindi}
                    onChange={e => setAnsHindi(e.target.value)}
                    placeholder="सही उत्तर..."
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-300">कठिनाई स्तर (Difficulty):</label>
                  <select
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  >
                    <option value="easy">सरल (Easy)</option>
                    <option value="medium">मध्यम (Medium)</option>
                    <option value="hard">कठिन (Hard)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">विवरण / स्पष्टीकरण (Explanation):</label>
                <input
                  type="text"
                  value={explanation}
                  onChange={e => setExplanation(e.target.value)}
                  placeholder="यदि कोई विशेष संदर्भ हो..."
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

