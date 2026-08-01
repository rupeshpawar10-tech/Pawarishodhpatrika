import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderTree, ChevronRight, ChevronDown, ExternalLink, Search, 
  BookOpen, Music, Database, Award, Landmark, FileText, Folder, 
  Users, Sparkles, HelpCircle, Mail, LogIn, Grid, List, Compass
} from 'lucide-react';

interface TreeNode {
  name: string;
  path: string;
  badge?: string;
  icon?: any;
  children?: TreeNode[];
}

const SITE_TREE: TreeNode[] = [
  { name: 'Home (मुख्य पृष्ठ)', path: '/', icon: Compass },
  { name: 'About (संस्थान का परिचय)', path: '/sansthan', icon: Users },
  {
    name: 'Journal (पवारी शोध पत्रिका - ISSN 2583-987X)',
    path: '/journal',
    icon: Award,
    children: [
      { name: 'About Journal (पत्रिका परिचय)', path: '/journal' },
      { name: 'Aims & Scope (उद्देश्य एवं कार्यक्षेत्र)', path: '/journal' },
      { name: 'Editorial Board (संपादकीय मंडल)', path: '/editorial-board' },
      { name: 'Editorial Policy (संपादकीय नीति)', path: '/journal' },
      { name: 'Publication Ethics (प्रकाशन नैतिकता)', path: '/journal' },
      { name: 'Author Guidelines (लेखक निर्देश)', path: '/submit-paper' },
      { name: 'Peer Review Process (समीक्षा प्रक्रिया)', path: '/reviewer-portal' },
      {
        name: 'Volumes (वॉल्यूम आर्काइव)',
        path: '/journal',
        children: [
          {
            name: 'Volume Archive (वॉल्यूम संग्रह)',
            path: '/journal',
            children: [
              {
                name: 'Issues (अंक संग्रह)',
                path: '/journal',
                children: [
                  { name: 'Table of Contents (विषय सूची)', path: '/journal' },
                  { name: 'Article Page (शोध पत्र पृष्ठ)', path: '/journal' },
                  { name: 'PDF Full Paper (पीडीएफ व्यूअर)', path: '/journal' }
                ]
              }
            ]
          }
        ]
      },
      { name: 'Archives (अभिलेखागार)', path: '/journal' },
      { name: 'Search (शोध पत्र खोज)', path: '/journal' },
      { name: 'Contact Editorial Office (संपादक कार्यालय संपर्क)', path: '/sansthan' }
    ]
  },
  {
    name: 'Dictionary (पवारी भाषाकोश एवं शब्दकोश)',
    path: '/pawari/dictionary',
    icon: BookOpen,
    children: [
      { name: 'Browse (शब्दावली ब्राउज़)', path: '/pawari/dictionary' },
      { name: 'Search (शब्द खोज)', path: '/pawari/dictionary' },
      { name: 'Categories (विषय श्रेणियाँ)', path: '/pawari/dictionary' },
      { name: 'Word Details (ध्वन्यात्मक उच्चारण एवं अर्थ)', path: '/pawari/dictionary' },
      { name: 'Random Word (यादृच्छिक शब्द)', path: '/pawari/dictionary' }
    ]
  },
  {
    name: 'Corpus (शोध कॉर्पस एवं भाषा विश्लेषक)',
    path: '/modules/corpus',
    icon: Database,
    children: [
      { name: 'Browse (कॉर्पस संग्रह)', path: '/modules/corpus' },
      { name: 'Search (कॉर्पस खोज)', path: '/modules/corpus' },
      { name: 'Record (पाण्डुलिपि रिकॉर्ड)', path: '/modules/corpus' },
      { name: 'KWIC (Key Word In Context)', path: '/modules/corpus' },
      { name: 'Statistics (भाषा सांख्यिकी)', path: '/modules/corpus' }
    ]
  },
  {
    name: 'Lokgeet (लोकगीत अभिलेखागार)',
    path: '/pawari/lokgeet',
    icon: Music,
    children: [
      { name: 'Browse (लोकगीत सूची)', path: '/pawari/lokgeet' },
      { name: 'Categories (गीत श्रेणियाँ - हेला, फाग, गरबा)', path: '/pawari/lokgeet' },
      { name: 'Audio (ध्वनि रिकॉर्डिंग स्ट्रीम)', path: '/pawari/lokgeet' },
      { name: 'Lyrics (मूल पवारी बोल एवं अर्थ)', path: '/pawari/lokgeet' },
      { name: 'Performers (लोक गायक एवं वादक)', path: '/pawari/lokgeet' },
      { name: 'Song Details (गीत विवरण व संदर्भ)', path: '/pawari/lokgeet' }
    ]
  },
  {
    name: 'History (इतिहास, वंशज एवं संस्कृति)',
    path: '/modules/history',
    icon: Landmark,
    children: [
      { name: 'Timeline (ऐतिहासिक कालक्रम)', path: '/modules/history' },
      { name: 'Historical Records (प्राचीन अभिलेख)', path: '/modules/history' },
      { name: 'Migration (धारा नगरी से प्रवास इतिहास)', path: '/modules/history' },
      { name: 'Gotra (वंशज एवं गोत्र वंशावली)', path: '/pawari/gotra' },
      { name: 'Genealogy (वंशावली वृक्ष)', path: '/pawari/gotra' },
      { name: 'Villages (सतपुड़ा अंचल पवारी ग्राम)', path: '/modules/history' },
      { name: 'Historical Maps (ऐतिहासिक मानचित्र)', path: '/modules/history' }
    ]
  },
  {
    name: 'Quiz & Certification (ज्ञान परीक्षा एवं प्रमाण-पत्र)',
    path: '/quiz',
    icon: Sparkles,
    children: [
      { name: 'Pahli Quiz (पहेली क्विज़)', path: '/quiz' },
      { name: 'Dictionary Quiz (शब्दकोश क्विज़)', path: '/quiz' },
      { name: 'Gotra Quiz (गोत्र एवं इतिहास क्विज़)', path: '/quiz' },
      { name: 'History Quiz (इतिहास परीक्षा)', path: '/quiz' },
      { name: 'Grammar Quiz (व्याकरण क्विज़)', path: '/quiz' },
      { name: 'Mixed Quiz (मिश्रित प्रतियोगिता)', path: '/quiz' },
      { name: 'Leaderboard (शीर्ष विजेता सूची)', path: '/quiz' },
      { name: 'Verify Certificate (प्रमाण-पत्र सत्यापन)', path: '/quiz' },
      { name: 'Hall of Fame (हॉल ऑफ़ फेम)', path: '/quiz' }
    ]
  },
  { name: 'Books (डिजिटल ग्रंथालय एवं मोनोग्राफ)', path: '/modules/books', icon: BookOpen },
  { name: 'Research Papers (शोध पत्र संग्रह)', path: '/journal', icon: FileText },
  { name: 'Knowledge Graph (ज्ञान आरेख एवं संबंध इंजन)', path: '/knowledge-graph', icon: Sparkles },
  { name: 'Media Library (डिजिटल मीडिया संग्रह)', path: '/media-library', icon: Folder },
  { name: 'Downloads (संसाधन एवं पीडीएफ डाउनलोड)', path: '/journal', icon: ExternalLink },
  { name: 'Gallery (चित्र-वीथिका)', path: '/gallery', icon: Folder },
  { name: 'News (ताज़ा समाचार व विज्ञप्ति)', path: '/events', icon: FileText },
  { name: 'Events (शोध संगोष्ठी एवं कार्यक्रम)', path: '/events', icon: Sparkles },
  { name: 'FAQ (सामान्य प्रश्नोत्तरी)', path: '/sansthan', icon: HelpCircle },
  { name: 'Contact (संपर्क कार्यालय)', path: '/sansthan', icon: Mail },
  { name: 'Login (प्रयोक्ता प्रवेश)', path: '/admin', icon: LogIn }
];

