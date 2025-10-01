import { useState } from 'react';
import type { Client, Case, Document, Task, Appointment, Email } from '../types';

// Mock data generation
const createClients = (): Client[] => [
  { id: 'cli-1', name: 'Kampala Industries Ltd.', email: 'contact@kampalaind.ug', phone: '+256 772 123456', address: '123 Industrial Area, Kampala', joinDate: '2020-05-12T00:00:00.000Z' },
  { id: 'cli-2', name: 'Jinja Agri-Ventures', email: 'info@jinjaagri.ug', phone: '+256 782 987654', address: '456 Main Street, Jinja', joinDate: '2021-02-20T00:00:00.000Z' },
  { id: 'cli-3', name: 'Mbarara Logistics', email: 'ops@mbararalogistics.com', phone: '+256 755 112233', address: '789 Highway, Mbarara', joinDate: '2019-11-01T00:00:00.000Z' },
];

const createCases = (): Case[] => [
  { id: 'case-1', title: 'Contract Dispute with Supplier', caseNumber: 'CIV-001-2023', clientId: 'cli-1', description: 'Dispute over the terms of a supply agreement governed by the Sale of Goods and Supply of Services Act, 2017.', status: 'Open', deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'case-2', title: 'Land Title Registration', caseNumber: 'LND-005-2023', clientId: 'cli-2', description: 'Registration of a new land title for agricultural expansion.', status: 'Pending', deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'case-3', title: 'Employment Contract Review', caseNumber: 'LAB-002-2023', clientId: 'cli-1', description: 'Review and update of standard employment contracts for new hires.', status: 'Open', deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'case-4', title: 'Corporate Restructuring Advice', caseNumber: 'CORP-003-2022', clientId: 'cli-3', description: 'Legal advice on corporate restructuring and ensuring compliance with the Companies Act, 2012.', status: 'Closed', deadline: '2022-12-15T00:00:00.000Z' },
];

const createDocuments = (): Document[] => [
  { id: 'doc-1', name: 'Supply_Agreement_v2.pdf', caseId: 'case-1', type: 'Contract', content: 'This Supply Agreement is made on this 1st day of January 2022, between Kampala Industries Ltd. ("Buyer") and Global Supplies Inc. ("Seller"). The Seller agrees to supply 500 tons of raw material per month...', uploadDate: '2023-01-15T00:00:00.000Z' },
  { id: 'doc-2', name: 'Plaint_CIV-001-2023.pdf', caseId: 'case-1', type: 'Pleading', content: 'IN THE HIGH COURT OF UGANDA AT KAMPALA (COMMERCIAL DIVISION)\\n\\nCIVIL SUIT NO. 001 OF 2023\\n\\nKAMPALA INDUSTRIES LTD...................................................PLAINTIFF\\n\\nVERSUS\\n\\nGLOBAL SUPPLIES INC...................................................DEFENDANT\\n\\nPLAINT...', uploadDate: '2023-02-01T00:00:00.000Z' },
  { id: 'doc-3', name: 'Land_Sale_Agreement.pdf', caseId: 'case-2', type: 'Contract', content: 'LAND SALE AGREEMENT\\n\\nThis agreement is made between John Doe (Vendor) and Jinja Agri-Ventures (Purchaser) for the sale of land comprised in Block 110, Plot 25, Jinja District...', uploadDate: '2023-03-10T00:00:00.000Z' },
];

const createTasks = (): Task[] => [
  { id: 'task-1', text: 'File affidavit for Kampala Industries case', completed: false },
  { id: 'task-2', text: 'Follow up with client on land title search', completed: false },
  { id: 'task-3', text: 'Draft response to demand letter', completed: true },
  { id: 'task-4', text: 'Schedule meeting with Mbarara Logistics team', completed: false },
];

const createAppointments = (): Appointment[] => [
  { id: 'appt-1', title: 'Consultation with Jinja Agri-Ventures', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), time: '10:00 AM', with: 'Mr. Okello' },
  { id: 'appt-2', title: 'Court Appearance for CIV-001-2023', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), time: '2:30 PM', with: 'Justice Opio' },
];

const createEmails = (): Email[] => [
    { id: 'email-1', sender: 'John Doe <john.doe@example.com>', subject: 'Question about our case', body: 'Dear team,\\n\\nI hope this email finds you well. I had a quick question about the status of our upcoming filing. Could you please provide an update?\\n\\nBest regards,\\nJohn Doe', receivedDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), status: 'Unread' },
    { id: 'email-2', sender: 'Jane Smith <jane.smith@corp.com>', subject: 'Request for meeting', body: 'Hello,\\n\\nI would like to schedule a meeting next week to discuss our ongoing corporate restructuring. Please let me know what time works best for you.\\n\\nThank you,\\nJane Smith', receivedDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), status: 'Unread' },
    { id: 'email-3', sender: 'Court Registry <registry@judiciary.go.ug>', subject: 'Hearing Notice: CIV-001-2023', body: 'TAKE NOTICE that the hearing of this matter has been fixed for the 25th day of October, 2024 at 9:00 AM.\\n\\nRegards,\\nClerk', receivedDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), status: 'Read' },
    { id: 'email-4', sender: 'Peter Jones <peter.j@global.com>', subject: 'Re: Follow-up', body: 'Dear Counsel,\\n\\nFurther to our previous correspondence, we have reviewed the documents and will revert with our official position shortly.\\n\\nRegards,\\nPeter', receivedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'Replied', reply: 'Dear Peter,\\n\\nThank you for the update. We look forward to hearing from you.\\n\\nBest,\\nThe Administrative Team\\nButagira & Co. Advocates' },
];

export const useMockData = () => {
  const [clients, setClients] = useState<Client[]>(createClients);
  const [cases, setCases] = useState<Case[]>(createCases);
  const [documents, setDocuments] = useState<Document[]>(createDocuments);
  const [tasks, setTasks] = useState<Task[]>(createTasks);
  const [appointments, setAppointments] = useState<Appointment[]>(createAppointments);
  const [emails, setEmails] = useState<Email[]>(createEmails);

  const updateTask = (taskId: string, completed: boolean) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed } : t));
  };

  const addDocument = (newDocument: Document) => {
    setDocuments(prev => [newDocument, ...prev]);
  };
  
  const updateDocument = (docId: string, updatedData: Partial<Omit<Document, 'id' | 'uploadDate'>>) => {
    setDocuments(documents.map(d => d.id === docId ? { ...d, ...updatedData } : d));
  };

  const addEmailReply = (emailId: string, reply: string) => {
    setEmails(emails.map(e => e.id === emailId ? { ...e, status: 'Replied', reply } : e));
  };
  
  const updateClient = (clientId: string, updatedData: Partial<Omit<Client, 'id' | 'joinDate'>>) => {
    setClients(clients.map(c => c.id === clientId ? { ...c, ...updatedData } : c));
  };

  const addClient = (clientData: Omit<Client, 'id' | 'joinDate'>) => {
    const newClient: Client = {
      ...clientData,
      id: `cli-${Date.now()}`,
      joinDate: new Date().toISOString(),
    };
    setClients(prev => [newClient, ...prev]);
  };


  return {
    clients,
    cases,
    documents,
    tasks,
    appointments,
    emails,
    stats: {
        clients: clients.length,
        cases: cases.filter(c => c.status === 'Open').length,
        documents: documents.length,
    },
    updateTask,
    addDocument,
    updateDocument,
    addEmailReply,
    updateClient,
    addClient,
  };
};