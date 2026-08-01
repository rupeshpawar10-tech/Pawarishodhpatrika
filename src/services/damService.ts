import { MediaAsset, DAMModule, SecurityLevel, DAMFileCategory } from '../types/dam';

const DAM_STORAGE_KEY = 'pawari_enterprise_dam_assets_v1';

const INITIAL_DAM_ASSETS: MediaAsset[] = [
  {
    mediaId: 'asset-101',
    module: 'papers',
    recordId: 'p-1',
    fileName: 'Satpura_Linguistic_Evolution_2026.pdf',
    originalFileName: 'Satpura Linguistic Evolution & Dialect Survey 2026.pdf',
    storagePath: '/papers/Satpura_Linguistic_Evolution_2026.pdf',
    downloadURL: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    mimeType: 'application/pdf',
    extension: 'pdf',
    category: 'document',
    size: 4520910,
    checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    language: 'multi',
    status: 'active',
    uploadedBy: 'Dr. R. K. Pawar',
    createdAt: '2026-07-10T09:30:00Z',
    updatedAt: '2026-07-10T09:30:00Z',
    tags: ['linguistics', 'satpura', 'dialects', 'grammar'],
    categories: ['Research Paper', 'Survey'],
    collections: ['Annual Journal 2026'],
    projects: ['Tapti Valley Linguistic Mapping'],
    security: 'public',
    version: 1,
    previousVersions: [],
    virusScanStatus: 'passed'
  },
  {
    mediaId: 'asset-102',
    module: 'lokgeet',
    recordId: 'l-1',
    fileName: 'Vivah_Mangal_Geet_Tapti.mp3',
    originalFileName: 'Vivah Mangal Geet - Traditional Multai.mp3',
    storagePath: '/lokgeet/audio/Vivah_Mangal_Geet_Tapti.mp3',
    downloadURL: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    mimeType: 'audio/mpeg',
    extension: 'mp3',
    category: 'audio',
    size: 6120400,
    checksum: '8f921d7bfa548c8227d14f479a0cf5828decd22b0f492b4535359a3c9e6c4331',
    duration: 245,
    language: 'paw',
    status: 'active',
    uploadedBy: 'Sitaram Pawar',
    createdAt: '2026-07-12T14:15:00Z',
    updatedAt: '2026-07-12T14:15:00Z',
    tags: ['lokgeet', 'vivah', 'folklore', 'multai'],
    categories: ['Audio Archive', 'Folk Music'],
    collections: ['Tapti Lokgeet Collection'],
    projects: ['Oral Tradition Preservation'],
    security: 'public',
    version: 1,
    previousVersions: [],
    virusScanStatus: 'passed'
  },
  {
    mediaId: 'asset-103',
    module: 'dictionary',
    recordId: 'd-1',
    fileName: 'Pawari_Phonetic_A_Audio.mp3',
    originalFileName: 'Pawari Word Pronunciation - A (अ).mp3',
    storagePath: '/dictionary/audio/Pawari_Phonetic_A_Audio.mp3',
    downloadURL: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    mimeType: 'audio/mpeg',
    extension: 'mp3',
    category: 'audio',
    size: 142000,
    checksum: 'a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
    duration: 3,
    language: 'paw',
    status: 'active',
    uploadedBy: 'Prof. Anant Deshmukh',
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z',
    tags: ['phonetics', 'dictionary', 'pronunciation'],
    categories: ['Phoneme Audio'],
    collections: ['Pawari Lexicon 2026'],
    projects: ['Digital Lexicography'],
    security: 'public',
    version: 1,
    previousVersions: [],
    virusScanStatus: 'passed'
  },
  {
    mediaId: 'asset-104',
    module: 'history',
    recordId: 'h-1',
    fileName: 'Parmar_Dynasty_Copper_Plate_Grant.jpg',
    originalFileName: 'Parmar Copper Plate Grant 12th Century Multai.jpg',
    storagePath: '/history/images/Parmar_Dynasty_Copper_Plate_Grant.jpg',
    downloadURL: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    mimeType: 'image/jpeg',
    extension: 'jpg',
    category: 'image',
    size: 3840100,
    checksum: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    width: 2400,
    height: 1600,
    language: 'multi',
    status: 'active',
    uploadedBy: 'Dr. R. K. Pawar',
    createdAt: '2026-06-18T11:20:00Z',
    updatedAt: '2026-06-18T11:20:00Z',
    tags: ['parmar', 'copperplate', 'inscription', 'history'],
    categories: ['Historical Artifact', 'Manuscript'],
    collections: ['Maa Tapti Museum Archives'],
    projects: ['Multai Archaeological Survey'],
    security: 'protected',
    version: 1,
    previousVersions: [],
    virusScanStatus: 'passed'
  },
  {
    mediaId: 'asset-105',
    module: 'books',
    recordId: 'b-1',
    fileName: 'Satpura_Kavya_Sangrah_1920.pdf',
    originalFileName: 'Satpura Kavya Sangrah Rare Book 1920.pdf',
    storagePath: '/books/Satpura_Kavya_Sangrah_1920.pdf',
    downloadURL: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    mimeType: 'application/pdf',
    extension: 'pdf',
    category: 'document',
    size: 18902000,
    checksum: 'fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
    language: 'hi',
    status: 'active',
    uploadedBy: 'Editor Board',
    createdAt: '2026-05-10T15:00:00Z',
    updatedAt: '2026-05-10T15:00:00Z',
    tags: ['rarebook', 'poetry', 'satpura', '1920'],
    categories: ['Monograph', 'Poetry'],
    collections: ['Rare Manuscript Library'],
    projects: ['Heritage Digitization'],
    security: 'research_only',
    version: 1,
    previousVersions: [],
    virusScanStatus: 'passed'
  },
  {
    mediaId: 'asset-106',
    module: 'corpus',
    recordId: 'c-1',
    fileName: 'Tapti_Valley_Field_Interview_04.mp4',
    originalFileName: 'Tapti Valley Elders Folklore Interview 04.mp4',
    storagePath: '/corpus/video/Tapti_Valley_Field_Interview_04.mp4',
    downloadURL: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    mimeType: 'video/mp4',
    extension: 'mp4',
    category: 'video',
    size: 89400000,
    checksum: '99887766554433221100aabbccddeeff99887766554433221100aabbccddeeff',
    duration: 612,
    width: 1920,
    height: 1080,
    language: 'paw',
    status: 'active',
    uploadedBy: 'Field Researcher A',
    createdAt: '2026-07-05T16:45:00Z',
    updatedAt: '2026-07-05T16:45:00Z',
    tags: ['corpus', 'interview', 'video', 'elders'],
    categories: ['Field Recording', 'Video Corpus'],
    collections: ['Living Oral Corpus 2026'],
    projects: ['Audio-Visual Corpus Project'],
    security: 'research_only',
    version: 1,
    previousVersions: [],
    virusScanStatus: 'passed'
  },
  {
    mediaId: 'asset-107',
    module: 'reports',
    recordId: 'r-1',
    fileName: 'Annual_Research_Grant_Utilization_2025.xlsx',
    originalFileName: 'Annual Research Grant Utilization 2025 Final.xlsx',
    storagePath: '/exports/Annual_Research_Grant_Utilization_2025.xlsx',
    downloadURL: '#',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extension: 'xlsx',
    category: 'data',
    size: 1420500,
    checksum: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    language: 'en',
    status: 'active',
    uploadedBy: 'Admin Treasurer',
    createdAt: '2026-04-01T08:00:00Z',
    updatedAt: '2026-04-01T08:00:00Z',
    tags: ['grant', 'finance', 'report', '2025'],
    categories: ['Financial Report'],
    collections: ['Administrative Reports'],
    projects: ['Institutional Management'],
    security: 'admin_only',
    version: 1,
    previousVersions: [],
    virusScanStatus: 'passed'
  }
];

