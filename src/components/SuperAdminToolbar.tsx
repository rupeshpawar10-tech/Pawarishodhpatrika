import React, { useState } from 'react';
import { ShieldCheck, Plus, Edit3, Database, FileUp, Sparkles, X, Check, BookOpen, Network, Languages, Cpu, Puzzle, Sliders, FileClock, Archive, FileSearch } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const SuperAdminToolbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  if (user.role !== 'super_admin') return null;

  return (
    <div className="bg-gradient-to-r from-amber-900 via-red-950 to-stone-950 text-amber-100 border-b border-amber-500/40 px-4 py-2 text-xs shadow-md sticky top-[73px] z-30 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <span className="font-bold tracking-wide text-amber-200">
          👑 सुपर एडमिन एंटरप्राइज नियंत्रण कक्ष:
        </span>
        <span className="text-stone-300 hidden lg:inline">
          सिटेशन, रिलेशन इंजन, नियंत्रित शब्दावली एवं जॉब कतार प्रबंधक सक्रिय।
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => navigate('/media-library')}
          className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg flex items-center gap-1 transition shadow"
        >
          <FileUp className="w-3.5 h-3.5" />
          <span>मीडिया लाइब्रेरी</span>
        </button>

        <button
          onClick={() => navigate('/enterprise/citations')}
          className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold rounded-lg flex items-center gap-1 transition border border-stone-700"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>सिटेशन</span>
        </button>

        <button
          onClick={() => navigate('/enterprise/relations')}
          className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold rounded-lg flex items-center gap-1 transition border border-stone-700"
        >
          <Network className="w-3.5 h-3.5 text-amber-400" />
          <span>रिलेशन इंजन</span>
        </button>

        <button
          onClick={() => navigate('/enterprise/vocabularies')}
          className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold rounded-lg flex items-center gap-1 transition border border-stone-700"
        >
          <Languages className="w-3.5 h-3.5 text-amber-400" />
          <span>शब्दावली</span>
        </button>

        <button
          onClick={() => navigate('/enterprise/jobs')}
          className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold rounded-lg flex items-center gap-1 transition border border-stone-700"
        >
          <Cpu className="w-3.5 h-3.5 text-amber-400" />
          <span>जॉब कतार</span>
        </button>

        <button
          onClick={() => navigate('/enterprise/plugins')}
          className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold rounded-lg flex items-center gap-1 transition border border-stone-700"
        >
          <Puzzle className="w-3.5 h-3.5 text-amber-400" />
          <span>प्लगइन्स</span>
        </button>

        <button
          onClick={() => navigate('/enterprise/config-flags')}
          className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold rounded-lg flex items-center gap-1 transition border border-stone-700"
        >
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span>फीचर फ्लैग्स</span>
        </button>

        <button
          onClick={() => navigate('/enterprise/audit-logs')}
          className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold rounded-lg flex items-center gap-1 transition border border-stone-700"
        >
          <FileClock className="w-3.5 h-3.5 text-amber-400" />
          <span>ऑडिट लॉग्स</span>
        </button>

        <button
          onClick={() => navigate('/enterprise/preservation')}
          className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold rounded-lg flex items-center gap-1 transition border border-stone-700"
        >
          <Archive className="w-3.5 h-3.5 text-amber-400" />
          <span>संरक्षण (Preservation)</span>
        </button>

        <button
          onClick={() => navigate('/enterprise/doi-harvest')}
          className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold rounded-lg flex items-center gap-1 transition border border-stone-700"
        >
          <FileSearch className="w-3.5 h-3.5 text-amber-400" />
          <span>DOI हार्वेस्ट</span>
        </button>
      </div>
    </div>
  );
};
