import React, { useState } from 'react';
import { 
  Award, CheckCircle2, HelpCircle, Trophy, ShieldCheck, Sparkles, 
  BarChart2, RefreshCw, Star, Download, Search, FileText, Check, X, User
} from 'lucide-react';

type QuizCategory = 'pahli' | 'dictionary' | 'gotra' | 'history' | 'grammar' | 'mixed' | 'leaderboard' | 'verify' | 'halloffame';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_DATA: Record<string, QuizQuestion[]> = {
  pahli: [
    {
      id: 1,
      question: 'पवारी पहेली: "बिन पाँवां के धावे, सब जगत की खबर लावे?"',
      options: ['हवा (पवन)', 'पत्र / खबर', 'नदी का पानी', 'सूर्य की किरणें'],
      correctIndex: 1,
      explanation: 'यह पवारी समाज की पारंपरिक पहेली है, जिसका उत्तर पत्र या समाचार है।'
    },
    {
      id: 2,
      question: 'पवारी पहेली: "एक थरिया में दो अंडा, एक गरम एक ठंडा?"',
      options: ['सूर्य और चंद्रमा', 'दिन और रात', 'आग और पानी', 'आकाश और पाताल'],
      correctIndex: 0,
      explanation: 'सूर्य (गर्म) और चंद्रमा (ठंडा) आकाश रूपी थाली में स्थित हैं।'
    }
  ],
  dictionary: [
    {
      id: 1,
      question: 'पवारी भाषा में "घोर" शब्द का क्या अर्थ है?',
      options: ['मकान / घर', 'जंगल', 'रात', 'खेत'],
      correctIndex: 0,
      explanation: 'पवारी (भोयरी) भाषा में घर या निवास स्थान को "घोर" कहा जाता है।'
    },
    {
      id: 2,
      question: 'पवारी पद "तान्हाँ" या "तान्हों" का अर्थ क्या होता है?',
      options: ['छोटा बालक / शिशु', 'बड़ा भाई', 'दादा जी', 'नदी का तट'],
      correctIndex: 0,
      explanation: 'छोटे बच्चे या बालक को पवारी में तान्हों/तानहाँ कहा जाता है।'
    }
  ],
  gotra: [
    {
      id: 1,
      question: 'पवार (भोयार) समाज का कौन सा गोत्र "परमार" राजवंश से सीधा संबंध रखता है?',
      options: ['वशिष्ठ गोत्र / पवार वंश', 'भारद्वाज', 'कश्यप', 'गौतम'],
      correctIndex: 0,
      explanation: 'पवार क्षत्रिय वंश का उद्गम धारा नगरी के परमारों एवं वशिष्ठ गोत्र से माना जाता है।'
    }
  ],
  history: [
    {
      id: 1,
      question: 'पवार (भोयार) समाज का मालवा एवं धारा नगरी से सतपुड़ा अंचल (बैतूल/छिंदवाड़ा) में स्थानांतरण किस शताब्दी में हुआ?',
      options: ['15वीं-17वीं शताब्दी', '8वीं शताब्दी', '20वीं शताब्दी', '5वीं शताब्दी'],
      correctIndex: 0,
      explanation: 'मुगलकालीन संघर्षों एवं राजनीतिक परिस्थितियों के कारण 15वीं से 17वीं शताब्दी के मध्य पवारों का मुलताई-बैतूल अंचल में प्रवास हुआ।'
    }
  ],
  grammar: [
    {
      id: 1,
      question: 'पवारी भाषा किस भाषा परिवार की प्रमुख उपबोली मानी जाती है?',
      options: ['राजस्थानी-मालवी एवं पश्चिम हिंदी', 'द्रविड़ भाषा', 'तिब्बती', 'असमिया'],
      correctIndex: 0,
      explanation: 'पवारी भाषा मालवी, राजस्थानी एवं मराठी का ध्वन्यात्मक संगम है।'
    }
  ],
  mixed: [
    {
      id: 1,
      question: 'माँ ताप्ती का उद्गम स्थल मुलताई (मूलतापी) किस जिले में स्थित है?',
      options: ['बैतूल (म.प्र.)', 'छिंदवाड़ा', 'नागपुर', 'अमरावती'],
      correctIndex: 0,
      explanation: 'मुलताई पवित्र ताप्ती नदी का उद्गम स्थल है जो बैतूल जिले में स्थित है।'
    }
  ]
};

