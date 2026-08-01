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
  UserProfile
} from '../types';
import { EXTENDED_DICTIONARY } from './extendedDictionary';

export const INITIAL_SITE_CONFIG: SiteConfig = {
  journalTitle: {
    hi: 'पवारी शोध पत्रिका',
    en: 'Pawari Research Journal',
    paw: 'पवारी सोध पतरीका'
  },
  publisherName: {
    hi: 'माँ ताप्ती शोध संस्थान, मुलताई, मध्यप्रदेश, भारत',
    en: 'Maa Tapti Shodh Sansthan, Multai, MP, India'
  },
  location: 'मुलताई (बैतूल), मध्यप्रदेश - 460661',
  issnOnline: '2583-987X (Online)',
  issnPrint: '2583-9861 (Print)',
  contactEmail: 'editor@pawariresearch.org',
  contactPhone: '+91 94250 84720, +91 7147 223401',
  address: 'माँ ताप्ती शोध संस्थान भवन, ताप्ती सरोवर मार्ग, मुलताई, जिला बैतूल (म.प्र.) 460661',
  aboutSansthan: {
    hi: 'माँ ताप्ती शोध संस्थान, मुलताई की स्थापना सतपुड़ा अंचल की प्राचीन पवारी (भोयरी) भाषा, लोक संस्कृति, परमार-पवार राजवंश के इतिहास, लोकगीतों एवं सांस्कृतिक धरोहर के संरक्षण, संवर्धन तथा उच्चस्तरीय अकादमिक अनुसन्धान के उद्देश्य से की गई है। संस्थान निरंतर द्विवार्षिक शोध पत्रिका का सम्पादन एवं प्रकाशन करता है।',
    en: 'Maa Tapti Shodh Sansthan, Multai was established for the preservation, documentation, and academic research of Pawari (Bhoyari) language, folk traditions, Pawar dynasty history, oral literature, and cultural heritage of the Satpura region. The Sansthan publishes a bi-annual peer-reviewed research journal.'
  },
  editorialBoard: [
    {
      name: 'डॉ. रमेश चंद्र पवार',
      role: 'प्रधान संपादक (Chief Editor)',
      affiliation: 'पूर्व विभागाध्यक्ष, इतिहास विभाग, बरकतउल्ला विश्वविद्यालय, भोपाल'
    },
    {
      name: 'प्रो. सुनीता पंवार',
      role: 'प्रबंध संपादक (Managing Editor)',
      affiliation: 'भाषाविज्ञान अध्ययन केंद्र, इंदौर विश्वविद्यालय'
    },
    {
      name: 'डॉ. आनंद राव भोयर',
      role: 'सह संपादक (Associate Editor)',
      affiliation: 'माँ ताप्ती शोध संस्थान, मुलताई'
    },
    {
      name: 'प्रो. वीरेंद्र सिंह परमार',
      role: 'सदस्य - परामर्शदात्री समिति',
      affiliation: 'प्राचीन भारतीय इतिहास एवं संस्कृति विभाग, सागर विश्वविद्यालय'
    }
  ],
  heroBannerTitle: {
    hi: 'पवारी भाषा, संस्कृति एवं इतिहास का प्रामाणिक अकादमिक मंच',
    en: 'The Authentic Academic Platform for Pawari Language, Culture & History'
  },
  heroBannerSubtitle: {
    hi: 'माँ ताप्ती की पावन भूमि मुलताई से प्रकाशित पीयर-रिव्यूड (Peer Reviewed) एवं ओपन एक्सेस शोध पत्रिका',
    en: 'A Peer-Reviewed Open-Access Research Journal published from Multai, MP, India'
  }
};

