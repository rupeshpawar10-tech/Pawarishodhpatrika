import React, { useState, useEffect } from 'react';
import { 
  Database, Plus, Search, ShieldCheck, Play, RefreshCw, CheckCircle2, AlertCircle, Clock, Terminal, Layers
} from 'lucide-react';
import { JobRecord, JobPriority, JobType } from '../types/enterprise';
import { JobQueueService } from '../services/jobQueueService';

export const JobQueuePage: React.FC = () => {
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = () => {
    setJobs(JobQueueService.getJobs());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('jobs_changed', handleUpdate);
    return () => window.removeEventListener('jobs_changed', handleUpdate);
  }, []);

  const handleTriggerJob = (jobType: JobType) => {
    JobQueueService.createJob(jobType, 'citations', 'high');
    alert(`नया बैकग्राउंड जॉब (${jobType}) कतार (Queue) में सफलतापूर्वक जोड़ दिया गया!`);
  };

  const filtered = jobs.filter(j => 
    j.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.jobType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 sm:p-10 rounded-3xl border border-amber-500/35 flex flex-wrap items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>बैकग्राउंड जॉब क्यू एवं टास्क प्रोसेसिंग इंजन (Background Job Queue Engine)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100">
            असिंक्रोनस टास्क कतार एवं वर्कर डैशबोर्ड
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl">
            भारी ऑपरेशनों (जैसे कॉरपस प्रोसेसिंग, सर्च रीइंडेक्स, पीडीएफ जनरेशन, ऑडियो वेवफॉर्म) को UI से बाहर सुरक्षित रूप से निष्पादित करने और प्रगति ट्रैक करने की कतार प्रणाली।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => handleTriggerJob('search_reindex')}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl flex items-center gap-2 shadow transition text-xs"
          >
            <Play className="w-4 h-4" />
            <span>सर्च रीइंडेक्स जॉब चलाएं</span>
          </button>
          <button
            onClick={() => handleTriggerJob('corpus_processing')}
            className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold rounded-xl flex items-center gap-2 border border-stone-700 transition text-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>कॉरपस प्रोसेसिंग जॉब</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 flex items-center justify-between gap-4 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="जॉब ID या प्रकार खोजें..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-200 outline-none focus:border-amber-500 w-64"
          />
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filtered.map(job => (
          <div key={job.jobId} className="bg-stone-900 p-6 rounded-2xl border border-stone-800 space-y-4 shadow-lg hover:border-amber-500/40 transition">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-bold font-mono uppercase">
                  {job.jobId} • {job.jobType}
                </span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                  job.status === 'completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' :
                  job.status === 'running' ? 'bg-amber-950 text-amber-400 border border-amber-900 animate-pulse' :
                  'bg-stone-800 text-stone-300'
                }`}>
                  {job.status}
                </span>
              </div>

              <span className="text-xs text-stone-400 font-mono">
                Priority: <strong className="text-amber-400 uppercase">{job.priority}</strong>
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-stone-300">प्रगति (Progress):</span>
                <span className="text-amber-400">{job.progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
                <div 
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500 rounded-full"
                  style={{ width: `${job.progress}%` }}
                />
              </div>
            </div>

            {/* Logs Terminal */}
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1 text-xs font-mono">
              <div className="flex items-center gap-2 text-amber-400 pb-2 border-b border-stone-800/80">
                <Terminal className="w-3.5 h-3.5" />
                <span>Execution Logs</span>
              </div>
              {job.logs.map((log, idx) => (
                <div key={idx} className="flex items-center gap-3 text-stone-400">
                  <span className="text-[10px] text-stone-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  <span className={log.level === 'error' ? 'text-red-400 font-bold' : 'text-stone-200'}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
