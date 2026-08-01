import {
  ResearchPaper,
  JournalVolumeIssue,
  BookItem,
  HistoricalDocument,
  DictionaryWord,
  Lokgeet,
  Paheli,
  GotraItem,
  EventItem,
  NewsAnnouncement,
  GalleryItem,
  SiteConfig,
  UserProfile,
  UserRole
} from '../types';

import {
  INITIAL_SITE_CONFIG,
  INITIAL_PAPERS,
  INITIAL_ISSUES,
  INITIAL_BOOKS,
  INITIAL_DICTIONARY,
  INITIAL_LOKGEET,
  INITIAL_PAHELI,
  INITIAL_GOTRAS,
  INITIAL_DOCUMENTS,
  INITIAL_EVENTS,
  INITIAL_NEWS,
  INITIAL_GALLERY,
  DEFAULT_USER
} from '../data/initialData';

const KEYS = {
  SITE_CONFIG: 'pawari_site_config',
  PAPERS: 'pawari_papers',
  ISSUES: 'pawari_issues',
  BOOKS: 'pawari_books',
  DICTIONARY: 'pawari_dictionary',
  LOKGEET: 'pawari_lokgeet',
  PAHELI: 'pawari_paheli',
  GOTRAS: 'pawari_gotras',
  DOCUMENTS: 'pawari_documents',
  EVENTS: 'pawari_events',
  NEWS: 'pawari_news',
  GALLERY: 'pawari_gallery',
  USER: 'pawari_current_user',
};

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Dispatch custom event for cross-component reactive updates
    window.dispatchEvent(new Event('pawari_storage_change'));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
}

