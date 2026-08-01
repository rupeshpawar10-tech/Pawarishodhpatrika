import { UserRole, Language } from '../../types';

// ==========================================
// 1. EVENT SYSTEM TYPES
// ==========================================

export type SystemEventType =
  | 'PAPER_SUBMITTED'
  | 'PAPER_STATUS_CHANGED'
  | 'JOURNAL_ISSUE_PUBLISHED'
  | 'DICTIONARY_WORD_ADDED'
  | 'LOKGEET_ADDED'
  | 'GOTRA_ADDED'
  | 'DOCUMENT_ADDED'
  | 'EVENT_CREATED'
  | 'NEWS_PUBLISHED'
  | 'SITE_CONFIG_UPDATED'
  | 'CMS_LAYOUT_UPDATED'
  | 'ROLE_CHANGED'
  | 'USER_LOGIN'
  | 'AUDIT_LOGGED';

export interface SystemEventPayload<T = any> {
  id: string;
  type: SystemEventType;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  data: T;
  description: string;
}

export type EventCallback<T = any> = (event: SystemEventPayload<T>) => void;

// ==========================================
// 2. AUDIT LOG TYPES
// ==========================================

export type AuditSeverity = 'info' | 'warning' | 'critical';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: SystemEventType;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  resource: string;
  details: string;
  severity: AuditSeverity;
  ipAddress?: string;
}

// ==========================================
// 3. PERMISSION ENGINE TYPES
// ==========================================

export type ResourceDomain =
  | 'journal'
  | 'peer_review'
  | 'library'
  | 'linguistics'
  | 'culture'
  | 'sansthan'
  | 'cms'
  | 'users'
  | 'audit';

export type ActionType =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'publish'
  | 'review'
  | 'assign_reviewer'
  | 'manage_config'
  | 'view_audit';

export type PermissionMatrix = Record<UserRole, Record<ResourceDomain, ActionType[]>>;

// ==========================================
// 4. CMS & CONFIGURATION ENGINE TYPES
// ==========================================

export type PageSectionType =
  | 'hero_banner'
  | 'journal_meta'
  | 'latest_papers'
  | 'current_issue'
  | 'dictionary_spotlight'
  | 'lokgeet_widget'
  | 'announcements'
  | 'sansthan_about'
  | 'editorial_board'
  | 'quick_links'
  | 'custom_html';

export interface PageSectionConfig {
  id: string;
  type: PageSectionType;
  title: Record<Language, string>;
  enabled: boolean;
  order: number;
  settings?: Record<string, any>;
}

export interface CmsPageConfig {
  pageId: string; // e.g. 'home', 'journal', 'dictionary'
  title: Record<Language, string>;
  seoDescription: Record<Language, string>;
  sections: PageSectionConfig[];
  customCss?: string;
  updatedAt: string;
}

export interface ModuleToggleConfig {
  journalEnabled: boolean;
  libraryEnabled: boolean;
  dictionaryEnabled: boolean;
  lokgeetEnabled: boolean;
  paheliEnabled: boolean;
  gotraEnabled: boolean;
  galleryEnabled: boolean;
  eventsEnabled: boolean;
}

export interface EnterpriseSystemConfig {
  platformName: {
    hi: string;
    en: string;
    paw: string;
  };
  publisher: {
    hi: string;
    en: string;
  };
  issnPrint: string;
  issnOnline: string;
  contactEmail: string;
  contactPhone: string;
  location: string;
  activeModules: ModuleToggleConfig;
  defaultLanguage: Language;
  enablePeerReviewWorkflow: boolean;
  enablePublicSubmissions: boolean;
  updatedAt: string;
}
