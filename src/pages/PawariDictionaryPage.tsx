import React, { useState, useEffect } from 'react';
import { StorageEngine } from '../lib/storage';
import { DictionaryWord } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, Search, Volume2, Filter, Plus, CheckCircle2, Clock, XCircle, 
  ShieldCheck, UserCheck, AlertCircle, X, Sparkles, Send
} from 'lucide-react';

export const PawariDictionaryPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // All words from storage
  const [allWords, setAllWords] = useState<DictionaryWord[]>(() => StorageEngine.getDictionary());

  const refreshWords = () => {
    setAllWords(StorageEngine.getDictionary());
  };

  useEffect(() => {
    refreshWords();
    const handleStorageChange = () => refreshWords();
    window.addEventListener('pawari_storage_change', handleStorageChange);
    return () => window.removeEventListener('pawari_storage_change', handleStorageChange);
  }, []);

  const isAdmin = ['super_admin', 'administrator', 'managing_editor', 'editor'].includes(user?.role || '');

  // Form state for user word submission
  const [formData, setFormData] = useState({
    wordPawari: '',
    wordDevanagari: '',
    phoneticEn: '',
    partOfSpeech: 'noun' as DictionaryWord['partOfSpeech'],
    meaningHindi: '',
    meaningEnglish: '',
    category: 'दैनिक उपयोग (Daily Usage)',
    exampleSentencePawari: '',
    exampleSentenceHindi: '',
    submittedBy: user?.name ? `${user.name} (${user.email || 'यूज़र'})` : ''
  });

  // Filter approved and pending words
  const approvedWords = allWords.filter(w => !w.status || w.status === 'approved');
  const pendingWords = allWords.filter(w => w.status === 'pending');

  const categories = Array.from(
    new Set(allWords.map(w => w.category).concat([
      'दैनिक उपयोग (Daily Usage)',
      'कृषि एवं औजार (Agriculture)',
      'पशु-पक्षी (Animals & Birds)',
      'संबंध एवं नातेदारी (Relations)',
      'पकवान एवं खानपान (Food)',
      'भूगोल एवं प्रकृति (Nature)',
      'पर्व एवं त्यौहार (Festivals)',
      'सामान्य (General)'
    ]))
  );

  const displayWords = activeTab === 'approved' ? approvedWords : pendingWords;

  const filteredWords = displayWords.filter(w => {
    const q = searchTerm.trim().toLowerCase();
    const matchSearch =
      w.wordPawari.toLowerCase().includes(q) ||
      w.wordDevanagari.toLowerCase().includes(q) ||
      w.meaningHindi.toLowerCase().includes(q) ||
      w.meaningEnglish.toLowerCase().includes(q) ||
      (w.submittedBy && w.submittedBy.toLowerCase().includes(q));
    const matchCat = selectedCategory === 'all' || w.category === selectedCategory || w.category.includes(selectedCategory);
    return matchSearch && matchCat;
  });

  const handlePronounce = (word: DictionaryWord) => {
    setPlayingId(word.id);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.wordPawari);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.8;
      utterance.onend = () => setPlayingId(null);
      utterance.onerror = () => setPlayingId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingId(null), 1000);
    }
  };

  const handleUserSubmitWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.wordPawari.trim() || !formData.meaningHindi.trim()) {
      alert('कृपया पवारी शब्द एवं हिंदी अर्थ अवश्य भरें।');
      return;
    }

    const newWord: DictionaryWord = {
      id: `word-sub-${Date.now()}`,
      wordPawari: formData.wordPawari.trim(),
      wordDevanagari: formData.wordDevanagari.trim() || formData.wordPawari.trim(),
      phoneticEn: formData.phoneticEn.trim() || formData.wordPawari.trim(),
      partOfSpeech: formData.partOfSpeech,
      meaningHindi: formData.meaningHindi.trim(),
      meaningEnglish: formData.meaningEnglish.trim() || formData.meaningHindi.trim(),
      category: formData.category || 'दैनिक उपयोग (Daily Usage)',
      exampleSentencePawari: formData.exampleSentencePawari.trim(),
      exampleSentenceHindi: formData.exampleSentenceHindi.trim(),
      status: 'approved',
      submittedBy: formData.submittedBy.trim() || user?.name || 'अज्ञात प्रयोक्ता (Anonymous User)',
      submittedAt: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    StorageEngine.saveDictionaryWord(newWord);
    setAllWords(StorageEngine.getDictionary());
    setActiveTab('approved');
    setSearchTerm('');
    setSelectedCategory('all');
    setShowAddModal(false);
    
    // Reset form
    setFormData({
      wordPawari: '',
      wordDevanagari: '',
      phoneticEn: '',
      partOfSpeech: 'noun',
      meaningHindi: '',
      meaningEnglish: '',
      category: 'दैनिक उपयोग (Daily Usage)',
      exampleSentencePawari: '',
      exampleSentenceHindi: '',
      submittedBy: user?.name ? `${user.name} (${user.email || 'यूज़र'})` : ''
    });

    setToastMessage('आपका पवारी शब्द सफलतापूर्वक शब्दकोश में जोड़ दिया गया है!');
    setTimeout(() => setToastMessage(null), 6000);
  };

  const handleApproveWord = (id: string) => {
    StorageEngine.approveDictionaryWord(id);
    setAllWords(StorageEngine.getDictionary());
    setToastMessage('शब्द को सफलतापूर्वक स्वीकृत एवं मुख्य शब्दकोश में प्रकाशित कर दिया गया है!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRejectWord = (id: string) => {
    if (confirm('क्या आप इस शब्द सुझाव को अस्वीकृत/हटाना चाहते हैं?')) {
      StorageEngine.deleteDictionaryWord(id);
      setAllWords(StorageEngine.getDictionary());
      setToastMessage('शब्द सुझाव को हटा दिया गया।');
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-amber-600 text-stone-950 px-5 py-3 rounded-2xl font-bold text-xs shadow-2xl border border-amber-400 flex items-center gap-3 max-w-md animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-stone-950" />
          <span className="flex-1">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-stone-900 hover:text-stone-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 sm:p-10 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>सतपुड़ा अंचल भाषाकोश एवं लोक-शब्दावली</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100">
            पवारी (भोयरी) भाषाकोश एवं संदर्भ शब्दकोश
          </h1>
          <p className="text-sm text-stone-300 font-serif leading-relaxed">
            पवारी भाषा के पारंपरिक पदों, ध्वन्यात्मक उच्चारण, व्याकरणिक श्रेणी एवं उदाहरण वाक्यों का प्रामाणिक संकलन। आप भी पवारी के लुप्तप्राय शब्दों का योगदान दे सकते हैं।
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold rounded-2xl flex items-center gap-2 shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 text-xs relative z-10"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>नया पवारी शब्द जोड़ें / सुझाव दें</span>
        </button>
      </div>

      {/* Status Notice Banner for Users */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">शब्दकोश योगदान नीति (Contribution Policy):</p>
          <p className="text-stone-600 dark:text-stone-300">
            प्रयोगकर्ताओं द्वारा जोड़े गए नए पवारी शब्द तुरंत <strong>'लंबित सुझाव (Pending)'</strong> सूची में दर्ज होते हैं। माँ ताप्ती शोध संस्थान के भाषाविदों एवं एडमिन द्वारा समीक्षा व स्वीकृति (Approval) के उपरांत ही वे मुख्य भाषाकोश में प्रकाशित होते हैं।
          </p>
        </div>
      </div>

      {/* Tabs & Search Toolbar */}
      <div className="bg-amber-50/80 dark:bg-stone-900 p-4 rounded-2xl border border-amber-200 dark:border-stone-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-200/60 dark:border-stone-800 pb-3">
          {/* Main Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
                activeTab === 'approved'
                  ? 'bg-amber-600 text-stone-950 shadow-md'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>प्रकाशित शब्दकोश ({approvedWords.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition relative ${
                activeTab === 'pending'
                  ? 'bg-amber-600 text-stone-950 shadow-md'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>लंबित शब्द सुझाव (Pending Approval)</span>
              {pendingWords.length > 0 && (
                <span className="px-2 py-0.5 text-[10px] bg-amber-500 text-stone-950 font-extrabold rounded-full animate-pulse">
                  {pendingWords.length}
                </span>
              )}
            </button>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-xl text-[11px] font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>एडमिन मोड: आप शब्द स्वीकृत/अस्वीकृत कर सकते हैं</span>
            </div>
          )}
        </div>

        {/* Filter Inputs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[280px] relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="पवारी शब्द, अर्थ या योगदानकर्ता खोजें..."
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 rounded-xl border border-amber-200 dark:border-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-sans">
            <Filter className="w-4 h-4 text-amber-600" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 px-3 py-2.5 rounded-xl border border-amber-200 dark:border-stone-800 font-medium text-xs"
            >
              <option value="all">सभी श्रेणियाँ (All Categories)</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredWords.length === 0 && (
        <div className="text-center py-16 bg-amber-50/40 dark:bg-stone-900/40 rounded-3xl border border-dashed border-amber-300 dark:border-stone-800 space-y-3">
          <BookOpen className="w-10 h-10 text-stone-400 mx-auto opacity-50" />
          <p className="text-sm font-serif text-stone-500">
            {activeTab === 'pending'
              ? 'वर्तमान में कोई लंबित शब्द सुझाव नहीं है।'
              : 'कोई पवारी शब्द नहीं मिला।'}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-amber-600 text-stone-950 font-bold rounded-xl text-xs inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>पहला शब्द जोड़ें</span>
          </button>
        </div>
      )}

      {/* Words Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWords.map((word) => {
          const isPending = word.status === 'pending';
          return (
            <div
              key={word.id}
              className={`bg-amber-50/50 dark:bg-stone-900 p-6 rounded-2xl border shadow-sm transition space-y-4 flex flex-col justify-between relative ${
                isPending
                  ? 'border-amber-500/60 dark:border-amber-500/40 bg-amber-500/5'
                  : 'border-amber-200/80 dark:border-stone-800 hover:border-amber-500/50'
              }`}
            >
              {/* Header Badge */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-amber-200/60 dark:border-stone-800">
                  <div className="space-y-0.5">
                    <span className="text-2xl font-serif font-bold text-amber-900 dark:text-amber-200 block">
                      {word.wordPawari}
                    </span>
                    {word.wordDevanagari && word.wordDevanagari !== word.wordPawari && (
                      <span className="text-xs text-stone-500">({word.wordDevanagari})</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePronounce(word)}
                      className={`p-2 rounded-xl transition ${
                        playingId === word.id
                          ? 'bg-amber-600 text-stone-950'
                          : 'bg-amber-100 dark:bg-stone-800 text-amber-800 dark:text-amber-400 hover:bg-amber-200'
                      }`}
                      title="उच्चारण सुनें (Pronounce)"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Submitter & Status Info */}
                <div className="flex items-center justify-between text-[11px] font-mono text-stone-500">
                  <span>[Phonetic: {word.phoneticEn}]</span>
                  <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold rounded">
                    {word.partOfSpeech}
                  </span>
                </div>

                {/* Meanings */}
                <div className="space-y-1.5 text-xs">
                  <p>
                    <span className="font-bold text-amber-800 dark:text-amber-400">हिंदी: </span>
                    <span className="text-stone-800 dark:text-stone-200 font-serif font-semibold">{word.meaningHindi}</span>
                  </p>
                  <p>
                    <span className="font-bold text-amber-800 dark:text-amber-400">English: </span>
                    <span className="text-stone-700 dark:text-stone-300 font-sans">{word.meaningEnglish}</span>
                  </p>
                  {word.exampleSentencePawari && (
                    <div className="mt-3 p-3 bg-stone-100 dark:bg-stone-950/80 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 italic font-serif">
                      "{word.exampleSentencePawari}"
                      {word.exampleSentenceHindi && (
                        <span className="block not-italic text-[11px] text-stone-500 font-sans mt-1">
                          ({word.exampleSentenceHindi})
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Info & Admin Actions */}
              <div className="pt-3 border-t border-amber-200/60 dark:border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-stone-400">
                  <span>श्रेणी: {word.category}</span>
                  {isPending ? (
                    <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      समीक्षाधीन
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      स्वीकृत
                    </span>
                  )}
                </div>

                {word.submittedBy && (
                  <p className="text-[10px] text-stone-500 italic">
                    योगदानकर्ता: {word.submittedBy} {word.submittedAt ? `• ${word.submittedAt}` : ''}
                  </p>
                )}

                {/* Admin Approval Toolbar */}
                {isAdmin && isPending && (
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => handleApproveWord(word.id)}
                      className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>स्वीकृत करें (Approve)</span>
                    </button>
                    <button
                      onClick={() => handleRejectWord(word.id)}
                      className="py-1.5 px-3 bg-red-900/30 hover:bg-red-900/50 text-red-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition"
                      title="अस्वीकृत / हटाएँ"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>अस्वीकृत</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* USER WORD SUBMISSION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-amber-500/30 rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-6 text-stone-100 shadow-2xl relative my-8">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-200 p-1 rounded-full bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>जन-सहभागिता पवारी भाषाकोश</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-amber-100">
                नया पवारी (भोयरी) शब्द का सुझाव दें
              </h3>
              <p className="text-xs text-stone-400">
                आपके द्वारा जोड़ा गया शब्द समीक्षा हेतु भेजा जाएगा। एडमिन की स्वीकृति (Admin Approval) के उपरांत इसे शब्दकोश में प्रकाशित किया जाएगा।
              </p>
            </div>

            <form onSubmit={handleUserSubmitWord} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-amber-300">पवारी शब्द (Pawari Word) *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. घोर, पाणी, खाजा, डोंगर"
                    value={formData.wordPawari}
                    onChange={e => setFormData({ ...formData, wordPawari: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-300">देवनागरी रूप (Devanagari Script)</label>
                  <input
                    type="text"
                    placeholder="देवनागरी लिपि रूप..."
                    value={formData.wordDevanagari}
                    onChange={e => setFormData({ ...formData, wordDevanagari: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-300">ध्वन्यात्मक अंग्रेजी (Phonetic EN)</label>
                  <input
                    type="text"
                    placeholder="उदा. Ghor, Paani"
                    value={formData.phoneticEn}
                    onChange={e => setFormData({ ...formData, phoneticEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-300">व्याकरण श्रेणी (Part of Speech)</label>
                  <select
                    value={formData.partOfSpeech}
                    onChange={e => setFormData({ ...formData, partOfSpeech: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  >
                    <option value="noun">संज्ञा (Noun)</option>
                    <option value="verb">क्रिया (Verb)</option>
                    <option value="adjective">विशेषण (Adjective)</option>
                    <option value="adverb">क्रियाविशेषण (Adverb)</option>
                    <option value="pronoun">सर्वनाम (Pronoun)</option>
                    <option value="idiom">मुहावरा (Idiom)</option>
                    <option value="phrase">लोकोक्ति/वाक्यांश (Phrase)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-300">विषय श्रेणी (Category)</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  >
                    <option value="दैनिक उपयोग (Daily Usage)">दैनिक उपयोग (Daily Usage)</option>
                    <option value="कृषि एवं औजार (Agriculture)">कृषि एवं औजार (Agriculture)</option>
                    <option value="पशु-पक्षी (Animals & Birds)">पशु-पक्षी (Animals & Birds)</option>
                    <option value="संबंध एवं नातेदारी (Relations)">संबंध एवं नातेदारी (Relations)</option>
                    <option value="पकवान एवं खानपान (Food)">पकवान एवं खानपान (Food)</option>
                    <option value="भूगोल एवं प्रकृति (Nature)">भूगोल एवं प्रकृति (Nature)</option>
                    <option value="पर्व एवं त्यौहार (Festivals)">पर्व एवं त्यौहार (Festivals)</option>
                    <option value="सामान्य (General)">सामान्य (General)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-amber-300">हिंदी अर्थ (Hindi Meaning) *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. मकान / गृह / घर"
                    value={formData.meaningHindi}
                    onChange={e => setFormData({ ...formData, meaningHindi: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-300">अंग्रेजी अर्थ (English Meaning)</label>
                  <input
                    type="text"
                    placeholder="उदा. House / Home"
                    value={formData.meaningEnglish}
                    onChange={e => setFormData({ ...formData, meaningEnglish: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">उदाहरण वाक्य (पवारी भाषा में)</label>
                <input
                  type="text"
                  placeholder="उदा. आमी आपना घोर चालला।"
                  value={formData.exampleSentencePawari}
                  onChange={e => setFormData({ ...formData, exampleSentencePawari: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">उदाहरण वाक्य का हिंदी अनुवाद</label>
                <input
                  type="text"
                  placeholder="उदा. हम अपने घर जा रहे हैं।"
                  value={formData.exampleSentenceHindi}
                  onChange={e => setFormData({ ...formData, exampleSentenceHindi: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">आपका नाम / संस्थान (Contributor Info)</label>
                <input
                  type="text"
                  placeholder="उदा. रूपेश पवार (मुलताई, बैतूल)"
                  value={formData.submittedBy}
                  onChange={e => setFormData({ ...formData, submittedBy: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold rounded-xl"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold rounded-xl shadow-lg flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>प्रस्ताव जमा करें (Submit Word)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