export const StorageEngine = {
  // Site Config
  getSiteConfig(): SiteConfig {
    return getItem(KEYS.SITE_CONFIG, INITIAL_SITE_CONFIG);
  },
  saveSiteConfig(config: SiteConfig): void {
    setItem(KEYS.SITE_CONFIG, config);
  },

  // Research Papers
  getPapers(): ResearchPaper[] {
    return getItem(KEYS.PAPERS, INITIAL_PAPERS);
  },
  getPaperById(id: string): ResearchPaper | undefined {
    return this.getPapers().find(p => p.id === id);
  },
  savePaper(paper: ResearchPaper): void {
    const papers = this.getPapers();
    const idx = papers.findIndex(p => p.id === paper.id);
    if (idx >= 0) {
      papers[idx] = paper;
    } else {
      papers.unshift(paper);
    }
    setItem(KEYS.PAPERS, papers);
  },
  deletePaper(id: string): void {
    const papers = this.getPapers().filter(p => p.id !== id);
    setItem(KEYS.PAPERS, papers);
  },
  incrementPaperMetric(id: string, type: 'views' | 'downloads'): void {
    const papers = this.getPapers();
    const paper = papers.find(p => p.id === id);
    if (paper) {
      if (type === 'views') paper.viewsCount += 1;
      if (type === 'downloads') paper.downloadsCount += 1;
      setItem(KEYS.PAPERS, papers);
    }
  },

  // Volume Issues
  getIssues(): JournalVolumeIssue[] {
    return getItem(KEYS.ISSUES, INITIAL_ISSUES);
  },
  saveIssue(issue: JournalVolumeIssue): void {
    const issues = this.getIssues();
    const idx = issues.findIndex(i => i.id === issue.id);
    if (idx >= 0) {
      issues[idx] = issue;
    } else {
      issues.unshift(issue);
    }
    setItem(KEYS.ISSUES, issues);
  },

  // Books
  getBooks(): BookItem[] {
    return getItem(KEYS.BOOKS, INITIAL_BOOKS);
  },
  saveBook(book: BookItem): void {
    const books = this.getBooks();
    const idx = books.findIndex(b => b.id === book.id);
    if (idx >= 0) {
      books[idx] = book;
    } else {
      books.unshift(book);
    }
    setItem(KEYS.BOOKS, books);
  },
  deleteBook(id: string): void {
    setItem(KEYS.BOOKS, this.getBooks().filter(b => b.id !== id));
  },

  // Dictionary Words
  getDictionary(): DictionaryWord[] {
    return getItem(KEYS.DICTIONARY, INITIAL_DICTIONARY);
  },
  getApprovedDictionary(): DictionaryWord[] {
    return this.getDictionary().filter(w => w.status !== 'pending' && w.status !== 'rejected');
  },
  getPendingDictionaryWords(): DictionaryWord[] {
    return this.getDictionary().filter(w => w.status === 'pending');
  },
  approveDictionaryWord(id: string): void {
    const dict = this.getDictionary();
    const word = dict.find(w => w.id === id);
    if (word) {
      word.status = 'approved';
      setItem(KEYS.DICTIONARY, dict);
    }
  },
  rejectDictionaryWord(id: string): void {
    const dict = this.getDictionary();
    const word = dict.find(w => w.id === id);
    if (word) {
      word.status = 'rejected';
      setItem(KEYS.DICTIONARY, dict);
    }
  },
  saveDictionaryWord(word: DictionaryWord): void {
    const dict = this.getDictionary();
    const idx = dict.findIndex(w => w.id === word.id);
    if (idx >= 0) {
      dict[idx] = word;
    } else {
      dict.unshift(word);
    }
    setItem(KEYS.DICTIONARY, dict);
  },
  deleteDictionaryWord(id: string): void {
    setItem(KEYS.DICTIONARY, this.getDictionary().filter(w => w.id !== id));
  },

  // Lokgeet
  getLokgeet(): Lokgeet[] {
    return getItem(KEYS.LOKGEET, INITIAL_LOKGEET);
  },
  saveLokgeet(song: Lokgeet): void {
    const songs = this.getLokgeet();
    const idx = songs.findIndex(s => s.id === song.id);
    if (idx >= 0) {
      songs[idx] = song;
    } else {
      songs.unshift(song);
    }
    setItem(KEYS.LOKGEET, songs);
  },
  deleteLokgeet(id: string): void {
    setItem(KEYS.LOKGEET, this.getLokgeet().filter(s => s.id !== id));
  },

  // Paheli
  getPaheli(): Paheli[] {
    return getItem(KEYS.PAHELI, INITIAL_PAHELI);
  },
  savePaheli(paheli: Paheli): void {
    const list = this.getPaheli();
    const idx = list.findIndex(p => p.id === paheli.id);
    if (idx >= 0) {
      list[idx] = paheli;
    } else {
      list.unshift(paheli);
    }
    setItem(KEYS.PAHELI, list);
  },

  // Gotra Database
  getGotras(): GotraItem[] {
    return getItem(KEYS.GOTRAS, INITIAL_GOTRAS);
  },
  saveGotra(gotra: GotraItem): void {
    const list = this.getGotras();
    const idx = list.findIndex(g => g.id === gotra.id);
    if (idx >= 0) {
      list[idx] = gotra;
    } else {
      list.unshift(gotra);
    }
    setItem(KEYS.GOTRAS, list);
  },

  // Historical Documents
  getDocuments(): HistoricalDocument[] {
    return getItem(KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
  },
  saveDocument(docItem: HistoricalDocument): void {
    const docs = this.getDocuments();
    const idx = docs.findIndex(d => d.id === docItem.id);
    if (idx >= 0) {
      docs[idx] = docItem;
    } else {
      docs.unshift(docItem);
    }
    setItem(KEYS.DOCUMENTS, docs);
  },

  // Events & News
  getEvents(): EventItem[] {
    return getItem(KEYS.EVENTS, INITIAL_EVENTS);
  },
  saveEvent(evt: EventItem): void {
    const list = this.getEvents();
    const idx = list.findIndex(e => e.id === evt.id);
    if (idx >= 0) {
      list[idx] = evt;
    } else {
      list.unshift(evt);
    }
    setItem(KEYS.EVENTS, list);
  },

  getNews(): NewsAnnouncement[] {
    return getItem(KEYS.NEWS, INITIAL_NEWS);
  },
  saveNews(news: NewsAnnouncement): void {
    const list = this.getNews();
    const idx = list.findIndex(n => n.id === news.id);
    if (idx >= 0) {
      list[idx] = news;
    } else {
      list.unshift(news);
    }
    setItem(KEYS.NEWS, list);
  },

  getGallery(): GalleryItem[] {
    return getItem(KEYS.GALLERY, INITIAL_GALLERY);
  },
  saveGalleryItem(item: GalleryItem): void {
    const list = this.getGallery();
    const idx = list.findIndex(g => g.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    setItem(KEYS.GALLERY, list);
  },

  // Current User Profile & Role Switcher
  getCurrentUser(): UserProfile {
    return getItem(KEYS.USER, DEFAULT_USER);
  },
  saveCurrentUser(user: UserProfile): void {
    setItem(KEYS.USER, user);
  },
  setUserRole(role: UserRole): void {
    const user = this.getCurrentUser();
    user.role = role;
    this.saveCurrentUser(user);
  },

  // Reset data to defaults
  resetToDefaults(): void {
    localStorage.removeItem(KEYS.SITE_CONFIG);
    localStorage.removeItem(KEYS.PAPERS);
    localStorage.removeItem(KEYS.ISSUES);
    localStorage.removeItem(KEYS.BOOKS);
    localStorage.removeItem(KEYS.DICTIONARY);
    localStorage.removeItem(KEYS.LOKGEET);
    localStorage.removeItem(KEYS.PAHELI);
    localStorage.removeItem(KEYS.GOTRAS);
    localStorage.removeItem(KEYS.DOCUMENTS);
    localStorage.removeItem(KEYS.EVENTS);
    localStorage.removeItem(KEYS.NEWS);
    localStorage.removeItem(KEYS.GALLERY);
    localStorage.removeItem(KEYS.USER);
    window.dispatchEvent(new Event('pawari_storage_change'));
  }
};
