import React, { useState } from 'react';
import { StorageEngine } from '../lib/storage';
import { HistoricalDocument } from '../types';
import { Landmark, Search, Calendar, MapPin, Users, FileText, Plus, Eye, Download, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HistoryArchivePage: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<HistoricalDocument[]>(() => StorageEngine.getDocuments());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'records' | 'timeline' | 'places' | 'persons'>('records');
  const [showAddModal, setShowAddModal] = useState(false);

  // New document form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Manuscripts');
  const [year, setYear] = useState('1750 ई.');
  const [description, setDescription] = useState('');
  const [sourceUrl, setSourceUrl] = useState('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const newDoc: HistoricalDocument = {
      id: `hist-${Date.now()}`,
      title,
      period: year,
      source: 'मुलताई एवं सतपुड़ा शोध अभिलेखागार',
      description,
      category: category as any,
      imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=800',
      documentPdfUrl: sourceUrl
    };

    StorageEngine.saveDocument(newDoc);
    setDocuments(StorageEngine.getDocuments());
    setShowAddModal(false);
    setTitle('');
    setDescription('');
    alert('नया ऐतिहासिक अभिलेख सफलतापूर्वक जोड़ा गया!');
  };

  // Entities state
  const personsList = [
    { id: 'p-1', name: 'राजा मोरध्वज', period: '12वीं शताब्दी', role: 'परमार राजवंश शासक, मुलताई क्षेत्र', desc: 'सतपुड़ा और मुलताई के ऐतिहासिक परमार शासक जिन्होंने ताप्ती तट पर सांस्कृतिक एवं धार्मिक संरक्षण दिया।' },
    { id: 'p-2', name: 'संत सिंगाजी (संबंधित)', period: '16वीं शताब्दी', role: 'निमाड़-सतपुड़ा संत कवि', desc: 'सतपुड़ा अंचल की लोकभाषा और निमाड़ी-पवारी संतों में अग्रगण्य।' },
    { id: 'p-3', name: 'दीवान पँवार सरदार', period: '18वीं शताब्दी', role: 'सैन्य कमांडर एवं भू-प्रबंधक', desc: 'सतपुड़ा के किलों और पँवारी जागीरदारी के संरक्षक।' },
  ];

  const placesList = [
    { id: 'pl-1', name: 'मुलताई (मूलाप्त ताप्ती उद्गम)', district: 'बैतूल, मध्य प्रदेश', type: 'तीर्थ एवं ऐतिहासिक स्थल', desc: 'माँ ताप्ती का उद्गम स्थल जहाँ प्राचीन पँवारी संस्कृति एवं परमार कालीन अवशेष विद्यमान हैं।' },
    { id: 'pl-2', name: 'ताप्ती घाटी दुर्ग', district: 'बैतूल / छिंदवाड़ा सीमा', type: 'ऐतिहासिक किला', desc: 'पँवार शासकों द्वारा निर्मित प्राचीन सुरक्षा गढ़।' },
    { id: 'pl-3', name: 'सतपुड़ा पँवारी ग्राम समूह', district: 'छिंदवाड़ा, बैतूल, पांढुर्णा', type: 'भाषाई सांस्कृतिक क्षेत्र', desc: 'पँवारी (भoyari) भाषी बहुल पारंपरिक ग्राम।' },
  ];

  const timelineEvents = [
    { year: '1150 ई.', title: 'परमार राजवंश का सतपुड़ा विस्तार', desc: 'धार के परमार राजाओं द्वारा मुलताई और ताप्ती घाटी क्षेत्र में प्रशासनिक सुदृढ़ीकरण।' },
    { year: '1550 ई.', title: 'पँवारी भाषाई बोलियों का स्वतंत्र विकास', desc: 'निमाड़ी और मराठी के संगम से सतपुड़ा अंचल में पँवारी/भoyari लोकभाषा का विशिष्ट रूप स्थापित।' },
    { year: '1925 ई.', title: 'प्रथम सतपुड़ा पँवारी सांस्कृतिक सम्मेलन', desc: 'मुलताई में पँवार समाज एवं लोकसाहित्य का पहला लिखित प्रलेखन।' },
    { year: '2026 ई.', title: 'माँ ताप्ती शोध संस्थान की स्थापना', desc: 'पवारी भाषा, साहित्य और इतिहास के संरक्षण हेतु डिजिटल आर्काइव का शुभारंभ।' },
  ];

  const filteredDocs = documents.filter(d => {
    const matchCat = selectedCategory === 'all' || d.category === selectedCategory;
    const matchSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        d.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 rounded-2xl border border-amber-500/35 flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Landmark className="w-4 h-4" />
            <span>इतिहास एवं सांस्कृतिक धरोहर अभिलेखागार (History & Cultural Archive)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
            सतपुड़ा, परमार राजवंश एवं पँवारी धरोहर
          </h1>
        </div>

        {user.role === 'super_admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl flex items-center gap-2 shadow-lg transition text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>नया ऐतिहासिक अभिलेख जोड़ें</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-amber-200 dark:border-stone-800 gap-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'records', label: 'ऐतिहासिक अभिलेख एवं पांडुलिपियाँ', icon: FileText },
          { id: 'timeline', label: 'ऐतिहासिक कालक्रम (Timeline)', icon: Calendar },
          { id: 'places', label: 'ऐतिहासिक स्थल (Places)', icon: MapPin },
          { id: 'persons', label: 'ऐतिहासिक व्यक्तित्व (Persons)', icon: Users },
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

      {/* TAB 1: RECORDS */}
      {activeTab === 'records' && (
        <div className="space-y-6">
          <div className="bg-amber-50/70 dark:bg-stone-900 p-5 rounded-2xl border border-amber-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              {['all', 'Royal Decrees', 'Land Records', 'Genealogy Scroll', 'Old Manuscript', 'Map'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-xl font-bold uppercase transition ${
                    selectedCategory === cat
                      ? 'bg-amber-600 text-stone-950 shadow'
                      : 'bg-white dark:bg-stone-950 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
                  }`}
                >
                  {cat === 'all' ? 'सभी अभिलेख' : cat}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="अभिलेख खोजें..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-xs text-stone-200 w-64 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map(doc => (
              <div key={doc.id} className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="relative h-48 bg-stone-950">
                  <img src={doc.imageUrl} alt={doc.title} className="w-full h-full object-cover opacity-90" referrerPolicy="no-referrer" />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-amber-600 text-stone-950 text-[10px] font-bold rounded-full uppercase shadow">
                    {doc.category}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <div className="text-xs font-mono text-amber-700 dark:text-amber-400 font-bold">{doc.period} • {doc.source}</div>
                  <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base">{doc.title}</h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300 font-serif line-clamp-3">{doc.description}</p>
                </div>
                <div className="p-4 bg-stone-50 dark:bg-stone-950 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-stone-400">मूल प्रति अभिलेखागार संरक्षित</span>
                  <a
                    href={doc.documentPdfUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-amber-600 text-stone-950 font-bold rounded-lg hover:bg-amber-500 transition flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>देखें</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-8 space-y-6 shadow-sm">
          <h3 className="font-serif font-bold text-stone-900 dark:text-amber-100 text-base">
            सतपुड़ा एवं पँवारी इतिहास का कालक्रम (Chronological Timeline)
          </h3>
          <div className="relative border-l-2 border-amber-600/50 pl-6 space-y-8 ml-4">
            {timelineEvents.map((item, idx) => (
              <div key={idx} className="relative space-y-1.5">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-amber-600 border-4 border-white dark:border-stone-900" />
                <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded font-mono text-xs font-bold">
                  {item.year}
                </span>
                <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base">{item.title}</h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 font-serif leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PLACES */}
      {activeTab === 'places' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {placesList.map(place => (
            <div key={place.id} className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3 shadow-sm">
              <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded text-[10px] font-bold">
                {place.type}
              </span>
              <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-lg">{place.name}</h3>
              <p className="text-xs font-mono text-amber-700 dark:text-amber-400">{place.district}</p>
              <p className="text-xs text-stone-600 dark:text-stone-300 font-serif leading-relaxed">{place.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: PERSONS */}
      {activeTab === 'persons' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {personsList.map(person => (
            <div key={person.id} className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3 shadow-sm">
              <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded text-[10px] font-bold font-mono">
                {person.period}
              </span>
              <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-lg">{person.name}</h3>
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400">{person.role}</p>
              <p className="text-xs text-stone-600 dark:text-stone-300 font-serif leading-relaxed">{person.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg p-6 space-y-6 text-stone-100 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-amber-200">नया ऐतिहासिक अभिलेख जोड़ें</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-stone-800 rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddDoc} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-300">अभिलेख शीर्षक (Title):</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="जैसे: परमार कालीन ताम्रपत्र अभिलेख..."
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-300">श्रेणी (Category):</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  >
                    <option value="Old Manuscript">Old Manuscript (पुरानी पांडुलिपि)</option>
                    <option value="Royal Decrees">Royal Decrees (शाही फरमान)</option>
                    <option value="Land Records">Land Records (भू-अभिलेख)</option>
                    <option value="Genealogy Scroll">Genealogy Scroll (वंशवली स्क्रॉल)</option>
                    <option value="Map">Map (ऐतिहासिक मानचित्र)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-300">काल / वर्ष (Period/Year):</label>
                  <input
                    type="text"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    placeholder="जैसे: 1750 ई."
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">दस्तावेज़ PDF फ़ाइल URL:</label>
                <input
                  type="text"
                  value={sourceUrl}
                  onChange={e => setSourceUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">विवरण (Description):</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="अभिलेख का ऐतिहासिक महत्व एवं विवरण..."
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
                  सहेजें (Save Record)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
