import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, Document, ViewState } from '../types';
import { Card } from './ui/Card';
import { Spinner } from './ui/Spinner';
import { performRAGQuery } from '../services/geminiService';
import { SparklesIcon, DocumentDetailIcon } from './ui/Icons';
import { useData } from '../context/DataContext';

interface AIAssistantViewProps {
    setView: (view: ViewState) => void;
}

// Extend ChatMessage to include optional sources
interface AssistantChatMessage extends ChatMessage {
    sources?: Document[];
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({ setView }) => {
    const { documents } = useData();
    const [history, setHistory] = useState<AssistantChatMessage[]>([
        {
            sender: 'ai',
            text: `Welcome to your AI Legal Assistant! I'm here to help you find information across all your uploaded documents using advanced Retrieval-Augmented Generation (RAG) technology.

**How to get the best results:**
• Ask specific questions about your documents (e.g., "What are the payment terms in the ABC Corporation contract?")
• Reference parties, dates, or document types for more targeted searches
• Ask about legal obligations, deadlines, or risk factors
• Request comparisons between different documents

**Example queries:**
• "What are the key deadlines in all pending litigation documents?"
• "Show me all contracts with termination clauses"
• "What are the liability limitations in the supply agreements?"

Currently, I have access to ${documents.length} documents. How can I assist you today?`
        }
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
                setHistory(prev => [...prev, {
                    sender: 'ai',
                    text: "I don't have access to any documents yet. Please upload documents using the 'Document Handling' section or 'AI Document Analysis' section first. Once documents are uploaded, I'll be able to answer questions about their content using my RAG capabilities."
                }]);
                setIsLoading(false);
                return;
            }

            const result = await performRAGQuery(query, documents);

            // Enhanced response with helpful guidance
            let enhancedResponse = result.answer;
            if (result.sources.length === 0) {
                enhancedResponse += "\n\n💡 **Tip:** Try rephrasing your question with different keywords, or check if the relevant documents have been uploaded to the system.";
            } else if (result.sources.length === 1) {
                enhancedResponse += `\n\n📄 **Source:** This answer is based on 1 document. Click on it below to view the full document.`;
            } else {
                enhancedResponse += `\n\n📚 **Sources:** This answer synthesizes information from ${result.sources.length} documents. Click on any source below to view the full document.`;
            }

            const aiMessage: AssistantChatMessage = {
                sender: 'ai',
                text: enhancedResponse,
                sources: result.sources
            };
            setHistory(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error performing RAG query:", error);
            const errorMessage: AssistantChatMessage = {
                sender: 'ai',
                text: "I apologize, but I encountered a technical error while processing your request. This could be due to:\n\n• Temporary service connectivity issues\n• Document processing limitations\n• Server overload\n\nPlease try again in a few moments. If the problem persists, contact system support."
            };
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