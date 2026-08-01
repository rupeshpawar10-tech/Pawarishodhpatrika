
export type SupportedModule = 
  | 'dictionary' 
  | 'corpus' 
  | 'lokgeet' 
  | 'history' 
  | 'papers' 
  | 'books' 
  | 'media' 
  | 'persons' 
  | 'places' 
  | 'organizations' 
  | 'collections'
  | 'citations'
  | 'knowledge_graph';

export type CitationStyle = 
  | 'apa7' 
  | 'mla9' 
  | 'chicago_author_date' 
  | 'chicago_notes' 
  | 'harvard' 
  | 'ieee' 
  | 'bibtex' 
  | 'ris' 
  | 'csl_json' 
  | 'dublin_core';

export type IdentifierType = 'doi' | 'isbn' | 'issn' | 'orcid' | 'ror' | 'internal' | 'url';

export interface ResearchIdentifier {
  id: string;
  type: IdentifierType;
  value: string;
  verified: boolean;
}

export interface AuthorContributor {
  id: string;
  name: string;
  role: 'author' | 'editor' | 'translator' | 'collector' | 'field_researcher' | 'performer' | 'organization';
  orcid?: string;
  affiliation?: string;
}

export interface CitationRecord {
  citationId: string; // e.g. CIT-000001
  persistentId: string; // e.g. PAPER-000041
  module: SupportedModule;
  recordId: string;
  title: string;
  subtitle?: string;
  authors: AuthorContributor[];
  publisher?: string;
  institution?: string;
  publicationDate: string;
  language: string;
  version?: number;
  edition?: string;
  identifiers: ResearchIdentifier[];
  license?: string;
  url?: string;
  accessDate?: string;
  keywords: string[];
  abstract?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// 2. Relation Engine
export type RelationType =
  | 'related_to'
  | 'variant_of'
  | 'translation_of'
  | 'derived_from'
  | 'mentions'
  | 'collected_by'
  | 'recorded_by'
  | 'performed_by'
  | 'lives_in'
  | 'located_in'
  | 'part_of'
  | 'same_as'
  | 'parent_of'
  | 'child_of'
  | 'references'
  | 'cites'
  | 'supports'
  | 'contradicts'
  | 'uses'
  | 'inspired_by'
  | 'ancestor_of'
  | 'descendant_of'
  | 'created_by'
  | 'edited_by'
  | 'verified_by';

export type RelationStatus = 'draft' | 'review' | 'approved' | 'published';

export interface RelationRecord {
  relationId: string; // REL-00001
  sourceModule: SupportedModule;
  sourceRecordId: string;
  targetModule: SupportedModule;
  targetRecordId: string;
  relationType: RelationType;
  direction: 'bidirectional' | 'source_to_target' | 'target_to_source';
  confidenceScore: number; // 0 to 100
  notes?: string;
  status: RelationStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 3. Controlled Vocabulary
export type VocabularyType =
  | 'languages'
  | 'dialects'
  | 'genres'
  | 'part_of_speech'
  | 'semantic_domains'
  | 'usage_labels'
  | 'registers'
  | 'grammatical_categories'
  | 'script'
  | 'districts'
  | 'villages'
  | 'communities'
  | 'organizations'
  | 'relation_types'
  | 'publication_types'
  | 'research_methods'
  | 'collection_types'
  | 'ritual_types'
  | 'festival_types'
  | 'source_types'
  | 'media_types'
  | 'file_types'
  | 'license_types'
  | 'access_levels'
  | 'workflow_status'
  | 'tags'
  | 'keywords'
  | 'custom_lists';

export interface MultilingualLabel {
  hi: string;
  en: string;
  paw?: string;
  mr?: string;
}

export interface VocabularyRecord {
  vocabularyId: string; // VOC-0001
  type: VocabularyType;
  code: string;
  label: MultilingualLabel;
  description?: MultilingualLabel;
  parentId?: string; // For tree structure
  sortOrder: number;
  status: 'draft' | 'review' | 'approved' | 'archived';
  icon?: string;
  color?: string;
  isSystem: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 4. Background Job Queue
export type JobType =
  | 'search_reindex'
  | 'knowledge_graph_update'
  | 'corpus_processing'
  | 'dictionary_rebuild'
  | 'thumbnail_generation'
  | 'pdf_generation'
  | 'zip_export'
  | 'csv_export'
  | 'excel_export'
  | 'audio_waveform'
  | 'video_processing'
  | 'ocr'
  | 'speech_to_text'
  | 'translation'
  | 'ai_processing'
  | 'backup'
  | 'restore'
  | 'import'
  | 'large_upload'
  | 'quality_scan'
  | 'duplicate_detection'
  | 'citation_generation'
  | 'statistics_rebuild';

export type JobStatus = 'queued' | 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled' | 'retrying';
export type JobPriority = 'critical' | 'high' | 'normal' | 'low';

export interface JobRecord {
  jobId: string; // JOB-0001
  jobType: JobType;
  module: SupportedModule;
  recordId?: string;
  priority: JobPriority;
  status: JobStatus;
  progress: number; // 0 to 100
  startedAt?: string;
  finishedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  error?: string;
  retryCount: number;
  logs: Array<{ timestamp: string; message: string; level: 'info' | 'warn' | 'error' }>;
}
