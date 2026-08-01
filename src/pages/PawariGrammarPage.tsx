import React, { useState } from 'react';
import { Compass, BookOpen, CheckCircle2, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface GrammarSection {
  title: string;
  desc: string;
  exampleTitle: string;
  exampleText: string;
}

export const PawariGrammarPage: React.FC = () => {
  const { user } = useAuth();
  const [sections, setSections] = useState<GrammarSection[]>([
    {
      title: "1. ध्वन्यात्मक विशेषताएँ (Phonology)",
      desc: "पवारी भाषा में अकारांत तथा ओकारांत ध्वनियों की प्रधानता पाई जाती है। मानक हिंदी के 'ल' वर्ण के स्थान पर पवारी में मूर्धन्य 'ळ' (ळकार) का प्रयोग बहुतायत से होता है.",
      exampleTitle: "उदाहरण:",
      exampleText: "पानी → पाणी, काला → काळो, बालक → बाळक"
    },
    {
      title: "2. सर्वनाम व्यवस्था (Pronoun System)",
      desc: "पवारी सर्वनामों में मालवी एवं राजस्थानी परमार रूप स्पष्ट दृष्टिगोचर होते हैं।",
      exampleTitle: "सर्वनाम रूप:",
      exampleText: "• उत्तम पुरुष: मना (मेरा), आमी (हम/हमारा)\n• मध्यम पुरुष: तुना (तुम्हारा), तुमी (आप/आप लोग)\n• अन्य पुरुष: उना (उसका), उनी (उनका)"
    },
    {
      title: "3. क्रिया रूप एवं काल विधान (Verbal Inflections)",
      desc: "वर्तमान काल की सहायक क्रिया 'आहे' (है) तथा भूतकाल में 'गेला/होतो' प्रयुक्त होता है।",
      exampleTitle: "काल उदाहरण:",
      exampleText: "• वर्तमान काल: मेँ खात आहे (मैं खा रहा हूँ)\n• भूतकाल: उनी घोर गेला (वे घर गए थे)\n• भविष्य काल: आमी मुलताई जासूँ (हम मुलताई जाएँगे)"
    },
    {
      title: "4. कारक चिह्न (Case Markers)",
      desc: "संबोधन एवं संबंध कारक में विशिष्ट प्रत्यय जुड़ते हैं।",
      exampleTitle: "कारक उदाहरण:",
      exampleText: "• संबंध कारक: ना / नी / ने (राम ना घोर = राम का घर)\n• अधिकरण कारक: में / पर (शेत में = खेत में)"
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newExTitle, setNewExTitle] = useState('');
  const [newExText, setNewExText] = useState('');

  const handleAddGrammar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;

    setSections(prev => [...prev, {
      title: newTitle,
      desc: newDesc,
      exampleTitle: newExTitle || 'उदाहरण:',
      exampleText: newExText
    }]);

    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewExTitle('');
    setNewExText('');
    alert('नया व्याकरण अनुभाग सफलतापूर्वक जोड़ा गया!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 sm:p-10 rounded-2xl border border-amber-500/30 flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>भाषावैज्ञानिक अध्ययन</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100">
            पवारी (भोयरी) भाषा संरचना एवं व्याकरण निर्देशिका
          </h1>
          <p className="text-sm text-stone-300 font-serif max-w-2xl">
            पवारी भाषा की ध्वन्यात्मकता (Phonology), पद-संरचना (Morphology), सर्वनाम, कारक-चिह्न एवं क्रिया रूपों का प्रामाणिक विवेचन।
          </p>
        </div>

        {user.role === 'super_admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl flex items-center gap-2 shadow-lg transition text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>व्याकरण अनुभाग जोड़ें</span>
          </button>
        )}
      </div>

      {/* Grammar Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-serif">
        {sections.map((sec, idx) => (
          <div key={idx} className="bg-amber-50/50 dark:bg-stone-900 p-6 sm:p-8 rounded-2xl border border-amber-200/80 dark:border-stone-800 space-y-4 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-600" />
              <span>{sec.title}</span>
            </h2>
            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              {sec.desc}
            </p>
            {sec.exampleText && (
              <div className="bg-amber-100/60 dark:bg-stone-950 p-4 rounded-xl text-xs space-y-1.5 font-sans whitespace-pre-line">
                <span className="font-bold text-amber-800 dark:text-amber-400 block">{sec.exampleTitle}</span>
                <span className="text-stone-800 dark:text-stone-200">{sec.exampleText}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Grammar Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg p-6 space-y-6 text-stone-100 shadow-2xl font-sans">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <h3 className="text-lg font-serif font-bold text-amber-200">नया व्याकरण अनुभाग जोड़ें (सुपर एडमिन)</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGrammar} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-300">शीर्षक (Title):</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="जैसे: 5. काल एवं वाच्य"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">विवरण (Description):</label>
                <textarea
                  rows={3}
                  required
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="व्याकरण नियम का विवरण..."
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">उदाहरण शीर्षक (Example Title):</label>
                <input
                  type="text"
                  value={newExTitle}
                  onChange={e => setNewExTitle(e.target.value)}
                  placeholder="जैसे: प्रयोग उदाहरण:"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">उदाहरण पाठ (Example Text):</label>
                <textarea
                  rows={3}
                  value={newExText}
                  onChange={e => setNewExText(e.target.value)}
                  placeholder="उदाहरण वाक्य..."
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold rounded-xl"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl shadow"
                >
                  सहेजें (Save)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