export const DAMService = {
  getAssets(): MediaAsset[] {
    try {
      const data = localStorage.getItem(DAM_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(DAM_STORAGE_KEY, JSON.stringify(INITIAL_DAM_ASSETS));
        return INITIAL_DAM_ASSETS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error loading DAM assets', e);
      return INITIAL_DAM_ASSETS;
    }
  },

  saveAssets(assets: MediaAsset[]): void {
    try {
      localStorage.setItem(DAM_STORAGE_KEY, JSON.stringify(assets));
      window.dispatchEvent(new Event('dam_assets_change'));
    } catch (e) {
      console.error('Error saving DAM assets', e);
    }
  },

  addAsset(asset: MediaAsset): void {
    const assets = this.getAssets();
    assets.unshift(asset);
    this.saveAssets(assets);
  },

  updateAsset(updated: MediaAsset): void {
    const assets = this.getAssets();
    const idx = assets.findIndex(a => a.mediaId === updated.mediaId);
    if (idx >= 0) {
      assets[idx] = { ...updated, updatedAt: new Date().toISOString() };
      this.saveAssets(assets);
    }
  },

  deleteAsset(mediaId: string, permanent: boolean = false): void {
    let assets = this.getAssets();
    if (permanent) {
      assets = assets.filter(a => a.mediaId !== mediaId);
    } else {
      assets = assets.map(a => a.mediaId === mediaId ? { ...a, status: 'soft_deleted' as const, updatedAt: new Date().toISOString() } : a);
    }
    this.saveAssets(assets);
  },

  restoreAsset(mediaId: string): void {
    const assets = this.getAssets().map(a => a.mediaId === mediaId ? { ...a, status: 'active' as const, updatedAt: new Date().toISOString() } : a);
    this.saveAssets(assets);
  },

  archiveAsset(mediaId: string): void {
    const assets = this.getAssets().map(a => a.mediaId === mediaId ? { ...a, status: 'archived' as const, updatedAt: new Date().toISOString() } : a);
    this.saveAssets(assets);
  },

  calculateStorageUsage(): { totalBytes: number; byModule: Record<string, number>; byCategory: Record<string, number> } {
    const assets = this.getAssets().filter(a => a.status !== 'soft_deleted');
    let totalBytes = 0;
    const byModule: Record<string, number> = {};
    const byCategory: Record<string, number> = {};

    for (const a of assets) {
      totalBytes += a.size;
      byModule[a.module] = (byModule[a.module] || 0) + a.size;
      byCategory[a.category] = (byCategory[a.category] || 0) + a.size;
    }

    return { totalBytes, byModule, byCategory };
  },

  generateChecksum(file: File): Promise<string> {
    return new Promise((resolve) => {
      // Simulate fast sha256 checksum based on file properties & name + size
      const str = `${file.name}_${file.size}_${file.lastModified}`;
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
      }
      const hex = Math.abs(hash).toString(16).padStart(8, '0');
      resolve(`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852${hex}`);
    });
  },

  getStorageFolderForModule(module: DAMModule, mimeType: string): string {
    switch (module) {
      case 'papers': return '/papers/';
      case 'books': return '/books/';
      case 'dictionary':
        return mimeType.startsWith('audio') ? '/dictionary/audio/' : '/dictionary/images/';
      case 'corpus':
        if (mimeType.startsWith('audio')) return '/corpus/audio/';
        if (mimeType.startsWith('video')) return '/corpus/video/';
        return '/corpus/transcripts/';
      case 'lokgeet':
        if (mimeType.startsWith('audio')) return '/lokgeet/audio/';
        if (mimeType.startsWith('video')) return '/lokgeet/video/';
        return '/lokgeet/images/';
      case 'history':
        return mimeType.startsWith('image') ? '/history/images/' : '/history/documents/';
      case 'media': return '/media/';
      case 'reports':
      case 'exports': return '/exports/';
      default: return '/temp/';
    }
  }
};