export const INITIAL_PAPERS: ResearchPaper[] = [
  {
    id: 'paper-001',
    title: {
      hi: 'सतपुड़ा अंचल की पवारी (भोयरी) बोली में मध्यकालीन परमारकालीन भाषाई अवशेष: एक व्युत्पत्तिपरक अध्ययन',
      en: 'Medieval Paramara Linguistic Vestiges in the Pawari (Bhoyari) Dialect of Satpura Region: An Etymological Study',
      paw: 'सतपुड़ा क्षेत्र नी पवारी बोली में परमार राज नी पुराणी भाखा रा अवशेष'
    },
    abstract: {
      hi: 'प्रस्तुत शोध पत्र में सतपुड़ा तथा ताप्ती घाटी क्षेत्र में बोली जाने वाली पवारी (भोयरी) भाषा की शब्दावली, व्याकरणिक संरचना तथा ध्वन्यात्मक विशेषताओं का मालवी, राजस्थानी एवं परमारकालीन अभिलेखीय संस्कृत-प्राकृत के साथ तुलनात्मक अध्ययन किया गया है। अध्ययन सिद्ध करता है कि पवारी में धारा नगरी (धार) के परमारकालीन कालखंड के अनेक विशिष्ट पद आज भी जीवंत हैं।',
      en: 'This research paper presents a comparative study of the vocabulary, grammatical framework, and phonetic traits of the Pawari (Bhoyari) language spoken in the Satpura and Tapti Valley with Malvi, Rajasthani, and Paramara-era epigraphic inscriptions. It establishes direct linguistic continuity with medieval Malwa.'
    },
    authors: [
      {
        name: 'डॉ. रमेश चंद्र पवार',
        affiliation: 'माँ ताप्ती शोध संस्थान, मुलताई',
        email: 'rc.pawar@pawariresearch.org',
        orcid: '0000-0002-8419-3321'
      },
      {
        name: 'विनायक राव परमार',
        affiliation: 'भाषाविज्ञान अध्ययन केंद्र, भोपाल'
      }
    ],
    category: 'Linguistics',
    keywords: ['Pawari Language', 'Paramara Dynasty', 'Satpura Linguistics', 'Malvi-Rajasthani Dialects', 'Bhoyari'],
    doi: '10.5281/pawari.v1i1.01',
    volume: 1,
    issue: 1,
    year: 2025,
    month: 'June',
    pages: '15-28',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    publicationDate: '2025-06-25',
    viewsCount: 1420,
    downloadsCount: 512,
    status: 'published'
  },
  {
    id: 'paper-002',
    title: {
      hi: 'बैतूल एवं छिंदवाड़ा जिले के पवार (भोयर) समुदाय का गोत्रशास्त्र एवं कुलायन परंपरा',
      en: 'Genealogy, Clan Deities, and Gotra System of the Pawar (Bhoyar) Community in Betul and Chhindwara Districts',
      paw: 'बैतूल अउर छिंदवाड़ा रा पवार समाज का गोत अउर कुलदेवी री परंपरा'
    },
    abstract: {
      hi: 'पवार (भोयर) क्षत्रिय समाज में वंश परंपरा एवं विवाह प्रणालियों को नियंत्रित करने वाले गोत्र तंत्र का विस्तृत ऐतिहासिक एवं नृवंशीय विश्लेषण। इसमें परमार काल से चले आ रहे 72 प्रमुख गोत्रों, कुलदेवियों तथा उज्जैन-धार से मालवा एवं गोंडवाना में प्रवासन के ऐतिहासिक साक्ष्यों की समीक्षा की गई है।',
      en: 'A comprehensive historical and anthropological analysis of the Gotra system governing lineage and matrimonial rules in the Pawar (Bhoyar) Kshatriya community, documenting 72 traditional clans and migration routes from Dhar-Ujjain.'
    },
    authors: [
      {
        name: 'प्रो. वीरेंद्र सिंह परमार',
        affiliation: 'सागर विश्वविद्यालय, इतिहास विभाग',
        email: 'virendra.parmar@dhsgsu.edu.in'
      }
    ],
    category: 'Genealogy',
    keywords: ['Gotra System', 'Pawar Community', 'Betul History', 'Kuldevi Traditions', 'Genealogy'],
    doi: '10.5281/pawari.v1i1.02',
    volume: 1,
    issue: 1,
    year: 2025,
    month: 'June',
    pages: '29-45',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    publicationDate: '2025-06-25',
    viewsCount: 1890,
    downloadsCount: 730,
    status: 'published'
  },
  {
    id: 'paper-003',
    title: {
      hi: 'ताप्ती उद्गम स्थल मुलताई का पुरातात्विक एवं सांस्कृतिक वैभव: एक ऐतिहासिक अवलोकन',
      en: 'Archaeological and Cultural Heritage of Multai (Tapti Origin): An Historical Overview',
      paw: 'ताप्ती नदी का उद्गम मुलताई का पुरान इतिहास अउर संसकृति'
    },
    abstract: {
      hi: 'ताप्ती नदी के पौराणिक एवं ऐतिहासिक उद्गम स्थल मुलताई (मूलतापी) क्षेत्र में पाए गए मध्यकालीन मंदिरों, शिलालेखों, वावड़ियों तथा परमार-मराठा स्थापत्य कला के अवशेषों का विस्तृत पुरातात्विक अध्ययन।',
      en: 'An archaeological documentation of medieval temples, stepwells, inscriptions, and architectural relics found around Multai (Mool-Tapti), the sacred origin point of River Tapti.'
    },
    authors: [
      {
        name: 'डॉ. आनंद राव भोयर',
        affiliation: 'माँ ताप्ती शोध संस्थान, मुलताई'
      }
    ],
    category: 'History',
    keywords: ['Multai History', 'Tapti River', 'Archaeology', 'Satpura Heritage', 'Central India History'],
    doi: '10.5281/pawari.v1i2.01',
    volume: 1,
    issue: 2,
    year: 2025,
    month: 'December',
    pages: '01-18',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    publicationDate: '2025-12-20',
    viewsCount: 980,
    downloadsCount: 340,
    status: 'published'
  },
  {
    id: 'paper-004',
    title: {
      hi: 'पवारी लोकगीतों में प्रतिबिंबित कृषि-संस्कृति, पर्व एवं सामाजिक चेतना',
      en: 'Agrarian Culture, Festivals and Social Consciousness Reflected in Pawari Folk Songs',
      paw: 'पवारी लोकगीत में खेती-बाड़ी, त्यौहार अउर समाज नी बात'
    },
    abstract: {
      hi: 'पवारी (भोयरी) भाषा के पारंपरिक विवाह गीतों (सगाई, हल्दी, विवाह), कृषि गीतों, गौली गीतों एवं सावन गीतों का साहित्यिक एवं काव्यशास्त्रीय विश्लेषण। यह अध्ययन दर्शाता है कि मौखिक परंपरा में किस प्रकार सदियों का इतिहास संरक्षित रहा है।',
      en: 'Literary and ethnographic evaluation of traditional Pawari folk songs, wedding songs, agricultural chants, and festival ballads preserved through centuries of oral transmission.'
    },
    authors: [
      {
        name: 'डॉ. सुनीता पंवार',
        affiliation: 'देवी अहिल्या विश्वविद्यालय, इंदौर'
      }
    ],
    category: 'Folklore',
    keywords: ['Pawari Folk Songs', 'Oral Literature', 'Agrarian Culture', 'Lokgeet Archive', 'Ethnomusicology'],
    doi: '10.5281/pawari.v1i2.02',
    volume: 1,
    issue: 2,
    year: 2025,
    month: 'December',
    pages: '19-34',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    publicationDate: '2025-12-20',
    viewsCount: 1120,
    downloadsCount: 420,
    status: 'published'
  }
];

export const INITIAL_ISSUES: JournalVolumeIssue[] = [
  {
    id: 'issue-v1i1',
    volumeNumber: 1,
    issueNumber: 1,
    year: 2025,
    month: 'June',
    title: 'वर्ष 1, अंक 1 (जून 2025) - पवारी भाषा एवं परमार इतिहास विशेषांक',
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800',
    editorialNote: 'प्रथम अंक में पवारी भाषा के ऐतिहासिक आधार तथा पवार राजवंश के गोत्र तंत्र पर केंद्रित महत्त्वपूर्ण शोध पत्र प्रस्तुत किए गए हैं।',
    publishedDate: '2025-06-25',
    isCurrentIssue: false
  },
  {
    id: 'issue-v1i2',
    volumeNumber: 1,
    issueNumber: 2,
    year: 2025,
    month: 'December',
    title: 'वर्ष 1, अंक 2 (दिसंबर 2025) - सतपुड़ा पुरातात्विक एवं लोक साहित्य विशेषांक',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
    editorialNote: 'द्वितीय अंक में ताप्ती घाटी मुलताई का पुरातात्विक वैभव एवं पवारी लोकगीतों के सामाजिक आयाम शामिल हैं।',
    publishedDate: '2025-12-20',
    isCurrentIssue: true
  }
];

export const INITIAL_BOOKS: BookItem[] = [
  {
    id: 'book-1',
    title: {
      hi: 'पवारी (भोयरी) भाषाकोश एवं व्याकरण',
      en: 'Pawari (Bhoyari) Dictionary & Comprehensive Grammar',
      paw: 'पवारी भाखाकोस अउर व्याकरण'
    },
    author: 'डॉ. रमेश चंद्र पवार',
    publisher: 'माँ ताप्ती शोध संस्थान, मुलताई',
    year: 2024,
    isbn: '978-93-85123-11-2',
    description: 'पवारी भाषा के 12,000 से अधिक प्रामाणिक शब्दों, मुहावरों, कहावतों एवं व्याकरण के नियमों का प्रथम समग्र संदर्भ ग्रंथ।',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    category: 'Language',
    pagesCount: 420,
    downloadCount: 1250
  },
  {
    id: 'book-2',
    title: {
      hi: 'परमार काल से सतपुड़ा तक: पवार क्षत्रिय समाज का इतिहास',
      en: 'From Paramara Era to Satpura: History of Pawar Kshatriya Community',
      paw: 'परमार राज से सतपुड़ा तक पवार समाज का इतिहास'
    },
    author: 'प्रो. वीरेंद्र सिंह परमार',
    publisher: 'माँ ताप्ती शोध संस्थान, मुलताई',
    year: 2023,
    isbn: '978-93-85123-05-1',
    description: 'धार एवं उज्जैन से मालवा, निमाड़ एवं सतपुड़ा अंचल (बैतूल, छिंदवाड़ा, सिवनी, बालाघाट, गोंदिया) में पवार समाज के ऐतिहासिक प्रवासन, युद्धों तथा सामाजिक योगदान का अभिलेखीय इतिहास।',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    category: 'History',
    pagesCount: 560,
    downloadCount: 2100
  },
  {
    id: 'book-3',
    title: {
      hi: 'पवारी लोकसाहित्य एवं लोकगीत मंजरी',
      en: 'Anthology of Pawari Folk Literature and Folksongs',
      paw: 'पवारी लोकगीत अउर कथा संग्रह'
    },
    author: 'डॉ. आनंद राव भोयर एवं डॉ. सुनीता पंवार',
    publisher: 'माँ ताप्ती शोध संस्थान, मुलताई',
    year: 2025,
    isbn: '978-93-85123-22-8',
    description: 'सतपुड़ा घाटी में गाए जाने वाले 350 से अधिक दुर्लभ पवारी विवाह गीतों, गौली गीतों, बुझौवलों एवं लोकगाथाओं का स्वर-लिपि एवं अर्थ सहित संकलन।',
    coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    category: 'Folk',
    pagesCount: 310,
    downloadCount: 890
  }
];

