export type PluginType = 
  | 'module' | 'ai' | 'storage' | 'search' | 'import' | 'export' 
  | 'visualization' | 'map' | 'auth' | 'analytics' | 'translation' | 'ocr' | 'speech';

export interface PluginManifest {
  pluginId: string;
  name: string;
  version: string;
  author: string;
  description: string;
  type: PluginType;
  minPlatformVersion: string;
  permissions: string[];
  dependencies: string[];
  enabled: boolean;
  installedAt: string;
}

export type FeatureFlagScope = 'global' | 'module' | 'organization' | 'role' | 'user';

export interface FeatureFlag {
  flagKey: string;
  name: string;
  description: string;
  enabled: boolean;
  beta: boolean;
  experimental: boolean;
  scope: FeatureFlagScope;
  rolloutPercentage: number; // 0 to 100
  updatedAt: string;
  updatedBy: string;
}

export interface AuditRecord {
  auditId: string;
  module: string;
  recordId: string;
  action: 'create' | 'edit' | 'archive' | 'restore' | 'publish' | 'unpublish' | 'delete' | 'login' | 'logout' | 'import' | 'export' | 'upload' | 'download';
  oldValue?: any;
  newValue?: any;
  performedBy: string;
  timestamp: string;
  ipAddress?: string;
  device?: string;
  requestId: string;
}

export interface PreservationRecord {
  preservationId: string;
  objectType: string;
  objectId: string;
  title: string;
  checksumSha256: string;
  checksumSha512: string;
  fixityStatus: 'verified' | 'damaged' | 'missing' | 'pending';
  lastScanDate: string;
  retentionPeriod: '10_years' | '25_years' | '50_years' | '100_years' | 'permanent';
  packageFormat: 'BagIt' | 'TEI_XML' | 'JSON' | 'PDF_A' | 'ZIP';
  pid: string;
  replicas: number;
}
