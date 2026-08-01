import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, FileText, Loader2 } from 'lucide-react';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface PdfReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
  author?: string;
}

export const PdfReaderModal: React.FC<PdfReaderModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  title,
  author
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (_err: Error) => {
    setLoading(false);
    setError('पीडीएफ लोड करने में त्रुटि या CORS प्रतिबंध। डिफ़ॉल्ट डमी पीडीएफ प्रदर्शित किया जा रहा है।');
  };

  const fallbackUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
  const activeUrl = error ? fallbackUrl : pdfUrl;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-6 font-sans">
      {/* Top Navigation Bar */}
      <div className="w-full max-w-5xl bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-stone-100 shadow-2xl mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-serif font-bold text-stone-100 truncate max-w-xs sm:max-w-md">{title}</h3>
            {author && <p className="text-[11px] text-amber-400">{author}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Pagination Controls */}
          <div className="flex items-center gap-1 bg-stone-950 px-3 py-1.5 rounded-xl border border-stone-800 text-xs">
            <button
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber(p => Math.max(p - 1, 1))}
              className="p-1 hover:bg-stone-800 rounded disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono px-2 text-amber-200">
              {pageNumber} / {numPages || '--'}
            </span>
            <button
              disabled={numPages !== null && pageNumber >= numPages}
              onClick={() => setPageNumber(p => (numPages ? Math.min(p + 1, numPages) : p + 1))}
              className="p-1 hover:bg-stone-800 rounded disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-stone-950 px-2 py-1.5 rounded-xl border border-stone-800 text-xs">
            <button
              onClick={() => setScale(s => Math.max(s - 0.2, 0.6))}
              className="p-1 hover:bg-stone-800 rounded text-stone-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono px-1 text-stone-300 text-[11px]">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale(s => Math.min(s + 0.2, 2.2))}
              className="p-1 hover:bg-stone-800 rounded text-stone-300"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <a
            href={pdfUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl transition flex items-center gap-1.5 text-xs shadow"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">डाउनलोड</span>
          </a>

          <button
            onClick={onClose}
            className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition"
            title="Close Reader"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PDF Document Viewer Canvas Area */}
      <div className="w-full max-w-5xl flex-1 bg-stone-900 border border-stone-800 rounded-2xl overflow-auto flex items-center justify-center p-6 relative shadow-inner min-h-[500px]">
        {loading && (
          <div className="absolute inset-0 bg-stone-950/70 flex flex-col items-center justify-center gap-3 text-amber-400 z-10">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-xs font-mono">पीडीएफ लोड हो रहा है (Loading PDF)...</span>
          </div>
        )}

        {error && (
          <div className="absolute top-4 bg-amber-950/80 border border-amber-500/50 text-amber-200 px-4 py-2 rounded-xl text-xs z-20">
            {error}
          </div>
        )}

        <Document
          file={activeUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          className="flex justify-center"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-2xl rounded-lg overflow-hidden border border-stone-800 bg-white"
          />
        </Document>
      </div>
    </div>
  );
};
