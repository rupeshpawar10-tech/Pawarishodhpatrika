import React, { useState, useMemo } from 'react';
import { EditorialMember, EditorialRoleType, WorkflowStatus } from '../types/editorial';
import { EditorialService, ALL_EDITORIAL_ROLES } from '../services/editorialService';
import { useAuth } from '../context/AuthContext';
import { ImageUpload } from '../components/ImageUpload';
import {
  Users,
  Search,
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Grid3X3,
  Image as ImageIcon,
  Award,
  Globe,
  Building2,
  Mail,
  FileText,
  ExternalLink,
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  Archive,
  RotateCcw,
  Copy,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  BookOpen,
  Briefcase,
  GraduationCap,
  Sparkles,
  X,
  Upload
} from 'lucide-react';

export const EditorialBoardPage: React.FC = () => {
  const { user, canManageCMS } = useAuth();
  const [members, setMembers] = useState<EditorialMember[]>(() => EditorialService.getMembers());
  
  // View & Filtering State
  const [activeTab, setActiveTab] = useState<'board' | 'team' | 'office' | 'policies' | 'review' | 'advisory'>('board');
  const [viewMode, setViewMode] = useState<'card' | 'grid' | 'table' | 'gallery'>('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'custom' | 'alphabetical' | 'role' | 'country' | 'institution'>('custom');

  // Selected Profile Modal State
  const [activeProfile, setActiveProfile] = useState<EditorialMember | null>(null);

  // Admin CRUD Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<EditorialMember | null>(null);

  // Form State for CRUD
  const [formData, setFormData] = useState<Partial<EditorialMember>>({
    fullName: '',
    title: 'डॉ.',
    designation: '',
    role: 'Editorial Board Member',
    biography: '',
    qualification: '',
    specialization: '',
    institution: '',
    department: '',
    city: '',
    state: '',
    country: 'भारत',
    email: '',
    phone: '',
    orcid: '',
    googleScholar: '',
    researchGate: '',
    academia: '',
    linkedIn: '',
    personalWebsite: '',
    languages: ['हिंदी', 'अंग्रेज़ी'],
    researchInterests: [],
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    cvPdfUrl: '',
    journalId: 'journal-tapti-1',
    volumeNumber: 15,
    issueNumber: 1,
    status: 'published',
    displayOrder: members.length + 1
  });

  const [interestInput, setInterestInput] = useState('');

  // Filter and Sort Logic
  const filteredMembers = useMemo(() => {
    let result = [...members];

    // Tab filter simulation
    if (activeTab === 'advisory') {
      result = result.filter(m => m.role === 'Advisory Board Member' || m.role === 'Patron' || m.role === 'Founder');
    } else if (activeTab === 'review') {
      result = result.filter(m => m.role === 'Reviewer' || m.role === 'Review Editor');
    } else if (activeTab === 'office') {
      result = result.filter(m => ['Managing Editor', 'Executive Editor', 'Language Editor', 'Technical Editor'].includes(m.role));
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(m =>
        m.fullName.toLowerCase().includes(term) ||
        m.institution.toLowerCase().includes(term) ||
        m.country.toLowerCase().includes(term) ||
        m.role.toLowerCase().includes(term) ||
        m.specialization.toLowerCase().includes(term)
      );
    }

    if (selectedRoleFilter !== 'all') {
      result = result.filter(m => m.role === selectedRoleFilter);
    }

    if (selectedCountryFilter !== 'all') {
      result = result.filter(m => m.country === selectedCountryFilter);
    }

    // Sorting
    if (sortBy === 'custom') {
      result.sort((a, b) => a.displayOrder - b.displayOrder);
    } else if (sortBy === 'alphabetical') {
      result.sort((a, b) => a.fullName.localeCompare(b.fullName));
    } else if (sortBy === 'role') {
      result.sort((a, b) => a.role.localeCompare(b.role));
    } else if (sortBy === 'country') {
      result.sort((a, b) => a.country.localeCompare(b.country));
    } else if (sortBy === 'institution') {
      result.sort((a, b) => a.institution.localeCompare(b.institution));
    }

    return result;
  }, [members, activeTab, searchTerm, selectedRoleFilter, selectedCountryFilter, sortBy]);

  const countriesList = useMemo(() => {
    const set = new Set(members.map(m => m.country));
    return Array.from(set);
  }, [members]);

  // Admin Actions
  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      fullName: '',
      title: 'डॉ.',
      designation: '',
      role: 'Editorial Board Member',
      biography: '',
      qualification: '',
      specialization: '',
      institution: '',
      department: '',
      city: '',
      state: '',
      country: 'भारत',
      email: '',
      phone: '',
      orcid: '',
      googleScholar: '',
      researchGate: '',
      academia: '',
      linkedIn: '',
      personalWebsite: '',
      languages: ['हिंदी', 'अंग्रेज़ी'],
      researchInterests: ['लोकसाहित्य'],
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      cvPdfUrl: '',
      journalId: 'journal-tapti-1',
      volumeNumber: 15,
      issueNumber: 1,
      status: 'published',
      displayOrder: members.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: EditorialMember) => {
    setEditingMember(member);
    setFormData({ ...member });
    setIsModalOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      alert('कृपया पूर्ण नाम और ईमेल दर्ज करें।');
      return;
    }

    const memberToSave: EditorialMember = {
      id: editingMember ? editingMember.id : `ed-${Date.now()}`,
      fullName: formData.fullName || '',
      title: formData.title || 'डॉ.',
      designation: formData.designation || '',
      role: (formData.role as EditorialRoleType) || 'Editorial Board Member',
      biography: formData.biography || '',
      qualification: formData.qualification || '',
      specialization: formData.specialization || '',
      institution: formData.institution || '',
      department: formData.department || '',
      city: formData.city || '',
      state: formData.state || '',
      country: formData.country || 'भारत',
      email: formData.email || '',
      phone: formData.phone || '',
      orcid: formData.orcid || '',
      googleScholar: formData.googleScholar || '',
      researchGate: formData.researchGate || '',
      academia: formData.academia || '',
      linkedIn: formData.linkedIn || '',
      personalWebsite: formData.personalWebsite || '',
      languages: formData.languages || ['हिंदी', 'अंग्रेज़ी'],
      researchInterests: formData.researchInterests || [],
      photoUrl: formData.photoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
      cvPdfUrl: formData.cvPdfUrl || '',
      appointmentLetterUrl: formData.appointmentLetterUrl || '',
      certificateUrls: formData.certificateUrls || [],
      journalId: formData.journalId || 'journal-tapti-1',
      volumeNumber: formData.volumeNumber || 15,
      issueNumber: formData.issueNumber || 1,
      status: (formData.status as WorkflowStatus) || 'published',
      displayOrder: formData.displayOrder || members.length + 1,
      createdAt: editingMember ? editingMember.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    EditorialService.saveMember(memberToSave);
    setMembers(EditorialService.getMembers());
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('क्या आप इस संपादकीय सदस्य को हटाना चाहते हैं?')) {
      EditorialService.deleteMember(id);
      setMembers(EditorialService.getMembers());
    }
  };

  const handleArchive = (id: string) => {
    EditorialService.archiveMember(id);
    setMembers(EditorialService.getMembers());
  };

  const handleRestore = (id: string) => {
    EditorialService.restoreMember(id);
    setMembers(EditorialService.getMembers());
  };

  const handleDuplicate = (id: string) => {
    EditorialService.duplicateMember(id);
    setMembers(EditorialService.getMembers());
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const list = [...filteredMembers];
    if (direction === 'up' && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
    } else if (direction === 'down' && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
    }
    const newOrderedIds = list.map(m => m.id);
    EditorialService.reorderMembers(newOrderedIds);
    setMembers(EditorialService.getMembers());
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 pb-20 transition-colors">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-900 via-amber-900 to-red-950 text-amber-100 py-12 px-4 sm:px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-amber-300 border border-amber-500/30 mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>माँ ताप्ती शोध संस्थान • ISSN 2583-987X</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-white mb-2">
              संपादकीय मंडल (Editorial Board & Team)
            </h1>
            <p className="text-amber-200/90 text-sm max-w-2xl font-serif">
              राष्ट्रीय एवं अंतर्राष्ट्रीय ख्याति प्राप्त विद्वानों, भाषा वैज्ञानिकों, विषय विशेषज्ञों और शोध संपादकों का गतिशील एवं पारदर्शी मंडल।
            </p>
          </div>

          {canManageCMS && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-5 py-3 rounded-xl font-semibold shadow-xl transition transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>नया सदस्य जोड़ें (Add Member)</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-md border border-amber-200/60 dark:border-stone-800 p-2 flex flex-wrap gap-2 mb-8">
          {[
            { id: 'board', label: 'सम्पूर्ण संपादकीय मंडल (Full Board)', icon: Users },
            { id: 'team', label: 'संपादकीय टीम (Team)', icon: Sparkles },
            { id: 'office', label: 'संपादकीय कार्यालय (Office)', icon: Briefcase },
            { id: 'review', label: 'समीक्षक मंडल (Review Board)', icon: ShieldCheck },
            { id: 'advisory', label: 'सलाहकार बोर्ड (Advisory Board)', icon: GraduationCap },
            { id: 'policies', label: 'संपादकीय नीतियाँ (Policies)', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-amber-50 dark:hover:bg-stone-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'policies' ? (
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-8 shadow-md border border-amber-200/60 dark:border-stone-800 space-y-6">
            <h2 className="text-2xl font-serif font-bold text-red-900 dark:text-amber-400">
              संपादकीय नीतियाँ एवं आचार संहिता (Editorial Policies & Ethics)
            </h2>
            <div className="prose dark:prose-invert max-w-none text-stone-700 dark:text-stone-300 space-y-4 font-serif text-sm">
              <p>
                <strong>1. सह-समीक्षा नीति (Peer Review Policy):</strong> माँ ताप्ती शोध संस्थान द्वारा प्रकाशित सभी शोध पत्र डबल-ब्लाइन्ड सह-समीक्षा (Double-Blind Peer Review) प्रक्रिया के अधीन होते हैं। समीक्षकों की पहचान पूर्णतः गोपनीय रखी जाती है।
              </p>
              <p>
                <strong>2. नैतिकता एवं साहित्यिक चोरी (Plagiarism Ethics):</strong> शोध पत्रों में मौलिकता अनिवार्य है। 10% से अधिक साहित्यिक चोरी पाए जाने पर शोध पत्र अस्वीकार कर दिया जाता है।
              </p>
              <p>
                <strong>3. ओपन एक्सेस नीति (Open Access):</strong> पत्रिका के सभी अंक पाठकों एवं शोधार्थियों के लिए पूर्णतः निःशुल्क एवं डिजिटल रूप से उपलब्ध हैं।
              </p>
              <p>
                <strong>4. कॉपीराइट एवं अधिकार (Copyright):</strong> लेखकों के पास उनके मौलिक विचारों का कॉपीराइट सुरक्षित रहता है, जबकि संस्थान को प्रथम प्रकाशन का अधिकार प्राप्त होता है।
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Search, Filter & View Controls */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-md border border-amber-200/60 dark:border-stone-800 p-4 sm:p-6 mb-8 flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Search Box */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="नाम, पद, संस्थान या देश से खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200 rounded-xl border border-amber-200 dark:border-stone-800 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Filters & Sorters */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
                {/* Role Filter */}
                <select
                  value={selectedRoleFilter}
                  onChange={(e) => setSelectedRoleFilter(e.target.value)}
                  className="px-3 py-2 bg-stone-50 dark:bg-stone-950 text-stone-700 dark:text-stone-300 rounded-xl border border-amber-200 dark:border-stone-800 text-xs"
                >
                  <option value="all">सभी भूमिकाएँ (All Roles)</option>
                  {ALL_EDITORIAL_ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>

                {/* Country Filter */}
                <select
                  value={selectedCountryFilter}
                  onChange={(e) => setSelectedCountryFilter(e.target.value)}
                  className="px-3 py-2 bg-stone-50 dark:bg-stone-950 text-stone-700 dark:text-stone-300 rounded-xl border border-amber-200 dark:border-stone-800 text-xs"
                >
                  <option value="all">सभी देश (All Countries)</option>
                  {countriesList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 bg-stone-50 dark:bg-stone-950 text-stone-700 dark:text-stone-300 rounded-xl border border-amber-200 dark:border-stone-800 text-xs"
                >
                  <option value="custom">क्रम (Custom Order)</option>
                  <option value="alphabetical">वर्णमाला (Alphabetical)</option>
                  <option value="role">भूमिका (Role)</option>
                  <option value="country">देश (Country)</option>
                  <option value="institution">संस्थान (Institution)</option>
                </select>

                {/* View Mode Buttons */}
                <div className="flex items-center bg-stone-100 dark:bg-stone-950 p-1 rounded-xl border border-amber-200 dark:border-stone-800">
                  <button
                    onClick={() => setViewMode('card')}
                    className={`p-2 rounded-lg transition ${viewMode === 'card' ? 'bg-amber-600 text-white' : 'text-stone-600 dark:text-stone-400'}`}
                    title="Card View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-amber-600 text-white' : 'text-stone-600 dark:text-stone-400'}`}
                    title="Grid View"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-lg transition ${viewMode === 'table' ? 'bg-amber-600 text-white' : 'text-stone-600 dark:text-stone-400'}`}
                    title="Table View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('gallery')}
                    className={`p-2 rounded-lg transition ${viewMode === 'gallery' ? 'bg-amber-600 text-white' : 'text-stone-600 dark:text-stone-400'}`}
                    title="Photo Gallery"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-xs text-stone-500 font-medium">
                कुल प्रदर्शित सदस्य: <strong className="text-amber-600 dark:text-amber-400">{filteredMembers.length}</strong>
              </span>
              {canManageCMS && (
                <span className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-stone-900 px-3 py-1 rounded-lg border border-amber-200 dark:border-stone-800">
                  🔐 एडमिन मोड सक्रिय: आप सदस्यों का क्रम बदल सकते हैं, संपादित या हटा सकते हैं।
                </span>
              )}
            </div>

            {/* Members Display Views */}
            {filteredMembers.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-2xl border border-amber-200 dark:border-stone-800">
                <Users className="w-12 h-12 text-stone-400 mx-auto mb-3" />
                <h3 className="text-lg font-serif font-bold">कोई संपादकीय सदस्य नहीं मिला</h3>
                <p className="text-xs text-stone-500 mt-1">कृपया अपनी खोज या फ़िल्टर बदलें।</p>
              </div>
            ) : viewMode === 'card' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member, idx) => (
                  <div
                    key={member.id}
                    className="bg-white dark:bg-stone-900 rounded-2xl border border-amber-200/60 dark:border-stone-800 shadow-md hover:shadow-xl transition flex flex-col overflow-hidden group"
                  >
                    <div className="p-6 flex items-start gap-4">
                      <img
                        src={member.photoUrl}
                        alt={member.fullName}
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500/30 shadow-md group-hover:scale-105 transition"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold mb-1">
                          {member.role}
                        </span>
                        <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100 truncate">
                          {member.fullName}
                        </h3>
                        <p className="text-xs text-stone-600 dark:text-stone-400 truncate">
                          {member.designation}
                        </p>
                        <p className="text-[11px] text-stone-500 dark:text-stone-500 flex items-center gap-1 mt-1 truncate">
                          <Building2 className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{member.institution}, {member.country}</span>
                        </p>
                      </div>
                    </div>

                    <div className="px-6 py-3 bg-stone-50 dark:bg-stone-950/50 border-t border-amber-100 dark:border-stone-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {member.orcid && (
                          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-mono">
                            ORCID
                          </span>
                        )}
                        {member.googleScholar && (
                          <span className="text-[10px] bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded font-mono">
                            Scholar
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setActiveProfile(member)}
                        className="text-amber-700 dark:text-amber-400 hover:underline font-semibold flex items-center gap-1"
                      >
                        <span>प्रोफाइल देखें</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {canManageCMS && (
                      <div className="px-6 py-2.5 bg-amber-50/80 dark:bg-stone-950 border-t border-amber-200/60 dark:border-stone-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMoveOrder(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 rounded hover:bg-amber-200 dark:hover:bg-stone-800 disabled:opacity-30"
                            title="पर ले जाएँ (Move Up)"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveOrder(idx, 'down')}
                            disabled={idx === filteredMembers.length - 1}
                            className="p-1.5 rounded hover:bg-amber-200 dark:hover:bg-stone-800 disabled:opacity-30"
                            title="नीचे ले जाएँ (Move Down)"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDuplicate(member.id)}
                            className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-amber-600"
                            title="प्रतिलिपि बनाएँ (Duplicate)"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(member)}
                            className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-blue-600"
                            title="संपादित करें (Edit)"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="p-1.5 text-red-600 hover:text-red-800"
                            title="हटाएँ (Delete)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => setActiveProfile(member)}
                    className="bg-white dark:bg-stone-900 rounded-2xl border border-amber-200 dark:border-stone-800 p-4 text-center shadow hover:shadow-lg transition cursor-pointer group"
                  >
                    <img
                      src={member.photoUrl}
                      alt={member.fullName}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-2 border-amber-500/40 group-hover:scale-105 transition"
                    />
                    <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                      {member.fullName}
                    </h4>
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5 truncate">
                      {member.role}
                    </p>
                    <p className="text-[10px] text-stone-500 truncate mt-1">
                      {member.institution}
                    </p>
                  </div>
                ))}
              </div>
            ) : viewMode === 'table' ? (
              <div className="bg-white dark:bg-stone-900 rounded-2xl border border-amber-200/60 dark:border-stone-800 shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-amber-50 dark:bg-stone-950 text-stone-700 dark:text-stone-300 font-serif border-b border-amber-200 dark:border-stone-800">
                      <tr>
                        <th className="p-4">सदस्य (Member)</th>
                        <th className="p-4">भूमिका (Role)</th>
                        <th className="p-4">संस्थान (Institution)</th>
                        <th className="p-4">देश (Country)</th>
                        <th className="p-4">ईमेल (Email)</th>
                        {canManageCMS && <th className="p-4 text-right">कार्रवाई (Actions)</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100 dark:divide-stone-800">
                      {filteredMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-amber-50/50 dark:hover:bg-stone-800/50 transition">
                          <td className="p-4 flex items-center gap-3">
                            <img src={member.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                            <div>
                              <div className="font-serif font-bold">{member.fullName}</div>
                              <div className="text-[11px] text-stone-500">{member.designation}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                              {member.role}
                            </span>
                          </td>
                          <td className="p-4 text-stone-600 dark:text-stone-400">{member.institution}</td>
                          <td className="p-4 text-stone-600 dark:text-stone-400">{member.country}</td>
                          <td className="p-4 font-mono text-stone-600 dark:text-stone-400">{member.email}</td>
                          {canManageCMS && (
                            <td className="p-4 text-right space-x-2">
                              <button onClick={() => handleOpenEdit(member)} className="text-blue-600 hover:underline">संपादित करें</button>
                              <button onClick={() => handleDelete(member.id)} className="text-red-600 hover:underline">हटाएँ</button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="relative group rounded-2xl overflow-hidden shadow-lg aspect-square bg-stone-900">
                    <img src={member.photoUrl} alt={member.fullName} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
                      <h4 className="font-serif font-bold text-sm">{member.fullName}</h4>
                      <p className="text-xs text-amber-300">{member.role}</p>
                      <p className="text-[10px] text-stone-300 truncate">{member.institution}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Editor Profile Detail Modal */}
      {activeProfile && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-200 dark:border-stone-800 p-6 sm:p-8 relative">
            <button
              onClick={() => setActiveProfile(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
              <img
                src={activeProfile.photoUrl}
                alt={activeProfile.fullName}
                className="w-32 h-32 rounded-2xl object-cover border-4 border-amber-500/30 shadow-lg"
              />
              <div className="text-center sm:text-left flex-1">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold mb-2">
                  {activeProfile.role}
                </span>
                <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  {activeProfile.fullName}
                </h2>
                <p className="text-sm text-stone-600 dark:text-stone-400 font-medium">
                  {activeProfile.designation}
                </p>
                <p className="text-xs text-stone-500 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>{activeProfile.institution}, {activeProfile.department} ({activeProfile.country})</span>
                </p>
              </div>
            </div>

            <div className="space-y-6 text-sm font-serif text-stone-700 dark:text-stone-300">
              <div>
                <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">जीवनी (Biography)</h3>
                <p className="leading-relaxed bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-amber-200/50 dark:border-stone-800">
                  {activeProfile.biography || 'जीवनी उपलब्ध नहीं है।'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-amber-200/50 dark:border-stone-800">
                  <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">योग्यता (Qualification)</h4>
                  <p className="text-xs">{activeProfile.qualification || 'N/A'}</p>
                </div>
                <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-amber-200/50 dark:border-stone-800">
                  <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">विशेषज्ञता (Specialization)</h4>
                  <p className="text-xs">{activeProfile.specialization || 'N/A'}</p>
                </div>
              </div>

              {/* Research Profiles & Links */}
              <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-amber-200/50 dark:border-stone-800 space-y-2">
                <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">शोध प्रोफाइल एवं संपर्क</h3>
                <div className="flex flex-wrap gap-3 text-xs">
                  {activeProfile.email && (
                    <a href={`mailto:${activeProfile.email}`} className="flex items-center gap-1 bg-amber-100 dark:bg-stone-800 px-3 py-1.5 rounded-lg text-amber-900 dark:text-amber-300 hover:bg-amber-200 transition">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{activeProfile.email}</span>
                    </a>
                  )}
                  {activeProfile.orcid && (
                    <span className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950 px-3 py-1.5 rounded-lg text-emerald-800 dark:text-emerald-300 font-mono">
                      ORCID: {activeProfile.orcid}
                    </span>
                  )}
                  {activeProfile.googleScholar && (
                    <a href={activeProfile.googleScholar} target="_blank" rel="noreferrer" className="flex items-center gap-1 bg-blue-100 dark:bg-blue-950 px-3 py-1.5 rounded-lg text-blue-800 dark:text-blue-300">
                      Google Scholar <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {activeProfile.researchGate && (
                    <a href={activeProfile.researchGate} target="_blank" rel="noreferrer" className="flex items-center gap-1 bg-teal-100 dark:bg-teal-950 px-3 py-1.5 rounded-lg text-teal-800 dark:text-teal-300">
                      ResearchGate <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-amber-200 dark:border-stone-800 flex justify-end">
              <button
                onClick={() => setActiveProfile(null)}
                className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2.5 rounded-xl font-semibold text-xs shadow-md transition"
              >
                बंद करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-200 dark:border-stone-800 p-6 sm:p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-serif font-bold text-red-900 dark:text-amber-400 mb-6">
              {editingMember ? 'संपादकीय सदस्य संपादित करें (Edit Member)' : 'नया संपादकीय सदस्य जोड़ें (Add Member)'}
            </h2>

            <form onSubmit={handleSaveMember} className="space-y-4 text-xs font-serif">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold mb-1">उपाधि (Title)</label>
                  <select
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-amber-200 dark:border-stone-800"
                  >
                    <option value="डॉ.">डॉ. (Dr.)</option>
                    <option value="प्रो.">प्रो. (Prof.)</option>
                    <option value="श्री">श्री (Mr.)</option>
                    <option value="सुश्री">सुश्री (Ms.)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1">पूर्ण नाम (Full Name)*</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="उदा. डॉ. रामेश्वर पवार"
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-amber-200 dark:border-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">पद / डेजिग्नेशन (Designation)</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="उदा. प्रोफेसर एवं विभागाध्यक्ष"
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-amber-200 dark:border-stone-800"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">संपादकीय भूमिका (Role)*</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-amber-200 dark:border-stone-800 font-sans"
                  >
                    {ALL_EDITORIAL_ROLES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold mb-1">संस्थान (Institution)*</label>
                  <input
                    type="text"
                    required
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="उदा. दिल्ली विश्वविद्यालय"
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-amber-200 dark:border-stone-800"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">देश (Country)*</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="उदा. भारत"
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-amber-200 dark:border-stone-800"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">ईमेल (Email)*</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.org"
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-amber-200 dark:border-stone-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <ImageUpload
                  label="सम्पादक प्रोफाइल फोटो (Editorial Profile Photo Upload)"
                  value={formData.photoUrl}
                  onChange={(url) => setFormData(prev => ({ ...prev, photoUrl: url }))}
                  storagePath="editorial/photos/"
                  aspectRatio="circle"
                  maxSizeMB={5}
                  placeholderText="डेस्कटॉप/लैपटॉप/मोबाइल से फोटो अपलोड करें"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">जीवनी (Biography)</label>
                <textarea
                  rows={3}
                  value={formData.biography}
                  onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                  placeholder="संक्षिप्त परिचय एवं शैक्षणिक उपलब्धियाँ..."
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-amber-200 dark:border-stone-800"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">ORCID ID</label>
                  <input
                    type="text"
                    value={formData.orcid}
                    onChange={(e) => setFormData({ ...formData, orcid: e.target.value })}
                    placeholder="0000-0000-0000-0000"
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-amber-200 dark:border-stone-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Google Scholar Link</label>
                  <input
                    type="text"
                    value={formData.googleScholar}
                    onChange={(e) => setFormData({ ...formData, googleScholar: e.target.value })}
                    placeholder="https://scholar.google.com/..."
                    className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-amber-200 dark:border-stone-800 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-amber-200 dark:border-stone-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-stone-200 dark:bg-stone-800 font-semibold"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold shadow-md"
                >
                  सुरक्षित करें (Save Member)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
