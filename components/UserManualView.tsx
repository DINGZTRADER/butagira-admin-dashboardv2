import React from 'react';
import { Card } from './ui/Card';
import { DashboardIcon, ClientsIcon, CasesIcon, DocumentsIcon, AnalysisIcon, SparklesIcon, EmailIcon, ComplianceIcon, CheckmarkIcon } from './ui/Icons';

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <Card>
        <h2 className="text-xl font-bold text-brand-accent mb-4 border-b border-brand-light/20 pb-2">{title}</h2>
        {children}
    </Card>
);

const Feature: React.FC<{ icon: React.ReactElement; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start p-3">
        <div className="text-brand-accent flex-shrink-0 mr-4 mt-1">{icon}</div>
        <div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </div>
    </div>
);

const HowToStep: React.FC<{ step: number; instruction: string }> = ({ step, instruction }) => (
    <div className="flex items-center mb-2">
        <div className="flex-shrink-0 bg-brand-accent text-brand-dark rounded-full h-6 w-6 flex items-center justify-center font-bold text-sm mr-3">{step}</div>
        <p className="text-gray-300">{instruction}</p>
    </div>
);

export const UserManualView: React.FC = () => {
    return (
        <div className="space-y-6">
            <Card>
                <h1 className="text-2xl font-bold text-white">Welcome to Your Admin Dashboard!</h1>
                <p className="text-gray-400 mt-1">This is your new digital assistant, designed to make managing the firm's work simpler and faster. Here’s a quick guide to get you started.</p>
            </Card>

            <SectionCard title="Understanding Your Dashboard (The Sidebar)">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Feature icon={<DashboardIcon />} title="Dashboard" description="Your home screen. See a quick overview of today's tasks, upcoming appointments, and key numbers at a glance." />
                    <Feature icon={<ClientsIcon />} title="Client Management" description="Your digital address book for all clients. View their details, edit information, and see all associated cases." />
                    <Feature icon={<CasesIcon />} title="Case Coordination" description="Keep track of all legal cases. See which cases are open, closed, or pending, and view their details." />
                    <Feature icon={<DocumentsIcon />} title="Document Handling" description="Your digital filing cabinet. Upload new documents, view existing ones, and keep everything organized by case." />
                    <Feature icon={<AnalysisIcon />} title="AI Document Analysis" description="A smart tool to help you understand a single, complex document quickly. It pulls out key details and lets you ask specific questions about it." />
                    <Feature icon={<SparklesIcon />} title="AI Legal Assistant" description="Your most powerful tool! Ask it any question, and it will search through *all* uploaded documents to find the answer for you." />
                    <Feature icon={<EmailIcon />} title="Email" description="Manage client emails directly. You can even use the AI assistant to help you draft professional replies in seconds." />
                    <Feature icon={<ComplianceIcon />} title="Compliance & Ethics" description="A handy checklist and guide for important firm procedures and ethical rules, specific to Ugandan law." />
                </div>
            </SectionCard>

            <SectionCard title="How Do I...? (Common Questions)">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                        <h3 className="font-semibold text-white mb-2">Find a client's phone number?</h3>
                        <HowToStep step={1} instruction="Click 'Client Management' in the sidebar." />
                        <HowToStep step={2} instruction="Use the filter bar at the top to type the client's name." />
                        <HowToStep step={3} instruction="Click on the client in the list to see all their details." />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-2">Upload a new document?</h3>
                        <HowToStep step={1} instruction="Click 'Document Handling' in the sidebar." />
                        <HowToStep step={2} instruction="Click the yellow '+ Upload Document' button." />
                        <HowToStep step={3} instruction="Fill in the form with the document's details and click 'Save'." />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-2">Get a quick summary of a document?</h3>
                        <HowToStep step={1} instruction="Go to 'Document Handling'." />
                        <HowToStep step={2} instruction="Find the document you want to summarize in the list." />
                        <HowToStep step={3} instruction="Click the 'Summarize' button in that document's row." />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-2">Ask the AI about all my cases?</h3>
                        <HowToStep step={1} instruction="Click 'AI Legal Assistant' in the sidebar." />
                        <HowToStep step={2} instruction="Type your question in the box at the bottom (e.g., 'Which cases have a deadline next week?')." />
                        <HowToStep step={3} instruction="Click 'Send' and the AI will find the answer from your documents." />
                    </div>
                </div>
            </SectionCard>

             <SectionCard title="Pro Tips for Best Results">
                 <ul className="space-y-3">
                     <li className="flex items-start p-2">
                        <CheckmarkIcon />
                        <span className="ml-3 text-gray-300"><strong>The More You Add, The Smarter It Gets:</strong> The AI Assistant's knowledge comes from the documents you upload. The more contracts, plaints, and letters you add, the better its answers will be.</span>
                    </li>
                     <li className="flex items-start p-2">
                        <CheckmarkIcon />
                        <span className="ml-3 text-gray-300"><strong>Use the Global Search:</strong> The search bar at the very top right of your screen is a quick way to find anything—clients, cases, or documents—from anywhere in the app.</span>
                    </li>
                     <li className="flex items-start p-2">
                        <CheckmarkIcon />
                        <span className="ml-3 text-gray-300"><strong>Be Specific with the AI:</strong> When asking the 'AI Legal Assistant' a question, be as specific as you can. Instead of "tell me about the contract," try "What are the payment terms in the Supply Agreement for Kampala Industries?"</span>
                    </li>
                 </ul>
            </SectionCard>
        </div>
    );
};