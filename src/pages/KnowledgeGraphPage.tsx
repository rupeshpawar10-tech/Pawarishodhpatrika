import React, { useState } from 'react';
import { StorageEngine } from '../lib/storage';
import { 
  Network, 
  Search, 
  Share2, 
  BookOpen, 
  FileText, 
  Music, 
  Landmark, 
  MapPin, 
  Users, 
  Calendar, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Filter,
  CheckCircle,
  Database,
  Sparkles
} from 'lucide-react';

export const KnowledgeGraphPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'graph' | 'relationships' | 'network' | 'timeline' | 'recommendations'>('graph');
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [relationshipFilter, setRelationshipFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Unified Knowledge Entities across modules
  const allEntities = [
    { id: 'p-1', type: 'ResearchPaper', title: 'पवारी भाषा की रूपरेखा और सतपुड़ा अंचल', category: 'Linguistics', status: 'published', date: '2026-06-15', author: 'डॉ. रूपेश पवार' },
    { id: 'p-2', type: 'ResearchPaper', title: 'परमारकालीन शिलालेख और मुलताई का इतिहास', category: 'History', status: 'published', date: '2026-06-20', author: 'प्रो. एस. के. वर्मा' },
    { id: 'b-1', type: 'Book', title: 'सतपुड़ा लोकसंस्कृति और पँवारी गीत', category: 'Monograph', status: 'published', date: '2025-11-10', author: 'डॉ. आर. के. पवार' },
    { id: 'd-1', type: 'DictionaryWord', title: 'बन्ना (Groom / वर)', category: 'Noun', status: 'verified', date: '2026-05-01', author: 'भाषा समिति' },
    { id: 'l-1', type: 'Lokgeet', title: 'ताप्ती तट के पारंपरिक विवाह गीत', category: 'Vivah', status: 'published', date: '2026-04-12', author: 'लोक दल' },
    { id: 'h-1', type: 'HistoryArticle', title: 'राजा मोरध्वज और परमार राजवंश का इतिहास', category: 'Dynasty', status: 'published', date: '2025-08-15', author: 'इतिहास विभाग' },
    { id: 'pl-1', type: 'Place', title: 'मूलाप्त ताप्ती उद्गम (मुलताई)', category: 'Tirth', status: 'verified', date: '2025-01-01', author: 'विशेषज्ञ दल' },
  ];

  // Knowledge Graph Relationships
  const relationships = [
    { id: 'rel-1', source: 'पवारी भाषा की रूपरेखा और सतपुड़ा अंचल', target: 'बन्ना (Groom / वर)', type: 'uses_term', confidence: '0.98', evidence: 'Section 3.2 Linguistic Analysis' },
    { id: 'rel-2', source: 'पवारी भाषा की रूपरेखा और सतपुड़ा अंचल', target: 'मूलाप्त ताप्ती उद्गम (मुलताई)', type: 'located_in', confidence: '1.00', evidence: 'Field survey GPS 21.78° N, 78.09° E' },
    { id: 'rel-3', source: 'सतपुड़ा लोकसंस्कृति और पँवारी गीत', target: 'ताप्ती तट के पारंपरिक विवाह गीत', type: 'cites', confidence: '0.95', evidence: 'Bibliography Chapter 4' },
    { id: 'rel-4', source: 'राजा मोरध्वज और परमार राजवंश का इतिहास', target: 'मूलाप्त ताप्ती उद्गम (मुलताई)', type: 'occurred_at', confidence: '0.92', evidence: 'Inscriptions on temple walls' },
    { id: 'rel-5', source: 'ताप्ती तट के पारंपरिक विवाह गीत', target: 'बन्ना (Groom / वर)', type: 'mentions', confidence: '0.99', evidence: 'Lyrics stanza 2 line 4' },
  ];

  const filteredRelationships = relationships.filter(r => {
    if (relationshipFilter === 'all') return true;
    return r.type === relationshipFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 rounded-2xl border border-amber-500/35 flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Network className="w-4 h-4" />
            <span>एकीकृत ज्ञान ग्राफ एवं क्रॉस-मॉड्यूल इंटीग्रेशन (Knowledge Graph Hub)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
            पवारी शोध एवं सांस्कृतिक ज्ञान नेटवर्क (Semantic Knowledge Graph)
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-mono font-bold">
            सक्रिय नोड्स: {allEntities.length} | संबंध: {relationships.length}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-amber-200 dark:border-stone-800 gap-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'graph', label: 'ज्ञान ग्राफ एक्सप्लोरर (Graph Explorer)', icon: Network },
          { id: 'relationships', label: 'संबंध मैट्रिक्स (Relationships)', icon: Share2 },
          { id: 'network', label: 'लेखक व भूगोल नेटवर्क (Network)', icon: Users },
          { id: 'timeline', label: 'ऐतिहासिक कालक्रम (Timeline Network)', icon: Calendar },
          { id: 'recommendations', label: 'बुद्धिमान अनुशंसाएँ (Smart Engine)', icon: Sparkles },
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

      {/* TAB 1: GRAPH EXPLORER */}
      {activeTab === 'graph' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Entity List */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-stone-900 dark:text-amber-100 text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-600" />
              <span>पंजीकृत ज्ञान नोड्स ({allEntities.length})</span>
            </h3>

            <div className="space-y-3">
              {allEntities.map(entity => (
                <div
                  key={entity.id}
                  onClick={() => setSelectedEntity(entity)}
                  className={`p-4 rounded-xl border transition cursor-pointer space-y-1.5 ${
                    selectedEntity?.id === entity.id
                      ? 'border-amber-600 bg-amber-50/50 dark:bg-stone-800 shadow-sm'
                      : 'border-stone-200 dark:border-stone-800 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded font-bold">
                      {entity.type}
                    </span>
                    <span className="text-stone-400">{entity.date}</span>
                  </div>
                  <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-xs">
                    {entity.title}
                  </h4>
                  <p className="text-[11px] text-stone-500">संकलनकर्ता/लेखक: {entity.author}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Graph Inspector / Details */}
          <div className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-sm">
            {selectedEntity ? (
              <div className="space-y-6">
                <div className="border-b border-stone-200 dark:border-stone-800 pb-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-600">
                    <span>Entity ID: {selectedEntity.id}</span>
                    <span>•</span>
                    <span>Type: {selectedEntity.type}</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-amber-100">
                    {selectedEntity.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300 font-serif">
                    श्रेणी: {selectedEntity.category} | स्थिति: {selectedEntity.status}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-serif font-bold text-stone-900 dark:text-amber-100 text-sm">
                    जुड़े हुए संबंध (Connected Relationships & Graph Edges):
                  </h4>
                  <div className="space-y-3">
                    {relationships.filter(r => r.source === selectedEntity.title || r.target === selectedEntity.title).length === 0 ? (
                      <p className="text-xs text-stone-500">इस नोड से सीधे जुड़े अन्य संबंध उपलब्ध नहीं हैं।</p>
                    ) : (
                      relationships
                        .filter(r => r.source === selectedEntity.title || r.target === selectedEntity.title)
                        .map(rel => (
                          <div key={rel.id} className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
                            <div className="space-y-1">
                              <span className="px-2 py-0.5 bg-amber-600 text-stone-950 font-bold rounded text-[10px] uppercase">
                                {rel.type}
                              </span>
                              <p className="font-serif font-bold text-stone-800 dark:text-stone-200">
                                {rel.source === selectedEntity.title ? `→ ${rel.target}` : `← ${rel.source}`}
                              </p>
                              <p className="text-[10px] text-stone-400 font-mono">विश्वास स्कोर: {rel.confidence} | साक्ष्य: {rel.evidence}</p>
                            </div>
                            <Share2 className="w-4 h-4 text-amber-600" />
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-24 text-stone-500 space-y-3">
                <Network className="w-12 h-12 text-stone-600 mx-auto" />
                <p className="text-sm font-serif">ज्ञान ग्राफ में संबंधों और विवरण को देखने के लिए बाईं सूची से कोई नोड चुनें।</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: RELATIONSHIPS MATRIX */}
      {activeTab === 'relationships' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="font-serif font-bold text-stone-900 dark:text-amber-100 text-sm">
              क्रॉस-मॉड्यूल संबंध मैट्रिक्स (Relationship Registry & Triples)
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-4 h-4 text-stone-400" />
              <select
                value={relationshipFilter}
                onChange={(e) => setRelationshipFilter(e.target.value)}
                className="p-2 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200 font-bold"
              >
                <option value="all">सभी संबंध प्रकार</option>
                <option value="uses_term">uses_term</option>
                <option value="located_in">located_in</option>
                <option value="cites">cites</option>
                <option value="occurred_at">occurred_at</option>
                <option value="mentions">mentions</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-stone-100 dark:bg-stone-950 text-stone-700 dark:text-stone-300 uppercase font-bold border-b border-stone-200 dark:border-stone-800">
                <tr>
                  <th className="p-4">स्रोत एंटिटी (Source)</th>
                  <th className="p-4">संबंध प्रकार (Relationship Type)</th>
                  <th className="p-4">लक्ष्य एंटिटी (Target)</th>
                  <th className="p-4">विश्वास (Confidence)</th>
                  <th className="p-4">साक्ष्य (Evidence)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800 font-serif">
                {filteredRelationships.map(rel => (
                  <tr key={rel.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition">
                    <td className="p-4 font-bold text-stone-900 dark:text-stone-100">{rel.source}</td>
                    <td className="p-4 font-mono text-amber-600 font-bold text-[11px]">{rel.type}</td>
                    <td className="p-4 font-bold text-stone-900 dark:text-stone-100">{rel.target}</td>
                    <td className="p-4 font-mono">{rel.confidence}</td>
                    <td className="p-4 text-stone-500 text-[11px] font-sans">{rel.evidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: NETWORK */}
      {activeTab === 'network' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-stone-900 dark:text-amber-100 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" />
              <span>लेखक एवं योगदान नेटवर्क (Author Network)</span>
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 font-serif leading-relaxed">
              डॉ. रूपेश पवार और अन्य शोधकर्ताओं के शोध पत्र, मोनोग्राफ, शब्दकोश प्रविष्टियाँ और ऐतिहासिक अभिलेखों का एकीकृत नेटवर्क।
            </p>
            <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between"><span>डॉ. रूपेश पवार:</span><span className="text-amber-600 font-bold">4 शोध पत्र, 2 पुस्तकें</span></div>
              <div className="flex justify-between"><span>प्रो. एस. के. वर्मा:</span><span className="text-amber-600 font-bold">2 शोध पत्र, 1 मोनोग्राफ</span></div>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-stone-900 dark:text-amber-100 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>भौगोलिक एवं क्षेत्रीय नेटवर्क (Geographic Network)</span>
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 font-serif leading-relaxed">
              मुलताई, सतपुड़ा, बैतूल, छिंदवाड़ा और पांढुर्णा अंचल से जुड़ी शब्दकोश प्रविष्टियाँ, लोकगीत और ऐतिहासिक स्थल।
            </p>
            <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between"><span>मुलताई (ताप्ती उद्गम):</span><span className="text-amber-600 font-bold">12 लोकगीत, 5 इतिहास लेख</span></div>
              <div className="flex justify-between"><span>सतपुड़ा ग्राम समूह:</span><span className="text-amber-600 font-bold">45 शब्दकोश शब्द</span></div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-8 space-y-6 shadow-sm">
          <h3 className="font-serif font-bold text-stone-900 dark:text-amber-100 text-base">
            क्रॉस-मॉड्यूल समेकित कालक्रम नेटवर्क (Unified Timeline Network)
          </h3>
          <div className="relative border-l-2 border-amber-600/50 pl-6 space-y-8 ml-4">
            <div className="relative space-y-1">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-amber-600 border-4 border-white dark:border-stone-900" />
              <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded font-mono text-xs font-bold">1150 ई.</span>
              <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">परमार राजवंश एवं मुलताई स्थापना</h4>
              <p className="text-xs text-stone-500">इतिहास अभिलेखागार तथा शिलालेख रिकॉर्ड से जुड़ा हुआ।</p>
            </div>
            <div className="relative space-y-1">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-amber-600 border-4 border-white dark:border-stone-900" />
              <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded font-mono text-xs font-bold">2026 ई.</span>
              <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">माँ ताप्ती शोध संस्थान एवं ज्ञान ग्राफ पोर्टल</h4>
              <p className="text-xs text-stone-500">शोध पत्रिका Volume 2, Issue 1 का प्रकाशन एवं डिजिटल लाइब्रेरी शुभारंभ।</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: RECOMMENDATIONS */}
      {activeTab === 'recommendations' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-8 space-y-6 shadow-sm">
          <h3 className="font-serif font-bold text-stone-900 dark:text-amber-100 text-base">
            बुद्धिमान क्रॉस-मॉड्यूल अनुशंसा इंजन (Smart Recommendations)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-3">
              <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded text-[10px] font-bold">
                संबंधित शोध पत्र से अनुशंसित पुस्तक
              </span>
              <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
                सतपुड़ा लोकसंस्कृति और पँवारी गीत
              </h4>
              <p className="text-xs text-stone-500">साझा कीवर्ड्स: "सतपुड़ा", "पवारी", "लोकगीत"</p>
            </div>
            <div className="p-5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-3">
              <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded text-[10px] font-bold">
                शब्दकोश प्रविष्टि से संबंधित लोकगीत
              </span>
              <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
                ताप्ती तट के पारंपरिक विवाह गीत (शब्द: बन्ना)
              </h4>
              <p className="text-xs text-stone-500">ज्ञान ग्राफ संबंध: `mentions` / `uses_term`</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
