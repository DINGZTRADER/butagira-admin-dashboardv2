

import React, { useState, useRef } from 'react';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import type { Document } from '../types';
import { Spinner } from './ui/Spinner';
import { useData } from '../context/DataContext';

// Let TypeScript know about the globally available pdfjsLib
declare const pdfjsLib: any;

interface UploadDocumentModalProps {
    onClose: () => void;
    onSave: (newDocument: Document) => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({ onClose, onSave }) => {
    const { cases } = useData();
    const [name, setName] = useState('');
    const [caseId, setCaseId] = useState(cases[0]?.id || '');
    const [type, setType] = useState<'Pleading' | 'Contract' | 'Correspondence' | 'Affidavit' | 'Motion'>('Pleading');
    const [content, setContent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isParsing, setIsParsing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isFormValid = name && caseId && type && content;

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsParsing(true);
        setError(null);

        try {
            if (file.type === 'text/plain' || file.name.endsWith('.md')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const fileContent = e.target?.result as string;
                    setContent(fileContent);
                    setName(file.name);
                    setIsParsing(false);
                };
                reader.readAsText(file);
            } else if (file.type === 'application/pdf') {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map((item: { str: string }) => item.str).join(' ');
                    fullText += pageText + '\n\n';
                }
                setContent(fullText.trim());
                setName(file.name);
                setIsParsing(false);
            } else {
                setError('Unsupported file type. Please upload a .pdf, .txt, or .md file, or paste content manually.');
                setIsParsing(false);
            }
        } catch (err) {
            console.error("Error parsing file:", err);
            setError("There was an error parsing the file. It might be corrupted or in an unsupported format.");
            setIsParsing(false);
        }
        
        event.target.value = '';
    };

    const handleSubmit = () => {
        if (!isFormValid) return;

        const newDocument: Document = {
            id: `doc-${Date.now()}`,
            name: name,
            caseId,
            type,
            content,
            uploadDate: new Date().toISOString(),
        };
        onSave(newDocument);
    };

    return (
        <Modal onClose={onClose} className="max-w-2xl">
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".txt,.md,.pdf" style={{ display: 'none' }} />
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Upload & Index New Document</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div className="space-y-4">
                    <div className="bg-brand-dark/50 p-4 rounded-lg border-2 border-dashed border-brand-mid hover:border-brand-accent transition-colors">
                        <p className="text-sm text-center text-gray-400 mb-2">
                            Direct upload is supported for PDF (.pdf), plain text (.txt), and markdown (.md) files.
                            <br/>
                            For other formats (e.g., DOCX), please copy and paste the content below.
                        </p>
                        <button 
                            onClick={() => fileInputRef.current?.click()} 
                            className="w-full bg-brand-light text-white font-bold py-2 px-4 rounded-md hover:bg-brand-light/80 text-center flex items-center justify-center disabled:opacity-50"
                            disabled={isParsing}
                        >
                            {isParsing ? (
                                <>
                                    <Spinner size="sm" />
                                    <span className="ml-2">Parsing File...</span>
                                </>
                            ) : (
                                'Select File from Computer'
                            )}
                        </button>
                        {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Document Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Client Agreement.pdf" className="w-full bg-brand-dark border border-brand-light/20 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-brand-accent focus:border-brand-accent" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-300 mb-1">Associated Case</label>
                            <select value={caseId} onChange={e => setCaseId(e.target.value)} className="w-full bg-brand-dark border border-brand-light/20 rounded-md py-2 px-3 text-white focus:ring-brand-accent focus:border-brand-accent" disabled={cases.length === 0}>
                                {cases.length > 0 ? cases.map(c => <option key={c.id} value={c.id}>{c.title}</option>) : <option>No cases available</option>}
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
                        <textarea value={content} onChange={e => setContent(e.target.value)} rows={8} className="w-full bg-brand-dark border border-brand-light/20 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-brand-accent focus:border-brand-accent" placeholder="Paste document content here..." />
                    </div>
                    <div className="flex justify-end pt-4 space-x-2">
                         <button onClick={onClose} className="bg-brand-mid text-white font-bold py-2 px-4 rounded-md hover:opacity-80">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={!isFormValid} className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-md hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed">
                            Save Document
                        </button>
                    </div>
                </div>
            </Card>
        </Modal>
    );
};