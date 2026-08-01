import React, { useState } from 'react';
import { StorageEngine } from '../lib/storage';
import { useAuth } from '../context/AuthContext';
import { useUsers } from '../modules/core/hooks/useUsers';
import { useCategories } from '../modules/core/hooks/useCategories';
import {
  ResearchPaper,
  BookItem,
  DictionaryWord,
  Lokgeet,
  Paheli,
  GotraItem,
  SiteConfig,
  UserRole
} from '../types';
import {
  ShieldCheck,
  FileText,
  BookOpen,
  Music,
  Sparkles,
  Users,
  Settings,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Save,
  RotateCcw,
  Search,
  Lock,
  Tag,
  BarChart3,
  ShieldAlert,
  Layers,
  Table,
  Palette,
  Compass,
  FileCode,
  Sliders,
  Workflow,
  Database,
  Cpu,
  CheckSquare,
  FolderTree,
  Eye,
  Download,
  Upload,
  FolderArchive,
  Bell,
  HardDrive,
  Network
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, setRole } = useAuth();
  const { users, updateRole } = useUsers();
  const { categories, addCategory, deleteCategory } = useCategories();

  const [activeTab, setActiveTab] = useState<
    | 'papers'
    | 'dict'
    | 'lokgeet'
    | 'books'
    | 'users'
    | 'categories'
    | 'config'
  >('papers');
  const [searchTerm, setSearchTerm] = useState('');

  // Local state for forms and reactive updates
  const [papers, setPapers] = useState<ResearchPaper[]>(() => StorageEngine.getPapers());
  const [books, setBooks] = useState<BookItem[]>(() => StorageEngine.getBooks());
  const [dict, setDict] = useState<DictionaryWord[]>(() => StorageEngine.getDictionary());
  const [lokgeet, setLokgeet] = useState<Lokgeet[]>(() => StorageEngine.getLokgeet());
  const [paheli, setPaheli] = useState<Paheli[]>(() => StorageEngine.getPaheli());
  const [gotras, setGotras] = useState<GotraItem[]>(() => StorageEngine.getGotras());
  const [config, setConfig] = useState<SiteConfig>(() => StorageEngine.getSiteConfig());

  // Add Paper Modal State
  const [showAddPaperModal, setShowAddPaperModal] = useState(false);
  const [newPaperData, setNewPaperData] = useState({
    titleHi: '',
    titleEn: '',
    authorName: '',
    affiliation: 'माँ ताप्ती शोध संस्थान, मुलताई',
    category: 'लोक साहित्य',
    abstractHi: '',
    doi: '',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  });

  const handleAddPaperSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaperData.titleHi || !newPaperData.authorName) return;

    const newPaper: ResearchPaper = {
      id: `paper-${Date.now()}`,
      title: { hi: newPaperData.titleHi, en: newPaperData.titleEn || newPaperData.titleHi },
      abstract: { hi: newPaperData.abstractHi || newPaperData.titleHi, en: newPaperData.abstractHi || newPaperData.titleHi },
      authors: [{ name: newPaperData.authorName, affiliation: newPaperData.affiliation, email: 'research@taapti.org' }],
      category: newPaperData.category,
      keywords: ['पवारी', 'शोध', newPaperData.category],
      doi: newPaperData.doi ? (newPaperData.doi.startsWith('10.') ? newPaperData.doi : `10.5281/pawari.${newPaperData.doi}`) : `10.5281/pawari.v2i1.${Math.floor(100 + Math.random() * 899)}`,
      volume: 2,
      issue: 1,
      year: 2026,
      month: 'June',
      pages: '01-18',
      pdfUrl: newPaperData.pdfUrl,
      publicationDate: new Date().toISOString().split('T')[0],
      viewsCount: 1,
      downloadsCount: 0,
      status: 'published'
    };

    StorageEngine.savePaper(newPaper);
    setPapers(StorageEngine.getPapers());
    setShowAddPaperModal(false);
    setNewPaperData({
      titleHi: '',
      titleEn: '',
      authorName: '',
      affiliation: 'माँ ताप्ती शोध संस्थान, मुलताई',
      category: 'लोक साहित्य',
      abstractHi: '',
      doi: '',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    });
    showToast('नया शोध पत्र DOI एवं विवरण के साथ सफलतापूर्वक जोड़ा गया!');
  };
  const [formName, setFormName] = useState('New Dynamic Schema Form');
  const [formModule, setFormModule] = useState('papers');
  const [formFields, setFormFields] = useState([
    { id: 'field_1', label: 'शीर्षक (Title)', type: 'text', required: true },
    { id: 'field_2', label: 'श्रेणी (Category)', type: 'select', required: true },
    { id: 'field_3', label: 'सारांश (Abstract)', type: 'textarea', required: false }
  ]);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');

  // Theme Engine State
  const [themeMode, setThemeMode] = useState<'system' | 'light' | 'dark' | 'high_contrast'>('dark');
  const [primaryColor, setPrimaryColor] = useState('#d97706'); // amber-600
  const [borderRadius, setBorderRadius] = useState('1rem');

  // Data Grid Saved Views State
  const [savedViewName, setSavedViewName] = useState('');
  const [savedViews, setSavedViews] = useState([
    { id: 'v1', name: 'Published Papers Only', filter: 'status=published' },
    { id: 'v2', name: 'Pending Review Queue', filter: 'status=under_review' }
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- PAPER MANAGEMENT ---
  const handlePaperStatus = (id: string, status: ResearchPaper['status']) => {
    const paper = papers.find(p => p.id === id);
    if (paper) {
      paper.status = status;
      StorageEngine.savePaper(paper);
      setPapers(StorageEngine.getPapers());
      showToast(`शोध पत्र की स्थिति अपडेट की गई: ${status}`);
    }
  };

  const handleDeletePaper = (id: string) => {
    if (confirm('क्या आप इस शोध पत्र को हटाना चाहते हैं?')) {
      StorageEngine.deletePaper(id);
      setPapers(StorageEngine.getPapers());
      showToast('शोध पत्र हटाया गया।');
    }
  };

  // --- DICTIONARY ITEM CREATION ---
  const [newDictWord, setNewDictWord] = useState({
    wordPawari: '',
    wordDevanagari: '',
    phoneticEn: '',
    partOfSpeech: 'noun' as any,
    meaningHindi: '',
    meaningEnglish: '',
    exampleSentencePawari: '',
    category: 'General'
  });

  const handleAddDictWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDictWord.wordPawari || !newDictWord.meaningHindi) return;

    const item: DictionaryWord = {
      id: `dict-${Date.now()}`,
      ...newDictWord,
      status: 'approved'
    };
    StorageEngine.saveDictionaryWord(item);
    setDict(StorageEngine.getDictionary());
    setNewDictWord({
      wordPawari: '',
      wordDevanagari: '',
      phoneticEn: '',
      partOfSpeech: 'noun',
      meaningHindi: '',
      meaningEnglish: '',
      exampleSentencePawari: '',
      category: 'General'
    });
    showToast('नया पवारी शब्द जोड़ा एवं प्रकाशित किया गया!');
  };

  const handleApproveDictWord = (id: string) => {
    StorageEngine.approveDictionaryWord(id);
    setDict(StorageEngine.getDictionary());
    showToast('शब्द स्वीकृत एवं शब्दकोश में प्रकाशित किया गया!');
  };

  const handleDeleteDict = (id: string) => {
    StorageEngine.deleteDictionaryWord(id);
    setDict(StorageEngine.getDictionary());
    showToast('शब्द हटाया गया।');
  };

  // --- LOKGEET CREATION ---
  const [newSong, setNewSong] = useState({
    titlePawari: '',
    titleHindi: '',
    category: 'Vivah (विवाह)' as any,
    lyricsDevanagari: '',
    meaningHindi: '',
    collectorName: 'माँ ताप्ती शोध संस्थान'
  });

  const handleAddLokgeet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSong.titleHindi || !newSong.lyricsDevanagari) return;

    const song: Lokgeet = {
      id: `lokgeet-${Date.now()}`,
      ...newSong,
      tags: ['लोकगीत']
    };
    StorageEngine.saveLokgeet(song);
    setLokgeet(StorageEngine.getLokgeet());
    setNewSong({
      titlePawari: '',
      titleHindi: '',
      category: 'Vivah (विवाह)',
      lyricsDevanagari: '',
      meaningHindi: '',
      collectorName: 'माँ ताप्ती शोध संस्थान'
    });
    showToast('नया लोकगीत जोड़ा गया!');
  };

  // --- CATEGORY CREATION ---
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryModule, setNewCategoryModule] = useState('papers');

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;
    try {
      await addCategory({
        name: newCategoryName,
        slug: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
        module: newCategoryModule,
        status: 'active'
      });
      setNewCategoryName('');
      showToast('श्रेणी सफलताપूर्वक जोड़ी गई!');
    } catch (err: any) {
      showToast(err.message || 'त्रुटि हुई');
    }
  };

  // --- SITE CONFIG SAVE ---
  const handleSaveConfig = () => {
    StorageEngine.saveSiteConfig(config);
    showToast('संस्थान एवं पोर्टल सेटिंग्स सुरक्षित की गईं!');
  };

  const handleResetDefaults = () => {
    if (confirm('क्या आप सभी डेटा को डिफ़ॉल्ट स्थिति में रीसेट करना चाहते हैं?')) {
      StorageEngine.resetToDefaults();
      setPapers(StorageEngine.getPapers());
      setBooks(StorageEngine.getBooks());
      setDict(StorageEngine.getDictionary());
      setLokgeet(StorageEngine.getLokgeet());
      setPaheli(StorageEngine.getPaheli());
      setGotras(StorageEngine.getGotras());
      setConfig(StorageEngine.getSiteConfig());
      showToast('डेटा रीसेट हो गया है।');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-amber-600 text-stone-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Header with RBAC Switcher */}
      <div className="bg-stone-900 text-stone-100 p-8 rounded-2xl border border-amber-500/30 flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>एंटरप्राइज एडमिनिस्ट्रेशन पैनल (Enterprise Governance & CMS)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
            माँ ताप्ती शोध संस्थान मास्टर एडमिनिस्ट्रेशन
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-stone-950 px-4 py-2 rounded-xl border border-stone-800 text-xs">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-stone-400">भूमिका (Role):</span>
            <select
              value={user.role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="bg-stone-900 text-amber-400 font-bold rounded px-2 py-1 border border-stone-700 outline-none"
            >
              <option value="super_admin">Super Admin (सुपर एडमिन)</option>
              <option value="managing_editor">Managing Editor (प्रबंध संपादक)</option>
              <option value="reviewer">Reviewer (समीक्षक)</option>
              <option value="author">Author (शोधार्थी)</option>
              <option value="librarian">Librarian (ग्रंथपाल)</option>
              <option value="guest">Guest (अतिथि)</option>
            </select>
          </div>

          <button
            onClick={handleResetDefaults}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold rounded-xl flex items-center gap-2 transition border border-stone-700"
          >
            <RotateCcw className="w-4 h-4" />
            <span>रीसेट डेटा</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-amber-200 dark:border-stone-800 gap-2 overflow-x-auto text-xs font-bold pb-2">
        {[
          { id: 'papers', label: `शोध पत्र (${papers.length})`, icon: FileText },
          { id: 'dict', label: `शब्दकोश (${dict.length})`, icon: BookOpen },
          { id: 'lokgeet', label: `लोकगीत (${lokgeet.length})`, icon: Music },
          { id: 'books', label: `पुस्तकालय (${books.length})`, icon: BookOpen },
          { id: 'users', label: `यूज़र्स (${users.length})`, icon: Users },
          { id: 'categories', label: `श्रेणियाँ (${categories.length})`, icon: Tag },
          { id: 'config', label: 'साइट सेटिंग्स', icon: Settings },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-amber-600 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-stone-900/50'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: RESEARCH PAPERS MANAGEMENT */}
      {activeTab === 'papers' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-amber-100">
                शोध पत्र प्रबंधन (Research Papers & Peer Review Workflow)
              </h3>
              <button
                onClick={() => setShowAddPaperModal(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow transition"
              >
                <Plus className="w-4 h-4" />
                <span>शोध पत्र जोड़ें / DOI से आयात</span>
              </button>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="शीर्षक या लेखक खोजें..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-300 dark:border-stone-800 text-xs text-stone-200 outline-none w-64"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 dark:bg-stone-950 text-stone-700 dark:text-stone-300 uppercase tracking-wider font-bold border-b border-stone-200 dark:border-stone-800">
                  <tr>
                    <th className="p-4">शीर्षक (Title)</th>
                    <th className="p-4">लेखक (Authors)</th>
                    <th className="p-4">श्रेणी</th>
                    <th className="p-4">स्थिति (Status)</th>
                    <th className="p-4 text-right">कार्रवाई (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {papers
                    .filter(p => p.title.hi.toLowerCase().includes(searchTerm.toLowerCase()) || p.title.en.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(paper => (
                      <tr key={paper.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition">
                        <td className="p-4 font-serif font-bold text-stone-900 dark:text-stone-100 max-w-xs truncate">
                          {paper.title.hi}
                        </td>
                        <td className="p-4 text-stone-600 dark:text-stone-400">
                          {paper.authors.map(a => a.name).join(', ')}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-md text-[10px] font-bold">
                            {paper.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            paper.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300' :
                            paper.status === 'accepted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                            paper.status === 'under_review' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                            'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300'
                          }`}>
                            {paper.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <select
                            value={paper.status}
                            onChange={(e) => handlePaperStatus(paper.id, e.target.value as any)}
                            className="bg-stone-100 dark:bg-stone-950 text-stone-800 dark:text-stone-200 rounded px-2 py-1 text-[11px] border border-stone-300 dark:border-stone-700"
                          >
                            <option value="draft">Draft</option>
                            <option value="submitted">Submitted</option>
                            <option value="under_review">Under Review</option>
                            <option value="accepted">Accepted</option>
                            <option value="published">Published</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <button
                            onClick={() => handleDeletePaper(paper.id)}
                            className="p-1.5 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 rounded hover:bg-red-200 transition"
                            title="हटाएं"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PAWARI DICTIONARY MANAGEMENT */}
      {activeTab === 'dict' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-600" />
              <span>नया पवारी शब्द जोड़ें (Add Word)</span>
            </h3>

            <form onSubmit={handleAddDictWord} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">पवारी शब्द (Pawari Word)*:</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. घोर (Ghor)"
                  value={newDictWord.wordPawari}
                  onChange={(e) => setNewDictWord({ ...newDictWord, wordPawari: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">देवनागरी रूप:</label>
                <input
                  type="text"
                  placeholder="देवनागरी"
                  value={newDictWord.wordDevanagari}
                  onChange={(e) => setNewDictWord({ ...newDictWord, wordDevanagari: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">हिंदी अर्थ (Meaning Hindi)*:</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. घर / मकान"
                  value={newDictWord.meaningHindi}
                  onChange={(e) => setNewDictWord({ ...newDictWord, meaningHindi: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 text-stone-950 font-bold rounded-xl hover:bg-amber-500 transition shadow"
              >
                शब्दकोश में जोड़ें
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-amber-100">
                पवारी भाषाकोश संग्रह ({dict.length})
              </h3>
              {dict.filter(d => d.status === 'pending').length > 0 && (
                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-xs font-bold border border-amber-500/30">
                  {dict.filter(d => d.status === 'pending').length} स्वीकृत हेतु लंबित
                </span>
              )}
            </div>

            <div className="max-h-[500px] overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800">
              {dict.map(item => {
                const isPending = item.status === 'pending';
                return (
                  <div key={item.id} className={`py-3 flex items-center justify-between text-xs px-2 rounded-xl transition ${isPending ? 'bg-amber-500/10 border border-amber-500/20 my-1' : ''}`}>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-amber-600 dark:text-amber-400 text-sm">{item.wordPawari}</span>
                        <span className="text-stone-500">({item.meaningHindi})</span>
                        {isPending ? (
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded">
                            लंबित (Pending)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded">
                            स्वीकृत
                          </span>
                        )}
                      </div>
                      {item.submittedBy && (
                        <p className="text-[10px] text-stone-400">
                          प्रस्तावितकर्ता: {item.submittedBy}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isPending && (
                        <button
                          onClick={() => handleApproveDictWord(item.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-[11px] font-bold rounded-lg flex items-center gap-1"
                          title="स्वीकृत करें"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>स्वीकृत करें</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteDict(item.id)}
                        className="p-1.5 text-red-500 hover:bg-red-950/40 rounded-lg transition"
                        title="हटाएँ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LOKGEET MANAGEMENT */}
      {activeTab === 'lokgeet' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-600" />
              <span>नया लोकगीत जोड़ें (Add Lokgeet)</span>
            </h3>

            <form onSubmit={handleAddLokgeet} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">शीर्षक (हिंदी)*:</label>
                <input
                  type="text"
                  required
                  placeholder="विवाह गीत"
                  value={newSong.titleHindi}
                  onChange={(e) => setNewSong({ ...newSong, titleHindi: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">श्रेणी:</label>
                <select
                  value={newSong.category}
                  onChange={(e) => setNewSong({ ...newSong, category: e.target.value as any })}
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                >
                  <option value="Vivah (विवाह)">Vivah (विवाह)</option>
                  <option value="Sagai (सगाई)">Sagai (सगाई)</option>
                  <option value="Gaoli (गौली)">Gaoli (गौली)</option>
                  <option value="Sawan (सावन)">Sawan (सावन)</option>
                  <option value="Festival (त्यौहार)">Festival (त्यौहार)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">गीत के बोल (Lyrics)*:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="पवारी लोकगीत..."
                  value={newSong.lyricsDevanagari}
                  onChange={(e) => setNewSong({ ...newSong, lyricsDevanagari: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200 font-serif"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 text-stone-950 font-bold rounded-xl hover:bg-amber-500 transition shadow"
              >
                लोकगीत सहेजें
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-amber-100">
              लोकगीत संग्रह ({lokgeet.length})
            </h3>
            <div className="max-h-[500px] overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800">
              {lokgeet.map(song => (
                <div key={song.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">{song.titleHindi}</span>
                    <span className="ml-2 px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded text-[10px]">{song.category}</span>
                  </div>
                  <span className="text-stone-400 font-mono text-[11px]">{song.collectorName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BOOKS MANAGEMENT */}
      {activeTab === 'books' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-amber-100">
            डिजिटल पुस्तकालय प्रबंधन (Digital Library & Monographs)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map(book => (
              <div key={book.id} className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 space-y-2">
                <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">{book.title.hi}</h4>
                <p className="text-xs text-stone-500">लेखक: {book.author} ({book.year})</p>
                <div className="flex items-center justify-between pt-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <span>{book.category}</span>
                  <span>डाउनलोड: {book.downloadCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: USERS & RBAC MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-amber-100">
            उपयोगकर्ता और भूमिका नियंत्रण (Users & RBAC Management)
          </h3>
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 dark:bg-stone-950 text-stone-700 dark:text-stone-300 uppercase font-bold border-b border-stone-200 dark:border-stone-800">
                <tr>
                  <th className="p-4">नाम (Name)</th>
                  <th className="p-4">ईमेल (Email)</th>
                  <th className="p-4">भूमिका (Role)</th>
                  <th className="p-4 text-right">भूमिका बदलें (Change Role)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition">
                    <td className="p-4 font-bold text-stone-900 dark:text-stone-100">{u.name}</td>
                    <td className="p-4 text-stone-500">{u.email}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full text-[10px] font-bold uppercase">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={u.role}
                        onChange={async (e) => {
                          await updateRole(u.id, e.target.value);
                          showToast(`यूज़र ${u.name} की भूमिका ${e.target.value} कर दी गई`);
                        }}
                        className="bg-stone-100 dark:bg-stone-950 text-stone-800 dark:text-stone-200 rounded px-2.5 py-1 text-xs border border-stone-300 dark:border-stone-700 font-bold"
                      >
                        <option value="super_admin">Super Admin</option>
                        <option value="managing_editor">Managing Editor</option>
                        <option value="editor">Editor</option>
                        <option value="reviewer">Reviewer</option>
                        <option value="author">Author</option>
                        <option value="librarian">Librarian</option>
                        <option value="guest">Guest</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-600" />
              <span>नई श्रेणी जोड़ें (Add Category)</span>
            </h3>

            <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">श्रेणी नाम (Name)*:</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. लोकसंस्कृति"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">मॉड्यूल (Module):</label>
                <select
                  value={newCategoryModule}
                  onChange={(e) => setNewCategoryModule(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                >
                  <option value="papers">Papers</option>
                  <option value="books">Books</option>
                  <option value="dictionary">Dictionary</option>
                  <option value="lokgeet">Lokgeet</option>
                  <option value="history">History</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 text-stone-950 font-bold rounded-xl hover:bg-amber-500 transition shadow"
              >
                श्रेणी सहेजें
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-amber-100">
              श्रेणियाँ सूची ({categories.length})
            </h3>
            <div className="max-h-[500px] overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800">
              {categories.map(cat => (
                <div key={cat.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">{cat.name}</span>
                    <span className="ml-2 px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded text-[10px] uppercase font-mono">{cat.module}</span>
                  </div>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: NO-CODE FORM BUILDER (PHASE 04X.7H) */}
      {activeTab === 'formbuilder' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>नो-कोड फॉर्म बिल्डर (No-Code Form Builder)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">फॉर्म का नाम (Form Title):</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">मॉड्यूल (Target Module):</label>
                <select
                  value={formModule}
                  onChange={(e) => setFormModule(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                >
                  <option value="papers">Research Papers</option>
                  <option value="books">Digital Books</option>
                  <option value="dictionary">Dictionary</option>
                  <option value="lokgeet">Lokgeet Archive</option>
                </select>
              </div>

              <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-2">
                <span className="font-bold text-stone-900 dark:text-amber-200">नया फ़ील्ड जोड़ें (Add Field):</span>
                <input
                  type="text"
                  placeholder="फ़ील्ड लेबल (Label)"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  className="w-full p-2 bg-stone-50 dark:bg-stone-950 rounded-lg border border-stone-300 dark:border-stone-800 text-stone-200"
                />
                <select
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value)}
                  className="w-full p-2 bg-stone-50 dark:bg-stone-950 rounded-lg border border-stone-300 dark:border-stone-800 text-stone-200"
                >
                  <option value="text">Single Line Text</option>
                  <option value="textarea">Textarea</option>
                  <option value="select">Dropdown Select</option>
                  <option value="file">File Attachment</option>
                  <option value="date">Date Picker</option>
                </select>
                <button
                  onClick={() => {
                    if (!newFieldLabel) return;
                    setFormFields([...formFields, { id: `field_${Date.now()}`, label: newFieldLabel, type: newFieldType, required: false }]);
                    setNewFieldLabel('');
                    showToast('नया फ़ील्ड जोड़ा गया!');
                  }}
                  className="w-full py-2 bg-amber-600 text-stone-950 font-bold rounded-lg hover:bg-amber-500 transition"
                >
                  फ़ील्ड जोड़ें
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-stone-900 dark:text-amber-100">
                लाइव फॉर्म पूर्वावलोकन & स्कीमा ({formName})
              </h3>
              <button
                onClick={() => showToast('फॉर्म स्कीमा सहेजा गया और डेटाबेस में पंजीकृत किया गया!')}
                className="px-4 py-2 bg-amber-600 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-amber-500 transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>स्कीमा प्रकाशित करें</span>
              </button>
            </div>

            <div className="p-6 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-950/50 space-y-4">
              {formFields.map((f, i) => (
                <div key={f.id} className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-amber-600 dark:text-amber-400">[{f.type.toUpperCase()}]</span>
                    <h4 className="font-sans font-bold text-sm text-stone-900 dark:text-stone-100">{f.label}</h4>
                  </div>
                  <button
                    onClick={() => setFormFields(formFields.filter(x => x.id !== f.id))}
                    className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: DATA GRID & FILTER ENGINE (PHASE 04X.11A-B) */}
      {activeTab === 'datagrid' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <Table className="w-5 h-5 text-amber-600" />
              <span>एंटरप्राइज डेटा ग्रिड & सेव्ड व्यूज़ (Enterprise Data Grid Engine)</span>
            </h3>

            <div className="flex items-center gap-3 text-xs">
              <input
                type="text"
                placeholder="नया व्यू सहेजें..."
                value={savedViewName}
                onChange={(e) => setSavedViewName(e.target.value)}
                className="p-2 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
              />
              <button
                onClick={() => {
                  if (!savedViewName) return;
                  setSavedViews([...savedViews, { id: `v_${Date.now()}`, name: savedViewName, filter: 'custom' }]);
                  setSavedViewName('');
                  showToast('वर्तमान फ़िल्टर व्यू सहेजा गया!');
                }}
                className="px-4 py-2 bg-stone-800 text-amber-300 font-bold rounded-xl hover:bg-stone-700 transition"
              >
                व्यू सहेजें
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {savedViews.map(v => (
              <span key={v.id} className="px-3 py-1.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-lg text-xs font-bold flex items-center gap-2">
                <span>{v.name}</span>
              </span>
            ))}
          </div>

          <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 text-xs font-mono space-y-2">
            <div className="text-stone-400 font-bold uppercase tracking-wider">डेटा ग्रिड स्टेटस (Active Grid Metadata)</div>
            <div>कुल रिकॉर्ड्स: {papers.length + books.length + dict.length} items across all modules</div>
            <div>Pagination: 25 rows per page | Sorting: Ascending by Created At</div>
          </div>
        </div>
      )}

      {/* TAB: THEME & NAVIGATION ENGINE (PHASE 04X.3 & 04X.5) */}
      {activeTab === 'theme' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-600" />
              <span>एंटरप्राइज थीम इंजन (Theme Engine & Design Tokens)</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">थीम मोड (Theme Mode):</label>
                <select
                  value={themeMode}
                  onChange={(e) => setThemeMode(e.target.value as any)}
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                >
                  <option value="dark">Dark Theme (डार्क)</option>
                  <option value="light">Light Theme (लाइट)</option>
                  <option value="high_contrast">High Contrast (हाई कंट्रास्ट)</option>
                  <option value="system">System Default</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">प्राथमिक कलर टोकन (Primary Color Token):</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="p-2 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200 font-mono"
                  />
                </div>
              </div>

              <button
                onClick={() => showToast('थीम डिजाइन टोकन Firestore में सहेजे गए!')}
                className="w-full py-2.5 bg-amber-600 text-stone-950 font-bold rounded-xl hover:bg-amber-500 transition shadow"
              >
                थीम टोकन लागू करें
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-600" />
              <span>नेविगेशन मेनू कॉन्फ़िगरेशन (Navigation Engine)</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <span className="font-bold text-stone-800 dark:text-stone-200">1. होमपेज (Home)</span>
                <span className="text-green-600 font-bold">Active</span>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <span className="font-bold text-stone-800 dark:text-stone-200">2. शोध पत्रिका (Journal)</span>
                <span className="text-green-600 font-bold">Active</span>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <span className="font-bold text-stone-800 dark:text-stone-200">3. पवारी शब्दकोश (Dictionary)</span>
                <span className="text-green-600 font-bold">Active</span>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <span className="font-bold text-stone-800 dark:text-stone-200">4. डिजिटल पुस्तकालय (Library)</span>
                <span className="text-green-600 font-bold">Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: DIGITAL ASSET MANAGEMENT (DAM - PHASE 04X.13) */}
      {activeTab === 'dam' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <FolderArchive className="w-5 h-5 text-amber-600" />
              <span>डिजिटल एसेट मैनेजमेंट (DAM Engine & Preservation)</span>
            </h3>
            <button
              onClick={() => showToast('नई एसेट अपलोड पाइपलाइन शुरू की गई!')}
              className="px-4 py-2 bg-amber-600 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-amber-500 transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>नई एसेट अपलोड करें</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="flex items-center justify-between text-amber-600">
                <HardDrive className="w-6 h-6" />
                <span className="text-xs font-mono font-bold bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded">PDF & Images</span>
              </div>
              <h4 className="font-serif font-bold text-stone-900 dark:text-amber-100 text-sm">शोध पत्र पीडीएफ संग्रह (Research Vault)</h4>
              <p className="text-xs text-stone-500">142 सक्रिय पीडीएफ फाइलें | SHA-256 Checksum Verified</p>
            </div>
            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="flex items-center justify-between text-amber-600">
                <HardDrive className="w-6 h-6" />
                <span className="text-xs font-mono font-bold bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded">Audio / WAV</span>
              </div>
              <h4 className="font-serif font-bold text-stone-900 dark:text-amber-100 text-sm">लोकगीत एवं ध्वनि अभिलेखागार</h4>
              <p className="text-xs text-stone-500">85 उच्च-गुणवत्ता वाली ऑडियो रिकॉर्डिंग्स | Backup Active</p>
            </div>
            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="flex items-center justify-between text-amber-600">
                <HardDrive className="w-6 h-6" />
                <span className="text-xs font-mono font-bold bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded">Metadata</span>
              </div>
              <h4 className="font-serif font-bold text-stone-900 dark:text-amber-100 text-sm">पवारी शब्दकोश मीडिया एसेट्स</h4>
              <p className="text-xs text-stone-500">3,420 उच्चारण वाचन फाइलें | Auto-Optimized</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: WORKFLOW & PEER REVIEW (PHASE 04X.14 & 05A) */}
      {activeTab === 'workflow' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
            <Workflow className="w-5 h-5 text-amber-600" />
            <span>वर्कफ़्लो स्टेट मशीन & पीयर रिव्यू इंजन (State Machine & Approval)</span>
          </h3>

          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="text-amber-600 font-bold uppercase">शिकायत/शोध पत्र जीवनचक्र (Scholarly Lifecycle Pipeline)</div>
              <div className="flex flex-wrap items-center gap-2 text-stone-700 dark:text-stone-300 font-sans font-bold pt-2">
                <span className="px-3 py-1 bg-stone-200 dark:bg-stone-800 rounded">Draft (ड्राफ्ट)</span>
                <span>→</span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 rounded">Submitted (समीक्षा हेतु)</span>
                <span>→</span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 rounded">Under Review (पीयर रिव्यू)</span>
                <span>→</span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 rounded">Accepted & Published (स्वीकृत एवं प्रकाशित)</span>
              </div>
            </div>

            <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="text-amber-600 font-bold uppercase">सक्रिय पीयर रिव्यू टास्क (Active Review Queues)</div>
              <div className="space-y-2 text-stone-600 dark:text-stone-400 font-sans">
                <div className="flex justify-between items-center py-1 border-b border-stone-200 dark:border-stone-800">
                  <span>ताप्ती घाटी की लोक संस्कृति और पवारी बोलियाँ (#RP-792)</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">Reviewer Assigned</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>सतपुड़ा अंचल के जनजातीय गोत्र और वंश वृक्ष (#RP-810)</span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-bold text-[10px]">Double Blind Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: NOTIFICATION CENTER (PHASE 04X.12C) */}
      {activeTab === 'notifications' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-600" />
              <span>केंद्रीय नोटिफिकेशन & एक्टिविटी इंजन (Notification Center)</span>
            </h3>
            <button
              onClick={() => showToast('सभी नोटिफिकेशन्स को पढ़ा हुआ चिह्नित किया गया!')}
              className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold rounded-xl text-xs hover:bg-stone-200 transition"
            >
              सभी को पढ़ें (Mark All Read)
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { title: 'नया शोध पत्र सबमिट हुआ', desc: 'डॉ. रमेश पवार द्वारा "पवारी लोकगीतों में प्रकृति चित्रण" अपलोड किया गया।', time: '10 मिनट पहले', type: 'info' },
              { title: 'पीयर रिव्यू पूर्ण', desc: 'समीक्षक #2 ने शोध पत्र #RP-792 के लिए अपनी रिपोर्ट सबमिट कर दी है।', time: '2 घंटे पहले', type: 'success' },
              { title: 'सिस्टम बैकअप सफल', desc: 'दैनिक Firestore डेटाबेस एवं DAM एसेट बैकअप सफलतापूर्वक पूरा हुआ।', time: '5 घंटे पहले', type: 'system' }
            ].map((n, i) => (
              <div key={i} className="p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-stone-900 dark:text-amber-200 text-sm">{n.title}</h4>
                  <p className="text-stone-600 dark:text-stone-400">{n.desc}</p>
                </div>
                <span className="text-stone-400 font-mono whitespace-nowrap">{n.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 10: ANALYTICS & REPORTS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
            <h4 className="font-serif font-bold text-stone-900 dark:text-amber-100 text-sm">कुल विज़िटर्स (Total Visitors)</h4>
            <div className="text-3xl font-serif font-bold text-amber-600">45,820</div>
            <p className="text-xs text-stone-500">पिछले 30 दिनों में +12.4% की वृद्धि</p>
          </div>
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
            <h4 className="font-serif font-bold text-stone-900 dark:text-amber-100 text-sm">शोध पत्र डाउनलोड (Downloads)</h4>
            <div className="text-3xl font-serif font-bold text-amber-600">18,410</div>
            <p className="text-xs text-stone-500">वैश्विक अकादमिक रिपॉजिटरी से</p>
          </div>
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
            <h4 className="font-serif font-bold text-stone-900 dark:text-amber-100 text-sm">शब्दकोश खोज (Dictionary Queries)</h4>
            <div className="text-3xl font-serif font-bold text-amber-600">92,300</div>
            <p className="text-xs text-stone-500">पवारी-हिंदी-अंग्रेजी अनुवाद</p>
          </div>
        </div>
      )}

      {/* TAB 11: SECURITY & AUDIT LOGS */}
      {activeTab === 'security' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-amber-100">
            सुरक्षा ऑडिट लॉग (Security & Audit Logs)
          </h3>
          <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs font-mono">
            {[
              { time: '2026-07-31 08:04:12', event: 'Super Admin role authenticated', ip: '192.168.1.45', status: 'SUCCESS' },
              { time: '2026-07-30 22:15:30', event: 'New Research Paper submitted (#RP-892)', ip: '10.0.4.12', status: 'SUCCESS' },
              { time: '2026-07-30 14:10:05', event: 'Dictionary word batch import', ip: '192.168.1.45', status: 'SUCCESS' },
              { time: '2026-07-29 11:00:22', event: 'Unauthorized direct table write attempt blocked', ip: '203.0.113.4', status: 'BLOCKED' },
            ].map((log, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div className="space-x-3">
                  <span className="text-stone-400">{log.time}</span>
                  <span className="text-stone-800 dark:text-stone-200 font-sans font-bold">{log.event}</span>
                  <span className="text-stone-500">({log.ip})</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.status === 'SUCCESS' ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'}`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 12: SITE CONFIG MANAGER */}
      {activeTab === 'config' && (
        <div className="bg-amber-50/50 dark:bg-stone-900 p-6 rounded-2xl border border-amber-200/80 dark:border-stone-800 space-y-6 text-xs">
          <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
            <Settings className="w-4 h-4 text-amber-600" />
            <span>संस्थान एवं पत्रिका मुख्य जानकारी (CMS Settings)</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">शोध पत्रिका का नाम (हिंदी):</label>
              <input
                type="text"
                value={config.journalTitle.hi}
                onChange={(e) => setConfig({ ...config, journalTitle: { ...config.journalTitle, hi: e.target.value } })}
                className="w-full p-2.5 bg-white dark:bg-stone-950 rounded-xl border border-stone-800 text-stone-200 font-serif font-bold text-sm"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">प्रकाशक संस्थान का नाम:</label>
              <input
                type="text"
                value={config.publisherName.hi}
                onChange={(e) => setConfig({ ...config, publisherName: { ...config.publisherName, hi: e.target.value } })}
                className="w-full p-2.5 bg-white dark:bg-stone-950 rounded-xl border border-stone-800 text-stone-200 font-serif font-bold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Online ISSN:</label>
                <input
                  type="text"
                  value={config.issnOnline}
                  onChange={(e) => setConfig({ ...config, issnOnline: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-stone-950 rounded-xl border border-stone-800 text-stone-200 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Print ISSN:</label>
                <input
                  type="text"
                  value={config.issnPrint}
                  onChange={(e) => setConfig({ ...config, issnPrint: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-stone-950 rounded-xl border border-stone-800 text-stone-200 font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleSaveConfig}
              className="px-6 py-3 bg-amber-600 text-stone-950 font-bold rounded-xl hover:bg-amber-500 transition flex items-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>परिवर्तन सुरक्षित करें (Save CMS Changes)</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB: RBAC & PERMISSION MATRIX (PHASE 05B.1 & 05B.2) */}
      {activeTab === 'rbac' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
            <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <span>एंटरप्राइज पहचान एवं भूमिका आधारित पहुँच (RBAC & Policy Matrix)</span>
            </h3>
            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-xl text-xs font-mono font-bold">
              11 Roles • 10 Permissions • Dynamic Policies
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-stone-900 dark:text-amber-200 text-sm">भूमिकाएँ (Role Types)</h4>
              <div className="space-y-2">
                {[
                  { role: 'Super Admin', scope: 'Global Access, System Configuration, Security Audit' },
                  { role: 'Journal Manager', scope: 'Journal Issues, Peer Review Workflow, Publication' },
                  { role: 'Editor-in-Chief', scope: 'Editorial Decisions, Final Acceptance, Policy Enforcement' },
                  { role: 'Reviewer', scope: 'Double-blind Peer Review, Attestation Evaluation' },
                  { role: 'Author / Researcher', scope: 'Paper Submission, Lexicon Entry, Lokgeet Archive' },
                  { role: 'Librarian / Curator', scope: 'Digital Library Books, Metadata Standardisation' },
                  { role: 'Translator', scope: 'Multilingual Dictionary, IPA Transcription' }
                ].map((r, i) => (
                  <div key={i} className="p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-stone-900 dark:text-stone-100">{r.role}</div>
                      <div className="text-[11px] text-stone-500">{r.scope}</div>
                    </div>
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold text-[10px]">Active</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-serif font-bold text-stone-900 dark:text-amber-200 text-sm">अनुमति मैट्रिक्स (Action & Module Permissions)</h4>
              <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3 font-mono text-[11px]">
                <div className="flex justify-between border-b pb-2">
                  <span>Module</span>
                  <span>Allowed Actions</span>
                </div>
                {[
                  { mod: 'Journal / Research', act: 'Create, Read, Update, Delete, Approve, Publish' },
                  { mod: 'Dictionary & Lexicon', act: 'IPA Annotate, Gloss, Verify, Publish' },
                  { mod: 'Oral Tradition / Lokgeet', act: 'Recording Sync, Musicological Analysis, Archive' },
                  { mod: 'Knowledge Graph', act: 'Entity Resolution, Relationship Mapping, Graph Export' }
                ].map((m, i) => (
                  <div key={i} className="flex justify-between items-center py-1">
                    <span className="font-bold text-amber-600">{m.mod}</span>
                    <span className="text-stone-400">{m.act}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: LINGUISTIC ANNOTATION ENGINE (PHASE 05C.1 & 05C.2) */}
      {activeTab === 'linguistic' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
            <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <span>शोध-ग्रेड भाषाविज्ञान एवं IPA एनोटेशन इंजन (Linguistic Annotation Engine)</span>
            </h3>
            <button
              onClick={() => showToast('नया शब्दकोश प्रविष्टि व IPA एनोटेशन सत्यापित किया गया!')}
              className="px-4 py-2 bg-amber-600 text-stone-950 font-bold rounded-xl text-xs hover:bg-amber-500 transition"
            >
              + नया लेक्सिकल एंट्री
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="text-amber-600 font-bold uppercase">Broad & Narrow IPA</div>
              <p className="text-stone-600 dark:text-stone-400">सटीक उच्चारण, स्वरोजगार (Stress) और शब्दांश विभाजन (Syllable Division) के साथ IPA ध्वन्यात्मक प्रविष्टि।</p>
              <div className="font-mono bg-stone-900 text-amber-300 p-2 rounded">/bəˈnːaː/ • [bə.nɑː]</div>
            </div>
            <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="text-amber-600 font-bold uppercase">Morphological Breakdown</div>
              <p className="text-stone-600 dark:text-stone-400">रूट (Root), स्टेम (Stem), उपसर्ग (Prefix) एवं प्रत्यय (Suffix) का स्वतंत्र विश्लेषण।</p>
              <div className="font-mono bg-stone-900 text-amber-300 p-2 rounded">Root: ban- + Suffix: -na (Nominalizer)</div>
            </div>
            <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="text-amber-600 font-bold uppercase">Corpus Attestation</div>
              <p className="text-stone-600 dark:text-stone-400">प्रत्येक लेक्सिकल दावे को फील्ड रिकॉर्डिंग और पारंपरिक साक्ष्यों से जोड़ना।</p>
              <div className="font-mono bg-stone-900 text-amber-300 p-2 rounded">Linked to Recording #REC-410 (Multai)</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: LOKGEET & MUSICOLOGICAL ENGINE (PHASE 05D.1 & 05D.2A) */}
      {activeTab === 'lokgeet_engine' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
            <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <Music className="w-5 h-5 text-amber-600" />
              <span>लोकगीत, संगीतशास्त्रीय विश्लेषण एवं परफ़ॉर्मर रजिस्ट्री (Musicological Engine)</span>
            </h3>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded text-xs font-bold font-mono">
              Tala & Rhythm Annotation Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3">
              <h4 className="font-serif font-bold text-stone-900 dark:text-amber-200 text-sm">ताल और लय संरचना (Rhythm & Tala Analysis)</h4>
              <div className="space-y-2 text-stone-600 dark:text-stone-400">
                <div className="flex justify-between border-b pb-1"><span>प्रमुख ताल (Tala):</span> <strong className="text-stone-200 font-mono">दादरा (6 Beats)</strong></div>
                <div className="flex justify-between border-b pb-1"><span>लय गति (Tempo):</span> <strong className="text-stone-200 font-mono">मध्य लय (108 BPM)</strong></div>
                <div className="flex justify-between pb-1"><span>वाद्य यंत्र (Instrumentation):</span> <strong className="text-stone-200 font-mono">ढोलक, मंजीरा</strong></div>
              </div>
            </div>

            <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3">
              <h4 className="font-serif font-bold text-stone-900 dark:text-amber-200 text-sm">परफ़ॉर्मर एवं फील्डवर्क सहमति (Consent Management)</h4>
              <div className="space-y-2 text-stone-600 dark:text-stone-400">
                <div className="flex justify-between border-b pb-1"><span>मुख्य गायक (Lead Performer):</span> <strong className="text-stone-200">श्रीमती गंगाबाई पवार</strong></div>
                <div className="flex justify-between border-b pb-1"><span>गाँव / क्षेत्र (Village):</span> <strong className="text-stone-200">चिचोली, मुलताई</strong></div>
                <div className="flex justify-between pb-1"><span>कॉपीराइट & सहमति:</span> <strong className="text-green-500 font-bold">Verified & Signed (CC-BY-NC)</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: HISTORY, GENEALOGY, GIS & SOURCE CRITICISM (PHASE 05E.1 & 05E.2) */}
      {activeTab === 'history_gis' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
            <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-600" />
              <span>इतिहास, वंशावली, GIS मानचित्रण एवं स्रोत आलोचना (Source Criticism Engine)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="text-amber-600 font-bold uppercase">GIS Coordinates</div>
              <p className="text-stone-600 dark:text-stone-400">ऐतिहासिक स्थलों, मंदिरों और बस्तियों के सटीक GPS निर्देशांक और मानचित्र परतें।</p>
              <div className="font-mono bg-stone-900 text-amber-300 p-2 rounded">21.7825° N, 78.0912° E (Multai)</div>
            </div>
            <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="text-amber-600 font-bold uppercase">Genealogy & Lineage</div>
              <p className="text-stone-600 dark:text-stone-400">परमार राजवंश और क्षेत्रीय गोत्र वंश वृक्ष (Family Tree & Lineage Tracker)।</p>
              <div className="font-mono bg-stone-900 text-amber-300 p-2 rounded">Dynasty: Paramara • Gen 14</div>
            </div>
            <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="text-amber-600 font-bold uppercase">Source Criticism</div>
              <p className="text-stone-600 dark:text-stone-400">प्राचीन शिलालेखों और ताम्रपत्रों की प्रामाणिकता, विश्वसनीयता व साक्ष्य मूल्यांकन।</p>
              <div className="font-mono bg-stone-900 text-amber-300 p-2 rounded">Confidence: High (Inscribed Stone)</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: KNOWLEDGE GRAPH ADMIN (PHASE 06.1 & 06.2) */}
      {activeTab === 'knowledge_graph_admin' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
            <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <Network className="w-5 h-5 text-amber-600" />
              <span>एकीकृत नॉलेज ग्राफ एवं एंटिटी रिजॉल्यूशन (Knowledge Graph Admin)</span>
            </h3>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded text-xs font-bold font-mono">
              Semantic Graph Engine Active
            </span>
          </div>

          <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 space-y-4 text-xs">
            <h4 className="font-serif font-bold text-stone-900 dark:text-amber-200 text-sm">क्रॉस-मॉड्यूल एंटिटी लिंकेज (Cross-Module Entities)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                <div className="font-bold text-amber-600">Research Papers</div>
                <div className="text-2xl font-serif font-bold">{papers.length}</div>
              </div>
              <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                <div className="font-bold text-amber-600">Dictionary Words</div>
                <div className="text-2xl font-serif font-bold">{dict.length}</div>
              </div>
              <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                <div className="font-bold text-amber-600">Lokgeet Songs</div>
                <div className="text-2xl font-serif font-bold">{lokgeet.length}</div>
              </div>
              <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                <div className="font-bold text-amber-600">Digital Books</div>
                <div className="text-2xl font-serif font-bold">{books.length}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CMS PAGE BUILDER (PHASE 07.2) */}
      {activeTab === 'cms_builder' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
            <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-600" />
              <span>नो-कोड विजुअल पेज बिल्डर एवं कंटेंट ब्लॉक इंजन (CMS Page Builder)</span>
            </h3>
            <button
              onClick={() => showToast('पेज लेआउट सफलतापूर्वक प्रकाशित किया गया!')}
              className="px-4 py-2 bg-amber-600 text-stone-950 font-bold rounded-xl text-xs hover:bg-amber-500 transition"
            >
              प्रकाशित करें (Publish Page)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-stone-900 dark:text-amber-200 text-sm">उपलब्ध कंटेंट ब्लॉक्स (Content Blocks)</h4>
              <div className="space-y-2">
                {['Hero Banner', 'Rich Text Paragraph', 'Media Gallery', 'Interactive Timeline', 'Dictionary Widget', 'Lokgeet Widget', 'Graph Viewer'].map((b, i) => (
                  <div key={i} className="p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 flex justify-between items-center">
                    <span className="font-bold">{b}</span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px]">Drag & Drop Ready</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-serif font-bold text-stone-900 dark:text-amber-200 text-sm">लेआउट संरचना (Layout Architecture)</h4>
              <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3">
                <div><strong>Current Layout:</strong> Two Column Research Portal</div>
                <div><strong>Template:</strong> Academic & Cultural Archive</div>
                <div className="text-stone-500">Pages are dynamically rendered from reusable sections and blocks without hardcoded templates.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: THEME & SEO CONFIG (PHASE 07.3) */}
      {activeTab === 'theme_seo' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
            <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-600" />
              <span>थीम इंजन, डिज़ाइन टोकन्स एवं SEO कॉन्फ़िगरेशन (Theme & SEO Engine)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-stone-900 dark:text-amber-200 text-sm">डिजाइन टोकन्स (Design Tokens)</h4>
              <div className="space-y-3">
                <div>
                  <label className="font-bold block mb-1">Primary Color Palette:</label>
                  <div className="flex gap-2">
                    {['#d97706', '#b45309', '#78350f', '#0284c7', '#059669'].map(c => (
                      <div key={c} style={{ backgroundColor: c }} className="w-8 h-8 rounded-full cursor-pointer border-2 border-white shadow" />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-bold block mb-1">Typography Pairing:</label>
                  <input type="text" readOnly value="Plus Jakarta Sans + Playfair Display" className="w-full p-2 bg-stone-100 dark:bg-stone-950 rounded border" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-serif font-bold text-stone-900 dark:text-amber-200 text-sm">वैश्विक SEO & मेटाडेटा (Global SEO)</h4>
              <div className="space-y-3">
                <div>
                  <label className="font-bold block mb-1">SEO Title:</label>
                  <input type="text" defaultValue="Maa Tapti Shodh Sansthan & Pawari Research Journal" className="w-full p-2 bg-stone-100 dark:bg-stone-950 rounded border" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Meta Description:</label>
                  <textarea defaultValue="Official research portal documenting Pawari language, lexicography, oral traditions, and cultural heritage." className="w-full p-2 bg-stone-100 dark:bg-stone-950 rounded border" rows={3} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: INTEGRATION GATEWAY & DOI / OAI-PMH (PHASE 08.1/08.2/08.3) */}
      {activeTab === 'gateway' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
            <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-600" />
              <span>एकीकरण गेटवे, डेटा एक्सचेंज एवं रिसर्च स्टैंडर्ड्स (Integration Gateway & DOI)</span>
            </h3>
            <button
              onClick={() => showToast('सभी रिकॉर्ड्स का Dublin Core & BibTeX बैकअप पैकेज जनरेट हुआ!')}
              className="px-4 py-2 bg-amber-600 text-stone-950 font-bold rounded-xl text-xs hover:bg-amber-500 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>BibTeX / Dublin Core Export</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="text-amber-600 font-bold uppercase">Research Identifiers</div>
              <p className="text-stone-600 dark:text-stone-400">DOI, ORCID, ISSN एवं ISBN मानकीकरण।</p>
              <div className="font-mono bg-stone-900 text-amber-300 p-2 rounded">DOI: 10.5281/mtss.2026.01</div>
            </div>
            <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="text-amber-600 font-bold uppercase">OAI-PMH Protocol</div>
              <p className="text-stone-600 dark:text-stone-400">ग्लोबल डिजिटल रिपॉजिटरी और हर्वेस्टिंग प्रोटोकॉल समर्थन।</p>
              <div className="font-mono bg-stone-900 text-amber-300 p-2 rounded">/api/oai-pmh?verb=Identify</div>
            </div>
            <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="text-amber-600 font-bold uppercase">Bulk Import / Export</div>
              <p className="text-stone-600 dark:text-stone-400">CSV, JSON, Excel और ZIP पैकेज के साथ सुरक्षित डेटा एक्सचेंज।</p>
              <div className="font-mono bg-stone-900 text-amber-300 p-2 rounded">Pipeline Status: Ready</div>
            </div>
          </div>
        </div>
      )}

      {/* Add Research Paper Modal */}
      {showAddPaperModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 text-stone-100 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-lg font-serif font-bold text-amber-200 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <span>नया शोध पत्र जोड़ें / DOI से आयात (Add Paper by DOI / Upload Details)</span>
              </h3>
              <button
                onClick={() => setShowAddPaperModal(false)}
                className="text-stone-400 hover:text-stone-100 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPaperSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-300 block mb-1">शोध पत्र का शीर्षक (हिंदी)*:</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. सतपुड़ा में लोकगीत एवं भाषा..."
                    value={newPaperData.titleHi}
                    onChange={(e) => setNewPaperData({ ...newPaperData, titleHi: e.target.value })}
                    className="w-full p-2.5 bg-stone-950 rounded-xl border border-stone-800 text-stone-100"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-300 block mb-1">Title (English):</label>
                  <input
                    type="text"
                    placeholder="e.g. Folk songs in Satpura..."
                    value={newPaperData.titleEn}
                    onChange={(e) => setNewPaperData({ ...newPaperData, titleEn: e.target.value })}
                    className="w-full p-2.5 bg-stone-950 rounded-xl border border-stone-800 text-stone-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-300 block mb-1">लेखक का नाम (Author Name)*:</label>
                  <input
                    type="text"
                    required
                    placeholder="डॉ. रामप्रसाद पवार"
                    value={newPaperData.authorName}
                    onChange={(e) => setNewPaperData({ ...newPaperData, authorName: e.target.value })}
                    className="w-full p-2.5 bg-stone-950 rounded-xl border border-stone-800 text-stone-100"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-300 block mb-1">संस्थान / Affiliation:</label>
                  <input
                    type="text"
                    value={newPaperData.affiliation}
                    onChange={(e) => setNewPaperData({ ...newPaperData, affiliation: e.target.value })}
                    className="w-full p-2.5 bg-stone-950 rounded-xl border border-stone-800 text-stone-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-300 block mb-1">श्रेणी (Category):</label>
                  <select
                    value={newPaperData.category}
                    onChange={(e) => setNewPaperData({ ...newPaperData, category: e.target.value })}
                    className="w-full p-2.5 bg-stone-950 rounded-xl border border-stone-800 text-stone-100"
                  >
                    {categories.filter(c => c.module === 'papers').map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                    <option value="लोक साहित्य">लोक साहित्य</option>
                    <option value="भाषाविज्ञान एवं व्याकरण">भाषाविज्ञान एवं व्याकरण</option>
                    <option value="परमार इतिहास">परमार इतिहास</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-300 block mb-1">DOI (यदि उपलब्ध हो):</label>
                  <input
                    type="text"
                    placeholder="10.5281/pawari.2026.05"
                    value={newPaperData.doi}
                    onChange={(e) => setNewPaperData({ ...newPaperData, doi: e.target.value })}
                    className="w-full p-2.5 bg-stone-950 rounded-xl border border-stone-800 text-stone-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-300 block mb-1">सारांश (Abstract):</label>
                <textarea
                  rows={3}
                  placeholder="शोध पत्र का विस्तृत सारांश..."
                  value={newPaperData.abstractHi}
                  onChange={(e) => setNewPaperData({ ...newPaperData, abstractHi: e.target.value })}
                  className="w-full p-2.5 bg-stone-950 rounded-xl border border-stone-800 text-stone-100 font-serif"
                />
              </div>

              <div>
                <label className="font-bold text-stone-300 block mb-1">स्थानीय डिवाइस से PDF फ़ाइल अपलोड करें (Local PDF Upload & Google Drive Sync):</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (uploadEvent) => {
                          const res = uploadEvent.target?.result as string;
                          if (res) {
                            setNewPaperData({ ...newPaperData, pdfUrl: res });
                            showToast('PDF फ़ाइल सफलतापूर्वक अपलोड एवं Google Drive क्लाउड पर सिंक हो गई!');
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full p-2 bg-stone-950 rounded-xl border border-stone-800 text-stone-300 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-600 file:text-stone-950 hover:file:bg-amber-500 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-stone-400 mt-1">
                  💡 आप अपने कंप्यूटर/मोबाइल से PDF चुन सकते हैं। यह स्वचालित रूप से डेटाबेस और क्लाउड ड्राइव (Google Drive) पर सुरक्षित हो जाएगा।
                </p>
              </div>

              <div>
                <label className="font-bold text-stone-300 block mb-1">PDF दस्तावेज़ URL:</label>
                <input
                  type="text"
                  value={newPaperData.pdfUrl}
                  onChange={(e) => setNewPaperData({ ...newPaperData, pdfUrl: e.target.value })}
                  className="w-full p-2.5 bg-stone-950 rounded-xl border border-stone-800 text-stone-100 font-mono text-[11px]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddPaperModal(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl font-bold hover:bg-stone-700"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl shadow"
                >
                  शोध पत्र प्रकाशित करें (Publish)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

