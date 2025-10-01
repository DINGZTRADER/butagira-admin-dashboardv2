import React, { useState, useMemo, useEffect } from 'react';
import type { Email, EmailAnalysis } from '../types';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { generateEmailReply, analyzeEmail } from '../services/geminiService';
import { Spinner } from './ui/Spinner';
import { formatDateTime } from '../utils/date';
import { AnalysisIcon } from './ui/Icons';

interface EmailViewProps {
  emails: Email[];
  onAddReply: (emailId: string, reply: string) => void;
}

const ReplyModal: React.FC<{ email: Email, onClose: () => void, onSend: (emailId: string, reply: string) => void }> = ({ email, onClose, onSend }) => {
    const [replyText, setReplyText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateReply = async () => {
        setIsLoading(true);
        const generatedReply = await generateEmailReply(email.body, email.subject);
        setReplyText(generatedReply);
        setIsLoading(false);
    };

    const handleSend = () => {
        onSend(email.id, replyText);
        onClose();
    };

    return (
        <Modal onClose={onClose} className="max-w-2xl">
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Reply to: {email.sender}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <p className="text-sm text-gray-400 mb-2">Subject: RE: {email.subject}</p>
                <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full h-48 p-2 bg-brand-dark rounded-md border border-brand-light/20 focus:ring-brand-accent focus:border-brand-accent"
                    placeholder="Your reply..."
                />
                <div className="mt-4 flex justify-between items-center">
                    <button onClick={handleGenerateReply} disabled={isLoading} className="flex items-center bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-md hover:opacity-80 disabled:opacity-50">
                        {isLoading ? <><Spinner size="sm" /> <span className="ml-2">Generating...</span></> : 'AI Draft Reply'}
                    </button>
                    <button onClick={handleSend} disabled={!replyText} className="bg-brand-light text-white font-bold py-2 px-4 rounded-md hover:bg-brand-light/80 disabled:opacity-50">
                        Send Reply
                    </button>
                </div>
            </Card>
        </Modal>
    );
};

const EmailAnalysisDisplay: React.FC<{ analysis: EmailAnalysis }> = ({ analysis }) => {
    const sentimentColors = {
        Positive: 'bg-green-500/20 text-green-300',
        Negative: 'bg-red-500/20 text-red-300',
        Urgent: 'bg-yellow-500/20 text-yellow-300',
        Neutral: 'bg-gray-500/20 text-gray-300',
    };

    const renderList = (title: string, items: string[]) => {
        if (items.length === 0) return null;
        return (
            <div>
                <h4 className="font-semibold text-brand-accent mb-2">{title}</h4>
                <ul className="list-disc list-inside text-gray-300 bg-brand-dark/50 p-3 rounded-md space-y-1">
                    {items.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </div>
        );
    };

    if (analysis.error) {
        return <p className="text-red-400">{analysis.error}</p>;
    }

    return (
        <div className="space-y-4">
            <div>
                <h4 className="font-semibold text-brand-accent mb-2">Sentiment Analysis</h4>
                <p>
                    <span className={`px-2 py-1 text-sm font-medium rounded-full ${sentimentColors[analysis.sentiment] || sentimentColors.Neutral}`}>
                        {analysis.sentiment}
                    </span>
                </p>
            </div>
            {renderList('Action Items', analysis.actionItems)}
            {renderList('Meeting Requests', analysis.meetingRequests)}
            {renderList('Key Dates', analysis.keyDates)}
        </div>
    );
};

export const EmailView: React.FC<EmailViewProps> = ({ emails, onAddReply }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredEmails = useMemo(() => {
    if (!searchQuery.trim()) {
        return emails;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return emails.filter(email =>
        email.sender.toLowerCase().includes(lowercasedQuery) ||
        email.subject.toLowerCase().includes(lowercasedQuery) ||
        email.body.toLowerCase().includes(lowercasedQuery)
    );
  }, [emails, searchQuery]);

  const [selectedEmail, setSelectedEmail] = useState<Email | null>(filteredEmails[0] || null);
  const [isReplying, setIsReplying] = useState(false);
  const [analysis, setAnalysis] = useState<EmailAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    // If the selected email is no longer in the filtered list, deselect it.
    if (selectedEmail && !filteredEmails.find(e => e.id === selectedEmail.id)) {
        setSelectedEmail(null);
    }
    // If there is no selection but the list is not empty, select the first one.
    if (!selectedEmail && filteredEmails.length > 0) {
        setSelectedEmail(filteredEmails[0]);
    }
  }, [filteredEmails, selectedEmail]);

  // Clear analysis when email changes
  useEffect(() => {
    setAnalysis(null);
    setIsAnalyzing(false);
    setShowAnalysis(false);
  }, [selectedEmail]);

   const handleAnalyzeEmail = async () => {
      if (!selectedEmail) return;
      setIsAnalyzing(true);
      setAnalysis(null);
      setShowAnalysis(true); // Open the section to show the spinner
      try {
          const resultString = await analyzeEmail(selectedEmail.body, selectedEmail.subject);
          const resultJson = JSON.parse(resultString) as EmailAnalysis;
          setAnalysis(resultJson);
      } catch (e) {
          console.error("Failed to parse email analysis:", e);
          const errorState: EmailAnalysis = {
              error: "Failed to process the analysis report.",
              sentiment: 'Neutral',
              actionItems: [],
              meetingRequests: [],
              keyDates: []
          };
          setAnalysis(errorState);
      }
      setIsAnalyzing(false);
  };

  return (
    <div className="flex h-full gap-6">
        {isReplying && selectedEmail && (
            <ReplyModal email={selectedEmail} onClose={() => setIsReplying(false)} onSend={onAddReply} />
        )}
        {/* Email List */}
        <div className="w-1/3">
            <Card className="h-full flex flex-col">
                <h3 className="text-xl font-semibold mb-4 text-white border-b border-brand-light/20 pb-2">Inbox</h3>
                <div className="relative mb-4">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Search emails..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-brand-dark border border-brand-light/20 rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:ring-brand-accent focus:border-brand-accent transition"
                    />
                </div>
                <ul className="space-y-2 overflow-y-auto flex-1">
                    {filteredEmails.map(email => (
                        <li key={email.id} onClick={() => setSelectedEmail(email)}
                            className={`p-3 rounded-md cursor-pointer transition-colors ${selectedEmail?.id === email.id ? 'bg-brand-light' : 'hover:bg-brand-mid'}`}>
                            <div className="flex justify-between items-center">
                                <p className={`font-semibold ${email.status === 'Unread' ? 'text-white' : 'text-gray-300'}`}>{email.sender}</p>
                                {email.status === 'Unread' && !searchQuery && <span className="w-2 h-2 bg-brand-accent rounded-full"></span>}
                            </div>
                            <p className={`truncate text-sm ${email.status === 'Unread' ? 'text-gray-200' : 'text-gray-400'}`}>{email.subject}</p>
                        </li>
                    ))}
                    {filteredEmails.length === 0 && (
                        <div className="text-center text-gray-500 py-8">No emails found.</div>
                    )}
                </ul>
            </Card>
        </div>

        {/* Email Content */}
        <div className="w-2/3">
            <Card className="h-full flex flex-col">
                {selectedEmail ? (
                    <>
                        <div className="border-b border-brand-light/20 pb-4 mb-4">
                             <div className="flex justify-between items-start">
                                <h2 className="text-2xl font-bold text-white pr-4">{selectedEmail.subject}</h2>
                                <button
                                    onClick={handleAnalyzeEmail}
                                    disabled={isAnalyzing}
                                    className="flex items-center bg-brand-mid text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-light transition-colors text-sm disabled:opacity-50 flex-shrink-0"
                                >
                                    <AnalysisIcon />
                                    <span className="ml-2">Analyze with AI</span>
                                </button>
                            </div>
                            <p className="text-gray-400 mt-2">From: {selectedEmail.sender}</p>
                            <p className="text-gray-500 text-sm">Received: {formatDateTime(selectedEmail.receivedDate)}</p>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                           <p className="text-gray-300 whitespace-pre-wrap">{selectedEmail.body}</p>
                           
                           {showAnalysis && (
                               <div className="mt-4 pt-4 border-t border-brand-mid/50">
                                   <h3 className="text-lg font-semibold text-white mb-3">AI-Powered Analysis</h3>
                                  {isAnalyzing && (
                                      <div className="flex justify-center items-center py-8">
                                          <Spinner />
                                          <p className="ml-3 text-gray-400">Analyzing email content...</p>
                                      </div>
                                  )}
                                  {analysis && <EmailAnalysisDisplay analysis={analysis} />}
                               </div>
                           )}

                           {selectedEmail.status === 'Replied' && (
                            <div className="mt-4 pt-4 border-t border-brand-mid/50">
                                <h4 className="font-semibold text-brand-accent mb-2">Your Reply:</h4>
                                <p className="text-gray-300 bg-brand-dark/50 p-3 rounded-md whitespace-pre-wrap">{selectedEmail.reply}</p>
                            </div>
                           )}
                        </div>
                        {selectedEmail.status !== 'Replied' && (
                             <div className="mt-4 pt-4 border-t border-brand-light/20">
                                <button onClick={() => setIsReplying(true)} className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-md hover:opacity-80">Reply</button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Select an email to read or try a different search.</p>
                    </div>
                )}
            </Card>
        </div>
    </div>
  );
};