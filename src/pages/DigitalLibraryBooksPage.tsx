import React, { useState } from 'react';
import { StorageEngine } from '../lib/storage';
import { BookItem } from '../types';
import { BookOpen, Search, Download, Eye, Plus, BookMarked, FileText, Check } from 'lucide-react';
import { PdfReaderModal } from '../components/PdfReaderModal';

export const DigitalLibraryBooksPage: React.FC = () => {
  const [books, setBooks] = useState<BookItem[]>(() => StorageEngine.getBooks());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activePdf, setActivePdf] = useState<{ url: string; title: string; author: string } | null>(null);

  // New book state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('माँ ताप्ती शोध संस्थान');
  const [year, setYear] = useState('2026');
  const [category, setCategory] = useState<BookItem['category']>('Monograph');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800');
  const [pdfUrl, setPdfUrl] = useState('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
  const [isbn, setIsbn] = useState('978-81-965432-1-8');
  const [doi, setDoi] = useState('10.5281/zenodo.book.2026');
  const [language, setLanguage] = useState('हिंदी / Pawari');
  const [pagesCount, setPagesCount] = useState('184');
  const [keywordsStr, setKeywordsStr] = useState('मोनोग्राफ, इतिहास, सतपुड़ा');

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author) return;

    const newBook: BookItem = {
      id: `book-${Date.now()}`,
      title: { hi: title, en: title },
      author,
      publisher,
      year: parseInt(year) || 2026,
      isbn: isbn || `978-81-${Math.floor(100000 + Math.random() * 900000)}`,
      description,
      coverUrl,
      pdfUrl,
      category,
      pagesCount: parseInt(pagesCount) || 150,
      downloadCount: 0,
    };

    StorageEngine.saveBook(newBook);
    setBooks(StorageEngine.getBooks());
    setShowAddModal(false);
    setTitle('');
    setAuthor('');
    setDescription('');
    setIsbn('');
    setDoi('');
    alert('पुस्तक / शोध मोनोग्राफ, पीडीएफ फ़ाइल और विस्तृत मेटाडेटा सफलतापूर्वक जोड़ा गया!');
  };

  const filteredBooks = books.filter(b => {
    const matchCat = selectedCategory === 'all' || b.category === selectedCategory;
    const matchSearch = b.title.hi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        b.publisher.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 rounded-2xl border border-amber-500/35 flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>डिजिटल ग्रंथालय एवं मोनोग्राफ आर्काइव (Digital Library & Monograph System)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
            शोध पुस्तकें, मोनोग्राफ एवं संदर्भ ग्रंथ
          </h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl flex items-center gap-2 shadow transition text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>नई पुस्तक सबमिट करें</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-amber-50/70 dark:bg-stone-900 p-5 rounded-2xl border border-amber-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'Monograph', 'History', 'Language', 'Literature', 'Folk'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl font-bold uppercase transition ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-stone-950 shadow'
                  : 'bg-white dark:bg-stone-950 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
              }`}
            >
              {cat === 'all' ? 'सभी श्रेणियां' : cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="पुस्तक शीर्षक, लेखक, ISBN खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-xs text-stone-200 w-64 outline-none"
          />
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map(book => (
          <div key={book.id} className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 shadow-sm hover:border-amber-500/50 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full text-[10px] font-bold uppercase">
                  {book.category}
                </span>
                <span className="text-xs font-mono text-stone-400">{book.year}</span>
              </div>

              <div className="flex gap-4">
                <img
                  src={book.coverUrl}
                  alt={book.title.hi}
                  className="w-20 h-28 object-cover rounded-xl shadow border border-stone-200 dark:border-stone-800"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm line-clamp-2">
                    {book.title.hi}
                  </h3>
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-bold">{book.author}</p>
                  <p className="text-[11px] text-stone-500 font-mono">{book.publisher}</p>
                </div>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-300 font-serif line-clamp-2">
                {book.description}
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
              <span className="font-mono text-[11px] text-stone-400">{book.pagesCount} पृष्ठ • {book.isbn || 'ISBN उपलब्ध'}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePdf({ url: book.pdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', title: book.title.hi, author: book.author })}
                  className="px-3 py-1.5 bg-amber-600 text-stone-950 font-bold rounded-xl hover:bg-amber-500 shadow flex items-center gap-1 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>पढ़ें</span>
                </button>
                <a
                  href={book.pdfUrl || '#'}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition"
                  title="Download"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 w-full max-w-xl rounded-2xl border border-stone-200 dark:border-stone-800 p-8 space-y-6 shadow-2xl font-sans text-xs">
            <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-amber-100">नई पुस्तक या मोनोग्राफ जोड़ें</h3>

            <form onSubmit={handleAddBook} className="space-y-4">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">पुस्तक शीर्षक (Title)*:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="उदा. सतपुड़ा का इतिहास एवं पवारी संस्कृति"
                  className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">लेखक (Author)*:</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="डॉ. आर. के. पवार"
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">श्रेणी (Category):</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                  >
                    <option value="Monograph">Monograph (मोनोग्राफ)</option>
                    <option value="History">History (इतिहास)</option>
                    <option value="Language">Language (भाषा)</option>
                    <option value="Literature">Literature (साहित्य)</option>
                    <option value="Folk">Folk (लोकसंस्कृति)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">प्रकाशन वर्ष (Year):</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">प्रकाशक (Publisher):</label>
                  <input
                    type="text"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">ISBN:</label>
                  <input
                    type="text"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    placeholder="978-81-..."
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">DOI / Persistent ID:</label>
                  <input
                    type="text"
                    value={doi}
                    onChange={(e) => setDoi(e.target.value)}
                    placeholder="10.5281/zenodo..."
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">कुल पृष्ठ (Pages):</label>
                  <input
                    type="text"
                    value={pagesCount}
                    onChange={(e) => setPagesCount(e.target.value)}
                    placeholder="184"
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">ई-बुक PDF फ़ाइल URL / अपलोड:</label>
                  <input
                    type="text"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    placeholder="https://.../document.pdf"
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">कवर इमेज URL:</label>
                  <input
                    type="text"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">विवरण (Description):</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="पुस्तक का परिचय..."
                  className="w-full p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold rounded-xl"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-600 text-stone-950 font-bold rounded-xl hover:bg-amber-500 shadow"
                >
                  पुस्तक प्रकाशित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Built-in PDF Reader Modal */}
      <PdfReaderModal
        isOpen={!!activePdf}
        onClose={() => setActivePdf(null)}
        pdfUrl={activePdf?.url || ''}
        title={activePdf?.title || ''}
        author={activePdf?.author}
      />
    </div>
  );
};
