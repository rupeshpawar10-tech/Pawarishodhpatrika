export type DAMModule = 
  | 'journal' 
  | 'dictionary' 
  | 'corpus' 
  | 'lokgeet' 
  | 'history' 
  | 'books' 
  | 'media' 
  | 'papers' 
  | 'reports' 
  | 'exports';

export type DAMFileType = 'PDF' | 'DOCX' | 'TXT' | 'CSV' | 'XLSX' | 'ZIP' | 'JSON' | 'XML' | 'JPG' | 'PNG' | 'WEBP' | 'SVG' | 'MP3' | 'WAV' | 'FLAC' | 'MP4' | 'WEBM' | 'MOV';

export type DAMFileCategory = 'image' | 'document' | 'audio' | 'video' | 'archive' | 'data';

export type DAMFileStatus = 'active' | 'archived' | 'soft_deleted' | 'processing' | 'quarantined' | 'duplicate';

export type SecurityLevel = 'public' | 'protected' | 'private' | 'research_only' | 'admin_only' | 'super_admin_only';

export interface MediaVersion {
  version: number;
  storagePath: string;
  downloadURL: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
  checksum: string;
}

export interface MediaAsset {
  mediaId: string;
  module: DAMModule;
  recordId?: string; // Linked record ID in respective module
  fileName: string;
  originalFileName: string;
  storagePath: string; // e.g. /papers/satpura_research.pdf
  downloadURL: string;
  mimeType: string;
  extension: string;
  category: DAMFileCategory;
  size: number; // in bytes
  checksum: string; // SHA-256 hash
  thumbnail?: string;
  duration?: number; // seconds for audio/video
  width?: number;
  height?: number;
  language: 'hi' | 'en' | 'paw' | 'multi';
  status: DAMFileStatus;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  categories: string[];
  collections: string[];
  projects: string[];
  security: SecurityLevel;
  version: number;
  previousVersions: MediaVersion[];
  virusScanStatus: 'passed' | 'scanning' | 'flagged' | 'clean';
  isDuplicate?: boolean;
  duplicateOf?: string;
}

export interface UploadTask {
  id: string;
  file: File;
  module: DAMModule;
  recordId?: string;
  security: SecurityLevel;
  tags: string[];
  language: 'hi' | 'en' | 'paw' | 'multi';
  progress: number; // 0 - 100
  status: 'queued' | 'uploading' | 'paused' | 'completed' | 'error' | 'cancelled';
  speed?: string;
  remainingTime?: string;
  errorMessage?: string;
  checksum?: string;
  downloadURL?: string;
}

export interface DAMFilterState {
  module: string;
  category: string;
  search: string;
  tag: string;
  language: string;
  security: string;
  status: string;
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
  sortBy: 'date_desc' | 'date_asc' | 'name_asc' | 'size_desc';
  viewMode: 'grid' | 'table' | 'folders';
}
