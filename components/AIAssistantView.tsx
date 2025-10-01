import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, Document, ViewState } from '../types';
import { Card } from './ui/Card';
import { Spinner } from './ui/Spinner';
import { performRAGQuery } from '../services/geminiService';
import { SparklesIcon, DocumentDetailIcon } from './ui/Icons';

interface AIAssistantViewProps {
    documents: Document[];
    setView: (view: ViewState) => void;
}

// Extend ChatMessage to include optional sources
interface AssistantChatMessage extends ChatMessage {
    sources?: Document[];
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({ documents, setView }) => {
    const [history, setHistory] = useState<AssistantChatMessage[]>([
        { sender: 'ai', text: `Hello! I am your AI Legal Assistant. Ask me any question about your documents, and I'll find the answer for you. For example: "What are the key terms in the Supply Agreement with Global Supplies Inc.?"` }
    ]);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history]);

    const handleSendMessage = async () => {
        if (!query.trim() || isLoading) return;

        const userMessage: AssistantChatMessage = { sender: 'user', text: query };
        setHistory(prev => [...prev, userMessage]);
        setQuery('');
        setIsLoading(true);

        try {
            if (documents.length === 0) {
                setHistory(prev => [...prev, { sender: 'ai', text: "I can't answer questions without any documents. Please upload some documents first in the 'Document Handling' or 'AI Document Analysis' sections." }]);
                setIsLoading(false);
                return;
            }

            const result = await performRAGQuery(query, documents);
            const aiMessage: AssistantChatMessage = { sender: 'ai', text: result.answer, sources: result.sources };
            setHistory(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error performing RAG query:", error);
            const errorMessage: AssistantChatMessage = { sender: 'ai', text: "I'm sorry, I encountered an error while trying to answer your question. Please try again." };
            setHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <Card className="mb-6">
                <div className="flex items-center">
                    <SparklesIcon />
                    <div className="ml-4">
                        <h2 className="text-2xl font-bold text-white">AI Legal Assistant</h2>
                        <p className="text-gray-400">Your intelligent partner for document-based Q&A. Powered by Retrieval-Augmented Generation.</p>
                    </div>
                </div>
            </Card>

            <Card className="flex-1 flex flex-col overflow-hidden">
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6">
                    {history.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-2xl p-4 rounded-lg shadow-md ${msg.sender === 'user' ? 'bg-brand-light text-white' : 'bg-brand-mid text-gray-200'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                            {msg.sender === 'ai' && msg.sources && msg.sources.length > 0 && (
                                <div className="mt-2 p-3 bg-brand-dark/50 rounded-lg max-w-2xl w-full">
                                    <h4 className="text-sm font-semibold text-brand-accent mb-2">Sources:</h4>
                                    <ul className="space-y-1">
                                        {msg.sources.map(doc => (
                                            <li key={doc.id}
                                                onClick={() => setView({ type: 'caseDetail', id: doc.caseId })}
                                                className="flex items-center text-xs text-gray-300 hover:text-white cursor-pointer transition-colors"
                                            >
                                                <DocumentDetailIcon /> <span className="ml-2 truncate">{doc.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start">
                            <div className="p-4 rounded-lg bg-brand-mid flex items-center">
                                <Spinner size="sm" />
                                <p className="text-gray-200 ml-3">Searching documents and formulating response...</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-brand-light/20">
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask a question about your documents..."
                            className="flex-1 bg-brand-dark border border-brand-light/30 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isLoading || !query.trim()}
                            className="bg-brand-accent text-brand-dark font-bold py-3 px-6 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
};