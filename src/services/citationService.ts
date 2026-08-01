import { CitationRecord, CitationStyle, SupportedModule } from '../types/enterprise';

const STORAGE_KEY = 'satpura_citations_v1';

const INITIAL_CITATIONS: CitationRecord[] = [
  {
    citationId: 'CIT-000001',
    persistentId: 'PAPER-000041',
    module: 'papers',
    recordId: 'paper-1',
    title: 'पवार (पवार/परमार) राजवंश का सतपुड़ा अंचल में प्रवासन एवं सांस्कृतिक अवदान',
    subtitle: 'एक ऐतिहासिक एवं भाषाई अध्ययन',
    authors: [
      { id: 'auth-1', name: 'डॉ. रूपेश पवार', role: 'author', orcid: '0000-0002-1829-4152', affiliation: 'माँ ताप्ती शोध संस्थान' },
      { id: 'auth-2', name: 'प्रो. रमेश चंद्र मालवीय', role: 'editor', affiliation: 'उज्जैन विश्वविद्यालय' }
    ],
    publisher: 'माँ ताप्ती शोध संस्थान प्रकाशन',
    institution: 'सतपुड़ा डिजिटल ह्यूमैनिटीज रिसर्च सेंटर',
    publicationDate: '2025-06-15',
    language: 'hi',
    version: 1,
    edition: 'प्रथम संस्करण',
    identifiers: [
      { id: 'id-1', type: 'doi', value: '10.5281/zenodo.satpura.2025.01', verified: true },
      { id: 'id-2', type: 'isbn', value: '978-81-965432-0-1', verified: true },
      { id: 'id-3', type: 'issn', value: '2583-987X', verified: true }
    ],
    license: 'CC BY-NC 4.0',
    url: 'https://taaptiresearch.org/papers/paper-1',
    accessDate: '2026-07-31',
    keywords: ['पवार राजवंश', 'सतपुड़ा', 'इतिहास', 'पवारी भाषा', 'मुलताई'],
    abstract: 'यह शोध पत्र धार और मालवा से सतपुड़ा क्षेत्र (बैतूल, छिंदवाड़ा, मुलताई) में पवार वंश के प्रवास, भाषा विकास और सांस्कृतिक योगदान का विश्लेषण करता है।',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'admin@taaptiresearch.org'
  },
  {
    citationId: 'CIT-000002',
    persistentId: 'DICT-000001',
    module: 'dictionary',
    recordId: 'dict-1',
    title: 'पवारी-हिंदी-अंग्रेजी त्रिभाषीय शब्दकोश (Pawari Trilingual Dictionary)',
    subtitle: 'सतपुड़ा लोकभाषा कोश संग्रह',
    authors: [
      { id: 'auth-3', name: 'पवारी भाषा संकलन समिति', role: 'collector', affiliation: 'मुलताई शोध केंद्र' }
    ],
    publisher: 'डिजिटल पवारी अकादमी',
    publicationDate: '2024-11-20',
    language: 'multi',
    version: 2,
    identifiers: [
      { id: 'id-4', type: 'internal', value: 'DICT-000001', verified: true },
      { id: 'id-5', type: 'doi', value: '10.5281/zenodo.pawari.dict.2024', verified: true }
    ],
    license: 'CC BY 4.0',
    url: 'https://taaptiresearch.org/dictionary/dict-1',
    accessDate: '2026-07-31',
    keywords: ['पवारी', 'शब्दकोश', 'डेटाबेस', 'लोकभाषा'],
    abstract: 'सतपुड़ा और वरद अंचल में बोली जाने वाली पवारी बोली के 10,000+ शब्दों का प्रामाणिक शब्दकोश।',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'editor@taaptiresearch.org'
  }
];

export const CitationService = {
  getCitations: (): CitationRecord[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CITATIONS));
        return INITIAL_CITATIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CITATIONS;
    }
  },

  saveCitation: (citation: CitationRecord) => {
    const list = CitationService.getCitations();
    const index = list.findIndex(c => c.citationId === citation.citationId);
    if (index >= 0) {
      list[index] = { ...citation, updatedAt: new Date().toISOString() };
    } else {
      list.unshift(citation);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('citations_changed'));
  },

  deleteCitation: (citationId: string) => {
    let list = CitationService.getCitations();
    list = list.filter(c => c.citationId !== citationId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('citations_changed'));
  },

  formatCitation: (citation: CitationRecord, style: CitationStyle): string => {
    const authorsStr = citation.authors.map(a => a.name).join(', ') || 'अज्ञात (Anonymous)';
    const year = citation.publicationDate ? citation.publicationDate.slice(0, 4) : 'n.d.';
    const title = citation.title;
    const publisher = citation.publisher || 'प्रकाशक अनुपलब्ध';
    const doi = citation.identifiers.find(i => i.type === 'doi')?.value;
    const url = citation.url || '';

    switch (style) {
      case 'apa7':
        return `${authorsStr} (${year}). ${title}. ${publisher}. ${doi ? `https://doi.org/${doi}` : url}`;
      
      case 'mla9':
        return `${authorsStr}. "${title}." ${publisher}, ${year}.`;
      
      case 'chicago_author_date':
        return `${authorsStr}. ${year}. ${title}. ${publisher}.`;

      case 'chicago_notes':
        return `${authorsStr}, "${title}" (${publisher}, ${year}).`;

      case 'harvard':
        return `${authorsStr} ${year}, ${title}, ${publisher}.`;

      case 'ieee':
        return `${authorsStr}, "${title}," ${publisher}, ${year}.`;

      case 'bibtex':
        return `@article{${citation.citationId.toLowerCase()},
  author = {${authorsStr}},
  title = {${title}},
  publisher = {${publisher}},
  year = {${year}},
  ${doi ? `doi = {${doi}},` : ''}
  url = {${url}}
}`;

      case 'ris':
        return `TY  - JOUR\nAU  - ${authorsStr}\nTI  - ${title}\nPY  - ${year}\nPB  - ${publisher}\n${doi ? `DO  - ${doi}\n` : ''}UR  - ${url}\nER  -`;

      case 'csl_json':
        return JSON.stringify({
          id: citation.citationId,
          type: "article-journal",
          title: title,
          author: citation.authors.map(a => ({ literal: a.name })),
          issued: { "date-parts": [[parseInt(year) || 2025]] },
          publisher: publisher,
          DOI: doi,
          URL: url
        }, null, 2);

      case 'dublin_core':
        return `DC.Title: ${title}\nDC.Creator: ${authorsStr}\nDC.Publisher: ${publisher}\nDC.Date: ${year}\nDC.Identifier: ${citation.persistentId}`;

      default:
        return `${authorsStr} (${year}). ${title}. ${publisher}.`;
    }
  },

  validateMetadata: (citation: CitationRecord): { isValid: boolean; missing: string[] } => {
    const missing: string[] = [];
    if (!citation.title) missing.push('शीर्षक (Title)');
    if (!citation.authors || citation.authors.length === 0) missing.push('लेखक (Authors)');
    if (!citation.publicationDate) missing.push('प्रकाशन वर्ष (Publication Year)');
    if (!citation.publisher) missing.push('प्रकाशक (Publisher)');
    if (!citation.identifiers.some(i => i.type === 'doi' || i.type === 'isbn')) missing.push('DOI या ISBN पहचानकर्ता');
    return {
      isValid: missing.length === 0,
      missing
    };
  }
};
