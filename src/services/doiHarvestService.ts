import { HarvestedPaper, ImportLog, IdentifierType, MetadataProvider, ImportMethod } from '../types/doiHarvesting';

const STORAGE_KEY_PAPERS = 'satpura_harvested_papers_v1';
const STORAGE_KEY_LOGS = 'satpura_harvest_logs_v1';

const INITIAL_PAPERS: HarvestedPaper[] = [
  {
    recordId: 'DOI-REC-001',
    identifierType: 'doi',
    identifierValue: '10.1016/j.culher.2025.04.012',
    provider: 'crossref',
    title: 'Digital Preservation and Computational Linguistic Analysis of Satpura Tribal Dialects',
    subtitle: 'A Case Study on Pawari and Korku Oral Traditions',
    authors: [
      { givenName: 'Rupesh', familyName: 'Pawar', fullName: 'Rupesh Pawar', orcid: '0000-0002-1829-4911', affiliation: 'Satpura Research Institute' },
      { givenName: 'Ananya', familyName: 'Sen', fullName: 'Ananya Sen', orcid: '0000-0001-9922-3810', affiliation: 'Tapti Linguistic Labs' }
    ],
    journalOrPublisher: 'Journal of Cultural Heritage & Computational Linguistics',
    volume: '42',
    issue: '3',
    pages: '112-128',
    publicationDate: '2025-06-15',
    issn: '1296-2074',
    language: 'en',
    license: 'CC-BY 4.0',
    abstractText: 'This paper explores advanced digital preservation frameworks for endangered Central Indian tribal languages, focusing on automated Devanagari OCR, phonetic alignment, and neural machine translation for Pawari dialects.',
    keywords: ['Digital Humanities', 'Pawari Dialect', 'OCR', 'Computational Linguistics', 'Satpura'],
    referencesCount: 48,
    citationCount: 14,
    isOpenAccess: true,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'imported',
    importedAt: new Date(Date.now() - 86400000).toISOString(),
    importedBy: 'admin@taaptiresearch.org',
    checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    recordId: 'DOI-REC-002',
    identifierType: 'arxiv',
    identifierValue: 'arXiv:2501.09842',
    provider: 'openaire',
    title: 'Neural Transformer Architectures for Low-Resource Indo-Aryan Dialect Translation',
    subtitle: 'Overcoming Data Scarcity in Satpura Linguistic Corpus',
    authors: [
      { givenName: 'Vikram', familyName: 'Aditya', fullName: 'Vikram Aditya', orcid: '0000-0003-4412-9018', affiliation: 'AI Research Center Bhopal' }
    ],
    journalOrPublisher: 'arXiv preprint',
    volume: 'v2',
    pages: '1-15',
    publicationDate: '2025-01-18',
    language: 'en',
    license: 'arXiv.org perpetual non-exclusive license',
    abstractText: 'We introduce synthetic data augmentation and cross-lingual transfer learning to improve neural machine translation between Pawari, Korku, and Standard Hindi without large parallel corpora.',
    keywords: ['Neural Machine Translation', 'Low-Resource Languages', 'Transformers', 'Pawari'],
    referencesCount: 32,
    citationCount: 7,
    isOpenAccess: true,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'imported',
    importedAt: new Date(Date.now() - 400000000).toISOString(),
    importedBy: 'editor@taaptiresearch.org',
    checksumSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
  }
];

const INITIAL_LOGS: ImportLog[] = [
  {
    logId: 'LOG-001',
    identifier: '10.1016/j.culher.2025.04.012',
    method: 'doi',
    provider: 'crossref',
    status: 'success',
    message: 'Successfully harvested metadata and validated SHA-256 checksum.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    performedBy: 'admin@taaptiresearch.org'
  },
  {
    logId: 'LOG-002',
    identifier: 'arXiv:2501.09842',
    method: 'doi',
    provider: 'openaire',
    status: 'success',
    message: 'Successfully harvested preprint metadata from arXiv.',
    timestamp: new Date(Date.now() - 400000000).toISOString(),
    performedBy: 'editor@taaptiresearch.org'
  }
];

export const DoiHarvestService = {
  getPapers: (): HarvestedPaper[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PAPERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_PAPERS, JSON.stringify(INITIAL_PAPERS));
        return INITIAL_PAPERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PAPERS;
    }
  },

  getLogs: (): ImportLog[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_LOGS);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(INITIAL_LOGS));
        return INITIAL_LOGS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_LOGS;
    }
  },

  lookupIdentifier: async (identifier: string, provider: MetadataProvider): Promise<HarvestedPaper> => {
    // Simulate real-time lookup from Crossref / OpenAlex / Semantic Scholar / arXiv
    await new Promise(r => setTimeout(r, 1200));

    const cleanId = identifier.trim();
    
    // Check if already exists
    const existing = DoiHarvestService.getPapers().find(p => p.identifierValue.toLowerCase() === cleanId.toLowerCase());
    if (existing) {
      throw new Error(`डेटाबेस में यह पहचानकर्ता (Identifier) पहले से मौजूद है: ${cleanId}`);
    }

    const mockHarvested: HarvestedPaper = {
      recordId: `DOI-REC-${Math.floor(1000 + Math.random() * 9000)}`,
      identifierType: cleanId.startsWith('10.') ? 'doi' : cleanId.toLowerCase().includes('arxiv') ? 'arxiv' : 'isbn',
      identifierValue: cleanId,
      provider: provider,
      title: `Harvested Research Paper on ${cleanId} (Satpura & Tapti Heritage)`,
      subtitle: 'Comprehensive Scholarly Metadata Analysis',
      authors: [
        { givenName: 'Dr. Ramesh', familyName: 'Pawar', fullName: 'Dr. Ramesh Pawar', orcid: '0000-0002-5541-1120', affiliation: 'Central India Linguistic Heritage Foundation' }
      ],
      journalOrPublisher: 'Satpura Journal of Linguistic & Historical Studies',
      volume: '15',
      issue: '2',
      pages: '45-62',
      publicationDate: new Date().toISOString().split('T')[0],
      issn: '2456-9912',
      language: 'en',
      license: 'CC-BY-NC 4.0',
      abstractText: `Retrieved successfully via ${provider.toUpperCase()} API integration for identifier ${cleanId}. Covers detailed philological analysis, historical migration patterns, and lexical structures.`,
      keywords: ['Satpura', 'Linguistics', 'Cultural Heritage', 'Metadata Harvesting'],
      referencesCount: 29,
      citationCount: 3,
      isOpenAccess: true,
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      status: 'imported',
      importedAt: new Date().toISOString(),
      importedBy: 'admin@taaptiresearch.org',
      checksumSha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a'
    };

    const papers = DoiHarvestService.getPapers();
    papers.unshift(mockHarvested);
    localStorage.setItem(STORAGE_KEY_PAPERS, JSON.stringify(papers));

    const logs = DoiHarvestService.getLogs();
    logs.unshift({
      logId: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      identifier: cleanId,
      method: 'doi',
      provider: provider,
      status: 'success',
      message: `Successfully harvested metadata via ${provider} API.`,
      timestamp: new Date().toISOString(),
      performedBy: 'admin@taaptiresearch.org'
    });
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));

    window.dispatchEvent(new Event('papers_harvested'));
    return mockHarvested;
  },

  deletePaper: (recordId: string) => {
    const papers = DoiHarvestService.getPapers().filter(p => p.recordId !== recordId);
    localStorage.setItem(STORAGE_KEY_PAPERS, JSON.stringify(papers));
    window.dispatchEvent(new Event('papers_harvested'));
  }
};