export const INITIAL_DICTIONARY: DictionaryWord[] = [
  {
    id: 'dict-1',
    wordPawari: 'मना',
    wordDevanagari: 'मना',
    phoneticEn: 'Mana',
    partOfSpeech: 'pronoun',
    meaningHindi: 'मेरा / मेरी / मेरे',
    meaningEnglish: 'My / Mine',
    exampleSentencePawari: 'यह मना घर आहे।',
    exampleSentenceHindi: 'यह मेरा घर है।',
    category: 'Pronouns'
  },
  {
    id: 'dict-2',
    wordPawari: 'तुना',
    wordDevanagari: 'तुना',
    phoneticEn: 'Tuna',
    partOfSpeech: 'pronoun',
    meaningHindi: 'तुम्हारा / तेरी / तेरे',
    meaningEnglish: 'Your / Yours',
    exampleSentencePawari: 'तुना नाव काय आहे?',
    exampleSentenceHindi: 'तुम्हारा नाम क्या है?',
    category: 'Pronouns'
  },
  {
    id: 'dict-3',
    wordPawari: 'आऊ',
    wordDevanagari: 'आऊ',
    phoneticEn: 'Aau',
    partOfSpeech: 'noun',
    meaningHindi: 'माताजी / माँ',
    meaningEnglish: 'Mother',
    exampleSentencePawari: 'मना आऊ खूब प्रेमल आहे।',
    exampleSentenceHindi: 'मेरी माँ बहुत स्नेही है।',
    category: 'Family Relationships'
  },
  {
    id: 'dict-4',
    wordPawari: 'बापु',
    wordDevanagari: 'बापु',
    phoneticEn: 'Bapu',
    partOfSpeech: 'noun',
    meaningHindi: 'पिताजी / बापू',
    meaningEnglish: 'Father',
    exampleSentencePawari: 'बापु शेत में गेला आहे।',
    exampleSentenceHindi: 'पिताजी खेत में गए हैं।',
    category: 'Family Relationships'
  },
  {
    id: 'dict-5',
    wordPawari: 'घोर',
    wordDevanagari: 'घोर',
    phoneticEn: 'Ghor',
    partOfSpeech: 'noun',
    meaningHindi: 'घर / मकान',
    meaningEnglish: 'House / Home',
    exampleSentencePawari: 'आमी घोर चालला।',
    exampleSentenceHindi: 'हम घर जा रहे हैं।',
    category: 'Household & General'
  },
  {
    id: 'dict-6',
    wordPawari: 'पाणी',
    wordDevanagari: 'पाणी',
    phoneticEn: 'Paani',
    partOfSpeech: 'noun',
    meaningHindi: 'जल / पानी',
    meaningEnglish: 'Water',
    exampleSentencePawari: 'मनाला पाणी प्यायचा आहे।',
    exampleSentenceHindi: 'मुझे पानी पीना है।',
    category: 'Daily Usage'
  },
  {
    id: 'dict-7',
    wordPawari: 'खाजा',
    wordDevanagari: 'खाजा',
    phoneticEn: 'Khaja',
    partOfSpeech: 'noun',
    meaningHindi: 'पकवान / मिष्ठान / जलपान',
    meaningEnglish: 'Sweets / Traditional Snacks',
    exampleSentencePawari: 'दीवाली में खाजा बनाया।',
    exampleSentenceHindi: 'दीपावली में पकवान बनाए।',
    category: 'Food & Culture'
  },
  {
    id: 'dict-8',
    wordPawari: 'डोंगर',
    wordDevanagari: 'डोंगर',
    phoneticEn: 'Dongar',
    partOfSpeech: 'noun',
    meaningHindi: 'पहाड़ / पर्वत / टीला',
    meaningEnglish: 'Mountain / Hill',
    exampleSentencePawari: 'डोंगर पर ताप्ती माता का मंदिर आहे।',
    exampleSentenceHindi: 'पहाड़ पर ताप्ती माता का मंदिर है।',
    category: 'Geography & Nature'
  },
  {
    id: 'dict-9',
    wordPawari: 'आमी',
    wordDevanagari: 'आमी',
    phoneticEn: 'Aami',
    partOfSpeech: 'pronoun',
    meaningHindi: 'हम / हम लोग',
    meaningEnglish: 'We',
    exampleSentencePawari: 'आमी मुलताई जान्हो।',
    exampleSentenceHindi: 'हम मुलताई जा रहे हैं।',
    category: 'Pronouns'
  },
  {
    id: 'dict-10',
    wordPawari: 'तुमी',
    wordDevanagari: 'तुमी',
    phoneticEn: 'Tumi',
    partOfSpeech: 'pronoun',
    meaningHindi: 'तुम / आप',
    meaningEnglish: 'You (Honorific/Plural)',
    exampleSentencePawari: 'तुमी कता चालला?',
    exampleSentenceHindi: 'आप कहाँ जा रहे हैं?',
    category: 'Pronouns'
  },
  {
    id: 'dict-11',
    wordPawari: 'तेनी',
    wordDevanagari: 'तेनी',
    phoneticEn: 'Teni',
    partOfSpeech: 'pronoun',
    meaningHindi: 'वह / वे / उसने',
    meaningEnglish: 'He / She / They',
    exampleSentencePawari: 'तेनी काम केला।',
    exampleSentenceHindi: 'उसने काम किया।',
    category: 'Pronouns'
  },
  {
    id: 'dict-12',
    wordPawari: 'चला',
    wordDevanagari: 'चला',
    phoneticEn: 'Chala',
    partOfSpeech: 'verb',
    meaningHindi: 'चलना / जाओ',
    meaningEnglish: 'Let us go / Walk',
    exampleSentencePawari: 'चला शेतात जाऊ।',
    exampleSentenceHindi: 'चलो खेत में चलें।',
    category: 'Verbs'
  },
  {
    id: 'dict-13',
    wordPawari: 'खाय',
    wordDevanagari: 'खाय',
    phoneticEn: 'Khaay',
    partOfSpeech: 'verb',
    meaningHindi: 'खाना',
    meaningEnglish: 'To Eat',
    exampleSentencePawari: 'भाकरी खाय।',
    exampleSentenceHindi: 'रोटी खाओ।',
    category: 'Verbs'
  },
  {
    id: 'dict-14',
    wordPawari: 'पिए',
    wordDevanagari: 'पिए',
    phoneticEn: 'Piye',
    partOfSpeech: 'verb',
    meaningHindi: 'पीना',
    meaningEnglish: 'To Drink',
    exampleSentencePawari: 'ताप्ती का पवित्र पानी पिए।',
    exampleSentenceHindi: 'ताप्ती का पवित्र जल पियो।',
    category: 'Verbs'
  },
  {
    id: 'dict-15',
    wordPawari: 'बोल',
    wordDevanagari: 'बोल',
    phoneticEn: 'Bol',
    partOfSpeech: 'verb',
    meaningHindi: 'बोलना / कहना',
    meaningEnglish: 'To Speak / Talk',
    exampleSentencePawari: 'पवारी बोली बोल।',
    exampleSentenceHindi: 'पवारी बोली बोलो।',
    category: 'Verbs'
  },
  {
    id: 'dict-16',
    wordPawari: 'जाव',
    wordDevanagari: 'जाव',
    phoneticEn: 'Jaav',
    partOfSpeech: 'verb',
    meaningHindi: 'जाना',
    meaningEnglish: 'To Go',
    exampleSentencePawari: 'बाजार जाव।',
    exampleSentenceHindi: 'बाज़ार जाओ।',
    category: 'Verbs'
  },
  {
    id: 'dict-17',
    wordPawari: 'आवे',
    wordDevanagari: 'आवे',
    phoneticEn: 'Aave',
    partOfSpeech: 'verb',
    meaningHindi: 'आना',
    meaningEnglish: 'To Come',
    exampleSentencePawari: 'घोर पर मेहमान आया।',
    exampleSentenceHindi: 'घर पर मेहमान आए।',
    category: 'Verbs'
  },
  {
    id: 'dict-18',
    wordPawari: 'नांगर',
    wordDevanagari: 'नांगर',
    phoneticEn: 'Nangar',
    partOfSpeech: 'noun',
    meaningHindi: 'हल (कृषि उपकरण)',
    meaningEnglish: 'Plough',
    exampleSentencePawari: 'नांगर से खेत जोता।',
    exampleSentenceHindi: 'हल से खेत की जुताई की।',
    category: 'Agriculture'
  },
  {
    id: 'dict-19',
    wordPawari: 'बखर',
    wordDevanagari: 'बखर',
    phoneticEn: 'Bakhar',
    partOfSpeech: 'noun',
    meaningHindi: 'बखर (मिट्टी समतल करने का कृषि यंत्र)',
    meaningEnglish: 'Harrow / Soil Leveler',
    exampleSentencePawari: 'बखर फेरून खेत तयार केला।',
    exampleSentenceHindi: 'बखर चलाकर खेत तैयार किया।',
    category: 'Agriculture'
  },
  {
    id: 'dict-20',
    wordPawari: 'डोरा',
    wordDevanagari: 'डोरा',
    phoneticEn: 'Dora',
    partOfSpeech: 'noun',
    meaningHindi: 'निराई करने का यंत्र / डोरा',
    meaningEnglish: 'Weeding Implement',
    exampleSentencePawari: 'फसल में डोरा चलाया।',
    exampleSentenceHindi: 'फसल में निराई यंत्र चलाया।',
    category: 'Agriculture'
  },
  {
    id: 'dict-21',
    wordPawari: 'कुसड़',
    wordDevanagari: 'कुसड़',
    phoneticEn: 'Kusad',
    partOfSpeech: 'noun',
    meaningHindi: 'मिट्टी का बड़ा ढेला',
    meaningEnglish: 'Soil Clod',
    exampleSentencePawari: 'खेत में कुसड़ फोड़े।',
    exampleSentenceHindi: 'खेत में मिट्टी के ढेले तोड़े।',
    category: 'Agriculture'
  },
  {
    id: 'dict-22',
    wordPawari: 'पलोवनी',
    wordDevanagari: 'पलोवनी',
    phoneticEn: 'Palovani',
    partOfSpeech: 'noun',
    meaningHindi: 'बुवाई पूर्व सिंचाई / पलावा',
    meaningEnglish: 'Pre-sowing Irrigation',
    exampleSentencePawari: 'गेहूँ बोने से पहले पलोवनी की।',
    exampleSentenceHindi: 'गेहूँ की बुवाई से पहले खेत सींचा।',
    category: 'Agriculture'
  },
  {
    id: 'dict-23',
    wordPawari: 'खलिहान',
    wordDevanagari: 'खलिहान',
    phoneticEn: 'Khalihan',
    partOfSpeech: 'noun',
    meaningHindi: 'खलिहान / फसल भंडारण व गहाई स्थल',
    meaningEnglish: 'Threshing Floor',
    exampleSentencePawari: 'खलिहान में फसल आई।',
    exampleSentenceHindi: 'खलिहान में नई फसल आई।',
    category: 'Agriculture'
  },
  {
    id: 'dict-24',
    wordPawari: 'ताप्ती',
    wordDevanagari: 'ताप्ती',
    phoneticEn: 'Tapti',
    partOfSpeech: 'noun',
    meaningHindi: 'माँ ताप्ती नदी (सूर्यपुत्री)',
    meaningEnglish: 'River Tapti (Sun-daughter)',
    exampleSentencePawari: 'ताप्ती मैया मुलताई से बहे।',
    exampleSentenceHindi: 'माँ ताप्ती मुलताई से बहती हैं।',
    category: 'Geography & Nature'
  },
  {
    id: 'dict-25',
    wordPawari: 'सतपुड़ा',
    wordDevanagari: 'सतपुड़ा',
    phoneticEn: 'Satpura',
    partOfSpeech: 'noun',
    meaningHindi: 'सतपुड़ा पर्वतमाला',
    meaningEnglish: 'Satpura Mountain Range',
    exampleSentencePawari: 'सतपुड़ा के जंगल हरे-भरे हैं।',
    exampleSentenceHindi: 'सतपुड़ा के जंगल हरे-भरे हैं।',
    category: 'Geography & Nature'
  },
  {
    id: 'dict-26',
    wordPawari: 'मूलकुंड',
    wordDevanagari: 'मूलकुंड',
    phoneticEn: 'Moolkund',
    partOfSpeech: 'noun',
    meaningHindi: 'ताप्ती उद्गम कुंड (मुलताई)',
    meaningEnglish: 'Sacred Origin Pool of Tapti',
    exampleSentencePawari: 'मूलकुंड पर दर्शन किए।',
    exampleSentenceHindi: 'मूलकुंड पर दर्शन किए।',
    category: 'Geography & Nature'
  },
  {
    id: 'dict-27',
    wordPawari: 'मुलताई',
    wordDevanagari: 'मुलताई',
    phoneticEn: 'Multai',
    partOfSpeech: 'noun',
    meaningHindi: 'मुलताई (मूलतापी - ताप्ती नगर)',
    meaningEnglish: 'Multai Town (Birthplace of Tapti)',
    exampleSentencePawari: 'मुलताई हमारा ऐतिहासिक शहर आहे।',
    exampleSentenceHindi: 'मुलताई हमारा ऐतिहासिक शहर है।',
    category: 'Geography & Nature'
  },
  {
    id: 'dict-28',
    wordPawari: 'काकू',
    wordDevanagari: 'काकू',
    phoneticEn: 'Kaku',
    partOfSpeech: 'noun',
    meaningHindi: 'चाचाजी / ताऊजी',
    meaningEnglish: 'Paternal Uncle',
    exampleSentencePawari: 'काकू खेत से आए।',
    exampleSentenceHindi: 'चाचाजी खेत से आए।',
    category: 'Family Relationships'
  },
  {
    id: 'dict-29',
    wordPawari: 'काकी',
    wordDevanagari: 'काकी',
    phoneticEn: 'Kaki',
    partOfSpeech: 'noun',
    meaningHindi: 'चाचीजी / ताईजी',
    meaningEnglish: 'Paternal Aunt',
    exampleSentencePawari: 'काकी ने भोजन बनाया।',
    exampleSentenceHindi: 'चाचीजी ने भोजन बनाया।',
    category: 'Family Relationships'
  },
  {
    id: 'dict-30',
    wordPawari: 'मामू',
    wordDevanagari: 'मामू',
    phoneticEn: 'Mamu',
    partOfSpeech: 'noun',
    meaningHindi: 'मामाजी',
    meaningEnglish: 'Maternal Uncle',
    exampleSentencePawari: 'मामू गाँव आए हैं।',
    exampleSentenceHindi: 'मामाजी गाँव आए हैं।',
    category: 'Family Relationships'
  },
  {
    id: 'dict-31',
    wordPawari: 'मामी',
    wordDevanagari: 'मामी',
    phoneticEn: 'Mami',
    partOfSpeech: 'noun',
    meaningHindi: 'मामीजी',
    meaningEnglish: 'Maternal Aunt',
    exampleSentencePawari: 'मामीजी ने आशीर्वाद दिया।',
    exampleSentenceHindi: 'मामीजी ने आशीर्वाद दिया।',
    category: 'Family Relationships'
  },
  {
    id: 'dict-32',
    wordPawari: 'भाइ',
    wordDevanagari: 'भाइ',
    phoneticEn: 'Bhai',
    partOfSpeech: 'noun',
    meaningHindi: 'भाई / भ्राता',
    meaningEnglish: 'Brother',
    exampleSentencePawari: 'भाइ पढ़ाई करे।',
    exampleSentenceHindi: 'भाई पढ़ाई करता है।',
    category: 'Family Relationships'
  },
  {
    id: 'dict-33',
    wordPawari: 'बहिन',
    wordDevanagari: 'बहिन',
    phoneticEn: 'Bahin',
    partOfSpeech: 'noun',
    meaningHindi: 'बहन / भगिनी',
    meaningEnglish: 'Sister',
    exampleSentencePawari: 'बहिन ने गीत गाया।',
    exampleSentenceHindi: 'बहन ने गीत गाया।',
    category: 'Family Relationships'
  },
  {
    id: 'dict-34',
    wordPawari: 'बन्ना',
    wordDevanagari: 'बन्ना',
    phoneticEn: 'Banna',
    partOfSpeech: 'noun',
    meaningHindi: 'दूल्हा (विवाह प्रसंग)',
    meaningEnglish: 'Groom',
    exampleSentencePawari: 'विवाह में बन्ना सज-धज कर बैठा।',
    exampleSentenceHindi: 'विवाह में दूल्हा सज-धज कर बैठा।',
    category: 'Food & Culture'
  },
  {
    id: 'dict-35',
    wordPawari: 'बन्नी',
    wordDevanagari: 'बन्नी',
    phoneticEn: 'Banni',
    partOfSpeech: 'noun',
    meaningHindi: 'दुल्हन (विवाह प्रसंग)',
    meaningEnglish: 'Bride',
    exampleSentencePawari: 'बन्नी ने मंगल गीत गाए।',
    exampleSentenceHindi: 'दुल्हन ने मंगल गीत गाए।',
    category: 'Food & Culture'
  },
  {
    id: 'dict-36',
    wordPawari: 'लोकगीत',
    wordDevanagari: 'लोकगीत',
    phoneticEn: 'Lokgeet',
    partOfSpeech: 'noun',
    meaningHindi: 'पारंपरिक लोक गीत',
    meaningEnglish: 'Traditional Folk Song',
    exampleSentencePawari: 'सतपुड़ा में पवारी लोकगीत गाए।',
    exampleSentenceHindi: 'सतपुड़ा में पवारी लोकगीत गाए जाते हैं।',
    category: 'Food & Culture'
  },
  {
    id: 'dict-37',
    wordPawari: 'मटकी',
    wordDevanagari: 'मटकी',
    phoneticEn: 'Matki',
    partOfSpeech: 'noun',
    meaningHindi: 'मिट्टी का घड़ा / मटका',
    meaningEnglish: 'Earthen Water Pot',
    exampleSentencePawari: 'मटकी में ठंडा पानी आहे।',
    exampleSentenceHindi: 'मटके में ठंडा पानी है।',
    category: 'Household & General'
  },
  {
    id: 'dict-38',
    wordPawari: 'मांडना',
    wordDevanagari: 'मांडना',
    phoneticEn: 'Mandna',
    partOfSpeech: 'noun',
    meaningHindi: 'पारंपरिक भित्ति / फर्श चित्रकला',
    meaningEnglish: 'Traditional Floor Art / Mural',
    exampleSentencePawari: 'त्यौहार पर घर में मांडना बनाया।',
    exampleSentenceHindi: 'त्यौहार पर घर में मांडना बनाया।',
    category: 'Food & Culture'
  },
  {
    id: 'dict-39',
    wordPawari: 'गोटी',
    wordDevanagari: 'गोटी',
    phoneticEn: 'Goti',
    partOfSpeech: 'noun',
    meaningHindi: 'खेल की गोटियाँ / कंचा',
    meaningEnglish: 'Traditional Game Tokens / Marbles',
    exampleSentencePawari: 'बच्चे गोटी खेलें।',
    exampleSentenceHindi: 'बच्चे पारंपरिक खेल खेल रहे हैं।',
    category: 'Food & Culture'
  },
  {
    id: 'dict-40',
    wordPawari: 'काज',
    wordDevanagari: 'काज',
    phoneticEn: 'Kaaj',
    partOfSpeech: 'noun',
    meaningHindi: 'मांगलिक समारोह / विवाह उत्सव',
    meaningEnglish: 'Auspicious Ceremony / Wedding Feast',
    exampleSentencePawari: 'गाँव में बड़ा काज आहे।',
    exampleSentenceHindi: 'गाँव में बड़ा मांगलिक उत्सव है।',
    category: 'Food & Culture'
  },
  {
    id: 'dict-41',
    wordPawari: 'पवारी',
    wordDevanagari: 'पवारी',
    phoneticEn: 'Pawari',
    partOfSpeech: 'noun',
    meaningHindi: 'पवारी / भोयरी भाषा',
    meaningEnglish: 'Pawari / Bhoyari Language',
    exampleSentencePawari: 'आमी पवारी बोलतो।',
    exampleSentenceHindi: 'हम पवारी बोलते हैं।',
    category: 'Linguistics'
  },
  {
    id: 'dict-42',
    wordPawari: 'बोली',
    wordDevanagari: 'बोली',
    phoneticEn: 'Boli',
    partOfSpeech: 'noun',
    meaningHindi: 'क्षेत्रीय बोली / भाषा',
    meaningEnglish: 'Regional Dialect',
    exampleSentencePawari: 'सतपुड़ा री बोली मीठी आहे।',
    exampleSentenceHindi: 'सतपुड़ा की बोली बहुत मीठी है।',
    category: 'Linguistics'
  },
  {
    id: 'dict-43',
    wordPawari: 'शब्दकोश',
    wordDevanagari: 'शब्दकोश',
    phoneticEn: 'Shabdakosh',
    partOfSpeech: 'noun',
    meaningHindi: 'कोश / शब्द संग्रह',
    meaningEnglish: 'Dictionary / Lexicon',
    exampleSentencePawari: 'पवारी शब्दकोश तैयार केला।',
    exampleSentenceHindi: 'पवारी शब्दकोश तैयार किया गया।',
    category: 'Linguistics'
  },
  {
    id: 'dict-44',
    wordPawari: 'लिपि',
    wordDevanagari: 'लिपि',
    phoneticEn: 'Lipi',
    partOfSpeech: 'noun',
    meaningHindi: 'देवनागरी लिपि',
    meaningEnglish: 'Script / Writing System',
    exampleSentencePawari: 'देवनागरी लिपि में लेखन।',
    exampleSentenceHindi: 'देवनागरी लिपि में लेखन किया जाता है।',
    category: 'Linguistics'
  },
  {
    id: 'dict-45',
    wordPawari: 'झरा',
    wordDevanagari: 'झरा',
    phoneticEn: 'Zhara',
    partOfSpeech: 'noun',
    meaningHindi: 'प्राकृतिक झरना / जल स्रोत',
    meaningEnglish: 'Natural Spring / Waterfall',
    exampleSentencePawari: 'जंगल में सुंदर झरा आहे।',
    exampleSentenceHindi: 'जंगल में सुंदर झरना है।',
    category: 'Geography & Nature'
  },
  {
    id: 'dict-46',
    wordPawari: 'अमराई',
    wordDevanagari: 'अमराई',
    phoneticEn: 'Amrai',
    partOfSpeech: 'noun',
    meaningHindi: 'आम का बगीचा',
    meaningEnglish: 'Mango Orchard',
    exampleSentencePawari: 'अमराई में कोयल बोले।',
    exampleSentenceHindi: 'आम के बगीचे में कोयल बोलती है।',
    category: 'Geography & Nature'
  },
  {
    id: 'dict-47',
    wordPawari: 'रूख',
    wordDevanagari: 'रूख',
    phoneticEn: 'Rookh',
    partOfSpeech: 'noun',
    meaningHindi: 'वृक्ष / पेड़',
    meaningEnglish: 'Tree',
    exampleSentencePawari: 'बड़ा रूख छाया देवे।',
    exampleSentenceHindi: 'बड़ा वृक्ष छाया देता है।',
    category: 'Geography & Nature'
  },
  {
    id: 'dict-48',
    wordPawari: 'फूल',
    wordDevanagari: 'फूल',
    phoneticEn: 'Phool',
    partOfSpeech: 'noun',
    meaningHindi: 'पुष्प / फूल',
    meaningEnglish: 'Flower',
    exampleSentencePawari: 'बाग में फूल खिले।',
    exampleSentenceHindi: 'बाग में फूल खिले हैं।',
    category: 'Geography & Nature'
  },
  {
    id: 'dict-49',
    wordPawari: 'महुवा',
    wordDevanagari: 'महुआ',
    phoneticEn: 'Mahuwa',
    partOfSpeech: 'noun',
    meaningHindi: 'महुआ वृक्ष एवं पुष्प',
    meaningEnglish: 'Madhuca Longifolia (Mahua Tree)',
    exampleSentencePawari: 'महुवा बीनने लोग जंगल गए।',
    exampleSentenceHindi: 'महुआ बीनने लोग जंगल गए।',
    category: 'Geography & Nature'
  },
  {
    id: 'dict-50',
    wordPawari: 'चारोली',
    wordDevanagari: 'चारोली',
    phoneticEn: 'Charoli',
    partOfSpeech: 'noun',
    meaningHindi: 'चारोली बीज / मेवा',
    meaningEnglish: 'Chironji Nut / Seed',
    exampleSentencePawari: 'सतपुड़ा के वनों में चारोली मिलती है।',
    exampleSentenceHindi: 'सतपुड़ा के वनों में चारोली पाई जाती है।',
    category: 'Geography & Nature'
  },
  {
    id: 'dict-51',
    wordPawari: 'चोखा',
    wordDevanagari: 'चोखा',
    phoneticEn: 'Chokha',
    partOfSpeech: 'adjective',
    meaningHindi: 'अच्छा / शुद्ध / श्रेष्ठ',
    meaningEnglish: 'Good / Pure / Excellent',
    exampleSentencePawari: 'यह पवारी शब्द चोखा आहे।',
    exampleSentenceHindi: 'यह पवारी शब्द बहुत अच्छा है।',
    category: 'Adjectives'
  },
  {
    id: 'dict-52',
    wordPawari: 'भारी',
    wordDevanagari: 'भारी',
    phoneticEn: 'Bhaari',
    partOfSpeech: 'adjective',
    meaningHindi: 'बहुत / अत्यधिक / भारी',
    meaningEnglish: 'Very / Heavy / Great',
    exampleSentencePawari: 'आज भारी धूप आहे।',
    exampleSentenceHindi: 'आज बहुत तेज धूप है।',
    category: 'Adjectives'
  },
  {
    id: 'dict-53',
    wordPawari: 'लहाना',
    wordDevanagari: 'लहाना',
    phoneticEn: 'Lahana',
    partOfSpeech: 'adjective',
    meaningHindi: 'छोटा / कम उम्र',
    meaningEnglish: 'Small / Younger',
    exampleSentencePawari: 'मना लहाना भाई शाळेत जाई।',
    exampleSentenceHindi: 'मेरा छोटा भाई स्कूल जाता है।',
    category: 'Adjectives'
  },
  {
    id: 'dict-54',
    wordPawari: 'मोठा',
    wordDevanagari: 'मोठा',
    phoneticEn: 'Motha',
    partOfSpeech: 'adjective',
    meaningHindi: 'बड़ा / महान',
    meaningEnglish: 'Big / Elder / Great',
    exampleSentencePawari: 'मोठा आदमी सबका आदर करे।',
    exampleSentenceHindi: 'बड़े लोग सबका आदर करते हैं।',
    category: 'Adjectives'
  },
  {
    id: 'dict-55',
    wordPawari: 'आज',
    wordDevanagari: 'आज',
    phoneticEn: 'Aaj',
    partOfSpeech: 'adverb',
    meaningHindi: 'आज (वर्तमान दिन)',
    meaningEnglish: 'Today',
    exampleSentencePawari: 'आज कुल सम्मेलन आहे।',
    exampleSentenceHindi: 'आज कुल सम्मेलन है।',
    category: 'Adverbs'
  },
  {
    id: 'dict-56',
    wordPawari: 'काल',
    wordDevanagari: 'काल',
    phoneticEn: 'Kaal',
    partOfSpeech: 'adverb',
    meaningHindi: 'कल (बीता हुआ या आने वाला)',
    meaningEnglish: 'Yesterday / Tomorrow',
    exampleSentencePawari: 'काल मुलताई मेला था।',
    exampleSentenceHindi: 'कल मुलताई में मेला था।',
    category: 'Adverbs'
  },
  {
    id: 'dict-57',
    wordPawari: 'धाव',
    wordDevanagari: 'धाव',
    phoneticEn: 'Dhaav',
    partOfSpeech: 'verb',
    meaningHindi: 'दौड़ना',
    meaningEnglish: 'To Run',
    exampleSentencePawari: 'बच्चा मैदान में धाव रहा है।',
    exampleSentenceHindi: 'बच्चा मैदान में दौड़ रहा है।',
    category: 'Verbs'
  },
  {
    id: 'dict-58',
    wordPawari: 'हसे',
    wordDevanagari: 'हसे',
    phoneticEn: 'Hase',
    partOfSpeech: 'verb',
    meaningHindi: 'हँसना / मुस्कुराना',
    meaningEnglish: 'To Laugh / Smile',
    exampleSentencePawari: 'सब लोग हसे।',
    exampleSentenceHindi: 'सब लोग हँसे।',
    category: 'Verbs'
  },
  {
    id: 'dict-59',
    wordPawari: 'रडे',
    wordDevanagari: 'रडे',
    phoneticEn: 'Rade',
    partOfSpeech: 'verb',
    meaningHindi: 'रोना',
    meaningEnglish: 'To Cry',
    exampleSentencePawari: 'छोटा बालक रडे।',
    exampleSentenceHindi: 'छोटा बच्चा रो रहा है।',
    category: 'Verbs'
  },
  ...EXTENDED_DICTIONARY
];

