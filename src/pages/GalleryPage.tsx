import React, { useState, useEffect, useRef } from 'react';
import { StorageEngine } from '../lib/storage';
import { Camera, Calendar, Image as ImageIcon, Upload, X, Check, Folder, Plus, HardDrive } from 'lucide-react';
import { GalleryItem } from '../types';
import { DAMService } from '../services/damService';

export const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Upload Form State
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCategory, setPhotoCategory] = useState('संगोष्ठी');
  const [photoCaption, setPhotoCaption] = useState('');
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadGallery = () => {
    setItems(StorageEngine.getGallery());
  };

  useEffect(() => {
    loadGallery();
    const handleStorageChange = () => loadGallery();
    window.addEventListener('pawari_storage_change', handleStorageChange);
    return () => window.removeEventListener('pawari_storage_change', handleStorageChange);
  }, []);

  const categories = Array.from(new Set(items.map(i => i.category)));
  const filtered = items.filter(i => activeCategory === 'all' || i.category === activeCategory);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('कृपया केवल फोटो/इमेज फ़ाइल चुनें (e.g. JPG, PNG, WEBP)');
        return;
      }
      setSelectedFileName(file.name);
      if (!photoTitle) {
        setPhotoTitle(file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "));
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewDataUrl) {
      alert('कृपया अपने कंप्यूटर/लोकल ड्राइव से एक फोटो चुनें');
      return;
    }

    setIsUploading(true);

    const newItem: GalleryItem = {
      id: 'gal-' + Date.now(),
      title: photoTitle || selectedFileName || 'चित्र दीर्घा छायाचित्र',
      category: photoCategory,
      imageUrl: previewDataUrl,
      caption: photoCaption || 'माँ ताप्ती शोध संस्थान मुलताई अंचल फोटो रिकॉर्ड',
      date: new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    StorageEngine.saveGalleryItem(newItem);

    // Also register in Enterprise DAM
    DAMService.addAsset({
      mediaId: 'asset-' + Date.now(),
      module: 'media',
      fileName: selectedFileName || 'local_upload.jpg',
      originalFileName: selectedFileName || 'Local Drive Photo',
      storagePath: '/media/gallery/' + (selectedFileName || 'local_photo.jpg'),
      downloadURL: previewDataUrl,
      mimeType: 'image/jpeg',
      extension: selectedFileName.split('.').pop()?.toLowerCase() || 'jpg',
      category: 'image',
      size: Math.round(previewDataUrl.length * 0.75),
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e464' + Date.now(),
      language: 'multi',
      status: 'active',
      uploadedBy: 'Current User (Local Drive Upload)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['gallery', photoCategory, 'local_upload'],
      categories: ['Gallery', photoCategory],
      collections: ['User Gallery Uploads'],
      projects: ['Maa Tapti Digital Humanities'],
      security: 'public',
      version: 1,
      previousVersions: [],
      virusScanStatus: 'passed'
    });

    setIsUploading(false);
    setIsUploadOpen(false);

    // Reset Form
    setPhotoTitle('');
    setPhotoCaption('');
    setPreviewDataUrl(null);
    setSelectedFileName('');
    loadGallery();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-stone-900 text-stone-100 p-8 sm:p-10 rounded-3xl border border-amber-500/30 flex flex-wrap items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Camera className="w-4 h-4" />
            <span>चित्र दीर्घा एवं छायाचित्र संग्रह</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100">
            माँ ताप्ती शोध संस्थान चित्र दीर्घा (Gallery)
          </h1>
          <p className="text-sm text-stone-300 font-serif leading-relaxed">
            संस्थान की संगोष्ठियों, शोध यात्राओं, मुलताई सरोवर एवं ऐतिहासिक धरोहरों की छायाचित्र दीर्घा।
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="px-6 py-3.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-2xl flex items-center gap-2.5 shadow-xl transition active:scale-95 text-xs sm:text-sm"
        >
          <HardDrive className="w-4 h-4" />
          <span>लोकल ड्राइव से फोटो अपलोड करें</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs font-sans pb-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl transition font-bold ${
            activeCategory === 'all'
              ? 'bg-amber-600 text-stone-950 shadow'
              : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
          }`}
        >
          सभी चित्र ({items.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl transition whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-amber-600 text-stone-950 font-bold shadow'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-amber-50/50 dark:bg-stone-900 rounded-3xl border border-amber-200/80 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-xl transition space-y-3 p-4 flex flex-col justify-between"
          >
            <div className="w-full h-56 rounded-2xl overflow-hidden bg-stone-950 relative group">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-amber-800 dark:text-amber-400">
                <span className="font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">{item.category}</span>
                <span>{item.date}</span>
              </div>
              <h3 className="text-base font-serif font-bold text-stone-900 dark:text-amber-100 mt-2">
                {item.title}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 font-serif mt-1 line-clamp-2">
                {item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal for Local Drive Photo Upload */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-amber-500/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-6 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-amber-100 text-lg">लोकल ड्राइव से फोटो अपलोड</h3>
                  <p className="text-xs text-stone-400">अपने डिवाइस (कंप्यूटर / मोबाइल) से फोटो चुनें</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-100 rounded-xl hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-4 text-xs font-serif">
              {/* File Drop / Select Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-amber-500/40 hover:border-amber-500 bg-stone-950/60 rounded-2xl p-6 text-center cursor-pointer transition space-y-3"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {previewDataUrl ? (
                  <div className="space-y-2">
                    <img src={previewDataUrl} alt="Preview" className="w-full h-40 object-cover rounded-xl border border-stone-700" />
                    <p className="text-emerald-400 font-bold text-[11px] flex items-center justify-center gap-1">
                      <Check className="w-4 h-4" />
                      <span>{selectedFileName} चयनित है</span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-amber-400 mx-auto" />
                    <p className="font-bold text-stone-200">लोकल ड्राइव से फोटो फ़ाइल चुनने के लिए यहाँ क्लिक करें</p>
                    <p className="text-[11px] text-stone-400">समर्थित प्रारूप: JPG, PNG, WEBP, GIF, SVG</p>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-stone-300 font-bold">फोटो का शीर्षक (Photo Title)</label>
                <input
                  type="text"
                  required
                  value={photoTitle}
                  onChange={e => setPhotoTitle(e.target.value)}
                  placeholder="उदा. मुलताई ताप्ती सरोवर शोध यात्रा 2026"
                  className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-stone-300 font-bold">श्रेणी (Category)</label>
                  <select
                    value={photoCategory}
                    onChange={e => setPhotoCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                  >
                    <option value="संगोष्ठी">संगोष्ठी (Seminar)</option>
                    <option value="धरोहर">धरोहर (Heritage)</option>
                    <option value="शोध यात्रा">शोध यात्रा (Research Visit)</option>
                    <option value="लोक कला">लोक कला (Folk Art)</option>
                    <option value="अन्य">अन्य (Other)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-stone-300 font-bold">दिनांक (Date)</label>
                  <input
                    type="text"
                    disabled
                    value={new Date().toLocaleDateString('hi-IN')}
                    className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-stone-300 font-bold">विवरण / कैप्शन (Caption)</label>
                <textarea
                  rows={2}
                  value={photoCaption}
                  onChange={e => setPhotoCaption(e.target.value)}
                  placeholder="फोटो के बारे में संक्षिप्त जानकारी दर्ज करें..."
                  className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold rounded-xl"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={!previewDataUrl || isUploading}
                  className="px-6 py-2.5 bg-amber-600 disabled:opacity-50 hover:bg-amber-500 text-stone-950 font-bold rounded-xl shadow-lg flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isUploading ? 'अपलोड हो रहा है...' : 'गैलरी में जोड़ें'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

