import React, { useState, useEffect } from 'react';
import { 
  Archive, Plus, Search, ShieldCheck, CheckCircle2, RefreshCw, Lock, Database, FileCheck, Layers
} from 'lucide-react';
import { PreservationRecord } from '../types/enterprisePlatform';
import { PreservationService } from '../services/preservationService';

export const EnterprisePreservationPage: React.FC = () => {
  const [preservations, setPreservations] = useState<PreservationRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = () => {
    setPreservations(PreservationService.getPreservations());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('preservation_changed', handleUpdate);
    return () => window.removeEventListener('preservation_changed', handleUpdate);
  }, []);

  const handleRunScan = () => {
    const updated = PreservationService.runFixityScan();
    setPreservations(updated);
    alert('फिक्सिटी चेक (Fixity Check) एवं SHA-256/SHA-512 सत्यापन सफलतापूर्वक पूर्ण हुआ!');
  };

  const filtered = preservations.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.pid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.objectType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 sm:p-10 rounded-3xl border border-amber-500/35 flex flex-wrap items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Archive className="w-4 h-4" />
            <span>डिजिटल प्रेसिर्वेशन & लॉन्ग-टर्म आर्काइवल इंजन (Digital Preservation Engine)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100">
            दीर्घकालिक संरक्षण, फिक्सिटी चेक एवं चेकसम सत्यापन
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl">
            शोध объектов और दुर्लभ पांडुलिपियों के लिए दशकों तक प्रामाणिकता बनाए रखने हेतु BagIt पैकेजिंग, SHA-256/SHA-512 चेकसम, और स्वचालित विट-रॉट डिटेक्शन प्रणाली।
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={handleRunScan}
            className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl flex items-center gap-2 shadow-lg transition text-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>फिक्सिटी चेक स्कैन चलाएं</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 flex items-center justify-between gap-4 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="शीर्षक या PID द्वारा खोजें..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-200 outline-none focus:border-amber-500 w-64"
          />
        </div>
      </div>

      {/* Preservations List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(item => (
          <div key={item.preservationId} className="bg-stone-900 p-6 rounded-2xl border border-stone-800 space-y-4 shadow-lg hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-bold font-mono uppercase">
                {item.preservationId} • {item.objectType}
              </span>
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded text-[10px] font-bold flex items-center gap-1">
                <FileCheck className="w-3 h-3" />
                <span>{item.fixityStatus.toUpperCase()} ({item.packageFormat})</span>
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-serif font-bold text-stone-100">{item.title}</h3>
              <p className="text-xs text-amber-400 font-mono font-medium">PID: {item.pid}</p>
            </div>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-stone-400">
                <span>SHA-256 Checksum:</span>
                <span className="text-amber-200 truncate max-w-[240px]" title={item.checksumSha256}>{item.checksumSha256}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Retention: <strong className="text-stone-200">{item.retentionPeriod.toUpperCase()}</strong></span>
                <span>Replicas: <strong className="text-emerald-400">{item.replicas} Active</strong></span>
              </div>
            </div>

            <div className="text-[11px] text-stone-500 font-mono flex items-center justify-between pt-2 border-t border-stone-800">
              <span>Last Scan: {new Date(item.lastScanDate).toLocaleString()}</span>
              <span className="text-amber-400 font-bold">Bit-rot Protected</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
