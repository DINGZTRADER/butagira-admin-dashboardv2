import React, { useState, useMemo } from 'react';
import type { ViewState } from './types';

import { useMockData } from './hooks/useMockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ClientView } from './components/ClientView';
import { CaseView } from './components/CaseView';
import { DocumentView } from './components/DocumentView';
import { AnalysisView } from './components/AnalysisView';
import { EmailView } from './components/EmailView';
import { ComplianceView } from './components/ComplianceView';
import { SearchView } from './components/SearchView';
import { AIAssistantView } from './components/AIAssistantView';
import { UserManualView } from './components/UserManualView';

function App() {
  const [view, setView] = useState<ViewState>({ type: 'dashboard' });
  const { clients, cases, documents, tasks, appointments, emails, stats, updateTask, addDocument, addEmailReply, updateClient, addClient, updateDocument } = useMockData();

  const handleSearch = (query: string) => {
    setView({ type: 'search', query });
  };

  const headerTitle = useMemo(() => {
    switch (view.type) {
      case 'dashboard': return 'Dashboard Overview';
      case 'clients': return 'Client Management';
      case 'clientDetail': return `Client Details: ${clients.find(c => c.id === view.id)?.name || ''}`;
      case 'cases': return 'Case Coordination';
      case 'caseDetail': return `Case Details: ${cases.find(c => c.id === view.id)?.title || ''}`;
      case 'documents': return 'Document Handling';
      case 'analysis': return 'AI Document Analysis';
      case 'aiAssistant': return 'AI Legal Assistant';
      case 'email': return 'Email Management';
      case 'compliance': return 'Compliance & Ethics';
      case 'userManual': return 'User Manual & Help Guide';
      case 'search': return `Search Results for "${view.query}"`;
      default: return 'Butagira & Co. Advocates';
    }
  }, [view, clients, cases]);

  const renderView = () => {
    switch (view.type) {
      case 'dashboard':
        return <Dashboard stats={stats} tasks={tasks} appointments={appointments} onUpdateTask={updateTask} setView={setView} />;
      case 'clients':
        return <ClientView clients={clients} cases={cases} setView={setView} onUpdateClient={updateClient} onAddClient={addClient} />;
       case 'clientDetail':
        const selectedClient = clients.find(c => c.id === view.id);
        return <ClientView clients={clients} cases={cases} selectedClient={selectedClient} setView={setView} onUpdateClient={updateClient} onAddClient={addClient} />;
      case 'cases':
        return <CaseView cases={cases} clients={clients} documents={documents} setView={setView} />;
      case 'caseDetail':
        const selectedCase = cases.find(c => c.id === view.id);
        return <CaseView cases={cases} clients={clients} documents={documents} selectedCase={selectedCase} setView={setView} />;
      case 'documents':
        return <DocumentView documents={documents} cases={cases} onAddDocument={addDocument} onUpdateDocument={updateDocument} />;
      case 'analysis':
        return <AnalysisView documents={documents} cases={cases} onAddDocument={addDocument} />;
      case 'aiAssistant':
        return <AIAssistantView documents={documents} setView={setView} />;
      case 'email':
        return <EmailView emails={emails} onAddReply={addEmailReply} />;
      case 'compliance':
        return <ComplianceView />;
      case 'userManual':
        return <UserManualView />;
      case 'search': {
        const lowercasedQuery = view.query.toLowerCase();
        const searchResults = {
            clients: clients.filter(c => 
                c.name.toLowerCase().includes(lowercasedQuery)
            ),
            cases: cases.filter(c => 
                c.title.toLowerCase().includes(lowercasedQuery) ||
                c.caseNumber.toLowerCase().includes(lowercasedQuery)
            ),
            documents: documents.filter(d =>
                d.name.toLowerCase().includes(lowercasedQuery)
            ),
        };
        return <SearchView query={view.query} results={searchResults} setView={setView} />;
      }
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-brand-dark text-gray-200 font-sans">
      <Sidebar currentView={view.type} setView={setView} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title={headerTitle} onSearch={handleSearch} />
        <div className="flex-1 overflow-y-auto p-8 bg-brand-darker">
          {renderView()}
        </div>
      </main>
    </div>
  );
}

export default App;