import React, { useState, useEffect } from 'react';
import { 
  Folder, Image as ImageIcon, FileText, Music, Video, Upload, Search, Trash2, Download, 
  Copy, Check, Eye, Shield, Tag, Calendar, Database, Server, RefreshCw, Archive, 
  FolderTree, Grid, List as ListIcon, HardDrive, AlertTriangle, CheckCircle2, MoreVertical, 
  Layers, Code, Filter, Sparkles
} from 'lucide-react';
import { MediaAsset, DAMModule, DAMFileCategory, SecurityLevel } from '../types/dam';
import { DAMService } from '../services/damService';
import { UploadModal } from '../components/dam/UploadModal';
import { MediaPreviewModal } from '../components/dam/MediaPreviewModal';
import { CloudFunctionsViewerModal } from '../components/dam/CloudFunctionsViewerModal';

export const MediaLibraryPage: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'folders'>('grid');
  
  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  const [isCloudFuncOpen, setIsCloudFuncOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  
  // Storage stats
  const [storageStats, setStorageStats] = useState({ totalBytes: 0, byModule: {}, byCategory: {} });

  const loadData = () => {
    const list = DAMService.getAssets();
    setAssets(list);
    setStorageStats(DAMService.calculateStorageUsage());
  };

  useEffect(() => {
    loadData();
    const handleStorageChange = () => loadData();
    window.addEventListener('dam_assets_change', handleStorageChange);
    return () => window.removeEventListener('dam_assets_change', handleStorageChange);
  }, []);

  const filteredAssets = assets.filter(a => {
    const matchMod = selectedModule === 'all' || a.module === selectedModule;
    const matchCat = selectedCategory === 'all' || a.category === selectedCategory;
    const matchSearch = a.fileName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        a.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchMod && matchCat && matchSearch && a.status !== 'soft_deleted';
  });

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDelete = (mediaId: string, permanent: boolean = false) => {
    if (permanent && !window.confirm('क्या आप इस मीडिया फ़ाइल को हमेशा के लिए हटाना चाहते हैं?')) return;
    DAMService.deleteAsset(mediaId, permanent);
    loadData();
  };

  const handleArchive = (mediaId: string) => {
    DAMService.archiveAsset(mediaId);
    loadData();
  };

  const handleExportMetadata = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(assets, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `dam_metadata_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-stone-900 text-stone-100 p-8 rounded-3xl border border-amber-500/35 flex flex-wrap items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>एंटरप्राइज डिजिटल एसेट मैनेजमेंट (Enterprise DAM & Storage)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100">
            केंद्रीकृत मीडिया लाइब्रेरी एवं स्टोरेज हब
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl">
            Firebase Storage (फ़ाइल भंडारण) और Firestore (मेटाडेटा) पर आधारित संपूर्ण शोध परिसंपत्ति प्रबंधन प्रणाली। सभी 10 मॉड्यूल्स से जुड़ी हुई।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => setIsCloudFuncOpen(true)}
            className="px-4 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-xl flex items-center gap-2 shadow transition text-xs border border-stone-700"
          >
            <Code className="w-4 h-4 text-amber-400" />
            <span>क्लाउड फंक्शन्स & नियम</span>
          </button>

          <button
            onClick={handleExportMetadata}
            className="px-4 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-xl flex items-center gap-2 shadow transition text-xs border border-stone-700"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>मेटाडेटा बैकअप</span>
          </button>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl flex items-center gap-2 shadow-lg transition text-xs"
          >
            <Upload className="w-4 h-4" />
            <span>नई फ़ाइल अपलोड करें</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-1">
          <span className="text-xs text-stone-400 font-bold uppercase">कुल मीडिया फ़ाइलें</span>
          <div className="text-2xl font-serif font-bold text-amber-100">{assets.length}</div>
          <span className="text-[10px] text-green-400 font-mono">100% Synced with Firestore</span>
        </div>

        <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-1">
          <span className="text-xs text-stone-400 font-bold uppercase">स्टोरेज उपयोग</span>
          <div className="text-2xl font-serif font-bold text-amber-100">
            {(storageStats.totalBytes / (1024 * 1024)).toFixed(2)} MB
          </div>
          <span className="text-[10px] text-stone-400 font-mono">Firebase Storage Buckets</span>
        </div>

        <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-1">
          <span className="text-xs text-stone-400 font-bold uppercase">दस्तावेज़ एवं पीडीएफ</span>
          <div className="text-2xl font-serif font-bold text-amber-100">
            {assets.filter(a => a.category === 'document').length}
          </div>
          <span className="text-[10px] text-stone-400 font-mono">/papers/ & /books/</span>
        </div>

        <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-1">
          <span className="text-xs text-stone-400 font-bold uppercase">ऑडियो एवं वीडियो</span>
          <div className="text-2xl font-serif font-bold text-amber-100">
            {assets.filter(a => a.category === 'audio' || a.category === 'video').length}
          </div>
          <span className="text-[10px] text-stone-400 font-mono">/corpus/ & /lokgeet/</span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Module Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'papers', 'books', 'dictionary', 'corpus', 'lokgeet', 'history', 'media', 'reports'].map(mod => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase transition ${
                selectedModule === mod
                  ? 'bg-amber-600 text-stone-950 shadow'
                  : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>

        {/* Search & Category View toggles */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="फ़ाइल नाम या टैग खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-200 outline-none focus:border-amber-500 w-60"
            />
          </div>

          <div className="flex items-center bg-stone-950 rounded-xl border border-stone-800 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-amber-600 text-stone-950' : 'text-stone-400'}`}
              title="ग्रिड व्यू"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'table' ? 'bg-amber-600 text-stone-950' : 'text-stone-400'}`}
              title="टेबल व्यू"
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('folders')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'folders' ? 'bg-amber-600 text-stone-950' : 'text-stone-400'}`}
              title="स्टोरेज फोल्डर स्ट्रक्चर"
            >
              <FolderTree className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Display Area */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map(asset => (
            <div
              key={asset.mediaId}
              className="bg-stone-900 rounded-2xl border border-stone-800 p-6 space-y-4 hover:border-amber-500/50 transition flex flex-col justify-between shadow-lg group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg text-[10px] font-bold uppercase">
                    {asset.module}
                  </span>
                  <span className="text-xs font-mono text-stone-400">
                    {(asset.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-center text-amber-400 shrink-0">
                    {asset.category === 'image' ? <ImageIcon className="w-6 h-6" /> :
                     asset.category === 'audio' ? <Music className="w-6 h-6" /> :
                     asset.category === 'video' ? <Video className="w-6 h-6" /> :
                     <FileText className="w-6 h-6" />}
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <h4
                      className="font-serif font-bold text-stone-100 text-sm truncate cursor-pointer hover:text-amber-400"
                      onClick={() => setPreviewAsset(asset)}
                      title={asset.fileName}
                    >
                      {asset.fileName}
                    </h4>
                    <p className="text-[11px] text-stone-400 font-mono truncate">{asset.storagePath}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {asset.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-stone-950 rounded text-[10px] text-stone-400 font-mono border border-stone-800">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => setPreviewAsset(asset)}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-lg flex items-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>पूर्वावलोकन</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(asset.downloadURL)}
                    className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition"
                    title="लिंक कॉपी करें"
                  >
                    {copiedUrl === asset.downloadURL ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleArchive(asset.mediaId)}
                    className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition"
                    title="आर्काइव करें"
                  >
                    <Archive className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(asset.mediaId, true)}
                    className="p-2 bg-red-950/40 hover:bg-red-950 text-red-400 rounded-lg transition border border-red-900/40"
                    title="हमेशा के लिए हटाएं (Delete)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'table' && (
        <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950 text-stone-400 uppercase font-mono border-b border-stone-800">
                <tr>
                  <th className="p-4">फ़ाइल नाम</th>
                  <th className="p-4">मॉड्यूल</th>
                  <th className="p-4">प्रकार</th>
                  <th className="p-4">आकार</th>
                  <th className="p-4">सुरक्षा</th>
                  <th className="p-4">अपलोडर</th>
                  <th className="p-4 text-right">कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800 text-stone-300">
                {filteredAssets.map(asset => (
                  <tr key={asset.mediaId} className="hover:bg-stone-950/50 transition">
                    <td className="p-4 font-medium text-stone-100 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="truncate max-w-xs">{asset.fileName}</span>
                    </td>
                    <td className="p-4 uppercase font-mono text-amber-300">{asset.module}</td>
                    <td className="p-4 uppercase font-mono">{asset.extension}</td>
                    <td className="p-4 font-mono">{(asset.size / (1024 * 1024)).toFixed(2)} MB</td>
                    <td className="p-4 uppercase font-mono text-stone-400">{asset.security}</td>
                    <td className="p-4">{asset.uploadedBy}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => setPreviewAsset(asset)} className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(asset.mediaId, true)} className="p-1.5 bg-red-950/40 hover:bg-red-950 text-red-400 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'folders' && (
        <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 space-y-6">
          <h3 className="text-base font-serif font-bold text-amber-100">Firebase Storage फोल्डर स्ट्रक्चर</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { path: '/papers/', count: assets.filter(a => a.module === 'papers').length, label: 'Research Papers' },
              { path: '/books/', count: assets.filter(a => a.module === 'books').length, label: 'Digital Books' },
              { path: '/dictionary/audio/', count: assets.filter(a => a.module === 'dictionary' && a.category === 'audio').length, label: 'Dictionary Audio' },
              { path: '/dictionary/images/', count: assets.filter(a => a.module === 'dictionary' && a.category === 'image').length, label: 'Dictionary Images' },
              { path: '/corpus/audio/', count: assets.filter(a => a.module === 'corpus' && a.category === 'audio').length, label: 'Corpus Audio' },
              { path: '/corpus/video/', count: assets.filter(a => a.module === 'corpus' && a.category === 'video').length, label: 'Corpus Video' },
              { path: '/lokgeet/audio/', count: assets.filter(a => a.module === 'lokgeet' && a.category === 'audio').length, label: 'Lokgeet Audio' },
              { path: '/history/images/', count: assets.filter(a => a.module === 'history').length, label: 'History Archives' },
              { path: '/media/', count: assets.filter(a => a.module === 'media').length, label: 'General Media' },
            ].map(folder => (
              <div key={folder.path} className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Folder className="w-6 h-6 text-amber-400" />
                  <div>
                    <h5 className="font-mono font-bold text-stone-200 text-xs">{folder.path}</h5>
                    <p className="text-[10px] text-stone-400">{folder.label}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 rounded-lg text-xs font-mono font-bold">
                  {folder.count} files
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploaded={() => loadData()}
      />

      <MediaPreviewModal
        asset={previewAsset}
        onClose={() => setPreviewAsset(null)}
      />

      <CloudFunctionsViewerModal
        isOpen={isCloudFuncOpen}
        onClose={() => setIsCloudFuncOpen(false)}
      />
    </div>
  );
};