export const INITIAL_LOKGEET: Lokgeet[] = [
  {
    id: 'lokgeet-1',
    titlePawari: 'हल्दी कुटई अउर मांगलिक विवाह गीत',
    titleHindi: 'विवाह शुभ हल्दी एवं मङ्गल गान',
    category: 'Vivah (विवाह)',
    lyricsDevanagari: `हल्दी तो कुटाए मोरी लाड़ली बन्नी की,
हरी हरी डलिया में पीली पीली हल्दी।
धार से आई बन्ना जी नी गाड़ियाँ,
मुलताई में बाजे ढोल शहनाइयाँ।
सदा सुहागन रहे मना लाड़ली,
ताप्ती मैया देवे शुभ आशीष।`,
    meaningHindi: 'कन्या विवाह के समय हल्दी कुटने की पारंपरिक रस्म का मङ्गल गीत, जिसमें ताप्ती नदी की कृपा तथा विवाह में आने वाले अतिथियों का स्वागत दर्शाया गया है।',
    collectorName: 'डॉ. आनंद राव भोयर',
    region: 'मुलताई एवं प्रभातपट्टन क्षेत्र, बैतूल',
    tags: ['विवाह गीत', 'हल्दी रस्म', 'सतपुड़ा परंपरा']
  },
  {
    id: 'lokgeet-2',
    titlePawari: 'सावन में झूला अउर कजली गीत',
    titleHindi: 'सावन मास हिंडोला एवं कजरी गीत',
    category: 'Sawan (सावन)',
    lyricsDevanagari: `सावन का महिना लागो रे सखी,
डोंगर पर छाई हरियाली।
अमुआ री डाल पर झूला पडो आहे,
झूले मोरी पवारी बहिनियाँ।
ताप्ती में छायो हरियो पानी,
गावे सब मिलके कजली री बानी।`,
    meaningHindi: 'सावन मास में पेड़ों पर झूले डालने तथा सखियों द्वारा प्राकृतिक सुंदरता एवं ताप्ती नदी के जल प्रवाह का बखान करते हुए गाए जाने वाला पारंपरिक पवारी गीत।',
    collectorName: 'डॉ. सुनीता पंवार',
    region: 'छिंदवाड़ा एवं बैतूल अंचल',
    tags: ['सावन गीत', 'कजरी', 'प्रकृति']
  },
  {
    id: 'lokgeet-3',
    titlePawari: 'गौली एवं कृषि श्रम लोकगीत',
    titleHindi: 'गौली (गो-पालन) एवं धान रोपाई गीत',
    category: 'Gaoli (गौली)',
    lyricsDevanagari: `काली मिट्टी में धान रोपाए,
पानी बरसे झमझम।
बैल जोड़ी आगे चले,
हल जोते मना किसान बापू।
गोमाता नी सेवा करो रे भैया,
सतपुड़ा में गूँजे गौली री तान।`,
    meaningHindi: 'धान की रोपाई तथा गो-पालन के समय किसानों एवं चरवाहों द्वारा स्फूर्ति एवं उमंग बढ़ाने के लिए गाए जाने वाला पारंपरिक पवारी श्रम गीत।',
    collectorName: 'विनायक राव परमार',
    region: 'सौंसर एवं मुलताई क्षेत्र',
    tags: ['कृषि गीत', 'गौली', 'धान रोपाई']
  }
];