export const SiteDirectoryPage: React.FC = () => {
  const [filterText, setFilterText] = useState('');
  const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'Journal (पवारी शोध पत्रिका - ISSN 2583-987X)': true,
    'Dictionary (पवारी भाषाकोश एवं शब्दकोश)': true,
    'Corpus (शोध कॉर्पस एवं भाषा विश्लेषक)': true,
    'Lokgeet (लोकगीत अभिलेखागार)': true,
    'History (इतिहास, वंशज एवं संस्कृति)': true,
    'Quiz & Certification (ज्ञान परीक्षा एवं प्रमाण-पत्र)': true
  });

  const toggleExpand = (name: string) => {
    setExpandedNodes(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const renderTree = (nodes: TreeNode[], depth = 0) => {
    return (
      <ul className={`space-y-2 ${depth > 0 ? 'ml-6 pl-4 border-l-2 border-amber-500/30 dark:border-stone-800' : ''}`}>
        {nodes.map((node, idx) => {
          const hasChildren = node.children && node.children.length > 0;
          const isExpanded = expandedNodes[node.name] || filterText.length > 0;
          const matchesFilter = !filterText || node.name.toLowerCase().includes(filterText.toLowerCase());

          if (filterText && !matchesFilter && (!hasChildren || !node.children?.some(c => c.name.toLowerCase().includes(filterText.toLowerCase())))) {
            return null;
          }

          const NodeIcon = node.icon || ChevronRight;

          return (
            <li key={idx} className="space-y-2">
              <div className="flex items-center gap-2 group">
                {hasChildren ? (
                  <button
                    onClick={() => toggleExpand(node.name)}
                    className="p-1 text-amber-500 hover:text-amber-400 bg-stone-900 border border-amber-500/30 rounded-md transition"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                ) : (
                  <span className="w-4 text-stone-600 font-mono text-center">•</span>
                )}

                <Link
                  to={node.path}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs font-serif transition ${
                    depth === 0
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200 font-bold hover:bg-amber-500/20'
                      : 'bg-stone-900/40 border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-500/40 hover:text-amber-300'
                  }`}
                >
                  {depth === 0 && <NodeIcon className="w-4 h-4 text-amber-500" />}
                  <span>{node.name}</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 text-amber-400 transition" />
                </Link>
              </div>

              {hasChildren && isExpanded && renderTree(node.children!, depth + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="bg-stone-900 text-stone-100 p-8 sm:p-10 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <FolderTree className="w-4 h-4" />
            <span>माँ ताप्ती शोध संस्थान • पोर्टल निर्देशिका</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100">
            पोर्टल साइट मैप एवं सम्पूर्ण संरचना (Sitemap Directory)
          </h1>
          <p className="text-sm text-stone-300 font-serif leading-relaxed">
            पवारी शोध पत्रिका, भाषाकोश, शोध कॉर्पस, लोकगीत, इतिहास, गोत्र वंशावली एवं क्विज़ पोर्टल के सभी अनुभागों की सीधी निर्देशिका।
          </p>
        </div>

        <div className="flex items-center gap-2 bg-stone-950 p-1.5 rounded-2xl border border-amber-500/30">
          <button
            onClick={() => setViewMode('tree')}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              viewMode === 'tree' ? 'bg-amber-600 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>वृक्ष आरेख (Tree View)</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              viewMode === 'grid' ? 'bg-amber-600 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>ग्रिड कार्ड्स (Grid View)</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-amber-50/80 dark:bg-stone-900 p-4 rounded-2xl border border-amber-200 dark:border-stone-800 flex items-center gap-3">
        <Search className="w-5 h-5 text-amber-600" />
        <input
          type="text"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          placeholder="साइट मैप में कोई भी अनुभाग या मॉड्यूल खोजें (Search sitemap directory)..."
          className="w-full bg-transparent text-stone-800 dark:text-stone-100 font-serif text-sm outline-none placeholder:text-stone-500"
        />
      </div>

      {/* Tree View Render */}
      {viewMode === 'tree' ? (
        <div className="bg-stone-950/90 rounded-3xl border border-amber-500/30 p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4 text-xs font-mono text-stone-400">
            <span>/ ROOT (माँ ताप्ती शोध संस्थान सम्पूर्ण डिजिटल संरचना)</span>
            <span>कुल मुख्य अनुभाग: {SITE_TREE.length}</span>
          </div>

          <div className="font-serif">
            {renderTree(SITE_TREE)}
          </div>
        </div>
      ) : (
        /* Grid View Render */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SITE_TREE.map((section, idx) => {
            const SectionIcon = section.icon || FolderTree;
            return (
              <div key={idx} className="bg-stone-900 p-6 rounded-3xl border border-amber-500/20 hover:border-amber-500/50 space-y-4 shadow-xl transition flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 pb-3 border-b border-stone-800">
                    <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/30">
                      <SectionIcon className="w-5 h-5" />
                    </div>
                    <Link to={section.path} className="font-serif font-bold text-amber-100 text-lg hover:text-amber-400 transition">
                      {section.name}
                    </Link>
                  </div>

                  {section.children && (
                    <ul className="space-y-1.5 text-xs text-stone-300">
                      {section.children.map((child, cIdx) => (
                        <li key={cIdx} className="flex items-center gap-2">
                          <span className="text-amber-500">•</span>
                          <Link to={child.path} className="hover:text-amber-300 transition">
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-800 text-right">
                  <Link
                    to={section.path}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300"
                  >
                    <span>अनुभाग खोलें</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
