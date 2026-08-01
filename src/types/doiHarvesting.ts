export type IdentifierType = 'doi' | 'isbn' | 'issn' | 'pmid' | 'pmcid' | 'orcid' | 'ror' | 'handle' | 'arxiv' | 'zenodo';

export type MetadataProvider = 'crossref' | 'datacite' | 'openalex' | 'pubmed' | 'europe_pmc' | 'zenodo' | 'openaire' | 'semantic_scholar' | 'doaj';

export type ImportMethod = 'doi' | 'isbn' | 'url' | 'bibtex' | 'ris' | 'csl_json' | 'manual';

export interface AuthorMeta {
  givenName: string;
  familyName: string;
  fullName: string;
  orcid?: string;
  affiliation?: string;
}

export interface HarvestedPaper {
  recordId: string;
  identifierType: IdentifierType;
  identifierValue: string;
  provider: MetadataProvider;
  title: string;
  subtitle?: string;
  authors: AuthorMeta[];
  journalOrPublisher: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publicationDate: string;
  issn?: string;
  language: string;
  license?: string;
  abstractText: string;
  keywords: string[];
  referencesCount: number;
  citationCount: number;
  isOpenAccess: boolean;
  pdfUrl?: string;
  datasetUrl?: string;
  codeRepoUrl?: string;
  status: 'imported' | 'pending_review' | 'duplicate_detected' | 'failed';
  importedAt: string;
  importedBy: string;
  checksumSha256?: string;
}

export interface ImportLog {
  logId: string;
  identifier: string;
  method: ImportMethod;
  provider: MetadataProvider;
  status: 'success' | 'warning' | 'error' | 'duplicate';
  message: string;
  timestamp: string;
  performedBy: string;
}
