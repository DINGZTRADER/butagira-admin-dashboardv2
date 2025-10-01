export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
}

export interface Case {
  id: string;
  title: string;
  caseNumber: string;
  clientId: string;
  description: string;
  status: 'Open' | 'Closed' | 'Pending';
  deadline: string;
}

export interface Document {
  id: string;
  name: string;
  caseId: string;
  type: 'Pleading' | 'Contract' | 'Correspondence' | 'Affidavit' | 'Motion';
  content: string;
  uploadDate: string;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  with: string;
}

export interface Email {
  id: string;
  sender: string;
  subject: string;
  body: string;
  receivedDate: string;
  status: 'Unread' | 'Read' | 'Replied';
  reply?: string;
}

export interface EmailAnalysis {
  sentiment: 'Positive' | 'Negative' | 'Neutral' | 'Urgent';
  actionItems: string[];
  meetingRequests: string[];
  keyDates: string[];
  error?: string;
}

export interface AnalysisReport {
  summary: string;
  keyParties: string[];
  criticalDates: string[];
  potentialRisks: string[];
  error?: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}


export type ViewType = 'dashboard' | 'clients' | 'clientDetail' | 'cases' | 'caseDetail' | 'documents' | 'analysis' | 'email' | 'compliance' | 'search' | 'aiAssistant' | 'userManual';

export type ViewState =
  | { type: 'dashboard' }
  | { type: 'clients' }
  | { type: 'clientDetail'; id: string }
  | { type: 'cases' }
  | { type: 'caseDetail'; id: string }
  | { type: 'documents' }
  | { type: 'analysis' }
  | { type: 'aiAssistant' }
  | { type: 'email' }
  | { type: 'compliance' }
  | { type: 'userManual' }
  | { type: 'search'; query: string };