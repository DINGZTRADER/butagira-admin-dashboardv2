import React, { useMemo } from 'react';
import { Card } from './ui/Card';
import type { Client, Case, Document, ViewState } from '../types';
import { ClientsIcon, CasesIcon, DocumentsIcon } from './ui/Icons';
import { useData } from '../context/DataContext';

interface SearchViewProps {
  query: string;
  setView: (view: ViewState) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ query, setView }) => {
    const { clients, cases, documents } = useData();

    const results = useMemo(() => {
        const lowercasedQuery = query.toLowerCase();
        return {
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
    }, [query, clients, cases, documents]);

    const totalResults = results.clients.length + results.cases.length + results.documents.length;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">
                Found {totalResults} results for "<span className="text-brand-accent">{query}</span>"
            </h2>

            {totalResults === 0 && (
                <Card>
                    <p className="text-center text-gray-400 py-8">No results found. Try a different search term.</p>
                </Card>
            )}

            {results.clients.length > 0 && (
                <Card>
                    <h3 className="flex items-center text-xl font-semibold text-white mb-4 border-b border-brand-light/20 pb-2">
                        <ClientsIcon /> <span className="ml-2">Clients ({results.clients.length})</span>
                    </h3>
                    <ul className="space-y-2">
                        {results.clients.map(client => (
                            <li key={client.id} onClick={() => setView({ type: 'clientDetail', id: client.id })}
                                className="p-3 bg-brand-dark/50 rounded-md cursor-pointer hover:bg-brand-mid transition-colors">
                                <p className="font-medium text-white">{client.name}</p>
                                <p className="text-sm text-gray-400">{client.email}</p>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}

            {results.cases.length > 0 && (
                <Card>
                    <h3 className="flex items-center text-xl font-semibold text-white mb-4 border-b border-brand-light/20 pb-2">
                        <CasesIcon /> <span className="ml-2">Cases ({results.cases.length})</span>
                    </h3>
                    <ul className="space-y-2">
                        {results.cases.map(caseItem => (
                            <li key={caseItem.id} onClick={() => setView({ type: 'caseDetail', id: caseItem.id })}
                                className="p-3 bg-brand-dark/50 rounded-md cursor-pointer hover:bg-brand-mid transition-colors">
                                <p className="font-medium text-white">{caseItem.title}</p>
                                <p className="text-sm text-gray-400">Case No: {caseItem.caseNumber}</p>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}

            {results.documents.length > 0 && (
                <Card>
                    <h3 className="flex items-center text-xl font-semibold text-white mb-4 border-b border-brand-light/20 pb-2">
                        <DocumentsIcon /> <span className="ml-2">Documents ({results.documents.length})</span>
                    </h3>
                    <ul className="space-y-2">
                        {results.documents.map(doc => (
                            <li key={doc.id} onClick={() => setView({ type: 'caseDetail', id: doc.caseId })}
                                className="p-3 bg-brand-dark/50 rounded-md cursor-pointer hover:bg-brand-mid transition-colors">
                                <p className="font-medium text-white">{doc.name}</p>
                                <p className="text-sm text-gray-400">Type: {doc.type}</p>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}
        </div>
    );
};