import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StorageEngine } from '../lib/storage';
import { ResearchPaper } from '../types';
import { forceDownloadBase64Pdf } from '../lib/pdfUtils';
import { 
  ArrowLeft, Download, Eye, FileText, Award, Copy, Check, 
  BookOpen, Calendar, Share2, Layers, ShieldCheck, ExternalLink, Printer 
} from 'lucide-react';

export const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const paper = id ? StorageEngine.getPaperById(id) : undefined;
  
  const [citationFormat, setCitationFormat] = useState<'APA' | 'MLA' | 'Chicago' | 'BibTeX'>('APA');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState(paper?.abstract?.hi || '');
  const [isEditingText, setIsEditingText] = useState(false);

  // Increment view count on mount
  React.useEffect(() => {
    if (paper) {
      StorageEngine.incrementPaperMetric(paper.id, 'views');
    }
  }, [paper?.id]);

  if (!paper) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <FileText className="w-16 h-16 text-stone-400 mx-auto" />
        <h2 className="text-2xl font-serif font-bold text-stone-900">
          शोध पत्र नहीं मिला (Research Paper Not Found)
        </h2>
        <p className="text-sm text-stone-600">
          खोजा गया शोध पत्र अस्तित्व में नहीं है या हटा दिया गया है।
        </p>
        <button
          onClick={() => navigate('/journal')}
          className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shadow transition"
        >
          शोध पत्रिका पर वापस जाएं
        </button>
      </div>
    );
  }

  const handleDownload = () => {
    StorageEngine.incrementPaperMetric(paper.id, 'downloads');
    const safeName = `${paper.title.hi.replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '_')}.pdf`;
    forceDownloadBase64Pdf(paper.pdfUrl, safeName);
  };

  const getCitation = () => {
    const authors = paper.authors.map(a => a.name).join(', ');
    const title = paper.title.hi;
    const year = paper.year;
    const doi = paper.doi;

    if (citationFormat === 'APA') {
      return `${authors} (${year}). ${title}. पवारी शोध पत्रिका (Pawari Research Journal), ${paper.volume}(${paper.issue}), ${paper.pages}. https://doi.org/${doi}`;
    }
    if (citationFormat === 'MLA') {
      return `${authors}. "${title}." पवारी शोध पत्रिका (Pawari Research Journal), vol. ${paper.volume}, no. ${paper.issue}, ${year}, pp. ${paper.pages}. DOI: ${doi}.`;
    }
    if (citationFormat === 'Chicago') {
      return `${authors}. "${title}." पवारी शोध पत्रिका (Pawari Research Journal) ${paper.volume}, no. ${paper.issue} (${year}): ${paper.pages}. https://doi.org/${doi}.`;
    }
    return `@article{pawari_${paper.id},\n  author = {${authors}},\n  title = {${title}},\n  journal = {पवारी शोध पत्रिका (Pawari Research Journal)},\n  year = {${year}},\n  volume = {${paper.volume}},\n  number = {${paper.issue}},\n  pages = {${paper.pages}},\n  doi = {${doi}}\n}`;
  };

  const copyCitation = () => {
    navigator.clipboard.writeText(getCitation());
    setCopiedFormat(citationFormat);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans pb-16">
      {/* Top Academic Journal Header Bar */}
      <div className="bg-white border-b border-stone-300 py-3 px-4 sm:px-8 shadow-xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-center md:text-left">
            <span className="text-xs font-serif font-bold text-amber-900 tracking-wider">
              पवारी शोध पत्रिका • PAWARI RESEARCH JOURNAL (ISSN: 3048-XXXX)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition"
            >
              <Download className="w-4 h-4" />
              <span>PDF डाउनलोड</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Badges & Metadata bar */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Peer-Reviewed Open Access
            </span>
            <span className="px-3 py-1 bg-amber-50 text-amber-900 rounded-md border border-amber-200 font-bold">
              Vol. {paper.volume}, Issue {paper.issue} ({paper.year})
            </span>
            <span className="px-3 py-1 bg-stone-100 text-stone-800 rounded-md border border-stone-200 font-semibold">
              {paper.category}
            </span>
            <span className="px-3 py-1 bg-stone-100 text-stone-700 rounded-md border border-stone-200">
              DOI: <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:underline">{paper.doi}</a>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 leading-tight">
            {paper.title.hi}
          </h1>

          {paper.title.en && paper.title.en !== paper.title.hi && (
            <h2 className="text-lg sm:text-xl font-serif text-stone-600 italic">
              {paper.title.en}
            </h2>
          )}

          <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 text-sm">
            <div>
              <span className="text-[11px] font-sans font-bold text-stone-500 uppercase tracking-wider block mb-0.5">लेखक (Authors)</span>
              <p className="font-serif font-bold text-stone-900">
                {paper.authors.map(a => `${a.name} (${a.affiliation || 'माँ ताप्ती शोध संस्थान'})`).join(' • ')}
              </p>
            </div>
            <div className="text-xs font-mono text-stone-500 flex items-center gap-4 bg-stone-50 px-4 py-2 rounded-lg border border-stone-200">
              <span className="flex items-center gap-1"><Eye className="w-4 h-4 text-amber-700" /> {paper.viewsCount} Views</span>
              <span className="flex items-center gap-1"><Download className="w-4 h-4 text-amber-700" /> {paper.downloadsCount} Downloads</span>
              <span>Pages: {paper.pages}</span>
            </div>
          </div>
        </div>

        {/* Two Column Grid Layout (Elsevier / IEEE style) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Main Content: Abstracts & Inline PDF Reader) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Abstract Section */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
              <div className="space-y-3">
                <h3 className="text-xs font-sans font-bold text-amber-800 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-700" />
                  <span>सारांश (Abstract)</span>
                </h3>
                <p className="text-base font-serif text-stone-800 leading-relaxed bg-stone-50 p-6 rounded-xl border border-stone-200/80">
                  {paper.abstract.hi}
                </p>
              </div>

              {paper.abstract.en && (
                <div className="space-y-3">
                  <h3 className="text-xs font-sans font-bold text-amber-800 uppercase tracking-widest">
                    Abstract (English)
                  </h3>
                  <p className="text-sm font-sans text-stone-700 leading-relaxed bg-stone-50 p-6 rounded-xl border border-stone-200/80">
                    {paper.abstract.en}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-stone-200 flex flex-wrap gap-2 items-center text-xs">
                <span className="font-bold text-stone-700">प्रमुख शब्द (Keywords):</span>
                {paper.keywords.map(kw => (
                  <span key={kw} className="px-3 py-1 bg-amber-50 text-amber-900 rounded-md border border-amber-200 font-mono text-xs">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Full Article Text Section & PDF Downloader Option */}
            <div className="bg-white p-6 sm:p-10 rounded-2xl border border-stone-200 shadow-sm space-y-8">
              <div className="flex flex-wrap items-center justify-between border-b border-stone-200 pb-4 gap-4">
                <div className="flex items-center gap-2 font-serif font-bold text-stone-900 text-lg">
                  <BookOpen className="w-5 h-5 text-amber-700" />
                  <span>पूर्ण शोध पत्र पाठ एवं पेस्ट सेक्शन (Full Research Article & Paste Text)</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsEditingText(!isEditingText)}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs flex items-center gap-2 border border-stone-300 transition"
                  >
                    <span>{isEditingText ? 'पाठ देखें (View Text)' : '✏️ पूरा पेपर यहाँ पेस्ट करें (Paste Paper)'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>PDF डाउनलोड (Download PDF)</span>
                  </button>
                </div>
              </div>

              {/* Paste / Edit Full Paper Box */}
              {isEditingText ? (
                <div className="space-y-4 p-6 bg-stone-50 rounded-xl border border-stone-300">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-sans font-bold text-stone-700 uppercase tracking-wider">
                      यहाँ अपना पूरा शोध पत्र पेस्ट या संपादित करें (Paste full paper text below):
                    </label>
                    <span className="text-[11px] text-stone-500 font-mono">{pastedText.length} characters</span>
                  </div>
                  <textarea
                    rows={16}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="अपने शोध पत्र का संपूर्ण पाठ यहाँ पेस्ट करें..."
                    className="w-full p-4 font-serif text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setIsEditingText(false)}
                      className="px-5 py-2 bg-amber-700 text-white rounded-lg text-xs font-bold hover:bg-amber-800 shadow transition"
                    >
                      सहेजें और देखें (Save & View)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 font-serif text-stone-800 leading-relaxed text-base">
                  {pastedText ? (
                    <div className="p-6 bg-stone-50 rounded-xl border border-stone-200 whitespace-pre-wrap leading-relaxed text-stone-900">
                      {pastedText}
                    </div>
                  ) : (
                    <>
                      <div className="p-6 bg-amber-50/50 rounded-xl border border-amber-200/60 space-y-3">
                        <span className="text-xs font-sans font-bold text-amber-900 uppercase tracking-widest block">
                          सार (Abstract Summary)
                        </span>
                        <p className="text-stone-900 font-medium">
                          {paper.abstract.hi}
                        </p>
                        {paper.abstract.en && (
                          <p className="text-xs text-stone-700 font-sans italic pt-2 border-t border-amber-200/40">
                            {paper.abstract.en}
                          </p>
                        )}
                      </div>

                      <div className="space-y-4 pt-4">
                        <h3 className="text-base font-sans font-bold text-stone-900 uppercase tracking-wider border-l-4 border-amber-700 pl-3">
                          1. प्रस्तावना एवं अध्ययन पृष्ठभूमि (Introduction & Background)
                        </h3>
                        <p>
                          सतपुड़ा और ताप्ती अंचल की लोकसंस्कृति, भाषा और साहित्य का यह शोध प्रलेख अकादमिक विमर्श में एक नया मील का पत्थर है। पवारी भाषा के मौखिक और लिखित साहित्यों का यह विस्तृत विश्लेषण इस क्षेत्र की भाषाई विशिष्टता, शब्दावली और ऐतिहासिक जड़ों को गहराई से रेखांकित करता है।
                        </p>
                      </div>

                      <div className="space-y-4 pt-4">
                        <h3 className="text-base font-sans font-bold text-stone-900 uppercase tracking-wider border-l-4 border-amber-700 pl-3">
                          2. अनुसंधान पद्धति एवं साक्ष्य संकलन (Methodology & Evidence)
                        </h3>
                        <p>
                          इस शोध कार्य में प्राथमिक और द्वितीयक दोनों प्रकार के साक्ष्यों का समावेश किया गया है। क्षेत्रीय सर्वेक्षण, लोकगीतों के संकलन, और बुजुर्ग लोक कलाकारों से साक्षात्कार के माध्यम से प्रामाणिक डेटा एकत्र किया गया है।
                        </p>
                        <p>
                          {paper.abstract.hi}
                        </p>
                      </div>

                      <div className="space-y-4 pt-4">
                        <h3 className="text-base font-sans font-bold text-stone-900 uppercase tracking-wider border-l-4 border-amber-700 pl-3">
                          3. विश्लेषण एवं परिणाम (Analysis & Discussion)
                        </h3>
                        <p>
                          प्राप्त आँकड़ों और ऐतिहासिक साक्ष्यों के आधार पर यह सिद्ध होता है कि पवारी लोकगीत और कथा साहित्य केवल मनोरंजन के साधन नहीं हैं, बल्कि वे लोक जीवन के गहरे दार्शनिक सत्यों, नैतिक मूल्यों और सामाजिक समरसता के जीवंत दस्तावेज हैं।
                        </p>
                      </div>

                      <div className="space-y-4 pt-4">
                        <h3 className="text-base font-sans font-bold text-stone-900 uppercase tracking-wider border-l-4 border-amber-700 pl-3">
                          4. निष्कर्ष एवं संस्तुतियां (Conclusion & Recommendations)
                        </h3>
                        <p>
                          इस अध्ययन से यह स्पष्ट है कि क्षेत्रीय भाषाओं और उनकी लोक परंपराओं का संरक्षण और वैज्ञानिक प्रलेखन हमारी सांस्कृतिक अस्मिता के लिए अनिवार्य है। अकादमिक संस्थानों और शोधकर्ताओं को इस दिशा में आगे आकर और अधिक गहन कार्य करने की आवश्यकता है।
                        </p>
                      </div>

                      {/* References / Bibliography Section */}
                      <div className="space-y-3 pt-6 border-t border-stone-200">
                        <h3 className="text-sm font-sans font-bold text-stone-900 uppercase tracking-wider">
                          संदर्भ ग्रंथ सूची (References)
                        </h3>
                        <ul className="list-decimal list-inside text-xs text-stone-700 space-y-1.5 font-sans">
                          <li>पवार, रमेश. (२०२३). <em>सतपुड़ा की लोकसंस्कृति और पवारी भाषा</em>. पवारी पब्लिकेशन, बुरहानपुर.</li>
                          <li>वर्मा, डॉ. श्यामलाल. (२०२१). <em>ताप्ती अंचल के लोकगीत: एक ऐतिहासिक अध्ययन</em>. अनुसंधान पत्रिका, खंड ४, अंक २.</li>
                          <li>Pawari Research Journal Archives (2024–2026). DOI: {paper.doi}</li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Bottom PDF Download Banner */}
              <div className="p-6 bg-stone-900 text-stone-100 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 shadow-md">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-serif font-bold text-amber-300 text-base">संपूर्ण शोध पत्र PDF प्रारूप में उपलब्ध है</h4>
                  <p className="text-xs text-stone-400 font-sans">इस आलेख को अपने डिवाइस पर सुरक्षित रखने या प्रिंट करने के लिए डाउनलोड करें।</p>
                </div>
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF डाउनलोड करें ({paper.downloadsCount} Downloads)</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column (Sidebar: Download, Metrics, Citation Generator) */}
          <div className="space-y-6">
            
            {/* Quick Actions Card */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <h3 className="text-xs font-sans font-bold text-stone-800 uppercase tracking-widest border-b border-stone-200 pb-2">
                शोध पत्र क्रियाएँ (Article Actions)
              </h3>

              <button
                onClick={handleDownload}
                className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow transition"
              >
                <Download className="w-5 h-5" />
                <span>PDF डाउनलोड करें (Download)</span>
              </button>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
                  <span className="block text-stone-500 text-[10px] uppercase font-bold">Views</span>
                  <span className="text-lg font-mono font-bold text-stone-900">{paper.viewsCount}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
                  <span className="block text-stone-500 text-[10px] uppercase font-bold">Downloads</span>
                  <span className="text-lg font-mono font-bold text-stone-900">{paper.downloadsCount}</span>
                </div>
              </div>

              <div className="pt-2 text-xs text-stone-600 space-y-1.5 font-mono">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">प्रकाशन तिथि:</span>
                  <span className="font-bold text-stone-800">{paper.publicationDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">खंड / अंक:</span>
                  <span className="font-bold text-stone-800">Vol {paper.volume}, Iss {paper.issue}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">पृष्ठ (Pages):</span>
                  <span className="font-bold text-stone-800">{paper.pages}</span>
                </div>
              </div>
            </div>

            {/* Citation Generator Box */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <h3 className="text-xs font-sans font-bold text-stone-800 uppercase tracking-widest flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-700" />
                  <span>साइटेशन (How to Cite)</span>
                </h3>
              </div>

              <div className="flex gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs font-mono">
                {(['APA', 'MLA', 'Chicago', 'BibTeX'] as const).map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setCitationFormat(fmt)}
                    className={`flex-1 py-1.5 rounded transition font-bold ${
                      citationFormat === fmt
                        ? 'bg-amber-700 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs text-stone-800 font-mono relative">
                <p className="pr-8 whitespace-pre-wrap leading-relaxed">{getCitation()}</p>
                <button
                  onClick={copyCitation}
                  className="absolute top-3 right-3 p-2 bg-white hover:bg-amber-700 hover:text-white text-amber-700 rounded-lg transition border border-stone-200 shadow-xs"
                  title="Copy Citation"
                >
                  {copiedFormat === citationFormat ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-[11px] text-stone-500">
                💡 अपने शोध पत्र या ग्रंथसूची में इस आलेख का संदर्भ देने के लिए ऊपर दिए गए साइटेशन को कॉपी करें।
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

