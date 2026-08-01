export type EditorialRoleType =
  | 'Founder'
  | 'Patron'
  | 'Chief Editor'
  | 'Managing Editor'
  | 'Executive Editor'
  | 'Associate Editor'
  | 'Section Editor'
  | 'Guest Editor'
  | 'Language Editor'
  | 'Technical Editor'
  | 'Copy Editor'
  | 'Layout Editor'
  | 'Review Editor'
  | 'Editorial Board Member'
  | 'Advisory Board Member'
  | 'Reviewer';

export type WorkflowStatus = 'draft' | 'approved' | 'published' | 'archived';

export interface EditorialMember {
  id: string;
  fullName: string;
  title: string; // e.g. Prof., Dr., Mr.
  designation: string; // e.g. Professor of History
  role: EditorialRoleType;
  biography: string;
  qualification: string;
  specialization: string;
  institution: string;
  department: string;
  city: string;
  state: string;
  country: string;
  email: string;
  phone?: string;
  orcid?: string;
  googleScholar?: string;
  researchGate?: string;
  academia?: string;
  linkedIn?: string;
  personalWebsite?: string;
  languages: string[];
  researchInterests: string[];
  
  // Attachments & Photo
  photoUrl: string;
  cvPdfUrl?: string;
  appointmentLetterUrl?: string;
  certificateUrls?: string[];

  // Assignments
  journalId: string; // e.g. 'j-1' (Maa Tapti Shodh Journal)
  volumeNumber?: number;
  issueNumber?: number;

  // Metadata & Workflow
  status: WorkflowStatus;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface EditorialBoardConfig {
  id: string;
  journalName: string;
  issn: string;
  description: string;
  policies: string;
}
