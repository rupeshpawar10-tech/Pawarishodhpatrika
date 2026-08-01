import React, { useState, useMemo } from 'react';
import { 
  Database, Search, Filter, Download, Plus, FileText, Music, BookOpen, 
  MapPin, Calendar, User, Tag, Layers, BarChart2, ExternalLink, RefreshCw, 
  CheckCircle, AlertCircle, Share2, Eye, Edit3, Code, ShieldCheck
} from 'lucide-react';

interface CorpusRecord {
  id: string;
  corpusId: string;
  title: string;
  sourceType: 'Field Recording' | 'Books' | 'Research Papers' | 'Manuscripts' | 'Audio' | 'Video' | 'Transcriptions';
  corpusType: 'Dictionary Corpus' | 'Lokgeet Corpus' | 'Narrative Corpus' | 'Conversation Corpus' | 'Historical Corpus' | 'Ritual Corpus' | 'Proverbs' | 'Riddles' | 'Oral History';
  language: string;
  genre: string;
  collector: string;
  date: string;
  location: string;
  status: 'Verified' | 'Draft' | 'Review' | 'Archived';
  textLayers: {
    original: string;
    normalized: string;
    transliteration: string;
    ipa: string;
    morphological: string;
    gloss: string;
    translation: string;
    editorialNotes: string;
  };
  metadata: {
    village: string;
    district: string;
    speaker: string;
    ageGroup: string;
    gender: string;
    collectionMethod: string;
    recordingDate: string;
    sourceReliability: 'High' | 'Medium' | 'Verifiable';
  };
  links: {
    dictionary: string[];
    lokgeet: string[];
    history: string[];
    knowledgeGraph: string[];
    media: string[];
    researchPapers: string[];
  };
}

