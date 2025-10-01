import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import type { Document, Case } from '../types';
import { summarizeDocument } from '../services/geminiService';
import { Spinner } from './ui/Spinner';
import { formatDate } from '../utils/date';
import { UploadDocumentModal } from './UploadDocumentModal';
import { useData } from '../context/DataContext';

type DocumentData = Omit<Document, 'id' | 'uploadDate'>;

interface DocumentViewProps {}

const EditDocumentModal: React.FC<{
    doc: Document;
    onClose: () => void;
}> = ({ doc, onClose }) => {
    const { cases, updateDocument } = useData();
    const [name, setName] = useState(doc.name);
    const [caseId, setCaseId] = useState(doc.caseId);
    const [type, setType] = useState(doc.type);
    const [content, setContent] = useState(doc.content);

    const isFormValid = name && caseId && type && content;

    const handleSubmit = () => {
        if (!isFormValid) return;

        const updatedData: DocumentData = {
            name,
            caseId,
            type,
            content,
        };
        updateDocument(doc.id, updatedData);
        onClose();
    };

    return (
        <Modal onClose={onClose} className="max-w-2xl">
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Edit Document</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Document Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-brand-dark border border-brand-light/20 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-brand-accent focus:border-brand-accent" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-300 mb-1">Associated Case</label>
                            <select value={caseId} onChange={e => setCaseId(e.target.value)} className="w-full bg-brand-dark border border-brand-light/20 rounded-md py-2 px-3 text-white focus:ring-brand-accent focus:border-brand-accent">
                                {cases.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                            </select>
                        </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-300 mb-1">Document Type</label>
                            <select value={type} onChange={e => setType(e.target.value as any)} className="w-full bg-brand-dark border border-brand-light/20 rounded-md py-2 px-3 text-white focus:ring-brand-accent focus:border-brand-accent">
                                <option>Pleading</option>
                                <option>Contract</option>
                                <option>Correspondence</option>
                                <option>Affidavit</option>
                                <option>Motion</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Document Content</label>
                        <textarea value={content} onChange={e => setContent(e.target.value)} rows={6} className="w-full bg-brand-dark border border-brand-light/20 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-brand-accent focus:border-brand-accent" />
                    </div>
                    <div className="flex justify-end pt-4 space-x-2">
                        <button onClick={onClose} className="bg-brand-mid text-white font-bold py-2 px-4 rounded-md hover:opacity-80">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={!isFormValid} className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-md hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed">
                            Save Changes
                        </button>
                    </div>
                </div>
            </Card>
        </Modal>
    );
};


const DocumentModal: React.FC<{ doc: Document, caseItem?: Case, onClose: () => void }> = ({ doc, caseItem, onClose }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSummarize = async () => {
        setIsLoading(true);
        const result = await summarizeDocument(doc.content);
        setSummary(result);
        setIsLoading(false);
    };

    return (
        <Modal onClose={onClose} className="max-w-3xl">
            <Card className="w-full max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4 border-b border-brand-light/20 pb-4">
                    <div>
                        <h3 className="text-xl font-bold text-white">{doc.name}</h3>
                        <p className="text-sm text-gray-400">Case: {caseItem?.title || 'N/A'}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                    <div>
                        <h4 className="font-semibold text-brand-accent mb-2">Document Content</h4>
                        <p className="text-gray-300 bg-brand-dark/50 p-4 rounded-md whitespace-pre-wrap">{doc.content}</p>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                           <h4 className="font-semibold text-brand-accent">AI Summary</h4>
                           <button onClick={handleSummarize} disabled={isLoading} className="text-sm bg-brand-accent text-brand-dark px-3 py-1 rounded-md hover:opacity-80 disabled:opacity-50 disabled:cursor-wait">
                                {isLoading ? 'Generating...' : 'Summarize'}
                           </button>
                        </div>
                        <div className="text-gray-300 bg-brand-dark/50 p-4 rounded-md min-h-[100px]">
                            {isLoading ? <div className="flex justify-center items-center h-full"><Spinner /></div> : <p className="whitespace-pre-wrap">{summary || 'Click "Summarize" to generate an AI summary.'}</p>}
                        </div>
                    </div>
                </div>
            </Card>
        </Modal>
    );
};

const SummaryModal: React.FC<{ title: string; content: string; onClose: () => void }> = ({ title, content, onClose }) => {
    return (
        <Modal onClose={onClose} className="max-w-xl">
            <Card>
                <div className="flex justify-between items-center mb-4 border-b border-brand-light/20 pb-4">
                    <div>
                        <h3 className="text-xl font-bold text-white">Summary for "{title}"</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                    <p className="text-gray-300 bg-brand-dark/50 p-4 rounded-md whitespace-pre-wrap">{content}</p>
                </div>
            </Card>
        </Modal>
    );
};


export const DocumentView: React.FC<DocumentViewProps> = () => {
    const { documents, cases, addDocument } = useData();
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
    const [editingDoc, setEditingDoc] = useState<Document | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [summaryData, setSummaryData] = useState<{ title: string; content: string } | null>(null);
    const [summarizingId, setSummarizingId] = useState<string | null>(null);
    
    const handleSaveDocument = (newDocument: Document) => {
        addDocument(newDocument);
        setIsUploadModalOpen(false);
    };
    
    const handleSummarize = async (doc: Document) => {
        setSummarizingId(doc.id);
        setSummaryData(null); // Clear previous summary
        try {
            const result = await summarizeDocument(doc.content);
            setSummaryData({ title: doc.name, content: result });
        } catch (error) {
            console.error("Summarization failed:", error);
            setSummaryData({ title: doc.name, content: "An error occurred while generating the summary. Please try again." });
        } finally {
            setSummarizingId(null);
        }
    };


    return (
        <>
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-white">All Documents</h3>
                    <button onClick={() => setIsUploadModalOpen(true)} className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-md hover:opacity-80">
                        + Upload Document
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-brand-light/20">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-300">Document Name</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Case</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Type</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Upload Date</th>
                                <th className="p-4 text-sm font-semibold text-gray-300 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map(doc => {
                                const caseItem = cases.find(c => c.id === doc.caseId);
                                return (
                                    <tr key={doc.id} onClick={() => setSelectedDoc(doc)} className="hover:bg-brand-light/10 cursor-pointer border-b border-brand-mid/50 transition-colors">
                                        <td className="p-4 font-medium text-white">{doc.name}</td>
                                        <td className="p-4 text-gray-400">{caseItem?.title || 'N/A'}</td>
                                        <td className="p-4 text-gray-400">{doc.type}</td>
                                        <td className="p-4 text-gray-400">{formatDate(doc.uploadDate)}</td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center items-center space-x-2">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingDoc(doc);
                                                    }}
                                                    className="bg-brand-light text-white font-semibold py-1 px-3 rounded-md hover:bg-brand-light/80 transition-colors text-sm w-24"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSummarize(doc);
                                                    }}
                                                    disabled={summarizingId === doc.id}
                                                    className="bg-brand-mid text-white font-semibold py-1 px-3 rounded-md hover:bg-brand-light transition-colors text-sm disabled:opacity-50 disabled:cursor-wait w-24 flex justify-center items-center"
                                                >
                                                    {summarizingId === doc.id ? <Spinner size="sm" /> : 'Summarize'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
            {selectedDoc && (
                <DocumentModal
                    doc={selectedDoc}
                    caseItem={cases.find(c => c.id === selectedDoc.caseId)}
                    onClose={() => setSelectedDoc(null)}
                />
            )}
            {editingDoc && (
                <EditDocumentModal
                    doc={editingDoc}
                    onClose={() => setEditingDoc(null)}
                />
            )}
            {isUploadModalOpen && (
                <UploadDocumentModal
                    onClose={() => setIsUploadModalOpen(false)}
                    onSave={handleSaveDocument}
                />
            )}
            {summaryData && (
                <SummaryModal
                    title={summaryData.title}
                    content={summaryData.content}
                    onClose={() => setSummaryData(null)}
                />
            )}
        </>
    );
};