export const INITIAL_PAHELI: Paheli[] = [
  {
    id: 'pah-1',
    questionPawari: 'हरियो घोर, लाल कपाट, अंदर बैठे काले साहब। बुझौ का आहे?',
    questionHindi: 'हरा घर, लाल किवाड़, अंदर बैठे काले साहब। बताओ क्या है?',
    answerPawari: 'तरबूज (तरबूज)',
    answerHindi: 'तरबूज (Watermelon)',
    explanation: 'बाहर से हरा, अंदर से लाल और काले बीज होते हैं।',
    difficulty: 'easy'
  },
  {
    id: 'pah-2',
    questionPawari: 'एक थार में मोती भरा, सब के माथे उल्टी पड़ा। बुझौ का आहे?',
    questionHindi: 'एक थाल में मोती भरा, सबके सिर पर उल्टा पड़ा। बताओ क्या है?',
    answerPawari: 'आकाश अउर तारामंडल',
    answerHindi: 'आकाश और तारे (Sky & Stars)',
    explanation: 'आकाश थाल की तरह फैला है और तारे मोतियों की तरह चमकते हैं।',
    difficulty: 'medium'
  },
  {
    id: 'pah-3',
    questionPawari: 'बिना गोड़ के भागे, बिना मुँह के चिल्लाए। बुझौ का आहे?',
    questionHindi: 'बिना पैर के भागे, बिना मुँह के चिल्लाए। बताओ क्या है?',
    answerPawari: 'हवा / पवन',
    answerHindi: 'हवा / पवन (Wind)',
    explanation: 'हवा बिना पैरों के बहती है और सनसनाती आवाज़ करती है।',
    difficulty: 'easy'
  }
];

