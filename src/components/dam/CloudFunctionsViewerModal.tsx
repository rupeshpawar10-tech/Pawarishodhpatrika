import React, { useState } from 'react';
import { X, Code, Database, Shield, Server, FileText, Check } from 'lucide-react';

interface CloudFunctionsViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudFunctionsViewerModal: React.FC<CloudFunctionsViewerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'functions' | 'firestoreRules' | 'storageRules'>('schema');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getSchemaCode = () => `// FIRESTORE MEDIA COLLECTION SCHEMA
export interface MediaMetadataDocument {
  mediaId: string;
  module: 'journal' | 'dictionary' | 'corpus' | 'lokgeet' | 'history' | 'books' | 'media' | 'papers' | 'reports' | 'exports';
  recordId?: string;
  fileName: string;
  originalFileName: string;
  storagePath: string; // e.g. /papers/Satpura_Research.pdf
  downloadURL: string;
  mimeType: string;
  extension: string;
  size: number;
  checksum: string; // SHA-256
  thumbnail?: string;
  duration?: number;
  width?: number;
  height?: number;
  language: 'hi' | 'en' | 'paw' | 'multi';
  status: 'active' | 'archived' | 'soft_deleted' | 'processing' | 'quarantined';
  uploadedBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  tags: string[];
  categories: string[];
  collections: string[];
  projects: string[];
  security: 'public' | 'protected' | 'private' | 'research_only' | 'admin_only' | 'super_admin_only';
  version: number;
  previousVersions: Array<{
    version: number;
    storagePath: string;
    downloadURL: string;
    size: number;
    checksum: string;
    createdAt: Timestamp;
  }>;
}`;

  const getFunctionsCode = () => `/**
 * ENTERPRISE DAM CLOUD FUNCTIONS (Node.js / TypeScript)
 */
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage();

// 1. On File Upload Trigger: Generate Thumbnail & Checksum
export const onMediaUploaded = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  const contentType = object.contentType;
  
  if (!filePath || filePath.startsWith('temp/')) return null;

  // Extract module from path prefix
  const pathSegments = filePath.split('/');
  const moduleName = pathSegments[0] || 'media';

  console.log(\`Processing uploaded asset in module \${moduleName}: \${filePath}\`);

  // Create or update Firestore metadata record
  const mediaRef = db.collection('media').doc();
  await mediaRef.set({
    mediaId: mediaRef.id,
    module: moduleName,
    storagePath: \`/\${filePath}\`,
    downloadURL: \`https://firebasestorage.googleapis.com/v0/b/\${object.bucket}/o/\${encodeURIComponent(filePath)}?alt=media\`,
    mimeType: contentType || 'application/octet-stream',
    size: Number(object.size),
    status: 'active',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return null;
});`;

  const getFirestoreRules = () => `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Media metadata collection rules
    match /media/{mediaId} {
      allow read: if resource.data.security == 'public' || 
                    (resource.data.security == 'protected' && request.auth != null) ||
                    (resource.data.security == 'research_only' && request.auth != null && request.auth.token.role in ['research_scholar', 'editor', 'admin', 'super_admin']) ||
                    (resource.data.security == 'admin_only' && request.auth != null && request.auth.token.role in ['admin', 'super_admin']) ||
                    (resource.data.security == 'super_admin_only' && request.auth != null && request.auth.token.role == 'super_admin');
      
      allow create: if request.auth != null;
      allow update: if request.auth != null && (request.auth.token.role in ['editor', 'admin', 'super_admin'] || resource.data.uploadedBy == request.auth.token.email);
      allow delete: if request.auth != null && request.auth.token.role == 'super_admin';
    }
  }
}`;

  const getStorageRules = () => `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public folders
    match /papers/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /books/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /dictionary/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /corpus/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /lokgeet/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /history/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /media/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /exports/{allPaths=**} {
      allow read: if request.auth != null && request.auth.token.role in ['admin', 'super_admin'];
      allow write: if request.auth != null;
    }
  }
}`;

  const getActiveCode = () => {
    switch (activeTab) {
      case 'schema': return getSchemaCode();
      case 'functions': return getFunctionsCode();
      case 'firestoreRules': return getFirestoreRules();
      case 'storageRules': return getStorageRules();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-100">क्लाउड फंक्शन्स, स्कीमा एवं सुरक्षा नियम (Cloud Architecture)</h3>
              <p className="text-xs text-stone-400 font-mono">Firebase Storage & Firestore Production Specifications</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 bg-stone-950/50 border-b border-stone-800 flex gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-4 py-2.5 rounded-t-xl transition border-t border-x ${
              activeTab === 'schema'
                ? 'bg-stone-900 border-stone-700 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Firestore Schema
          </button>
          <button
            onClick={() => setActiveTab('functions')}
            className={`px-4 py-2.5 rounded-t-xl transition border-t border-x ${
              activeTab === 'functions'
                ? 'bg-stone-900 border-stone-700 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Cloud Functions
          </button>
          <button
            onClick={() => setActiveTab('firestoreRules')}
            className={`px-4 py-2.5 rounded-t-xl transition border-t border-x ${
              activeTab === 'firestoreRules'
                ? 'bg-stone-900 border-stone-700 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Firestore Rules
          </button>
          <button
            onClick={() => setActiveTab('storageRules')}
            className={`px-4 py-2.5 rounded-t-xl transition border-t border-x ${
              activeTab === 'storageRules'
                ? 'bg-stone-900 border-stone-700 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Storage Rules
          </button>
        </div>

        {/* Code Content */}
        <div className="p-6 bg-stone-950 flex-1 overflow-y-auto">
          <pre className="text-xs font-mono text-amber-200/90 whitespace-pre-wrap leading-relaxed">
            {getActiveCode()}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stone-800 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-xl flex items-center gap-2 text-xs transition"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Code className="w-4 h-4" />}
            <span>{copied ? 'कोड कॉपी हो गया' : 'कोड क्लिपबोर्ड पर कॉपी करें'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs transition shadow"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
