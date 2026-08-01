import React, { useState, useEffect } from 'react';
import { 
  Sliders, Plus, Search, ShieldCheck, CheckCircle2, XCircle, ToggleLeft, ToggleRight, SlidersHorizontal, Layers
} from 'lucide-react';
import { FeatureFlag } from '../types/enterprisePlatform';
import { ConfigService } from '../services/configService';

export const EnterpriseConfigFlagsPage: React.FC = () => {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = () => {
    setFlags(ConfigService.getFlags());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('flags_changed', handleUpdate);
    return () => window.removeEventListener('flags_changed', handleUpdate);
  }, []);

  const handleToggle = (key: string) => {
    const updated = ConfigService.toggleFlag(key);
    setFlags(updated);
  };

  const handleRolloutChange = (key: string, val: number) => {
    const updated = ConfigService.updateRollout(key, val);
    setFlags(updated);
  };

  const filtered = flags.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.flagKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 sm:p-10 rounded-3xl border border-amber-500/35 flex flex-wrap items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            <span>सिस्टम कॉन्फ़िगरेशन एवं फीचर फ्लैग इंजन (Feature Flag & Config Engine)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100">
            डायनेमिक फीचर फ्लैग्स एवं रोलआउट नियंत्रण
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl">
            बिना कोड बदले प्लेटफॉर्म की क्षमताओं (AI, OCR, Translation, Public Search, Knowledge Graph) को सक्षम/अक्षम करें और प्रतिशत-आधारित (Rollout Percentage) नियंत्रण प्रबंधित करें।
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <span className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-bold font-mono">
            {flags.filter(f => f.enabled).length} / {flags.length} Flags Enabled
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 flex items-center justify-between gap-4 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="फीचर कुंजी या नाम खोजें..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-200 outline-none focus:border-amber-500 w-64"
          />
        </div>
      </div>

      {/* Flags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(flag => (
          <div key={flag.flagKey} className="bg-stone-900 p-6 rounded-2xl border border-stone-800 space-y-4 shadow-lg hover:border-amber-500/40 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg text-[10px] font-bold font-mono uppercase">
                  {flag.flagKey} • {flag.scope}
                </span>

                <div className="flex items-center gap-2">
                  {flag.beta && <span className="px-2 py-0.5 bg-blue-950 text-blue-400 border border-blue-900 rounded text-[10px] font-bold">BETA</span>}
                  {flag.experimental && <span className="px-2 py-0.5 bg-purple-950 text-purple-400 border border-purple-900 rounded text-[10px] font-bold">EXPERIMENTAL</span>}
                </div>
              </div>

              <div>
                <h3 className="text-base font-serif font-bold text-stone-100">{flag.name}</h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">{flag.description}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-stone-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-300 font-bold">रोलआउट प्रतिशत (Rollout):</span>
                <select
                  value={flag.rolloutPercentage}
                  onChange={e => handleRolloutChange(flag.flagKey, parseInt(e.target.value))}
                  className="px-3 py-1.5 bg-stone-950 border border-stone-800 rounded-xl text-amber-300 font-mono outline-none"
                >
                  <option value={100}>100% (All Users)</option>
                  <option value={50}>50% Rollout</option>
                  <option value={25}>25% Rollout</option>
                  <option value={10}>10% Rollout</option>
                  <option value={1}>1% Canary</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-stone-400 font-mono text-[10px]">Updated: {new Date(flag.updatedAt).toLocaleDateString()}</span>
                <button
                  onClick={() => handleToggle(flag.flagKey)}
                  className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition ${
                    flag.enabled 
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-stone-950 shadow' 
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700'
                  }`}
                >
                  {flag.enabled ? <ToggleRight className="w-4 h-4 text-stone-950" /> : <ToggleLeft className="w-4 h-4 text-stone-400" />}
                  <span>{flag.enabled ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