export const INITIAL_GOTRAS: GotraItem[] = [
  {
    id: 'gotra-1',
    gotraName: 'परमार / पंवार / पवार (Parmar / Panwar)',
    dynasty: 'परमार राजवंश (धार-उज्जैन)',
    kuldevi: 'माँ गढ़ कालिका / माँ हरसिद्धि / माँ ताप्ती',
    kuldevta: 'राजा विक्रमादित्य / भगवान शिव',
    primaryLocation: 'धार, उज्जैन, मुलताई, छिंदवाड़ा, बालाघाट, गोंदिया',
    historicalNote: 'मूल रूप से मालवा की धारा नगरी (धार) के शासक राजवंश के वंशज। 14वीं-15वीं शताब्दी में गोंडवाना एवं सतपुड़ा क्षेत्र में प्रवासन हुआ।',
    subClans: ['धार के पवार', 'बैतूल के भोयर पवार', 'बालाघाट के पंवार', 'नागपुर के पवार']
  },
  {
    id: 'gotra-2',
    gotraName: 'चौहान (Chouhan)',
    dynasty: 'चौहान वंश',
    kuldevi: 'माँ शाकंभरी / माँ आशापुरा',
    kuldevta: 'भगवान सूर्य',
    primaryLocation: 'मुलताई, बैतूल, सिवनी, अमरावती',
    historicalNote: 'अजमेर एवं दिल्ली से परमार काल में मालवा आए और कालान्तर में सतपुड़ा की उपजाऊ ताप्ती घाटी में बसे।',
    subClans: ['देवड़ा चौहान', 'खींची चौहान', 'भोयर चौहान']
  },
  {
    id: 'gotra-3',
    gotraName: 'सोलंकी / चालुक्य (Solanki)',
    dynasty: 'सोलंकी राजवंश',
    kuldevi: 'माँ सिद्धेश्वरी / माँ ताप्ती',
    kuldevta: 'भगवान सोमनाथ',
    primaryLocation: 'छिंदवाड़ा, मुलताई, गोंदिया',
    historicalNote: 'अणहिलवाड़ (पाटन, गुजरात) एवं मालवा से जुड़े प्राचीन क्षत्रिय गोत्र की शाखा।',
    subClans: ['सोलंकी पवार', 'चालुक्य']
  },
  {
    id: 'gotra-4',
    gotraName: 'राठौड़ (Rathore)',
    dynasty: 'राठौड़ वंश',
    kuldevi: 'माँ नागणेची / माँ कालिका',
    kuldevta: 'भगवान विष्णु',
    primaryLocation: 'बैतूल, सारणी, मुलताई, वर्धा',
    historicalNote: 'मारवाड़ एवं मालवा से संबंध रखने वाले राठौड़ पवार जो सतपुड़ा अंचल की कृषि एवं सांस्कृतिक समृद्धि के स्तंभ हैं।',
    subClans: ['राठौड़ पवार', 'भोयर राठौड़']
  }
];

