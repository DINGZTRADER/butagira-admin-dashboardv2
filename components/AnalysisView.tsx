import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Spinner } from './ui/Spinner';
import type { Document, Case, AnalysisReport, ChatMessage } from '../types';
import { analyzeDocument, queryDocuments } from '../services/geminiService';
import { UploadDocumentModal } from './UploadDocumentModal';

interface AnalysisViewProps {
  documents: Document[];
  cases: Case[];
  onAddDocument: (newDocument: Document) => void;
}

const AnalysisReportDisplay: React.FC<{ report: AnalysisReport }> = ({ report }) => (
  <div className="space-y-4">
    <div>
      <h4 className="font-semibold text-brand-accent mb-2">Summary</h4>
      <p className="text-gray-300 bg-brand-dark/50 p-3 rounded-md">{report.summary}</p>
    </div>
    <div>
      <h4 className="font-semibold text-brand-accent mb-2">Key Parties</h4>
      <ul className="list-disc list-inside text-gray-300 bg-brand-dark/50 p-3 rounded-md">
        {report.keyParties.map((party, i) => <li key={i}>{party}</li>)}
      </ul>
    </div>
    <div>
      <h4 className="font-semibold text-brand-accent mb-2">Critical Dates</h4>
       <ul className="list-disc list-inside text-gray-300 bg-brand-dark/50 p-3 rounded-md">
        {report.criticalDates.length > 0 ? report.criticalDates.map((date, i) => <li key={i}>{date}</li>) : <li>No critical dates found.</li>}
      </ul>
    </div>
    <div>
      <h4 className="font-semibold text-brand-accent mb-2">Potential Risks</h4>
       <ul className="list-disc list-inside text-gray-300 bg-brand-dark/50 p-3 rounded-md">
        {report.potentialRisks.length > 0 ? report.potentialRisks.map((risk, i) => <li key={i}>{risk}</li>) : <li>No specific risks identified.</li>}
      </ul>
    </div>
  </div>
);

const ChatInterface: React.FC<{ document: Document }> = ({ document }) => {
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history]);

    const handleSendQuery = async () => {
        if (!query.trim()) return;
        
        const newHistory: ChatMessage[] = [...history, { sender: 'user', text: query }];
        setHistory(newHistory);
        setQuery('');
        setIsLoading(true);

        const aiResponse = await queryDocuments(query, document.content);
        
        setHistory([...newHistory, { sender: 'ai', text: aiResponse }]);
        setIsLoading(false);
    };

    return (
        <div className="border-t border-brand-light/20 mt-6 pt-6">
            <h3 className="text-xl font-semibold text-white mb-4">Ask Questions About This Document</h3>
            <div ref={chatContainerRef} className="bg-brand-dark/50 p-4 rounded-lg h-64 overflow-y-auto mb-4 space-y-4">
                {history.length === 0 && <p className="text-gray-500 text-center h-full flex items-center justify-center">Ask a question to begin.</p>}
                {history.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-brand-light' : 'bg-brand-mid'}`}>
                            <p className="text-white whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                 {isLoading && (
                     <div className="flex justify-start">
                         <div className="max-w-md p-3 rounded-lg bg-brand-mid flex items-center">
                            <Spinner size="sm" />
                            <p className="text-white ml-2">Thinking...</p>
                         </div>
                     </div>
                 )}
            </div>
            <div className="flex gap-2">
                <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendQuery()}
                    placeholder="e.g., 'What is the deadline for the plaintiff?'"
                    className="flex-1 bg-brand-dark border border-brand-light/20 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-brand-accent focus:border-brand-accent"
                    disabled={isLoading}
                />
                <button onClick={handleSendQuery} disabled={isLoading || !query.trim()} className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-md hover:opacity-80 disabled:opacity-50">
                    {isLoading ? <Spinner size="sm" /> : 'Send'}
                </button>
            </div>
        </div>
    );
};


export const AnalysisView: React.FC<AnalysisViewProps> = ({ documents, cases, onAddDocument }) => {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(documents[0]?.id || null);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  const selectedDoc = documents.find(d => d.id === selectedDocId);

  useEffect(() => {
    setReport(null);
  }, [selectedDocId]);
  
  const handleSaveDocument = (newDocument: Document) => {
    onAddDocument(newDocument);
    setIsUploadModalOpen(false);
    setSelectedDocId(newDocument.id); // Automatically select the new document
  };

  const handleAnalyze = async () => {
    if (!selectedDoc) return;
    setIsAnalyzing(true);
    setReport(null);
    try {
        const resultString = await analyzeDocument(selectedDoc.content);
        const resultJson = JSON.parse(resultString);
        if (resultJson.error) {
             setReport({ summary: resultJson.error, keyParties: [], criticalDates: [], potentialRisks: [], error: resultJson.error });
        } else {
            setReport(resultJson as AnalysisReport);
        }
    } catch (e) {
        console.error("Failed to parse analysis report:", e);
        setReport({ summary: "Failed to process the analysis report.", keyParties: [], criticalDates: [], potentialRisks: [], error: "Failed to process the analysis report." });
    }
    setIsAnalyzing(false);
  };
  
  return (
    <>
        {isUploadModalOpen && (
            <UploadDocumentModal 
                cases={cases}
                onClose={() => setIsUploadModalOpen(false)}
                onSave={handleSaveDocument}
            />
        )}
        <div className="flex h-full gap-6">
          <div className="w-1/3">
            <Card className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4 border-b border-brand-light/20 pb-2">
                <h3 className="text-xl font-semibold text-white">Select Document</h3>
                <button 
                    onClick={() => setIsUploadModalOpen(true)} 
                    className="bg-brand-accent text-brand-dark font-bold text-sm py-1 px-3 rounded-md hover:opacity-80"
                    title="Upload new document for analysis"
                >
                    + Upload
                </button>
              </div>
              <ul className="space-y-2 overflow-y-auto flex-1 pr-2">
                {documents.map(doc => (
                  <li key={doc.id} onClick={() => setSelectedDocId(doc.id)}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${selectedDocId === doc.id ? 'bg-brand-light' : 'hover:bg-brand-mid'}`}>
                    <p className="font-semibold text-white truncate">{doc.name}</p>
                    <p className="text-sm text-gray-400">{doc.type}</p>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="w-2/3">
            <Card className="h-full overflow-y-auto">
              {selectedDoc ? (
                <>
                  <h2 className="text-2xl font-bold text-white mb-4">{selectedDoc.name}</h2>
                  {!report && !isAnalyzing && (
                    <div className="text-center py-16">
                        <p className="text-gray-400 mb-4">Click the button to generate an AI-powered analysis report.</p>
                        <button onClick={handleAnalyze} className="bg-brand-accent text-brand-dark font-bold py-2 px-6 rounded-md hover:opacity-80">
                            Analyze Document
                        </button>
                    </div>
                  )}
                  {isAnalyzing && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Spinner size="lg" />
                        <p className="mt-4 text-gray-300">Analyzing document, please wait...</p>
                    </div>
                  )}
                  {report && <AnalysisReportDisplay report={report} />}
                  
                  {report && !report.error && <ChatInterface document={selectedDoc} />}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>Select or upload a document to begin analysis.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
    </>
  );
};