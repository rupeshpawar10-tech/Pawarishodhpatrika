import React, { useState, useEffect } from 'react';
import { 
  Puzzle, Plus, Search, ShieldCheck, CheckCircle2, XCircle, Power, Download, Layers, Cpu, Terminal
} from 'lucide-react';
import { PluginManifest, PluginType } from '../types/enterprisePlatform';
import { PluginService } from '../services/pluginService';

export const EnterprisePluginMarketplacePage: React.FC = () => {
  const [plugins, setPlugins] = useState<PluginManifest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<PluginType | 'all'>('all');

  const loadData = () => {
    setPlugins(PluginService.getPlugins());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('plugins_changed', handleUpdate);
    return () => window.removeEventListener('plugins_changed', handleUpdate);
  }, []);

  const handleToggle = (id: string) => {
    const updated = PluginService.togglePlugin(id);
    setPlugins(updated);
  };

  const filtered = plugins.filter(p => {
    const matchType = selectedType === 'all' || p.type === selectedType;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 sm:p-10 rounded-3xl border border-amber-500/35 flex flex-wrap items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Puzzle className="w-4 h-4" />
            <span>एंटरप्राइज प्लगइन & एक्सटेंशन फ्रेमवर्क (Plugin & Extension Marketplace)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100">
            प्लेटफॉर्म एक्सटेंशन्स एवं मॉड्यूलर प्लगइन्स
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl">
            बिना कोर सिस्टम को प्रभावित किए नए मॉड्यूल्स, एआई इंजनों, ट्रांसलेशन टूल्स, ओसीआर स्कैनर्स और मैप लेयर्स को डायनेमिक रूप से स्थापित और सक्रिय करें।
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <span className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-bold font-mono">
            {plugins.filter(p => p.enabled).length} / {plugins.length} Active Plugins
          </span>
        </div>
      </div>

      {/* Toolbar & Filter */}
      <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="प्लगइन नाम या लेखक खोजें..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-200 outline-none focus:border-amber-500 w-64"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-stone-400 font-bold">प्लगइन प्रकार (Type):</span>
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value as any)}
            className="px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-amber-300 font-mono outline-none focus:border-amber-500"
          >
            <option value="all">सभी प्रकार (All Types)</option>
            <option value="ocr">OCR Scanner</option>
            <option value="translation">Translation</option>
            <option value="map">Map & GIS</option>
            <option value="ai">AI Model</option>
            <option value="storage">Storage</option>
            <option value="analytics">Analytics</option>
          </select>
        </div>
      </div>

      {/* Plugins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(plugin => (
          <div key={plugin.pluginId} className="bg-stone-900 p-6 rounded-2xl border border-stone-800 space-y-4 shadow-lg hover:border-amber-500/40 transition flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg text-[10px] font-bold font-mono uppercase">
                  {plugin.type} • v{plugin.version}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                  plugin.enabled ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-stone-800 text-stone-400'
                }`}>
                  {plugin.enabled ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {plugin.enabled ? 'Active' : 'Disabled'}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-serif font-bold text-stone-100">{plugin.name}</h3>
                <p className="text-[11px] text-amber-400/90 font-medium">By {plugin.author}</p>
              </div>

              <p className="text-xs text-stone-400 leading-relaxed">
                {plugin.description}
              </p>
            </div>

            <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs">
              <span className="text-stone-500 font-mono text-[10px]">Min Platform: v{plugin.minPlatformVersion}</span>
              <button
                onClick={() => handleToggle(plugin.pluginId)}
                className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition ${
                  plugin.enabled 
                    ? 'bg-red-950/60 hover:bg-red-950 text-red-300 border border-red-900/50' 
                    : 'bg-amber-600 hover:bg-amber-500 text-stone-950 shadow'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{plugin.enabled ? 'निष्क्रिय करें (Disable)' : 'सक्रिय करें (Enable)'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