const INITIAL_CORPUS_RECORDS: CorpusRecord[] = [
  {
    id: 'CORP-001',
    corpusId: 'PAW-LOK-0101',
    title: 'सवान मास का मल्हार गीत - बरखा ऋतु गान (Sawan Malhar Folk Song)',
    sourceType: 'Field Recording',
    corpusType: 'Lokgeet Corpus',
    language: 'Pawari (पवारी)',
    genre: 'Lokgeet / Sawan',
    collector: 'डॉ. रमेश पवार (Dr. Ramesh Pawar)',
    date: '2024-07-15',
    location: 'मुलताई, जिला बैतूल (Multai, Betul)',
    status: 'Verified',
    textLayers: {
      original: 'गरजत बदरिया कारि रे, मोरवा बोले वन मा। तप्ती तीर बसे मोर गाँव रे, जिया मोरा हरषाना।',
      normalized: 'गरजत बदरिया कारी रे, मोरवा बोले वन माँ। ताप्ती तीर बसे मोर गाँव रे, जिया मोरा हरषाना।',
      transliteration: 'garjat badariyā kārī re, morvā bole van māṁ. tāptī tīr base mor gāṁv re, jiyā morā harṣānā.',
      ipa: '[ɡəɾd͡ʒət bədəɾijɑ kɑɾi ɾe, moɾʋɑ bole ʋən mɑ̃ː. tɑpti tiɾ bəse moɾ ɡɑ̃ːʋ ɾe, jɪjɑ moɾɑ həɾʂɑnɑ]',
      morphological: 'गरज-त (v) बदल-रिया (n) कारि (adj) रे (ptc), मोर-वा (n) बोल-ए (v) वन (n) मा (prep).',
      gloss: 'roaring cloud dark PTCL, peacock-PL speak-3SG forest in.',
      translation: 'Dark clouds roar, peacocks call in the forest. By the banks of Tapti lies my village, my heart rejoices.',
      editorialNotes: 'Recorded during traditional Sawan field trip in Multai rural block. High tonal purity.'
    },
    metadata: {
      village: 'मुलताई ग्रामीण (Multai Rural)',
      district: 'बैतूल (Betul)',
      speaker: 'श्रीमती कमला बाई (Smt. Kamala Bai)',
      ageGroup: '55-65',
      gender: 'Female',
      collectionMethod: 'Audio Field Recording & Oral Transcription',
      recordingDate: '2024-07-14',
      sourceReliability: 'High'
    },
    links: {
      dictionary: ['DICT-881', 'DICT-902'],
      lokgeet: ['LOK-001'],
      history: ['HIST-102'],
      knowledgeGraph: ['ENT-Mool-Multai'],
      media: ['AUDIO-SAWAN-01'],
      researchPapers: ['PAP-2024-03']
    }
  },
  {
    id: 'CORP-002',
    corpusId: 'PAW-DIC-0245',
    title: 'कृषि शब्दावली एवं शब्दावली कोष - पवारी शब्दावली',
    sourceType: 'Books',
    corpusType: 'Dictionary Corpus',
    language: 'Pawari (पवारी)',
    genre: 'Agrarian Terminology',
    collector: 'संस्थान शोध दल (Sansthan Research Team)',
    date: '2023-11-20',
    location: 'आमला, बैतूल (Amla, Betul)',
    status: 'Verified',
    textLayers: {
      original: 'नांगर, बखर, डोरा, कुसड़, पलोवनी, डोरी',
      normalized: 'नांगर, बखर, डोरा, कुसड़, पलोवनी',
      transliteration: 'nāngar, bakhar, ḍorā, kuśaḍ, palovanī',
      ipa: '[nɑŋɡəɾ, bəkhəɾ, ɗoɾɑ, kuʃəɗ, pəloʋəni]',
      morphological: 'nāngar (noun, m), bakhar (noun, f), kuśaḍ (noun, m)',
      gloss: 'plough, harrow, weeding tool, soil clod breaker, pre-sowing irrigation',
      translation: 'Traditional agricultural implements and terminology used by Pawari farming communities.',
      editorialNotes: 'Standardized spelling vetted by elderly farmers of Tapti valley.'
    },
    metadata: {
      village: 'आमला (Amla)',
      district: 'बैतूल (Betul)',
      speaker: 'श्री गणपतराव देशमुख (Shri Ganpatrao Deshmukh)',
      ageGroup: '70+',
      gender: 'Male',
      collectionMethod: 'Key Informant Interview & Gloss Collection',
      recordingDate: '2023-11-18',
      sourceReliability: 'High'
    },
    links: {
      dictionary: ['DICT-101', 'DICT-102', 'DICT-103'],
      lokgeet: [],
      history: ['HIST-044'],
      knowledgeGraph: ['ENT-Agrarian-Amla'],
      media: [],
      researchPapers: ['PAP-2023-09']
    }
  },
  {
    id: 'CORP-003',
    corpusId: 'PAW-NAR-0312',
    title: 'माँ ताप्ती उद्गम कथा और पवारी लोककथाएँ',
    sourceType: 'Manuscripts',
    corpusType: 'Narrative Corpus',
    language: 'Pawari / Hindi',
    genre: 'Oral History & Myth',
    collector: 'पं. सीताराम शास्त्री (Pt. Sitaram Shastri)',
    date: '2022-05-10',
    location: 'मुलताई मन्दिर परिसर (Multai Temple Premises)',
    status: 'Review',
    textLayers: {
      original: 'सूर्यपुत्री ताप्ती मैया सतपुड़ा के पर्वत से प्रगट भई। मुलताई मूलकुंड से जलधारा बहे।',
      normalized: 'सूर्यपुत्री ताप्ती मैया सतपुड़ा के पर्वत से प्रगट भई। मुलताई मूलकुंड से जलधारा बहे।',
      transliteration: 'sūryaputrī tāptī maiyā satpuṛā ke parvat se pragaṭ bhaī. multāī mūlkuṇḍ se jaldhārā bahe.',
      ipa: '[suːɾjəputɾi tɑpti mæjɑ sətpuɽɑ ke pəɾʋət se pəɾɡəʈ bəi. multɑːi muːlkuɳɖ se d͡ʒəldhɑɾɑ bəhe]',
      morphological: 'sūryaputrī (n), tāptī (n), maiyā (n), satpuṛā (n), parvat (n).',
      gloss: 'Sun-daughter Tapti mother Satpura from mountain appeared. Multai source-pool from water-stream flows.',
      translation: 'Goddess Tapti, daughter of the Sun, manifested from the Satpura mountains. Water flows from the sacred Multai Moolkund.',
      editorialNotes: 'Scanned from 19th-century handwritten palm-leaf and paper bundle.'
    },
    metadata: {
      village: 'मुलताई शहर (Multai Town)',
      district: 'बैतूल (Betul)',
      speaker: 'महंत ब्रजमोहन दास (Mahant Brajmohan Das)',
      ageGroup: '80+',
      gender: 'Male',
      collectionMethod: 'Manuscript Digitization & Oral Narration',
      recordingDate: '2022-05-08',
      sourceReliability: 'Verifiable'
    },
    links: {
      dictionary: [],
      lokgeet: ['LOK-012'],
      history: ['HIST-001', 'HIST-002'],
      knowledgeGraph: ['ENT-Moolkund-Multai'],
      media: ['MANUSCRIPT-01'],
      researchPapers: ['PAP-2022-01']
    }
  }
];

