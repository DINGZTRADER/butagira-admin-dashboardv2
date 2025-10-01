import React from 'react';
import type { ViewState, ViewType } from '../types';
import { DashboardIcon, ClientsIcon, CasesIcon, DocumentsIcon, AnalysisIcon, SparklesIcon, EmailIcon, ComplianceIcon, UserManualIcon } from './ui/Icons';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewState) => void;
}

const NavItem: React.FC<{
  // FIX: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  icon: React.ReactElement;
  label: string;
  view: ViewType;
  currentView: ViewType;
  onClick: () => void;
}> = ({ icon, label, view, currentView, onClick }) => {
  const isActive = currentView === view;
  return (
    <li
      onClick={onClick}
      className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 ${
        isActive ? 'bg-brand-accent text-brand-dark font-bold' : 'text-gray-300 hover:bg-brand-mid hover:text-white'
      }`}
    >
      <span className="mr-4">{icon}</span>
      <span>{label}</span>
    </li>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { type: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { type: 'clients', label: 'Client Management', icon: <ClientsIcon /> },
    { type: 'cases', label: 'Case Coordination', icon: <CasesIcon /> },
    { type: 'documents', label: 'Document Handling', icon: <DocumentsIcon /> },
    { type: 'analysis', label: 'AI Document Analysis', icon: <AnalysisIcon /> },
    { type: 'aiAssistant', label: 'AI Legal Assistant', icon: <SparklesIcon /> },
    { type: 'email', label: 'Email', icon: <EmailIcon /> },
    { type: 'compliance', label: 'Compliance & Ethics', icon: <ComplianceIcon /> },
  ] as const;

  const helpItems = [
      { type: 'userManual', label: 'User Manual', icon: <UserManualIcon /> },
  ] as const;


  return (
    <aside className="w-64 bg-brand-dark flex-shrink-0 p-4 border-r border-brand-mid flex flex-col">
      <div className="flex items-center mb-8">
        <svg className="w-10 h-10 text-brand-accent mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <div>
            <h1 className="text-xl font-bold text-white">Butagira & Co. Advocates</h1>
            <p className="text-xs text-gray-400">"A Tradition of Excellence"</p>
        </div>
      </div>
      <nav className="flex-1">
        <ul>
          {navItems.map((item) => (
            <NavItem
              key={item.type}
              icon={item.icon}
              label={item.label}
              view={item.type}
              currentView={currentView}
              onClick={() => setView({ type: item.type })}
            />
          ))}
        </ul>
      </nav>
       <div>
        <ul>
            {helpItems.map((item) => (
                 <NavItem
                    key={item.type}
                    icon={item.icon}
                    label={item.label}
                    view={item.type}
                    currentView={currentView}
                    onClick={() => setView({ type: item.type })}
                 />
            ))}
        </ul>
        <div className="mt-4 p-4 bg-brand-mid rounded-lg text-center">
          <p className="text-sm text-gray-300">Operational Efficiency Platform</p>
          <p className="text-xs text-gray-500 mt-1">&copy; 2024</p>
        </div>
      </div>
    </aside>
  );
};