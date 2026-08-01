import React, { useState, useEffect } from 'react';
import { 
  Network, Plus, Search, ShieldCheck, ArrowRightLeft, Link2, Trash2, CheckCircle2, AlertCircle, Layers
} from 'lucide-react';
import { RelationRecord, RelationType, SupportedModule } from '../types/enterprise';
import { RelationService } from '../services/relationService';

export const RelationEnginePage: React.FC = () => {
  const [relations, setRelations] = useState<RelationRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [sourceModule, setSourceModule] = useState<SupportedModule>('dictionary');
  const [sourceId, setSourceId] = useState('dict-1');
  const [targetModule, setTargetModule] = useState<SupportedModule>('corpus');
  const [targetId, setTargetId] = useState('corp-1');
  const [relationType, setRelationType] = useState<RelationType>('derived_from');
  const [notes, setNotes] = useState('');

  const loadData = () => {
    setRelations(RelationService.getRelations());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('relations_changed', handleUpdate);
    return () => window.removeEventListener('relations_changed', handleUpdate);
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newRel: RelationRecord = {
      relationId: `REL-${Math.floor(10000 + Math.random() * 90000)}`,
      sourceModule,
      sourceRecordId: sourceId,
      targetModule,
      targetRecordId: targetId,
      relationType,
      direction: 'bidirectional',
      confidenceScore: 99,
      notes,
      status: 'published',
      createdBy: 'admin@taaptiresearch.org',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    RelationService.saveRelation(newRel);
    setShowAddModal(false);
    setNotes('');
    alert('नया संबंध (Relation) सफलतापूर्वक स्थापित किया गया!');
  };

  const filtered = relations.filter(r => 
    r.relationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.sourceModule.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 sm:p-10 rounded-3xl border border-amber-500/35 flex flex-wrap items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Network className="w-4 h-4" />
            <span>यूनिवर्सल रिलेशन इंजन (Universal Relation Engine)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100">
            क्रॉस-मॉड्यूल संबंध एवं ज्ञान ग्राफ बैकबोन
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl">
            प्लेटफॉर्म के किसी भी रिकॉर्ड को किसी अन्य मॉड्यूल (शब्दकोश, कॉर्पस, लोकगीत, इतिहास, ग्रंथ, व्यक्ति) से semantic रूप से जोड़ने और नॉलेज ग्राफ को अपडेट करने की प्रणाली।
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl flex items-center gap-2 shadow-lg transition text-xs relative z-10"
        >
          <Plus className="w-4 h-4" />
          <span>नया संबंध जोड़ें</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 flex items-center justify-between gap-4 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="संबंध प्रकार या मॉड्यूल खोजें..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-200 outline-none focus:border-amber-500 w-64"
          />
        </div>
      </div>

      {/* Relations List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(rel => (
          <div key={rel.relationId} className="bg-stone-900 p-6 rounded-2xl border border-stone-800 space-y-4 shadow-lg hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-bold font-mono uppercase">
                {rel.relationId}
              </span>
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded text-[10px] font-bold">
                {rel.status} ({rel.confidenceScore}% confidence)
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 bg-stone-950 p-4 rounded-xl border border-stone-800 text-xs">
              <div className="space-y-1 text-left">
                <span className="text-stone-400 font-bold uppercase text-[10px]">Source</span>
                <p className="font-bold text-amber-200">{rel.sourceModule} ({rel.sourceRecordId})</p>
              </div>

              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 font-bold">
                <ArrowRightLeft className="w-4 h-4" />
              </div>

              <div className="space-y-1 text-right">
                <span className="text-stone-400 font-bold uppercase text-[10px]">Target</span>
                <p className="font-bold text-amber-200">{rel.targetModule} ({rel.targetRecordId})</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-400">
              <div>
                <strong className="text-stone-300">Relation Type:</strong> <span className="text-amber-400 font-mono">{rel.relationType}</span>
              </div>
              <button
                onClick={() => RelationService.deleteRelation(rel.relationId)}
                className="p-1.5 bg-red-950/40 hover:bg-red-950 text-red-400 rounded-lg transition"
                title="हटाएं"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {rel.notes && (
              <p className="text-xs text-stone-300 bg-stone-950/60 p-3 rounded-lg border border-stone-800 italic">
                "{rel.notes}"
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg p-6 space-y-6 text-stone-100 shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-amber-200">नया संबंध (Semantic Relation) जोड़ें</h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-300">स्रोत मॉड्यूल (Source Module):</label>
                  <select
                    value={sourceModule}
                    onChange={e => setSourceModule(e.target.value as SupportedModule)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  >
                    <option value="dictionary">Dictionary</option>
                    <option value="corpus">Corpus</option>
                    <option value="lokgeet">Lokgeet</option>
                    <option value="history">History</option>
                    <option value="papers">Papers</option>
                    <option value="books">Books</option>
                    <option value="media">Media</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-300">स्रोत ID (Source Record ID):</label>
                  <input
                    type="text"
                    required
                    value={sourceId}
                    onChange={e => setSourceId(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-300">लक्ष्य मॉड्यूल (Target Module):</label>
                  <select
                    value={targetModule}
                    onChange={e => setTargetModule(e.target.value as SupportedModule)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  >
                    <option value="dictionary">Dictionary</option>
                    <option value="corpus">Corpus</option>
                    <option value="lokgeet">Lokgeet</option>
                    <option value="history">History</option>
                    <option value="papers">Papers</option>
                    <option value="books">Books</option>
                    <option value="media">Media</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-300">लक्ष्य ID (Target Record ID):</label>
                  <input
                    type="text"
                    required
                    value={targetId}
                    onChange={e => setTargetId(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">संबंध का प्रकार (Relation Type):</label>
                <select
                  value={relationType}
                  onChange={e => setRelationType(e.target.value as RelationType)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-amber-300 font-mono outline-none focus:border-amber-500"
                >
                  <option value="related_to">Related To</option>
                  <option value="variant_of">Variant Of</option>
                  <option value="translation_of">Translation Of</option>
                  <option value="derived_from">Derived From</option>
                  <option value="mentions">Mentions</option>
                  <option value="collected_by">Collected By</option>
                  <option value="recorded_by">Recorded By</option>
                  <option value="cites">Cites</option>
                  <option value="supports">Supports</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">टिप्पणी / संदर्भ नोट (Notes):</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="संबंध का संक्षिप्त विवरण..."
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
