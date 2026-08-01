export type Language = 'hi' | 'en' | 'paw';

export type UserRole = 
  | 'super_admin'
  | 'administrator'
  | 'managing_editor'
  | 'editor'
  | 'section_editor'
  | 'reviewer'
  | 'author'
  | 'translator'
  | 'proofreader'
  | 'research_scholar'
  | 'student'
  | 'reader'
  | 'guest';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  affiliation?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface ResearchPaper {
  id: string;
  title: {
    hi: string;
    en: string;
    paw?: string;
  };
  abstract: {
    hi: string;
    en: string;
    paw?: string;
  };
  authors: {
    name: string;
    affiliation: string;
    email?: string;
    orcid?: string;
  }[];
  category: string; // e.g., 'History', 'Linguistics', 'Folklore', 'Genealogy', 'Culture'
  keywords: string[];
  doi: string;
  volume: number;
  issue: number;
  year: number;
  month: 'June' | 'December';
  pages: string;
  pdfUrl: string;
  publicationDate: string;
  viewsCount: number;
  downloadsCount: number;
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'published' | 'rejected';
  peerReviewers?: string[];
}

export interface JournalVolumeIssue {
  id: string;
  volumeNumber: number;
  issueNumber: number;
  year: number;
  month: 'June' | 'December';
  title: string;
  coverImage?: string;
  editorialNote?: string;
  publishedDate: string;
  isCurrentIssue?: boolean;
}

export interface BookItem {
  id: string;
  title: {
    hi: string;
    en: string;
    paw?: string;
  };
  author: string;
  editor?: string;
  publisher: string;
  year: number;
  isbn?: string;
  description: string;
  coverUrl: string;
  pdfUrl?: string;
  category: 'History' | 'Literature' | 'Language' | 'Folk' | 'Genealogy' | 'Monograph';
  pagesCount: number;
  downloadCount: number;
}

export interface HistoricalDocument {
  id: string;
  title: string;
  period: string;
  source: string;
  description: string;
  transcription?: string;
  imageUrl: string;
  documentPdfUrl?: string;
  category: 'Royal Decrees' | 'Land Records' | 'Genealogy Scroll' | 'Old Manuscript' | 'Map';
}

export interface DictionaryWord {
  id: string;
  wordPawari: string;
  wordDevanagari: string;
  phoneticEn: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'idiom' | 'phrase';
  meaningHindi: string;
  meaningEnglish: string;
  exampleSentencePawari?: string;
  exampleSentenceHindi?: string;
  audioUrl?: string;
  category: string;
  status?: 'approved' | 'pending' | 'rejected';
  submittedBy?: string;
  submittedAt?: string;
}

export interface Lokgeet {
  id: string;
  titlePawari: string;
  titleHindi: string;
  category: 'Sagai (सगाई)' | 'Vivah (विवाह)' | 'Gaoli (गौली)' | 'Sawan (सावन)' | 'Festival (त्यौहार)' | 'Devotional (भजन)' | 'General (सामान्य)';
  lyricsDevanagari: string;
  meaningHindi: string;
  audioUrl?: string;
  collectorName?: string;
  region?: string;
  tags: string[];
}

export interface Paheli {
  id: string;
  questionPawari: string;
  questionHindi: string;
  answerPawari: string;
  answerHindi: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GotraItem {
  id: string;
  gotraName: string;
  dynasty: string; // e.g. 'Parmar (पवार)', 'Chouhan', 'Solanki'
  kuldevi: string;
  kuldevta?: string;
  primaryLocation: string;
  historicalNote: string;
  subClans: string[];
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image?: string;
  registrationLink?: string;
  isUpcoming: boolean;
}

export interface NewsAnnouncement {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  category: 'Journal' | 'Sansthan' | 'Conference' | 'Publication' | 'General';
  important?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: 'Sansthan' | 'Seminar' | 'Field Work' | 'Historical Artifact' | 'Events';
  imageUrl: string;
  date: string;
}

export interface SiteConfig {
  journalTitle: {
    hi: string;
    en: string;
    paw: string;
  };
  publisherName: {
    hi: string;
    en: string;
  };
  location: string;
  issnOnline: string;
  issnPrint: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  aboutSansthan: {
    hi: string;
    en: string;
  };
  editorialBoard: {
    name: string;
    role: string;
    affiliation: string;
  }[];
  heroBannerTitle: {
    hi: string;
    en: string;
  };
  heroBannerSubtitle: {
    hi: string;
    en: string;
  };
}
