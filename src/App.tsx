import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { Breadcrumb } from './components/Breadcrumb';

import { HomePage } from './pages/HomePage';
import { JournalPage } from './pages/JournalPage';
import { LibraryPage } from './pages/LibraryPage';
import { PawariDictionaryPage } from './pages/PawariDictionaryPage';
import { PawariGrammarPage } from './pages/PawariGrammarPage';
import { LokgeetPage } from './pages/LokgeetPage';
import { PaheliPage } from './pages/PaheliPage';
import { GotraPage } from './pages/GotraPage';
import { SansthanPage } from './pages/SansthanPage';
import { GalleryPage } from './pages/GalleryPage';
import { EventsPage } from './pages/EventsPage';
import { SubmitPaperPage } from './pages/SubmitPaperPage';
import { AuthorPortalPage } from './pages/AuthorPortalPage';
import { ReviewerPortalPage } from './pages/ReviewerPortalPage';
import { EditorPortalPage } from './pages/EditorPortalPage';
import { DictionaryModulePage } from './pages/DictionaryModulePage';
import { LokgeetArchivePage } from './pages/LokgeetArchivePage';
import { DigitalLibraryBooksPage } from './pages/DigitalLibraryBooksPage';
import { HistoryArchivePage } from './pages/HistoryArchivePage';
import { MediaLibraryPage } from './pages/MediaLibraryPage';
import { KnowledgeGraphPage } from './pages/KnowledgeGraphPage';
import { CorpusManagerPage } from './pages/CorpusManagerPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { SuperAdminToolbar } from './components/SuperAdminToolbar';
import { CitationManagerPage } from './pages/CitationManagerPage';
import { RelationEnginePage } from './pages/RelationEnginePage';
import { VocabularyManagerPage } from './pages/VocabularyManagerPage';
import { JobQueuePage } from './pages/JobQueuePage';
import { EnterprisePluginMarketplacePage } from './pages/EnterprisePluginMarketplacePage';
import { EnterpriseConfigFlagsPage } from './pages/EnterpriseConfigFlagsPage';
import { EnterpriseAuditLogsPage } from './pages/EnterpriseAuditLogsPage';
import { EnterprisePreservationPage } from './pages/EnterprisePreservationPage';
import { DoiHarvestPage } from './pages/DoiHarvestPage';
import { EditorialBoardPage } from './pages/EditorialBoardPage';
import { QuizCertificationPage } from './pages/QuizCertificationPage';
import { SiteDirectoryPage } from './pages/SiteDirectoryPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';

export function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans flex flex-col selection:bg-amber-500 selection:text-stone-950 transition-colors duration-300">
            {/* Top Navigation */}
            <Navbar
              onOpenSearch={() => setIsSearchOpen(true)}
              isDark={isDark}
              onToggleTheme={toggleTheme}
            />
            <SuperAdminToolbar />

            {/* Main View Area */}
            <main className="flex-1">
              <Breadcrumb />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/journal" element={<JournalPage />} />
                <Route path="/paper/:id" element={<ArticleDetailPage />} />
                <Route path="/article/:id" element={<ArticleDetailPage />} />
                <Route path="/library" element={<LibraryPage />} />
                <Route path="/pawari/dictionary" element={<PawariDictionaryPage />} />
                <Route path="/pawari/grammar" element={<PawariGrammarPage />} />
                <Route path="/pawari/lokgeet" element={<LokgeetPage />} />
                <Route path="/pawari/paheli" element={<PaheliPage />} />
                <Route path="/pawari/gotra" element={<GotraPage />} />
                <Route path="/pawari/gotras" element={<GotraPage />} />
                <Route path="/sansthan" element={<SansthanPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/submit-paper" element={<SubmitPaperPage />} />
                <Route path="/author-portal" element={<AuthorPortalPage />} />
                <Route path="/reviewer-portal" element={<ReviewerPortalPage />} />
                <Route path="/editor-portal" element={<EditorPortalPage />} />
                <Route path="/modules/dictionary" element={<DictionaryModulePage />} />
                <Route path="/modules/lokgeet" element={<LokgeetArchivePage />} />
                <Route path="/modules/books" element={<DigitalLibraryBooksPage />} />
                <Route path="/modules/history" element={<HistoryArchivePage />} />
                <Route path="/media-library" element={<MediaLibraryPage />} />
                <Route path="/knowledge-graph" element={<KnowledgeGraphPage />} />
                <Route path="/modules/corpus" element={<CorpusManagerPage />} />
                <Route path="/enterprise/citations" element={<CitationManagerPage />} />
                <Route path="/enterprise/relations" element={<RelationEnginePage />} />
                <Route path="/enterprise/vocabularies" element={<VocabularyManagerPage />} />
                <Route path="/enterprise/jobs" element={<JobQueuePage />} />
                <Route path="/enterprise/plugins" element={<EnterprisePluginMarketplacePage />} />
                <Route path="/enterprise/config-flags" element={<EnterpriseConfigFlagsPage />} />
                <Route path="/enterprise/audit-logs" element={<EnterpriseAuditLogsPage />} />
                <Route path="/enterprise/preservation" element={<EnterprisePreservationPage />} />
                <Route path="/enterprise/doi-harvest" element={<DoiHarvestPage />} />
                <Route path="/editorial-board" element={<EditorialBoardPage />} />
                <Route path="/quiz" element={<QuizCertificationPage />} />
                <Route path="/sitemap" element={<SiteDirectoryPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<SiteDirectoryPage />} />
              </Routes>
            </main>

            {/* Global Footer */}
            <Footer />

            {/* Search Modal */}
            <GlobalSearchModal
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
            />
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
