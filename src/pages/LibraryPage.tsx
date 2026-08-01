import React, { useState } from 'react';
import { StorageEngine } from '../lib/storage';
import { BookItem, HistoricalDocument } from '../types';
import { Library, Download, Eye, BookOpen, Calendar, Award, Plus, X } from 'lucide-react';

export const LibraryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'books' | 'documents'>('books');
  const [books, setBooks] = useState<BookItem[]>(() => StorageEngine.getBooks());
  const [documents, setDocuments] = useState<HistoricalDocument[]>(() => StorageEngine.getDocuments());
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [itemType, setItemType] = useState<'book' | 'document'>('book');
  const [titleHi, setTitleHi] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('लोक साहित्य');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600');
  const [pdfUrl, setPdfUrl] = useState('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleHi || !author) return;

    if (itemType === 'book') {
      const newBook: BookItem = {
        id: `book-${Date.now()}`,
        title: { hi: titleHi, en: titleHi },
        author,
        publisher: 'माँ ताप्ती शोध संस्थान, मुलताई',
        year: 2026,
        category: (category as any) || 'Literature',
        description: description || titleHi,
        coverUrl: coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
        pdfUrl: pdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        isbn: `978-93-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 89)}-${Math.floor(0 + Math.random() * 9)}`,
        pagesCount: 180,
        downloadCount: 0
      };
      StorageEngine.saveBook(newBook);
      setBooks(StorageEngine.getBooks());
      setActiveTab('books');
      alert('नई पुस्तक पुस्तकालय में सफलतापूर्वक जोड़ी गई!');
    } else {
      const newDoc: HistoricalDocument = {
        id: `doc-${Date.now()}`,
        title: titleHi,
        period: '18वीं-19वीं शताब्दी',
        source: 'सतपुड़ा-मुलताई पुरालेख',
        description: description || titleHi,
        transcription: 'मोड़ी / देवनागरी लिपि अभिलेख',
        category: 'Old Manuscript',
        imageUrl: coverUrl || 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600'
      };
      StorageEngine.saveDocument(newDoc);
      setDocuments(StorageEngine.getDocuments());
      setActiveTab('documents');
      alert('नया ऐतिहासिक दस्तावेज आर्काइव में जोड़ा गया!');
    }

    setShowAddModal(false);
    setTitleHi('');
    setAuthor('');
    setDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 sm:p-10 rounded-2xl border border-amber-500/30 flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Library className="w-4 h-4" />
            <span>माँ ताप्ती शोध संस्थान आर्काइव</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100">
            डिजिटल पुस्तकालय एवं पुरालेख केंद्र
          </h1>
          <p className="text-sm text-stone-300 font-serif max-w-2xl">
            पवारी भाषा, परमार इतिहास, लोक साहित्य एवं सतपुड़ा क्षेत्र से संबंधित संदर्भ ग्रंथों तथा पांडुलिपियों का स्थायी डिजिटल संग्रह।
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl flex items-center gap-2 shadow-lg transition text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>नई पुस्तक / दस्तावेज जोड़ें</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-amber-200 dark:border-stone-800 gap-4 text-sm font-serif font-bold">
        <button
          onClick={() => setActiveTab('books')}
          className={`pb-3 px-2 border-b-2 transition ${
            activeTab === 'books'
              ? 'border-amber-600 text-amber-800 dark:text-amber-400'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
          }`}
        >
          प्रकाशन एवं संदर्भ पुस्तकें ({books.length})
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-3 px-2 border-b-2 transition ${
            activeTab === 'documents'
              ? 'border-amber-600 text-amber-800 dark:text-amber-400'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
          }`}
        >
          ऐतिहासिक पांडुलिपियाँ एवं ताम्रपत्र ({documents.length})
        </button>
      </div>

      {/* Books Content */}
      {activeTab === 'books' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-amber-50/50 dark:bg-stone-900 rounded-2xl border border-amber-200/80 dark:border-stone-800 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition"
            >
              <div className="p-6 space-y-3">
                <div className="w-full h-48 rounded-xl overflow-hidden bg-stone-900 border border-stone-800 mb-2">
                  <img src={book.coverUrl} alt={book.title.hi} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-amber-800 dark:text-amber-400">
                  <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 font-bold rounded">
                    {book.category}
                  </span>
                  <span>ISBN: {book.isbn || 'N/A'}</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-amber-100 leading-snug">
                  {book.title.hi}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  लेखक: <span className="font-semibold text-stone-800 dark:text-stone-200">{book.author}</span>
                </p>
                <p className="text-xs text-stone-700 dark:text-stone-300 font-serif leading-relaxed line-clamp-3">
                  {book.description}
                </p>
              </div>

              <div className="p-6 pt-0">
                <a
                  href={book.pdfUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-amber-100 dark:bg-amber-600 dark:hover:bg-amber-500 dark:text-stone-950 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>पुस्तक डाउनलोड करें (PDF)</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Historical Documents Content */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {documents.map((docItem) => (
            <div
              key={docItem.id}
              className="bg-amber-50/50 dark:bg-stone-900 p-6 rounded-2xl border border-amber-200/80 dark:border-stone-800 space-y-4"
            >
              <div className="w-full h-56 rounded-xl overflow-hidden bg-stone-900 border border-stone-800">
                <img src={docItem.imageUrl} alt={docItem.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-amber-800 dark:text-amber-400">
                <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950 rounded font-bold">
                  {docItem.category}
                </span>
                <span>कालखंड: {docItem.period}</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-amber-100">
                {docItem.title}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                स्रोत: <span className="font-semibold text-stone-800 dark:text-stone-200">{docItem.source}</span>
              </p>
              <p className="text-xs text-stone-700 dark:text-stone-300 font-serif leading-relaxed">
                {docItem.description}
              </p>
              {docItem.transcription && (
                <div className="p-3 bg-stone-950 text-amber-200 rounded-xl text-xs font-mono border border-stone-800">
                  <span className="text-amber-400 font-bold block mb-1">प्रतिलिपि (Transcription):</span>
                  "{docItem.transcription}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg p-6 space-y-6 text-stone-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <h3 className="text-lg font-serif font-bold text-amber-200">नई पुस्तक या दस्तावेज जोड़ें</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4 text-xs">
              <div>
                <label className="block text-amber-400 font-bold mb-1">प्रकार (Type)</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="itemType"
                      checked={itemType === 'book'}
                      onChange={() => setItemType('book')}
                      className="accent-amber-500"
                    />
                    <span>पुस्तक (Book)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="itemType"
                      checked={itemType === 'document'}
                      onChange={() => setItemType('document')}
                      className="accent-amber-500"
                    />
                    <span>ऐतिहासिक दस्तावेज (Manuscript)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-amber-400 font-bold mb-1">शीर्षक (Title) *</label>
                <input
                  type="text"
                  required
                  value={titleHi}
                  onChange={(e) => setTitleHi(e.target.value)}
                  placeholder="उदा. पवारी व्याकरण एवं शब्दकोश"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-400 font-bold mb-1">लेखक / संपादक (Author) *</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="लेखक का नाम"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-amber-400 font-bold mb-1">श्रेणी (Category)</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="उदा. भाषाशास्त्र / इतिहास"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-400 font-bold mb-1">विवरण / विवरण (Description)</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="पुस्तक या दस्तावेज का संक्षिप्त परिचय..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-amber-400 font-bold mb-1">कवर चित्र लिंक (Cover Image URL)</label>
                <input
                  type="text"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-amber-400 font-bold mb-1">PDF फ़ाइल लिंक (PDF Link)</label>
                <input
                  type="text"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-xl font-bold"
                >
                  जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
