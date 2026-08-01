import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageEngine } from '../lib/storage';
import { ResearchPaper } from '../types';
import { Sparkles, CheckCircle, Upload, FileText, UserCheck, AlertCircle } from 'lucide-react';

export const SubmitPaperPage: React.FC = () => {
  const navigate = useNavigate();
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const [titleHi, setTitleHi] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [abstractHi, setAbstractHi] = useState('');
  const [abstractEn, setAbstractEn] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [email, setEmail] = useState('');
  const [orcid, setOrcid] = useState('');
  const [category, setCategory] = useState('Linguistics');
  const [keywordsStr, setKeywordsStr] = useState('');
  const [pdfUrl, setPdfUrl] = useState('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titleHi || !abstractHi || !authorName) {
      alert('कृपया शीर्षक, सारांश तथा लेखक का नाम दर्ज करें।');
      return;
    }

    const newPaper: ResearchPaper = {
      id: `paper-${Date.now()}`,
      title: {
        hi: titleHi,
        en: titleEn || titleHi,
      },
      abstract: {
        hi: abstractHi,
        en: abstractEn || abstractHi,
      },
      authors: [
        {
          name: authorName,
          affiliation: affiliation || 'माँ ताप्ती शोध संस्थान',
          email,
          orcid,
        }
      ],
      category,
      keywords: keywordsStr.split(',').map(k => k.trim()).filter(Boolean),
      doi: `10.5281/pawari.v2i1.${Math.floor(10 + Math.random() * 89)}`,
      volume: 2,
      issue: 1,
      year: 2026,
      month: 'June',
      pages: '01-15',
      pdfUrl: pdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      publicationDate: new Date().toISOString().split('T')[0],
      viewsCount: 1,
      downloadsCount: 0,
      status: 'submitted',
    };

    StorageEngine.savePaper(newPaper);
    setSubmittedSuccess(true);
  };

  if (submittedSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-green-900/40 text-green-400 rounded-full flex items-center justify-center mx-auto border border-green-500/40">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-amber-100">
          शोध पत्र सफलतापूर्वक सबमिट हो गया है!
        </h1>
        <p className="text-sm text-stone-300 font-serif max-w-lg mx-auto">
          आपका पांडुलिपि (Manuscript) समीक्षा हेतु संपादकीय मंडल को भेज दिया गया है। पीयर-रिव्यू प्रक्रिया पूर्ण होने पर आपको सूचित किया जाएगा।
        </p>
        <div className="pt-4 flex justify-center gap-4 text-xs font-sans">
          <button
            onClick={() => navigate('/journal')}
            className="px-6 py-2.5 bg-amber-600 text-stone-950 font-bold rounded-xl"
          >
            शोध पत्रिका देखें
          </button>
          <button
            onClick={() => {
              setSubmittedSuccess(false);
              setTitleHi('');
              setAbstractHi('');
            }}
            className="px-6 py-2.5 bg-stone-800 text-stone-200 font-bold rounded-xl"
          >
            अन्य शोध पत्र जमा करें
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 rounded-2xl border border-amber-500/30">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>लेखक दिशानिर्देश एवं सबमिशन पोर्टल</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-amber-100">
            पवारी शोध पत्रिका - शोध पत्र सबमिशन
          </h1>
          <p className="text-xs text-stone-300 font-serif">
            पवारी भाषा, परमार इतिहास, लोकसाहित्य एवं नृविज्ञान विषयक मौलिक अनुसंधान पत्र सबमिट करें।
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-amber-50/50 dark:bg-stone-900 p-8 rounded-2xl border border-amber-200/80 dark:border-stone-800 space-y-6 font-sans text-xs">
        <div className="space-y-4">
          <h3 className="text-sm font-serif font-bold text-amber-900 dark:text-amber-200 border-b border-amber-200 dark:border-stone-800 pb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-600" />
            <span>1. शोध पत्र का विवरण (Paper Information)</span>
          </h3>

          <div className="space-y-2">
            <label className="font-bold text-stone-700 dark:text-stone-300">
              शोध पत्र का शीर्षक (हिंदी / पवारी में)*:
            </label>
            <input
              type="text"
              required
              value={titleHi}
              onChange={(e) => setTitleHi(e.target.value)}
              placeholder="उदा. सतपुड़ा अंचल में पवारी भाषा का उद्भव एवं विकास..."
              className="w-full p-3 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 rounded-xl border border-amber-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-2">
            <label className="font-bold text-stone-700 dark:text-stone-300">
              Paper Title (in English):
            </label>
            <input
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="e.g. Origin and Evolution of Pawari Language in Satpura Region..."
              className="w-full p-3 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 rounded-xl border border-amber-200 dark:border-stone-800 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-bold text-stone-700 dark:text-stone-300">विषय श्रेणी (Category):</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 rounded-xl border border-amber-200 dark:border-stone-800"
              >
                <option value="Linguistics">भाषाविज्ञान (Linguistics)</option>
                <option value="History">इतिहास (History)</option>
                <option value="Folklore">लोकसाहित्य (Folklore)</option>
                <option value="Genealogy">गोत्र एवं वंशावली (Genealogy)</option>
                <option value="Culture">संस्कृति (Culture)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-stone-700 dark:text-stone-300">कीवर्ड्स (Comma separated):</label>
              <input
                type="text"
                value={keywordsStr}
                onChange={(e) => setKeywordsStr(e.target.value)}
                placeholder="पवारी, सतपुड़ा, इतिहास, परमार..."
                className="w-full p-3 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 rounded-xl border border-amber-200 dark:border-stone-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-stone-700 dark:text-stone-300">
              सारांश (Abstract in Hindi)*:
            </label>
            <textarea
              required
              rows={4}
              value={abstractHi}
              onChange={(e) => setAbstractHi(e.target.value)}
              placeholder="शोध पत्र का 150-250 शब्दों का संक्षिप्त सारांश..."
              className="w-full p-3 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 rounded-xl border border-amber-200 dark:border-stone-800 focus:outline-none"
            />
          </div>
        </div>

        {/* Authors Info */}
        <div className="space-y-4 pt-4 border-t border-amber-200 dark:border-stone-800">
          <h3 className="text-sm font-serif font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-600" />
            <span>2. मुख्य लेखक का विवरण (Author Details)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-bold text-stone-700 dark:text-stone-300">लेखक का पूरा नाम*: </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="उदा. डॉ. रमेश चंद्र पवार"
                className="w-full p-3 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 rounded-xl border border-amber-200 dark:border-stone-800"
              />
            </div>

            <div className="space-y-2">
              <label className="font-bold text-stone-700 dark:text-stone-300">संस्थान / विश्वविद्यालय (Affiliation):</label>
              <input
                type="text"
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                placeholder="उदा. सागर विश्वविद्यालय / शोध संस्थान"
                className="w-full p-3 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 rounded-xl border border-amber-200 dark:border-stone-800"
              />
            </div>

            <div className="space-y-2">
              <label className="font-bold text-stone-700 dark:text-stone-300">ईमेल (Email):</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="author@domain.org"
                className="w-full p-3 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 rounded-xl border border-amber-200 dark:border-stone-800"
              />
            </div>

            <div className="space-y-2">
              <label className="font-bold text-stone-700 dark:text-stone-300">ORCID iD (यदि हो):</label>
              <input
                type="text"
                value={orcid}
                onChange={(e) => setOrcid(e.target.value)}
                placeholder="0000-0002-XXXX-XXXX"
                className="w-full p-3 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 rounded-xl border border-amber-200 dark:border-stone-800"
              />
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-3 pt-4 border-t border-amber-200 dark:border-stone-800">
          <label className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-2">
            <Upload className="w-4 h-4 text-amber-600" />
            <span>3. शोध पत्र संलग्न करें (PDF / DOC Document from Local Drive)*:</span>
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-stone-950 text-stone-700 dark:text-stone-300 rounded-xl border-2 border-dashed border-amber-300 dark:border-stone-700 hover:border-amber-500 transition">
              <Upload className="w-4 h-4 text-amber-600" />
              <span className="font-medium">लोकल ड्राइव से PDF या DOC चुनें</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const fakeUrl = URL.createObjectURL(file);
                    setPdfUrl(fakeUrl);
                    alert(`फाइल "${file.name}" सफलतापूर्वक संलग्न कर ली गई है!`);
                  }
                }}
              />
            </label>
            <input
              type="text"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              placeholder="या PDF URL दर्ज करें"
              className="flex-1 p-3 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 rounded-xl border border-amber-200 dark:border-stone-800 font-mono text-xs"
            />
          </div>
          <p className="text-[11px] text-stone-500 italic">स्वीकृत प्रारूप: PDF, DOC, DOCX (अधिकतम 25MB)</p>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-sm rounded-xl shadow-lg transition"
        >
          शोध पत्र समीक्षा हेतु सबमिट करें
        </button>
      </form>
    </div>
  );
};
