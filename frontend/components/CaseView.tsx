import React from 'react';
import { Card } from './ui/Card';
import type { Case, Client, Document, ViewState } from '../types';
import { formatDate } from '../utils/date';
import { DocumentDetailIcon } from './ui/Icons';
import { useData } from '../context/DataContext';

interface CaseViewProps {
  selectedCase?: Case;
  setView: (view: ViewState) => void;
}

const CaseDetail: React.FC<{
  caseItem: Case;
  setView: (view: ViewState) => void;
}> = ({ caseItem, setView }) => {
    const { clients, documents } = useData();
    const client = clients.find(c => c.id === caseItem.clientId);
    const caseDocuments = documents.filter(d => d.caseId === caseItem.id);
    
    const deadlineDate = new Date(caseItem.deadline);
    const timeDiff = deadlineDate.getTime() - new Date().getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const deadlineColor = daysRemaining <= 7 ? 'text-red-400' : daysRemaining <= 30 ? 'text-yellow-400' : 'text-green-400';

    return (
        <div className="space-y-6">
            <button onClick={() => setView({type: 'cases'})} className="mb-4 text-brand-accent hover:underline">
                &larr; Back to Case List
            </button>
            <Card>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{caseItem.title}</h3>
                        <p className="text-sm text-gray-400 mb-4">Case Number: {caseItem.caseNumber}</p>
                    </div>
                     <span className={`px-3 py-1.5 text-sm rounded-full ${caseItem.status === 'Open' ? 'bg-green-500/20 text-green-300' : caseItem.status === 'Closed' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                        {caseItem.status}
                    </span>
                </div>
                <p className="text-gray-300 mt-2">{caseItem.description}</p>
                <div className="mt-6 border-t border-brand-light/20 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <p className="text-sm text-gray-400">Client</p>
                        <p className="font-semibold text-white cursor-pointer hover:text-brand-accent" onClick={() => client && setView({type: 'clientDetail', id: client.id})}>{client?.name || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Filing Deadline</p>
                        <p className={`font-semibold ${deadlineColor}`}>{formatDate(caseItem.deadline)} ({daysRemaining} days remaining)</p>
                    </div>
                </div>
            </Card>
            <Card>
                <h4 className="text-xl font-semibold text-white mb-4">Related Documents</h4>
                <ul className="space-y-2">
                    {caseDocuments.length > 0 ? caseDocuments.map(doc => (
                        <li key={doc.id} className="flex justify-between items-center p-3 bg-brand-dark/50 rounded-md">
                            <div className="flex items-center">
                                <DocumentDetailIcon />
                                <span className="ml-3">{doc.name}</span>
                            </div>
                            <span className="text-xs text-gray-400">{doc.type}</span>
                        </li>
                    )) : <p className="text-gray-400">No documents found for this case.</p>}
                </ul>
            </Card>
        </div>
    );
};

const CaseList: React.FC<{ setView: (view: ViewState) => void }> = ({ setView }) => {
    const { cases, clients } = useData();
    return (
        <Card>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-brand-light/20">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-300">Case Title</th>
                            <th className="p-4 text-sm font-semibold text-gray-300">Client</th>
                            <th className="p-4 text-sm font-semibold text-gray-300">Status</th>
                            <th className="p-4 text-sm font-semibold text-gray-300">Deadline</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cases.map(c => {
                            const client = clients.find(cl => cl.id === c.clientId);
                            return (
                                <tr key={c.id} onClick={() => setView({type: 'caseDetail', id: c.id})} className="hover:bg-brand-light/10 cursor-pointer border-b border-brand-mid/50 transition-colors">
                                    <td className="p-4 font-medium text-white">{c.title}</td>
                                    <td className="p-4 text-gray-400">{client?.name || 'N/A'}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${c.status === 'Open' ? 'bg-green-500/20 text-green-300' : c.status === 'Closed' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-400">{formatDate(c.deadline)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

export const CaseView: React.FC<CaseViewProps> = ({ selectedCase, setView }) => {
  if (selectedCase) {
    return <CaseDetail caseItem={selectedCase} setView={setView} />;
  }

  return <CaseList setView={setView} />;
};