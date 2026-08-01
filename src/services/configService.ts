import { FeatureFlag } from '../types/enterprisePlatform';

const STORAGE_KEY = 'satpura_feature_flags_v1';

const INITIAL_FLAGS: FeatureFlag[] = [
  { flagKey: 'enable_ai', name: 'Gemini AI Assistant & Synthesis', description: 'Enable advanced AI intelligence for research summaries and translations', enabled: true, beta: false, experimental: false, scope: 'global', rolloutPercentage: 100, updatedAt: new Date().toISOString(), updatedBy: 'admin@taaptiresearch.org' },
  { flagKey: 'enable_ocr', name: 'OCR & Manuscript Scanning', description: 'Enable automated optical character recognition for old manuscripts', enabled: true, beta: false, experimental: false, scope: 'module', rolloutPercentage: 100, updatedAt: new Date().toISOString(), updatedBy: 'admin@taaptiresearch.org' },
  { flagKey: 'enable_translation', name: 'Neural Translation Engine', description: 'Multi-dialect translation between Pawari, Hindi and English', enabled: true, beta: true, experimental: false, scope: 'global', rolloutPercentage: 100, updatedAt: new Date().toISOString(), updatedBy: 'admin@taaptiresearch.org' },
  { flagKey: 'enable_public_search', name: 'Public Enterprise Search', description: 'Global unified search across dictionary, corpus, books and archives', enabled: true, beta: false, experimental: false, scope: 'global', rolloutPercentage: 100, updatedAt: new Date().toISOString(), updatedBy: 'admin@taaptiresearch.org' },
  { flagKey: 'enable_citation_export', name: 'Multi-Format Citation Export', description: 'Export citations in APA, MLA, Chicago, BibTeX, RIS', enabled: true, beta: false, experimental: false, scope: 'global', rolloutPercentage: 100, updatedAt: new Date().toISOString(), updatedBy: 'admin@taaptiresearch.org' },
  { flagKey: 'enable_knowledge_graph', name: 'Knowledge Graph Visualizer', description: 'Interactive graph visualization of entities, relations and genealogies', enabled: true, beta: false, experimental: true, scope: 'global', rolloutPercentage: 50, updatedAt: new Date().toISOString(), updatedBy: 'admin@taaptiresearch.org' },
  { flagKey: 'enable_media_upload', name: 'Digital Asset Media Upload', description: 'High-capacity audio/video/document upload with chunking', enabled: true, beta: false, experimental: false, scope: 'role', rolloutPercentage: 100, updatedAt: new Date().toISOString(), updatedBy: 'admin@taaptiresearch.org' },
  { flagKey: 'enable_bulk_import', name: 'Bulk Data Import (CSV/JSON)', description: 'Batch ingestion tools for archival researchers', enabled: true, beta: true, experimental: true, scope: 'role', rolloutPercentage: 25, updatedAt: new Date().toISOString(), updatedBy: 'admin@taaptiresearch.org' },
];

export const ConfigService = {
  getFlags: (): FeatureFlag[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FLAGS));
        return INITIAL_FLAGS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_FLAGS;
    }
  },

  toggleFlag: (flagKey: string): FeatureFlag[] => {
    const list = ConfigService.getFlags();
    const flag = list.find(f => f.flagKey === flagKey);
    if (flag) {
      flag.enabled = !flag.enabled;
      flag.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event('flags_changed'));
    }
    return list;
  },

  updateRollout: (flagKey: string, rolloutPercentage: number): FeatureFlag[] => {
    const list = ConfigService.getFlags();
    const flag = list.find(f => f.flagKey === flagKey);
    if (flag) {
      flag.rolloutPercentage = rolloutPercentage;
      flag.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event('flags_changed'));
    }
    return list;
  }
};