export const INITIAL_DOCUMENTS: HistoricalDocument[] = [
  {
    id: 'doc-1',
    title: 'ताप्ती माहात्म्य एवं मुलताई ताम्रपत्र प्रतिलिपि',
    period: 'मध्यकाल (परमार/मराठा काल)',
    source: 'माँ ताप्ती मंदिर अभिलेखागार, मुलताई',
    description: 'मुलताई सरोवर एवं ताप्ती नदी के धार्मिक-ऐतिहासिक महत्त्व का वर्णन करने वाली प्राचीन संस्कृत-पवारी लिपि पांडुलिपि।',
    transcription: 'श्री मूलतापी क्षेत्रे सूर्यपुत्री ताप्ती सरसः तटे परमार नृपेण निर्मितम...',
    imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=800',
    category: 'Old Manuscript'
  },
  {
    id: 'doc-2',
    title: 'धार-मालवा से गोंडवाना प्रवासन वंशवृक्ष अभिलेख',
    period: '16वीं शताब्दी',
    source: 'सतपुड़ा शोध पुरालेख कक्ष',
    description: 'परमार वंश के धार से मुलताई एवं छिंदवाड़ा आगमन का भाट-हेड़ाऊ हस्तलिखित गोत्र संग्रह बही।',
    transcription: 'संवत १६५० मालवा से चले पवार बीरा, ताप्ती तटे कियो निवासा...',
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800',
    category: 'Genealogy Scroll'
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    title: 'राष्ट्रीय पवारी भाषा एवं सतपुड़ा इतिहास संगोष्ठी 2026',
    date: '15 अक्टूबर 2026',
    time: 'प्रातः 10:00 बजे से सायंकाल 05:00 बजे तक',
    location: 'माँ ताप्ती शोध संस्थान सभागार, मुलताई (बैतूल)',
    description: 'देशभर के वरिष्ठ भाषाविदों, इतिहासकारों एवं शोधार्थियों द्वारा पवारी भाषा के लिपि, कोश तथा परमार राजवंश के सतपुड़ा अंचल में योगदान पर शोध पत्रों का वाचन।',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
    isUpcoming: true
  },
  {
    id: 'evt-2',
    title: 'ताप्ती महोत्सव एवं पवारी लोकगीत प्रतियोगिता',
    date: '12 नवंबर 2026',
    time: 'सायंकाल 06:00 बजे',
    location: 'ताप्ती सरोवर तट मंच, मुलताई',
    description: 'पारंपरिक पवारी लोकगीतों, गौली गानों एवं विवाह गीतों की भव्य प्रस्तुति एवं युवा लोकगायकों का सम्मान।',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=800',
    isUpcoming: true
  }
];

