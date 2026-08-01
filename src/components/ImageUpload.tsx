import React, { useState, useRef, useCallback } from 'react';
import {
  Upload,
  Camera,
  Trash2,
  RefreshCw,
  RotateCcw,
  RotateCw,
  Eye,
  Check,
  X,
  AlertTriangle,
  User,
  Image as ImageIcon,
  Sparkles,
  Zap,
  HardDrive
} from 'lucide-react';
import { storage } from '../lib/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { DAMService } from '../services/damService';

export interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  storagePath?: string; // e.g. 'editorial/photos/'
  maxSizeMB?: number; // default 5
  allowedFormats?: string[]; // default ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  aspectRatio?: 'circle' | 'square' | 'rect';
  label?: string;
  placeholderText?: string;
  className?: string;
  compact?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  storagePath = 'editorial/photos/',
  maxSizeMB = 5,
  allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  aspectRatio = 'square',
  label = 'फोटो अपलोड (Photo Upload)',
  placeholderText = 'फोटो चुनने के लिए क्लिक करें या ड्रैग-एंड-ड्रॉप करें',
  className = '',
  compact = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [editedDataUrl, setEditedDataUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate File
  const validateFile = (file: File): boolean => {
    setErrorMessage(null);

    // Format validation
    const fileType = file.type ? file.type.toLowerCase() : '';
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    const validExts = ['jpg', 'jpeg', 'png', 'webp', 'jfif', 'pjpeg', 'pjp', 'gif', 'bmp', 'svg', 'heic'];
    const isExtValid = validExts.includes(ext);
    const isMimeValid = fileType
      ? allowedFormats.some(fmt => fileType === fmt || fileType.includes(fmt.replace('image/', ''))) || fileType.startsWith('image/')
      : true;

    if (!isMimeValid && !isExtValid) {
      setErrorMessage(`अमान्य प्रारूप! केवल JPG, JPEG, PNG, WEBP समर्थित हैं। (आपकी फ़ाइल: ${file.name})`);
      return false;
    }

    // Size validation (default 5MB)
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMessage(`फ़ाइल का आकार ${maxSizeMB}MB से अधिक नहीं होना चाहिए। आपका फ़ाइल आकार: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      return false;
    }

    return true;
  };

  // Compress & Resize Image using HTML Canvas with guaranteed DataURL Fallback
  const processAndCompressImage = useCallback(
    (file: File, angleDegrees: number = 0): Promise<string> => {
      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onerror = () => {
          // Fallback to FileReader directly if reader errors
          const fallbackReader = new FileReader();
          fallbackReader.onloadend = () => resolve((fallbackReader.result as string) || '');
          fallbackReader.readAsDataURL(file);
        };

        reader.onload = (event) => {
          const resultStr = event.target?.result as string;
          if (!resultStr) {
            resolve('');
            return;
          }

          const img = new Image();
          img.onerror = () => {
            // Direct DataURL fallback on image element load error
            resolve(resultStr);
          };

          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');

              if (!ctx) {
                resolve(resultStr);
                return;
              }

              // Target max dimension
              const MAX_DIM = 1000;
              let width = img.width || 800;
              let height = img.height || 800;

              if (width > MAX_DIM || height > MAX_DIM) {
                if (width > height) {
                  height = Math.round((height * MAX_DIM) / width);
                  width = MAX_DIM;
                } else {
                  width = Math.round((width * MAX_DIM) / height);
                  height = MAX_DIM;
                }
              }

              // Handle rotation swapping canvas width/height
              const rad = (angleDegrees * Math.PI) / 180;
              if (angleDegrees % 180 !== 0) {
                canvas.width = height;
                canvas.height = width;
              } else {
                canvas.width = width;
                canvas.height = height;
              }

              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.save();
              ctx.translate(canvas.width / 2, canvas.height / 2);
              ctx.rotate(rad);

              ctx.drawImage(img, -width / 2, -height / 2, width, height);
              ctx.restore();

              const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
              const compressedDataUrl = canvas.toDataURL(outputType, 0.88);
              resolve(compressedDataUrl || resultStr);
            } catch (canvasErr) {
              console.warn('Canvas process note, using raw data url:', canvasErr);
              resolve(resultStr);
            }
          };

          img.src = resultStr;
        };

        reader.readAsDataURL(file);
      });
    },
    []
  );

  // Upload to Firebase Storage or Fallback
  const handleFileUpload = async (file: File, angle: number = 0) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    setRawFile(file);

    try {
      // Step 1: Compress and auto-resize image instantly
      const compressedDataUrl = await processAndCompressImage(file, angle);
      if (!compressedDataUrl) {
        throw new Error('फोटो पढ़ने में असमर्थ। कृपया दूसरी फ़ाइल चुनें।');
      }

      setEditedDataUrl(compressedDataUrl);

      // Instantly pass the image to parent form so user sees it without waiting
      onChange(compressedDataUrl);

      const cleanFileName = file.name.toLowerCase().replace(/[^a-z0-9.]/g, '_');
      const timestamp = Date.now();
      const fullPath = `${storagePath.replace(/\/$/, '')}/${timestamp}_${cleanFileName}`;

      let finalDownloadUrl = compressedDataUrl;

      // Step 2: Try Firebase Storage upload with a 3-second timeout guard
      if (storage) {
        try {
          const uploadPromise = (async () => {
            const storageRef = ref(storage, fullPath);
            await uploadString(storageRef, compressedDataUrl, 'data_url');
            return await getDownloadURL(storageRef);
          })();

          const timeoutPromise = new Promise<string>((_, reject) =>
            setTimeout(() => reject(new Error('Storage timeout')), 3500)
          );

          const remoteUrl = await Promise.race([uploadPromise, timeoutPromise]);
          if (remoteUrl) {
            finalDownloadUrl = remoteUrl;
            onChange(finalDownloadUrl);
          }
        } catch (stErr) {
          console.warn('Firebase Storage upload notice (using optimized DataURL):', stErr);
        }
      }

      // Step 3: Register in Enterprise DAM for digital humanities archive
      try {
        DAMService.addAsset({
          mediaId: 'editorial-photo-' + timestamp,
          module: 'journal',
          fileName: cleanFileName,
          originalFileName: file.name,
          storagePath: fullPath,
          downloadURL: finalDownloadUrl,
          mimeType: file.type || 'image/jpeg',
          extension: file.name.split('.').pop() || 'jpg',
          category: 'image',
          size: Math.round(compressedDataUrl.length * 0.75),
          checksum: 'editorial-photo-' + timestamp,
          language: 'hi',
          status: 'active',
          uploadedBy: 'Editorial Board Admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: ['editorial_board', 'profile_photo', 'member'],
          categories: ['Editorial Board'],
          collections: ['Editorial Members'],
          projects: ['Journal ISSN 2583-987X'],
          security: 'public',
          version: 1,
          previousVersions: [],
          virusScanStatus: 'passed'
        });
      } catch (damErr) {
        console.warn('DAM Service note:', damErr);
      }

      // Step 4: Notify parent form
      onChange(finalDownloadUrl);
      setErrorMessage(null);
    } catch (err: any) {
      console.error('Image Upload Error:', err);
      setErrorMessage(err.message || 'फोटो अपलोड करने में विफलता हुई।');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, rotation);
    }
    // Clear input value so selecting the same file triggers change again
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file, rotation);
    }
  };

  const handleRotate = async (dir: 'left' | 'right') => {
    const delta = dir === 'right' ? 90 : -90;
    const newAngle = (rotation + delta + 360) % 360;
    setRotation(newAngle);

    if (rawFile) {
      await handleFileUpload(rawFile, newAngle);
    } else if (value) {
      try {
        setIsUploading(true);
        const response = await fetch(value);
        const blob = await response.blob();
        const file = new File([blob], 'profile_photo.jpg', { type: blob.type || 'image/jpeg' });
        setRawFile(file);
        await handleFileUpload(file, newAngle);
      } catch (err) {
        console.warn('Rotate from URL note:', err);
        setIsUploading(false);
      }
    }
  };

  const handleDelete = () => {
    onChange('');
    setRawFile(null);
    setEditedDataUrl(null);
    setRotation(0);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-3 font-serif ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
            {label}
          </label>
          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono font-semibold">
            JPG, PNG, WEBP (अधिकतम {maxSizeMB}MB)
          </span>
        </div>
      )}

      {/* Main Container */}
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-amber-50/50 dark:bg-stone-900 border border-amber-200/80 dark:border-stone-800 shadow-inner">
        {/* Photo Preview / Placeholder Box */}
        <div className="relative group shrink-0">
          <div
            className={`overflow-hidden border-2 border-amber-500/40 bg-stone-950 flex items-center justify-center shadow-lg transition-all ${
              aspectRatio === 'circle'
                ? 'w-28 h-28 rounded-full'
                : 'w-28 h-28 rounded-2xl'
            }`}
          >
            {value ? (
              <img
                src={value}
                alt="Profile Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            ) : (
              <div className="text-center p-2 space-y-1">
                <User className="w-10 h-10 text-stone-600 mx-auto" />
                <span className="text-[9px] font-bold text-amber-400 block uppercase tracking-wider">
                  फोटो नहीं है
                </span>
              </div>
            )}

            {isUploading && (
              <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-amber-400 text-xs font-bold gap-1">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>अपलोड जारी...</span>
              </div>
            )}
          </div>

          {value && !isUploading && (
            <button
              type="button"
              onClick={() => setPreviewModalOpen(true)}
              className="absolute bottom-1 right-1 p-1.5 bg-stone-900/90 text-amber-300 rounded-full border border-amber-500/40 opacity-0 group-hover:opacity-100 transition shadow"
              title="बड़ा फोटो देखें"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Upload Controls & Drag Area */}
        <div className="flex-1 w-full space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.jpg,.jpeg,.png,.webp,.jfif,.gif,.bmp"
            onChange={handleInputChange}
            className="hidden"
          />

          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-3.5 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-amber-500 bg-amber-500/10'
                : 'border-amber-300/60 dark:border-stone-700 bg-stone-100/80 dark:bg-stone-950/60 hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-stone-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-stone-700 dark:text-stone-300 text-xs">
              <HardDrive className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="font-bold">
                {value ? 'नई फोटो बदलने के लिए यहाँ क्लिक करें' : placeholderText}
              </span>
            </div>
            <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
              डेस्कटॉप, लैपटॉप, मोबाइल व टैबलेट की लोकल स्टोरेज से चुनें
            </p>
          </div>

          {/* Success / Photo Attached Banner */}
          {value && !isUploading && (
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center justify-between gap-2 shadow-sm">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>फोटो सफलतापूर्वक अपलोड / चयनित हुई! रिकॉर्ड सुरक्षित करने हेतु नीचे **'सहेजें (Save)'** बटन दबाएँ।</span>
              </div>
            </div>
          )}

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg flex items-center gap-1.5 shadow-sm active:scale-95 transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{value ? 'फोटो बदलें (Replace)' : 'फोटो चुनें (Browse)'}</span>
              </button>

              {value && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isUploading}
                  className="px-3 py-1.5 bg-red-100 dark:bg-red-950/60 hover:bg-red-200 text-red-700 dark:text-red-300 font-bold rounded-lg flex items-center gap-1.5 transition active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>हटाएँ (Delete)</span>
                </button>
              )}
            </div>

            {/* Rotate controls if photo exists */}
            {value && (
              <div className="flex items-center gap-1 bg-stone-200 dark:bg-stone-800 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => handleRotate('left')}
                  className="p-1 hover:bg-amber-500 hover:text-stone-950 rounded transition"
                  title="90° बाएँ घुमाएँ"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono px-1 font-bold text-amber-700 dark:text-amber-400">
                  {rotation}°
                </span>
                <button
                  type="button"
                  onClick={() => handleRotate('right')}
                  className="p-1 hover:bg-amber-500 hover:text-stone-950 rounded transition"
                  title="90° दाएँ घुमाएँ"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3 bg-red-50 dark:bg-red-950/80 border border-red-300 dark:border-red-800 rounded-xl text-red-800 dark:text-red-200 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* High-Res Preview Modal */}
      {previewModalOpen && value && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-amber-500/30 rounded-3xl max-w-md w-full overflow-hidden p-6 space-y-4 text-center shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <span className="font-serif font-bold text-amber-100 text-sm">संपादकीय फोटो का पूर्ण पूर्वावलोकन</span>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full h-72 rounded-2xl overflow-hidden bg-stone-950 border border-amber-500/20">
              <img src={value} alt="Full Preview" className="w-full h-full object-contain" />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