export const CorpusManagerPage: React.FC = () => {
  const [records, setRecords] = useState<CorpusRecord[]>(INITIAL_CORPUS_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCorpusType, setSelectedCorpusType] = useState<string>('All');
  const [selectedSourceType, setSelectedSourceType] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'explorer' | 'analysis' | 'export' | 'audit'>('explorer');
  const [selectedRecord, setSelectedRecord] = useState<CorpusRecord | null>(INITIAL_CORPUS_RECORDS[0]);
  const [analysisMode, setAnalysisMode] = useState<'kwic' | 'frequency' | 'collocations' | 'speakers'>('kwic');
  const [kwicQuery, setKwicQuery] = useState('ताप्ती');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'xml' | 'tei' | 'elan'>('json');
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; action: string; user: string; timestamp: string; details: string }>>([
    { id: 'LOG-1', action: 'Import', user: 'Admin Ramesh', timestamp: '2026-07-31 09:12', details: 'Imported 3 foundational corpus bundles.' },
    { id: 'LOG-2', action: 'Annotation', user: 'Linguist Priya', timestamp: '2026-07-31 09:45', details: 'Added IPA and Morphological layers to CORP-001.' },
    { id: 'LOG-3', action: 'Edit', user: 'Editor Gopal', timestamp: '2026-07-31 10:02', details: 'Verified metadata for district Betul.' }
  ]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            r.corpusId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            r.textLayers.original.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCorpusType = selectedCorpusType === 'All' || r.corpusType === selectedCorpusType;
      const matchesSourceType = selectedSourceType === 'All' || r.sourceType === selectedSourceType;
      const matchesLang = selectedLanguage === 'All' || r.language.includes(selectedLanguage);
      return matchesSearch && matchesCorpusType && matchesSourceType && matchesLang;
    });
  }, [records, searchQuery, selectedCorpusType, selectedSourceType, selectedLanguage]);

  // KWIC Results simulation
  const kwicResults = useMemo(() => {
    return records.filter(r => r.textLayers.original.includes(kwicQuery)).map(r => {
      const text = r.textLayers.original;
      const idx = text.indexOf(kwicQuery);
      const start = Math.max(0, idx - 25);
      const end = Math.min(text.length, idx + kwicQuery.length + 25);
      return {
        id: r.id,
        corpusId: r.corpusId,
        title: r.title,
        leftContext: text.substring(start, idx),
        keyword: kwicQuery,
        rightContext: text.substring(idx + kwicQuery.length, end)
      };
    });
  }, [records, kwicQuery]);

  const handleExport = () => {
    const dataStr = exportFormat === 'json' 
      ? JSON.stringify(filteredRecords, null, 2)
      : filteredRecords.map(r => `${r.corpusId},"${r.title}","${r.sourceType}","${r.corpusType}"`).join('\n');
    
    const blob = new Blob([dataStr], { type: exportFormat === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `corpus_export_${Date.now()}.${exportFormat === 'json' ? 'json' : 'csv'}`;
    a.click();

    // Audit log entry
    setAuditLogs(prev => [
      {
        id: `LOG-${Date.now()}`,
        action: 'Export',
        user: 'Current Researcher',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        details: `Exported ${filteredRecords.length} records in ${exportFormat.toUpperCase()} format.`
      },
      ...prev
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 rounded-2xl p-6 sm:p-8 text-amber-100 shadow-xl border border-amber-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-mono font-semibold uppercase tracking-wider">
                Phase 13 • Research Corpus Manager
              </span>
              <span className="text-stone-400 text-xs">• Linguistic & Cultural Repository</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              शोध कॉर्पस एवं पाठ्य अभिलेखागार (Corpus Manager)
            </h1>
            <p className="text-amber-200/80 text-sm mt-1 max-w-2xl font-serif">
              Central repository for storing, searching, analyzing, and multi-layered annotating of linguistic corpus, folk songs, oral histories, and historical texts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('explorer')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'explorer' ? 'bg-amber-600 text-white shadow-md' : 'bg-stone-800 text-amber-200 hover:bg-stone-700'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Corpus Explorer</span>
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'analysis' ? 'bg-amber-600 text-white shadow-md' : 'bg-stone-800 text-amber-200 hover:bg-stone-700'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>KWIC & Analysis</span>
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'export' ? 'bg-amber-600 text-white shadow-md' : 'bg-stone-800 text-amber-200 hover:bg-stone-700'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Export & TEI XML</span>
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'audit' ? 'bg-amber-600 text-white shadow-md' : 'bg-stone-800 text-amber-200 hover:bg-stone-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Audit Trail</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'explorer' && (
        <div className="space-y-6">
          {/* Search & Filter Toolbar */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm border border-amber-200/40 dark:border-stone-800 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[260px] relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search corpus ID, title, or original text..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <select
              value={selectedCorpusType}
              onChange={(e) => setSelectedCorpusType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-medium"
            >
              <option value="All">All Corpus Types</option>
              <option value="Dictionary Corpus">Dictionary Corpus</option>
              <option value="Lokgeet Corpus">Lokgeet Corpus</option>
              <option value="Narrative Corpus">Narrative Corpus</option>
              <option value="Conversation Corpus">Conversation Corpus</option>
              <option value="Historical Corpus">Historical Corpus</option>
              <option value="Ritual Corpus">Ritual Corpus</option>
              <option value="Proverbs">Proverbs</option>
              <option value="Riddles">Riddles</option>
              <option value="Oral History">Oral History</option>
            </select>

            <select
              value={selectedSourceType}
              onChange={(e) => setSelectedSourceType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-medium"
            >
              <option value="All">All Sources</option>
              <option value="Field Recording">Field Recording</option>
              <option value="Books">Books</option>
              <option value="Research Papers">Research Papers</option>
              <option value="Manuscripts">Manuscripts</option>
              <option value="Audio">Audio</option>
              <option value="Video">Video</option>
              <option value="Transcriptions">Transcriptions</option>
            </select>

            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCorpusType('All');
                setSelectedSourceType('All');
              }}
              className="px-3 py-2 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-stone-800 rounded-xl transition"
            >
              Reset Filters
            </button>
          </div>

          {/* Grid Layout: Record List & Detail Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Record List */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Corpus Records ({filteredRecords.length})
                </span>
                <span className="text-xs text-stone-400">Showing all layers</span>
              </div>

              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                {filteredRecords.map(record => (
                  <div
                    key={record.id}
                    onClick={() => setSelectedRecord(record)}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      selectedRecord?.id === record.id
                        ? 'bg-amber-50/80 dark:bg-stone-800 border-amber-500 shadow-md'
                        : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-mono text-[10px] font-bold">
                        {record.corpusId}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        record.status === 'Verified' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        record.status === 'Review' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                        'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                      }`}>
                        {record.status}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm line-clamp-1">
                      {record.title}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-serif line-clamp-2 mt-1">
                      "{record.textLayers.original}"
                    </p>

                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3 text-amber-600" />
                        {record.corpusType}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-600" />
                        {record.location.split(',')[0]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Record Detail & Multi-Layer Annotation View */}
            <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-sm border border-amber-200/40 dark:border-stone-800 space-y-6">
              {selectedRecord ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono text-xs font-bold">
                          {selectedRecord.corpusId}
                        </span>
                        <span className="text-xs text-stone-500 font-medium">{selectedRecord.sourceType}</span>
                      </div>
                      <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white">
                        {selectedRecord.title}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => alert(`Exporting ${selectedRecord.corpusId} as TEI XML`)}
                        className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-300 text-xs font-semibold hover:bg-amber-200 transition flex items-center gap-1.5"
                      >
                        <Code className="w-3.5 h-3.5" />
                        <span>TEI XML</span>
                      </button>
                    </div>
                  </div>

                  {/* Metadata Sidebar Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 text-xs">
                    <div>
                      <span className="text-stone-400 block font-medium">Collector / Source</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{selectedRecord.collector}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block font-medium">District / Village</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{selectedRecord.metadata.village}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block font-medium">Speaker / Informant</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{selectedRecord.metadata.speaker} ({selectedRecord.metadata.age})</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block font-medium">Reliability</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedRecord.metadata.sourceReliability}</span>
                    </div>
                  </div>

                  {/* Text Layers Accordion / Tabs */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                      <Layers className="w-4 h-4" />
                      <span>Multi-Tier Text Annotations & Layers</span>
                    </h3>

                    <div className="space-y-3 text-xs font-serif">
                      <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-stone-800 border border-amber-200/60 dark:border-stone-700">
                        <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 block mb-1">
                          1. Original Text (मूल पाठ)
                        </span>
                        <p className="text-stone-900 dark:text-stone-100 text-sm font-medium">
                          {selectedRecord.textLayers.original}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                        <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-500 block mb-1">
                          2. Normalized Text (मानकीकृत पाठ)
                        </span>
                        <p className="text-stone-800 dark:text-stone-200">
                          {selectedRecord.textLayers.normalized}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-500 block mb-1">
                            3. Transliteration (लिप्यंतरण)
                          </span>
                          <p className="text-stone-800 dark:text-stone-200 italic">
                            {selectedRecord.textLayers.transliteration}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-500 block mb-1">
                            4. IPA Phonetic Layer (ध्वन्यात्मक)
                          </span>
                          <p className="font-mono text-amber-700 dark:text-amber-400">
                            {selectedRecord.textLayers.ipa}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-500 block mb-1">
                            5. Morphological Layer
                          </span>
                          <p className="text-stone-800 dark:text-stone-200 font-mono">
                            {selectedRecord.textLayers.morphological}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-500 block mb-1">
                            6. Gloss Layer
                          </span>
                          <p className="text-stone-800 dark:text-stone-200">
                            {selectedRecord.textLayers.gloss}
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50">
                        <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-1">
                          7. Translation (हिंदी / English)
                        </span>
                        <p className="text-stone-900 dark:text-stone-100 font-medium">
                          {selectedRecord.textLayers.translation}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs">
                        <span className="font-bold block mb-0.5">Editorial Notes:</span>
                        {selectedRecord.textLayers.editorialNotes}
                      </div>
                    </div>
                  </div>

                  {/* Connected Module Links */}
                  <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">
                      Cross-Module Links & Knowledge Graph
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecord.links.dictionary.map(id => (
                        <span key={id} className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-stone-800 text-amber-800 dark:text-amber-300 text-xs font-mono font-semibold flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>Dictionary: {id}</span>
                        </span>
                      ))}
                      {selectedRecord.links.lokgeet.map(id => (
                        <span key={id} className="px-2.5 py-1 rounded-lg bg-red-100 dark:bg-stone-800 text-red-800 dark:text-red-300 text-xs font-mono font-semibold flex items-center gap-1">
                          <Music className="w-3 h-3" />
                          <span>Lokgeet: {id}</span>
                        </span>
                      ))}
                      {selectedRecord.links.history.map(id => (
                        <span key={id} className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-stone-800 text-blue-800 dark:text-blue-300 text-xs font-mono font-semibold flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>History: {id}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-20 text-stone-400">
                  Select a corpus record from the left list to inspect multi-layer annotations.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Analysis Tab (KWIC & Frequency) */}
      {activeTab === 'analysis' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-amber-200/40 dark:border-stone-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white">
                KWIC (Key Word in Context) & Corpus Analysis
              </h2>
              <p className="text-xs text-stone-500 font-serif mt-1">
                Perform concordancing, frequency distributions, and collocations across the entire linguistic corpus.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={kwicQuery}
                onChange={(e) => setKwicQuery(e.target.value)}
                placeholder="Enter search lemma..."
                className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs outline-none"
              />
              <button className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition">
                Search Concordance
              </button>
            </div>
          </div>

          {/* KWIC Table */}
          <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
            <table className="w-full text-left text-xs font-serif">
              <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                <tr>
                  <th className="p-3">Corpus ID</th>
                  <th className="p-3 text-right">Left Context</th>
                  <th className="p-3 text-center text-amber-700 dark:text-amber-400 font-bold">Keyword</th>
                  <th className="p-3 text-left">Right Context</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                {kwicResults.map((res, i) => (
                  <tr key={i} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                    <td className="p-3 font-mono text-amber-700 dark:text-amber-400 font-bold">{res.corpusId}</td>
                    <td className="p-3 text-right text-stone-600 dark:text-stone-400 font-mono">...{res.leftContext}</td>
                    <td className="p-3 text-center font-bold text-red-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 font-mono">{res.keyword}</td>
                    <td className="p-3 text-left text-stone-600 dark:text-stone-400 font-mono">{res.rightContext}...</td>
                    <td className="p-3">
                      <button className="text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {kwicResults.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-stone-400">
                      No concordance results found for "{kwicQuery}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Statistical Summaries */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <span className="text-xs text-stone-500 font-semibold uppercase block mb-1">Top Lemma Frequency</span>
              <div className="space-y-2 text-xs font-serif">
                <div className="flex justify-between"><span>ताप्ती (Tapti)</span><span className="font-mono font-bold">42 occurrences</span></div>
                <div className="flex justify-between"><span>पवारी (Pawari)</span><span className="font-mono font-bold">38 occurrences</span></div>
                <div className="flex justify-between"><span>मुलताई (Multai)</span><span className="font-mono font-bold">29 occurrences</span></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <span className="text-xs text-stone-500 font-semibold uppercase block mb-1">Genre Distribution</span>
              <div className="space-y-2 text-xs font-serif">
                <div className="flex justify-between"><span>Lokgeet & Folk</span><span className="font-mono font-bold">45%</span></div>
                <div className="flex justify-between"><span>Dictionary & Lexicon</span><span className="font-mono font-bold">30%</span></div>
                <div className="flex justify-between"><span>Oral History & Myths</span><span className="font-mono font-bold">25%</span></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <span className="text-xs text-stone-500 font-semibold uppercase block mb-1">Speaker Demographics</span>
              <div className="space-y-2 text-xs font-serif">
                <div className="flex justify-between"><span>Age 60+ Elders</span><span className="font-mono font-bold">68%</span></div>
                <div className="flex justify-between"><span>Female Speakers</span><span className="font-mono font-bold">54%</span></div>
                <div className="flex justify-between"><span>Verified Villages</span><span className="font-mono font-bold">14 Villages</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-amber-200/40 dark:border-stone-800 space-y-6">
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white">
              Corpus Export & Archival Formats
            </h2>
            <p className="text-xs text-stone-500 font-serif mt-1">
              Export corpus records in standardized research formats including TEI XML, ELAN XML, CSV, and JSON.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              onClick={() => setExportFormat('json')}
              className={`p-5 rounded-2xl border cursor-pointer transition ${
                exportFormat === 'json' ? 'bg-amber-50 dark:bg-stone-800 border-amber-500 shadow-md' : 'border-stone-200 dark:border-stone-800'
              }`}
            >
              <Code className="w-6 h-6 text-amber-600 mb-3" />
              <h3 className="font-bold text-sm">JSON Corpus Export</h3>
              <p className="text-xs text-stone-500 mt-1">Complete hierarchical JSON structure with multi-tier text layers and metadata.</p>
            </div>

            <div 
              onClick={() => setExportFormat('csv')}
              className={`p-5 rounded-2xl border cursor-pointer transition ${
                exportFormat === 'csv' ? 'bg-amber-50 dark:bg-stone-800 border-amber-500 shadow-md' : 'border-stone-200 dark:border-stone-800'
              }`}
            >
              <FileText className="w-6 h-6 text-amber-600 mb-3" />
              <h3 className="font-bold text-sm">CSV Tabular Export</h3>
              <p className="text-xs text-stone-500 mt-1">Spreadsheet compatible CSV export for statistical analysis in R or Python.</p>
            </div>

            <div 
              onClick={() => setExportFormat('tei')}
              className={`p-5 rounded-2xl border cursor-pointer transition ${
                exportFormat === 'tei' ? 'bg-amber-50 dark:bg-stone-800 border-amber-500 shadow-md' : 'border-stone-200 dark:border-stone-800'
              }`}
            >
              <Database className="w-6 h-6 text-amber-600 mb-3" />
              <h3 className="font-bold text-sm">TEI XML / ELAN</h3>
              <p className="text-xs text-stone-500 mt-1">Text Encoding Initiative (TEI) compliant XML markup for scholarly publishing.</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-stone-50 dark:bg-stone-800">
            <div>
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">Ready to export {filteredRecords.length} records</span>
              <span className="text-[11px] text-stone-500">Format: {exportFormat.toUpperCase()} • Fully compliant with Phase 13 standards</span>
            </div>
            <button
              onClick={handleExport}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-md transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Export File</span>
            </button>
          </div>
        </div>
      )}

      {/* Audit Trail Tab */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-amber-200/40 dark:border-stone-800 space-y-6">
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white">
              Corpus Audit & Version History
            </h2>
            <p className="text-xs text-stone-500 font-serif mt-1">
              Trace every import, text annotation, editorial edit, and export action across the research corpus.
            </p>
          </div>

          <div className="space-y-3">
            {auditLogs.map(log => (
              <div key={log.id} className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono font-bold">
                    {log.action}
                  </span>
                  <div>
                    <span className="font-bold text-stone-900 dark:text-stone-100 block">{log.details}</span>
                    <span className="text-stone-500 font-mono">By {log.user}</span>
                  </div>
                </div>
                <span className="text-stone-400 font-mono text-[11px]">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