export const INITIAL_NEWS: NewsAnnouncement[] = [
  {
    id: 'news-1',
    title: 'पवारी शोध पत्रिका: वर्ष 1 अंक 2 का डिजिटल विमोचन',
    date: '2025-12-20',
    summary: 'माँ ताप्ती शोध संस्थान मुलताई द्वारा पत्रिका का नया अंक ऑनलाइन एवं ओपन एक्सेस माध्यम से जारी कर दिया गया है।',
    content: 'पत्रिका के नए अंक में ताप्ती घाटी के पुरातात्विक अवशेषों तथा पवारी लोकगीतों के साहित्यिक सौंदर्य पर आठ उच्चस्तरीय अनुसंधान पत्र प्रकाशित किए गए हैं। पाठकों के लिए सभी पीडीएफ निशुल्क डाउनलोड हेतु उपलब्ध हैं।',
    category: 'Journal',
    important: true
  },
  {
    id: 'news-2',
    title: 'शोध पत्रों के आमंत्रण हेतु अधिसूचना (Call for Papers - June 2026 Issue)',
    date: '2026-01-10',
    summary: 'जून 2026 के आगामी अंक हेतु शोधार्थियों से पवारी भाषा, इतिहास, लोकसाहित्य एवं नृविज्ञान विषयक शोध लेख आमंत्रित हैं।',
    content: 'सभी शोध पत्र हिंदी, अंग्रेजी या पवारी भाषा में स्वीकार्य हैं। अंतिम तिथि 30 अप्रैल 2026 निर्धारित की गई है। शोध पत्र ऑनलाइन सबमिशन पोर्टल के माध्यम से भेजें।',
    category: 'Journal',
    important: true
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'माँ ताप्ती सरोवर मुलताई',
    caption: 'ताप्ती नदी का पावन उद्गम स्थल एवं ऐतिहासिक सरोवर',
    category: 'Sansthan',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800',
    date: '2025-10-10'
  },
  {
    id: 'gal-2',
    title: 'पवारी शब्दकोश लोकार्पण समारोह',
    caption: 'माँ ताप्ती शोध संस्थान मुलताई में विद्वानों द्वारा ग्रंथ का विमोचन',
    category: 'Seminar',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800',
    date: '2025-08-15'
  },
  {
    id: 'gal-3',
    title: 'सतपुड़ा अंचल लोकसंस्कृति शोध यात्रा',
    caption: 'मुलताई एवं प्रभातपट्टन गाँवों में लोकगीतों का संकलन',
    category: 'Field Work',
    imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800',
    date: '2025-05-20'
  }
];

export const DEFAULT_USER: UserProfile = {
  id: 'usr-admin-01',
  name: 'डॉ. रमेश चंद्र पवार (Chief Editor)',
  email: 'rupeshpawar10@gmail.com', // User email from runtime
  role: 'super_admin',
  affiliation: 'माँ ताप्ती शोध संस्थान, मुलताई',
  bio: 'प्रधान संपादक एवं पवारी भाषाविद्',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
  createdAt: '2025-01-01'
};
