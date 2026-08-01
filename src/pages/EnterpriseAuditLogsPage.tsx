import React, { useState, useEffect } from 'react';
import { 
  FileClock, Plus, Search, ShieldCheck, Terminal, User, Calendar, Database, Layers
} from 'lucide-react';
import { AuditRecord } from '../types/enterprisePlatform';
import { AuditService } from '../services/auditService';

export const EnterpriseAuditLogsPage: React.FC = () => {
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');

  const loadData = () => {
    setAudits(AuditService.getAudits());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('audits_changed', handleUpdate);
    return () => window.removeEventListener('audits_changed', handleUpdate);
  }, []);

  const filtered = audits.filter(a => {
    const matchModule = selectedModule === 'all' || a.module === selectedModule;
    const matchSearch = a.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.recordId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchModule && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 sm:p-10 rounded-3xl border border-amber-500/35 flex flex-wrap items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <FileClock className="w-4 h-4" />
            <span>एंटरप्राइज ऑडिट, एक्टिविटी टाइमलाइन एवं ऑबजर्बेबिलिटी (Audit & Activity System)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100">
            एक्टिविटी लॉग्स एवं ट्रेसेबिलिटी डैशबोर्ड
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl">
            प्लेटफॉर्म पर प्रत्येक उपयोगकर्ता कार्रवाई (Create, Edit, Publish, Delete, Login, Export) का सुरक्षित, अपरिवर्तनीय ऑडिट ट्रेल और संस्करण तुलना।
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <span className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-bold font-mono">
            {audits.length} Recorded Events
          </span>
        </div>
      </div>

      {/* Toolbar & Filter */}
      <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="कारਵਾਈ या उपयोगकर्ता द्वारा खोजें..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-200 outline-none focus:border-amber-500 w-64"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-stone-400 font-bold">मॉड्यूल (Module):</span>
          <select
            value={selectedModule}
            onChange={e => setSelectedModule(e.target.value)}
            className="px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-amber-300 font-mono outline-none focus:border-amber-500"
          >
            <option value="all">सभी मॉड्यूल (All Modules)</option>
            <option value="dictionary">Dictionary</option>
            <option value="corpus">Corpus</option>
            <option value="citations">Citations</option>
            <option value="history">History</option>
          </select>
        </div>
      </div>

      {/* Audit Logs List */}
      <div className="space-y-4">
        {filtered.map(audit => (
          <div key={audit.auditId} className="bg-stone-900 p-6 rounded-2xl border border-stone-800 space-y-3 shadow-lg hover:border-amber-500/40 transition">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-bold font-mono uppercase">
                  {audit.auditId} • {audit.module}
                </span>
                <span className="px-2.5 py-0.5 bg-stone-800 text-amber-400 rounded text-[10px] font-bold uppercase font-mono">
                  ACTION: {audit.action}
                </span>
              </div>

              <span className="text-xs text-stone-400 font-mono flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                {new Date(audit.timestamp).toLocaleString()}
              </span>
            </div>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-stone-300">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" />
                <span>Performed By: <strong className="text-amber-200">{audit.performedBy}</strong></span>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-stone-400">
                <span>Record ID: <strong className="text-stone-200">{audit.recordId}</strong></span>
                <span>IP: {audit.ipAddress}</span>
                <span>Req: {audit.requestId}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
