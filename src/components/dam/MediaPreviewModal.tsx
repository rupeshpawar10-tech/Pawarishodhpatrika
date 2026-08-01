import React, { useState } from 'react';
import { X, Download, FileText, Image as ImageIcon, Music, Video, Copy, Check, Eye, Shield, Tag, Calendar, User, HardDrive, Layers } from 'lucide-react';
import { MediaAsset } from '../../types/dam';

interface MediaPreviewModalProps {
  asset: MediaAsset | null;
  onClose: () => void;
}

export const MediaPreviewModal: React.FC<MediaPreviewModalProps> = ({ asset, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!asset) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(asset.downloadURL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              {asset.category === 'image' ? <ImageIcon className="w-5 h-5" /> :
               asset.category === 'audio' ? <Music className="w-5 h-5" /> :
               asset.category === 'video' ? <Video className="w-5 h-5" /> :
               <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-100 truncate max-w-md" title={asset.fileName}>
                {asset.fileName}
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                पथ (Storage Path): {asset.storagePath} • { (asset.size / (1024 * 1024)).toFixed(2) } MB
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Viewer Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-stone-950/50">
          <div className="bg-stone-950 rounded-2xl border border-stone-800 p-6 flex items-center justify-center min-h-[320px] relative overflow-hidden">
            {asset.category === 'image' && (
              <img
                src={asset.downloadURL}
                alt={asset.fileName}
                className="max-h-[360px] object-contain rounded-xl shadow-lg border border-stone-800"
              />
            )}

            {asset.category === 'audio' && (
              <div className="space-y-6 text-center w-full max-w-md">
                <div className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
                  <Music className="w-10 h-10 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-stone-100 text-sm mb-1">{asset.originalFileName}</h4>
                  <p className="text-xs text-stone-400 font-mono">ऑडियो प्लेयर (Audio Waveform Stream)</p>
                </div>
                {/* Simulated waveform bars */}
                <div className="flex items-center justify-center gap-1 h-12">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-amber-500/60 rounded-full transition-all duration-300"
                      style={{ height: `${Math.max(15, Math.sin(i * 0.5) * 40 + 25)}px` }}
                    />
                  ))}
                </div>
                <audio controls src={asset.downloadURL} className="w-full mt-4" />
              </div>
            )}

            {asset.category === 'video' && (
              <div className="w-full max-w-2xl space-y-3">
                <video controls src={asset.downloadURL} className="w-full max-h-[340px] rounded-xl shadow-lg border border-stone-800" />
              </div>
            )}

            {asset.category === 'document' && (
              <div className="w-full max-w-2xl bg-stone-900 p-6 rounded-xl border border-stone-800 space-y-4 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <span className="text-xs font-bold text-amber-400 uppercase">PDF / Document Viewer Preview</span>
                  <span className="text-xs font-mono text-stone-400">{(asset.size / 1024).toFixed(1)} KB</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed font-sans">
                  यह फ़ाइल Firebase Storage में सुरक्षित रूप से संगृहीत है। नीचे दिए गए बटन से आप मूल दस्तावेज़ डाउनलोड कर सकते हैं या शोध मॉड्यूल में देख सकते हैं।
                </p>
                <div className="p-4 bg-stone-950 rounded-lg border border-stone-800 text-xs font-mono text-amber-200/80">
                  Checksum (SHA-256): {asset.checksum}
                </div>
              </div>
            )}

            {asset.category !== 'image' && asset.category !== 'audio' && asset.category !== 'video' && asset.category !== 'document' && (
              <div className="text-center space-y-3">
                <FileText className="w-16 h-16 text-amber-400 mx-auto" />
                <h4 className="font-serif font-bold text-stone-200">{asset.fileName}</h4>
                <p className="text-xs text-stone-400">डेटा / आर्काइव फ़ाइल पूर्वावलोकन उपलब्ध है।</p>
              </div>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 space-y-1">
              <span className="text-stone-400 font-medium flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-amber-400" /> मॉड्यूल
              </span>
              <p className="font-serif font-bold text-stone-200 uppercase">{asset.module}</p>
            </div>

            <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 space-y-1">
              <span className="text-stone-400 font-medium flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-amber-400" /> सुरक्षा
              </span>
              <p className="font-serif font-bold text-stone-200 uppercase">{asset.security}</p>
            </div>

            <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 space-y-1">
              <span className="text-stone-400 font-medium flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-400" /> अपलोडर
              </span>
              <p className="font-serif font-bold text-stone-200">{asset.uploadedBy}</p>
            </div>

            <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 space-y-1">
              <span className="text-stone-400 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> दिनांक
              </span>
              <p className="font-serif font-bold text-stone-200 font-mono">{new Date(asset.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 space-y-2">
            <span className="text-xs text-stone-400 font-bold flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" /> टैग्स एवं कीवर्ड्स (Tags & Keywords)
            </span>
            <div className="flex flex-wrap gap-2">
              {asset.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-mono">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-stone-800 flex items-center justify-between">
          <button
            onClick={handleCopyUrl}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-xl flex items-center gap-2 text-xs transition"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'डाउनलोड लिंक कॉपी हो गया' : 'शेयर लिंक कॉपी करें'}</span>
          </button>

          <a
            href={asset.downloadURL}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl flex items-center gap-2 text-xs transition shadow"
          >
            <Download className="w-4 h-4" />
            <span>मूल फ़ाइल डाउनलोड करें</span>
          </a>
        </div>
      </div>
    </div>
  );
};
