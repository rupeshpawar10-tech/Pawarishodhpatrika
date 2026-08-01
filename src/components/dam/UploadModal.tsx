import React, { useState, useRef } from 'react';
import { X, Upload, File, CheckCircle2, AlertCircle, Play, Pause, RefreshCw, Shield, Tag, Globe, Layers } from 'lucide-react';
import { DAMModule, SecurityLevel, UploadTask, MediaAsset } from '../../types/dam';
import { DAMService } from '../../services/damService';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploaded: (asset: MediaAsset) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUploaded }) => {
  const [selectedModule, setSelectedModule] = useState<DAMModule>('media');
  const [security, setSecurity] = useState<SecurityLevel>('public');
  const [language, setLanguage] = useState<'hi' | 'en' | 'paw' | 'multi'>('multi');
  const [tagInput, setTagInput] = useState('research, archive');
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleFilesSelected = async (files: FileList | File[]) => {
    const newTasks: UploadTask[] = Array.from(files).map(file => ({
      id: 'task-' + Math.random().toString(36).substring(2, 9),
      file,
      module: selectedModule,
      security,
      tags: tagInput.split(',').map(t => t.trim()).filter(Boolean),
      language,
      progress: 0,
      status: 'queued'
    }));

    setTasks(prev => [...prev, ...newTasks]);

    // Process tasks
    for (const task of newTasks) {
      await processUploadTask(task);
    }
  };

  const processUploadTask = async (task: UploadTask) => {
    // Update status to uploading
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'uploading' } : t));

    try {
      const checksum = await DAMService.generateChecksum(task.file);
      
      // Check duplicate
      const existing = DAMService.getAssets().find(a => a.checksum === checksum);
      if (existing) {
        console.warn('Duplicate file detected:', existing.fileName);
      }

      // Simulate chunked upload progress
      for (let p = 10; p <= 100; p += 20) {
        await new Promise(r => setTimeout(r, 250));
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, progress: p } : t));
      }

      const storagePath = DAMService.getStorageFolderForModule(task.module, task.file.type) + task.file.name;
      let downloadURL = URL.createObjectURL(task.file);

      // For images, read as Data URL for persistent offline/local storage rendering
      if (task.file.type.startsWith('image/')) {
        try {
          downloadURL = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string || URL.createObjectURL(task.file));
            reader.onerror = () => resolve(URL.createObjectURL(task.file));
            reader.readAsDataURL(task.file);
          });
        } catch (e) {
          console.warn('FileReader failed, falling back to object URL', e);
        }
      }

      const ext = task.file.name.split('.').pop()?.toLowerCase() || 'bin';
      let category: MediaAsset['category'] = 'document';
      if (task.file.type.startsWith('image/')) category = 'image';
      else if (task.file.type.startsWith('audio/')) category = 'audio';
      else if (task.file.type.startsWith('video/')) category = 'video';
      else if (['zip', 'rar', 'tar', 'gz'].includes(ext)) category = 'archive';
      else if (['json', 'xml', 'csv', 'xlsx'].includes(ext)) category = 'data';

      const newAsset: MediaAsset = {
        mediaId: 'asset-' + Math.random().toString(36).substring(2, 9),
        module: task.module,
        fileName: task.file.name.replace(/\s+/g, '_'),
        originalFileName: task.file.name,
        storagePath,
        downloadURL,
        mimeType: task.file.type || 'application/octet-stream',
        extension: ext,
        category,
        size: task.file.size,
        checksum,
        language: task.language,
        status: 'active',
        uploadedBy: 'Current Researcher (Admin)',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: task.tags,
        categories: [task.module.toUpperCase()],
        collections: ['Enterprise DAM Storage'],
        projects: ['Digital Humanities Platform'],
        security: task.security,
        version: 1,
        previousVersions: [],
        virusScanStatus: 'passed',
        isDuplicate: !!existing,
        duplicateOf: existing?.mediaId
      };

      DAMService.addAsset(newAsset);
      onUploaded(newAsset);

      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'completed', progress: 100, checksum, downloadURL } : t));
    } catch (err) {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'error', errorMessage: 'Upload failed' } : t));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-stone-100">एंटरप्राइज मीडिया अपलोड इंजन</h2>
              <p className="text-xs text-stone-400 font-mono">Firebase Storage & Firestore Metadata Integration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Config row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-stone-400 font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>लक्ष्य मॉड्यूल (Module)</span>
              </label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value as DAMModule)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-200 outline-none focus:border-amber-500"
              >
                <option value="papers">Research Papers (/papers/)</option>
                <option value="books">Digital Books (/books/)</option>
                <option value="dictionary">Dictionary (/dictionary/)</option>
                <option value="corpus">Corpus (/corpus/)</option>
                <option value="lokgeet">Lokgeet (/lokgeet/)</option>
                <option value="history">Historical Archives (/history/)</option>
                <option value="media">Media Library (/media/)</option>
                <option value="reports">Reports (/exports/)</option>
                <option value="exports">Exports (/exports/)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-stone-400 font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>सुरक्षा स्तर (Security)</span>
              </label>
              <select
                value={security}
                onChange={(e) => setSecurity(e.target.value as SecurityLevel)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-200 outline-none focus:border-amber-500"
              >
                <option value="public">Public (सार्वजनिक)</option>
                <option value="protected">Protected (सुरक्षित)</option>
                <option value="private">Private (निजी)</option>
                <option value="research_only">Research Only (केवल शोध)</option>
                <option value="admin_only">Admin Only (केवल एडमिन)</option>
                <option value="super_admin_only">Super Admin Only</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-stone-400 font-bold flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>भाषा (Language)</span>
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-200 outline-none focus:border-amber-500"
              >
                <option value="multi">Multilingual / Multi</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="paw">Pawari (पवारी)</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="text-stone-400 font-bold flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>टैग्स (Comma Separated Tags)</span>
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="e.g. folklore, audio, 2026, survey"
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-200 outline-none focus:border-amber-500"
            />
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${
              isDragging
                ? 'border-amber-500 bg-amber-500/10'
                : 'border-stone-800 hover:border-amber-500/50 bg-stone-950/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-serif font-bold text-stone-200 mb-1">
              फ़ाइलें यहाँ खींचें या क्लिक करके चुनें (Drag & Drop)
            </h4>
            <p className="text-xs text-stone-400">
              समर्थित प्रारूप: PDF, DOCX, TXT, CSV, XLSX, ZIP, JSON, XML, JPG, PNG, WEBP, SVG, MP3, WAV, MP4, WEBM, MOV
            </p>
          </div>

          {/* Tasks List */}
          {tasks.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">अपलोड प्रगति (Upload Progress)</h4>
              <div className="space-y-2">
                {tasks.map(task => (
                  <div key={task.id} className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <File className="w-4 h-4 text-amber-400" />
                        <span className="font-medium text-stone-200 truncate max-w-[280px]">{task.file.name}</span>
                        <span className="text-[10px] text-stone-400 font-mono">({(task.file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {task.status === 'completed' && <span className="flex items-center gap-1 text-green-400 font-bold"><CheckCircle2 className="w-4 h-4" /> पूर्ण</span>}
                        {task.status === 'uploading' && <span className="text-amber-400 font-mono font-bold">{task.progress}%</span>}
                        {task.status === 'error' && <span className="flex items-center gap-1 text-red-400 font-bold"><AlertCircle className="w-4 h-4" /> त्रुटि</span>}
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          task.status === 'completed' ? 'bg-green-500' :
                          task.status === 'error' ? 'bg-red-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stone-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 font-bold text-xs"
          >
            बंद करें / समाप्त
          </button>
        </div>
      </div>
    </div>
  );
};