export const QuizCertificationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<QuizCategory>('pahli');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [verifyCertCode, setVerifyCertCode] = useState('');
  const [verifiedResult, setVerifiedResult] = useState<any | null>(null);

  const activeQuestions = QUIZ_DATA[activeTab] || QUIZ_DATA.pahli;
  const currentQuestion = activeQuestions[currentQuestionIndex] || activeQuestions[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQuestion.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(c => c + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsAnswerSubmitted(false);
    setQuizCompleted(false);
  };

  const handleVerifyCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCertCode.trim()) return;
    
    // Mock verify result
    setVerifiedResult({
      code: verifyCertCode.toUpperCase(),
      candidateName: 'रूपेश कुमार पवार',
      quizTitle: 'पवारी भाषा एवं संस्कृति विशेषज्ञ प्रमाण-पत्र',
      score: '95%',
      issuedDate: '15 जुलाई 2026',
      issuer: 'माँ ताप्ती शोध संस्थान, मुलताई (बैतूल)'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 sm:p-10 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-4 h-4" />
            <span>पवारी ज्ञान परीक्षा एवं डिजिटल प्रमाण-पत्र</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100">
            Quiz & Certification Portal
          </h1>
          <p className="text-sm text-stone-300 font-serif leading-relaxed">
            पवारी पहेली, भाषाकोश, गोत्र, इतिहास एवं व्याकरण क्विज़ में भाग लें तथा ऑनलाइन प्रमाण-पत्र अर्जित एवं सत्यापित करें।
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-amber-50/80 dark:bg-stone-900 p-3 rounded-2xl border border-amber-200 dark:border-stone-800 flex flex-wrap items-center gap-2 text-xs font-bold">
        {[
          { id: 'pahli', label: 'पहेली क्विज़ (Pahli Quiz)' },
          { id: 'dictionary', label: 'शब्दकोश क्विज़ (Dictionary)' },
          { id: 'gotra', label: 'गोत्र क्विज़ (Gotra Quiz)' },
          { id: 'history', label: 'इतिहास क्विज़ (History)' },
          { id: 'grammar', label: 'व्याकरण क्विज़ (Grammar)' },
          { id: 'mixed', label: 'मिश्रित क्विज़ (Mixed)' },
          { id: 'leaderboard', label: 'लीडरबोर्ड (Leaderboard)' },
          { id: 'verify', label: 'प्रमाण-पत्र सत्यापन (Verify)' },
          { id: 'halloffame', label: 'हॉल ऑफ़ फेम (Hall of Fame)' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as QuizCategory);
              handleResetQuiz();
            }}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === tab.id
                ? 'bg-amber-600 text-stone-950 shadow-md'
                : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {['pahli', 'dictionary', 'gotra', 'history', 'grammar', 'mixed'].includes(activeTab) && (
        <div className="bg-amber-50/50 dark:bg-stone-900 rounded-3xl border border-amber-200 dark:border-stone-800 p-6 sm:p-10 shadow-xl space-y-8 max-w-4xl mx-auto">
          {!quizCompleted ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-amber-200 dark:border-stone-800 pb-4 text-xs font-mono text-stone-500">
                <span>प्रश्न {currentQuestionIndex + 1} / {activeQuestions.length}</span>
                <span className="font-bold text-amber-600">स्कोर: {score}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-amber-100">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((opt, idx) => {
                  let isSelected = selectedOption === idx;
                  let isCorrect = idx === currentQuestion.correctIndex;
                  let buttonStyle = 'border-amber-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 hover:border-amber-500';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      buttonStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold';
                    } else if (isSelected) {
                      buttonStyle = 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-300';
                    }
                  } else if (isSelected) {
                    buttonStyle = 'border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-200 font-bold';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      className={`w-full p-4 rounded-2xl border text-left text-sm font-serif transition flex items-center justify-between ${buttonStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswerSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                      {isAnswerSubmitted && isSelected && !isCorrect && <X className="w-5 h-5 text-red-500" />}
                    </button>
                  );
                })}
              </div>

              {isAnswerSubmitted && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs space-y-1 text-stone-800 dark:text-stone-200">
                  <p className="font-bold text-amber-600 dark:text-amber-400">व्याख्या (Explanation):</p>
                  <p>{currentQuestion.explanation}</p>
                </div>
              )}

              <div className="pt-4 flex justify-between items-center">
                <button
                  onClick={handleResetQuiz}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>पुनः प्रयास (Reset)</span>
                </button>

                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="px-6 py-2.5 bg-amber-600 disabled:opacity-50 text-stone-950 font-bold rounded-xl text-xs"
                  >
                    उत्तर सबमिट करें
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-bold rounded-xl text-xs shadow-lg"
                  >
                    {currentQuestionIndex < activeQuestions.length - 1 ? 'अगला प्रश्न →' : 'परिणाम देखें (Finish)'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-6">
              <Trophy className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
              <div className="space-y-2">
                <h2 className="text-2xl font-serif font-bold text-amber-100">अभिनंदन! क्विज़ पूर्ण हुआ।</h2>
                <p className="text-sm text-stone-300">
                  आपका कुल स्कोर: <span className="font-bold text-amber-400 text-xl">{score} / {activeQuestions.length}</span>
                </p>
              </div>

              <div className="p-6 bg-stone-950 border border-amber-500/30 rounded-2xl max-w-md mx-auto space-y-4">
                <ShieldCheck className="w-8 h-8 text-amber-400 mx-auto" />
                <h4 className="font-serif font-bold text-amber-200 text-sm">डिजिटल ई-प्रमाणपत्र प्राप्त करें</h4>
                <p className="text-xs text-stone-400">
                  माँ ताप्ती शोध संस्थान द्वारा प्रामाणिक पवारी भाषा एवं संस्कृति ई-सर्टिफिकेट डाउनलोड करें।
                </p>
                <button
                  onClick={() => alert('आपका पवारी ई-सर्टिफिकेट जनरेट हो चुका है (Certificate ID: PAWARI-2026-QUIZ-889)')}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>प्रमाण-पत्र डाउनलोड करें (PDF)</span>
                </button>
              </div>

              <button
                onClick={handleResetQuiz}
                className="px-6 py-2.5 bg-stone-800 text-stone-200 font-bold rounded-xl text-xs"
              >
                दोबारा क्विज़ खेलें
              </button>
            </div>
          )}
        </div>
      )}

      {/* Leaderboard View */}
      {activeTab === 'leaderboard' && (
        <div className="bg-stone-900 rounded-3xl border border-amber-500/30 p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-800 pb-4">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-serif font-bold text-amber-100">शीर्ष क्विज़ विजेता (Leaderboard)</h2>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { rank: 1, name: 'रूपेश कुमार पवार', district: 'मुलताई (बैतूल)', score: '98%', certId: 'PAWARI-9821' },
              { rank: 2, name: 'श्रीमती अनीता पवार', district: 'छिंदवाड़ा', score: '95%', certId: 'PAWARI-9822' },
              { rank: 3, name: 'डॉ. राजेश भोयार', district: 'नागपुर', score: '92%', certId: 'PAWARI-9823' },
              { rank: 4, name: 'संजय पंवार', district: 'सौंसर', score: '90%', certId: 'PAWARI-9824' },
            ].map(item => (
              <div key={item.rank} className="p-4 bg-stone-950 border border-stone-800 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    item.rank === 1 ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-300'
                  }`}>
                    #{item.rank}
                  </span>
                  <div>
                    <h4 className="font-bold text-amber-200 text-sm">{item.name}</h4>
                    <p className="text-stone-400 text-[11px]">{item.district}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-amber-400 text-sm">{item.score}</span>
                  <p className="text-stone-500 text-[10px]">Cert ID: {item.certId}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verify Certificate */}
      {activeTab === 'verify' && (
        <div className="bg-stone-900 rounded-3xl border border-amber-500/30 p-8 space-y-6 max-w-2xl mx-auto">
          <div className="text-center space-y-2">
            <ShieldCheck className="w-10 h-10 text-amber-400 mx-auto" />
            <h2 className="text-xl font-serif font-bold text-amber-100">प्रमाण-पत्र सत्यापन (Certificate Verification)</h2>
            <p className="text-xs text-stone-400">
              माँ ताप्ती शोध संस्थान द्वारा जारी प्रमाण-पत्र की प्रामाणिकता जांचने के लिए प्रमाणपत्र कोड दर्ज करें।
            </p>
          </div>

          <form onSubmit={handleVerifyCert} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="उदा. PAWARI-9821 या PAWARI-2026-QUIZ"
              value={verifyCertCode}
              onChange={e => setVerifyCertCode(e.target.value)}
              className="flex-1 px-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-xs focus:border-amber-500 outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>सत्यापित करें</span>
            </button>
          </form>

          {verifiedResult && (
            <div className="p-6 bg-stone-950 border border-emerald-500/40 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>प्रमाण-पत्र वैध एवं प्रामाणिक है (Valid Certificate)</span>
              </div>
              <div className="space-y-1 text-stone-300">
                <p><strong>अभ्यर्थी नाम:</strong> {verifiedResult.candidateName}</p>
                <p><strong>प्रमाणपत्र शीर्षक:</strong> {verifiedResult.quizTitle}</p>
                <p><strong>प्राप्तांक:</strong> {verifiedResult.score}</p>
                <p><strong>जारी तिथि:</strong> {verifiedResult.issuedDate}</p>
                <p><strong>जारीकर्ता संस्थान:</strong> {verifiedResult.issuer}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hall of Fame */}
      {activeTab === 'halloffame' && (
        <div className="bg-stone-900 rounded-3xl border border-amber-500/30 p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-800 pb-4">
            <Star className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-serif font-bold text-amber-100">हॉल ऑफ़ फेम (Hall of Fame)</h2>
          </div>
          <p className="text-xs text-stone-400">
            पवारी भाषा संरक्षण, लोकगीत संकलन एवं शोध पत्रों में विशिष्‍ट योगदान देने वाले समाज रत्न।
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'पं. मुकुंद रामजी पवार', role: 'वरिष्ठ पवारी साहित्यकार', achievement: 'प्रथम पवारी-हिंदी वृहद शब्दकोश रचयिता' },
              { name: 'डॉ. गजानन भोयार', role: 'लोकसंस्कृति विशेषज्ञ', achievement: 'सतपुड़ा अंचल लोकगीत संरक्षण शोध' },
              { name: 'श्री संतोष पवार', role: 'संपादक, ताप्ती वाणी', achievement: 'पवारी पत्रिका निरंतर प्रकाशन' },
            ].map((person, idx) => (
              <div key={idx} className="p-6 bg-stone-950 border border-stone-800 rounded-2xl space-y-3 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 font-serif text-xl font-bold">
                  {person.name[0]}
                </div>
                <h4 className="font-serif font-bold text-amber-200 text-sm">{person.name}</h4>
                <p className="text-xs text-amber-500 font-medium">{person.role}</p>
                <p className="text-[11px] text-stone-400 font-serif leading-relaxed">{person.achievement}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
