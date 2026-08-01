import { EditorialMember, EditorialRoleType, WorkflowStatus } from '../types/editorial';

const STORAGE_KEY_MEMBERS = 'mt_editorial_members_v1';
const STORAGE_KEY_BOARDS = 'mt_editorial_boards_v1';

const INITIAL_EDITORIAL_MEMBERS: EditorialMember[] = [
  {
    id: 'ed-1',
    fullName: 'डॉ. वल्लभ डोंगरे',
    title: 'डॉ.',
    designation: 'संस्थापक एवं मुख्य संरक्षक',
    role: 'Founder',
    biography: 'सतपुड़ा संस्कृति संस्थान के संस्थापक एवं पवारी लोकसाहित्य एवं शब्दकोश "रुनुक-झुनुक" के रचनाकार।',
    qualification: 'पीएच.डी. (लोकसाहित्य एवं संस्कृति)',
    specialization: 'पवारी लोकभाषा, संस्कृति एवं इतिहास',
    institution: 'सतपुड़ा संस्कृति संस्थान',
    department: 'शोध एवं अनुसंधान विभाग',
    city: 'भोपाल',
    state: 'मध्य प्रदेश',
    country: 'भारत',
    email: 'vallabhdongre6@gmail.com',
    phone: '+91 9425392656',
    orcid: '0000-0002-1829-391X',
    googleScholar: 'https://scholar.google.com',
    researchGate: 'https://researchgate.net',
    linkedIn: 'https://linkedin.com',
    languages: ['हिंदी', 'पवारी', 'संस्कृत', 'अंग्रेज़ी'],
    researchInterests: ['लोकसाहित्य', 'जनजातीय संस्कृति', 'इतिहास एवं पुरातत्व'],
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    cvPdfUrl: '#',
    journalId: 'journal-tapti-1',
    volumeNumber: 15,
    issueNumber: 1,
    status: 'published',
    displayOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ed-2',
    fullName: 'प्रो. रमेश चंद्र पवार',
    title: 'प्रो.',
    designation: 'प्रधान संपादक (Chief Editor)',
    role: 'Chief Editor',
    biography: 'उच्च शिक्षा एवं अनुसंधान के क्षेत्र में 30 वर्षों का अनुभव। अनेक प्रतिष्ठित शोध पत्रिकाओं के संपादक रहे हैं।',
    qualification: 'एम.ए., पीएच.डी., डी.लिट्',
    specialization: 'भारतीय इतिहास एवं संस्कृति',
    institution: 'बरकतउल्ला विश्वविद्यालय',
    department: 'इतिहास विभाग',
    city: 'भोपाल',
    state: 'मध्य प्रदेश',
    country: 'भारत',
    email: 'ramesh.pawar@taptishodh.org',
    orcid: '0000-0003-4920-1122',
    googleScholar: 'https://scholar.google.com',
    researchGate: 'https://researchgate.net',
    languages: ['हिंदी', 'अंग्रेज़ी'],
    researchInterests: ['मध्यकालीन इतिहास', 'अभिलेख शास्त्र'],
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    journalId: 'journal-tapti-1',
    volumeNumber: 15,
    issueNumber: 1,
    status: 'published',
    displayOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ed-3',
    fullName: 'डॉ. सुनीता ओझा',
    title: 'डॉ.',
    designation: 'कार्यकारी संपादक (Executive Editor)',
    role: 'Executive Editor',
    biography: 'पवारी एवं गोंडी लोकबोलियों की वरिष्ठ शोधकर्त्ता एवं भाषा वैज्ञानिक।',
    qualification: 'पीएच.डी. (भाषा विज्ञान)',
    specialization: 'तुलनात्मक भाषाविज्ञान',
    institution: 'संत हिरदाराम कॉलेज',
    department: 'हिंदी एवं भाषा विभाग',
    city: 'भोपाल',
    state: 'मध्य प्रदेश',
    country: 'भारत',
    email: 'sunita.ojha@taptishodh.org',
    orcid: '0000-0001-9882-7711',
    googleScholar: 'https://scholar.google.com',
    languages: ['हिंदी', 'पवारी', 'अंग्रेज़ी'],
    researchInterests: ['ध्वनिविज्ञान', 'शब्दकोश निर्माण'],
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    journalId: 'journal-tapti-1',
    status: 'published',
    displayOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ed-4',
    fullName: 'प्रो. आर्थर वान डेर वेइडेन',
    title: 'प्रो.',
    designation: 'अंतर्राष्ट्रीय सलाहकार बोर्ड सदस्य',
    role: 'Advisory Board Member',
    biography: 'साउथ एशिया लिंग्विस्टिक्स के प्रतिष्ठित प्रोफेसर और इंडोलॉजी विशेषज्ञ।',
    qualification: 'Ph.D. (Leiden University)',
    specialization: 'Indo-Aryan Linguistics',
    institution: 'Leiden University',
    department: 'Institute for Area Studies',
    city: 'Leiden',
    state: 'South Holland',
    country: 'Netherlands',
    email: 'a.vanderweijden@leidenuniv.nl',
    orcid: '0000-0002-3341-9988',
    googleScholar: 'https://scholar.google.com',
    languages: ['English', 'Dutch', 'Sanskrit'],
    researchInterests: ['Comparative Dialectology', 'Folklore'],
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    journalId: 'journal-tapti-1',
    status: 'published',
    displayOrder: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const ALL_EDITORIAL_ROLES: EditorialRoleType[] = [
  'Founder',
  'Patron',
  'Chief Editor',
  'Managing Editor',
  'Executive Editor',
  'Associate Editor',
  'Section Editor',
  'Guest Editor',
  'Language Editor',
  'Technical Editor',
  'Copy Editor',
  'Layout Editor',
  'Review Editor',
  'Editorial Board Member',
  'Advisory Board Member',
  'Reviewer'
];

export const EditorialService = {
  getMembers(): EditorialMember[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_MEMBERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(INITIAL_EDITORIAL_MEMBERS));
        return INITIAL_EDITORIAL_MEMBERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_EDITORIAL_MEMBERS;
    }
  },

  saveMember(member: EditorialMember): void {
    const members = this.getMembers();
    const index = members.findIndex(m => m.id === member.id);
    if (index >= 0) {
      members[index] = { ...member, updatedAt: new Date().toISOString() };
    } else {
      members.push({ ...member, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(members));
  },

  deleteMember(id: string): void {
    let members = this.getMembers();
    members = members.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(members));
  },

  archiveMember(id: string): void {
    const members = this.getMembers();
    const member = members.find(m => m.id === id);
    if (member) {
      member.status = 'archived';
      member.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(members));
    }
  },

  restoreMember(id: string): void {
    const members = this.getMembers();
    const member = members.find(m => m.id === id);
    if (member) {
      member.status = 'published';
      member.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(members));
    }
  },

  duplicateMember(id: string): EditorialMember | null {
    const members = this.getMembers();
    const member = members.find(m => m.id === id);
    if (!member) return null;
    const newMember: EditorialMember = {
      ...member,
      id: `ed-${Date.now()}`,
      fullName: `${member.fullName} (प्रतिलिपि)`,
      email: `copy_${member.email}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    members.push(newMember);
    localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(members));
    return newMember;
  },

  reorderMembers(orderedIds: string[]): void {
    const members = this.getMembers();
    const map = new Map<string, EditorialMember>(members.map(m => [m.id, m]));
    const reordered: EditorialMember[] = [];
    orderedIds.forEach((id, idx) => {
      const mem = map.get(id);
      if (mem) {
        mem.displayOrder = idx + 1;
        reordered.push(mem);
        map.delete(id);
      }
    });
    // Append remaining
    map.forEach(mem => reordered.push(mem));
    localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(reordered));
  }
};
