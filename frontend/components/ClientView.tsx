import React, { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import type { Client, Case, ViewState } from '../types';
import { formatDate } from '../utils/date';
import { CaseDetailIcon } from './ui/Icons';
import { useData } from '../context/DataContext';

type NewClientData = Omit<Client, 'id' | 'joinDate'>;

interface ClientViewProps {
  selectedClient?: Client;
  setView: (view: ViewState) => void;
}

const AddClientModal: React.FC<{
    onClose: () => void;
    onSave: (clientData: NewClientData) => void;
}> = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState<NewClientData>({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const isFormValid = formData.name && formData.email && formData.phone && formData.address;

    const handleSubmit = () => {
        if (!isFormValid) return;
        onSave(formData);
    };

    return (
        <Modal onClose={onClose} className="max-w-xl">
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Add New Client</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Client Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-brand-dark border border-brand-light/20 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-brand-accent focus:border-brand-accent" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-brand-dark border border-brand-light/20 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-brand-accent focus:border-brand-accent" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-brand-dark border border-brand-light/20 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-brand-accent focus:border-brand-accent" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Physical Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-brand-dark border border-brand-light/20 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-brand-accent focus:border-brand-accent" />
                    </div>
                    <div className="flex justify-end pt-4 space-x-2">
                         <button onClick={onClose} className="bg-brand-mid text-white font-bold py-2 px-4 rounded-md hover:opacity-80">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={!isFormValid} className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-md hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed">
                            Save Client
                        </button>
                    </div>
                </div>
            </Card>
        </Modal>
    );
};


const EditClientModal: React.FC<{
    client: Client;
    onClose: () => void;
    onSave: (updatedData: Partial<NewClientData>) => void;
}> = ({ client, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSave(formData);
        onClose();
    };

    return (
        <Modal onClose={onClose} className="max-w-xl">
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Edit Client Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Client Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-brand-dark border border-brand-light/20 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-brand-accent focus:border-brand-accent" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-brand-dark border border-brand-light/20 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-brand-accent focus:border-brand-accent" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-brand-dark border border-brand-light/20 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-brand-accent focus:border-brand-accent" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Physical Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-brand-dark border border-brand-light/20 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-brand-accent focus:border-brand-accent" />
                    </div>
                    <div className="flex justify-end pt-4 space-x-2">
                         <button onClick={onClose} className="bg-brand-mid text-white font-bold py-2 px-4 rounded-md hover:opacity-80">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-md hover:opacity-80">
                            Save Changes
                        </button>
                    </div>
                </div>
            </Card>
        </Modal>
    );
};

const ClientDetail: React.FC<{
  client: Client;
  setView: (view: ViewState) => void;
}> = ({ client, setView }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { cases, updateClient } = useData();
    const clientCases = cases.filter(c => c.clientId === client.id);

    return (
        <>
            {isEditing && (
                <EditClientModal
                    client={client}
                    onClose={() => setIsEditing(false)}
                    onSave={(updatedData) => updateClient(client.id, updatedData)}
                />
            )}
            <div className="space-y-6">
                <button onClick={() => setView({type: 'clients'})} className="mb-4 text-brand-accent hover:underline">
                    &larr; Back to Client List
                </button>
                <Card>
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">{client.name}</h3>
                            <p className="text-sm text-gray-400">Client since {formatDate(client.joinDate)}</p>
                        </div>
                        <button onClick={() => setIsEditing(true)} className="bg-brand-mid text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-light transition-colors text-sm">
                            Edit Client
                        </button>
                    </div>
                    <div className="mt-6 border-t border-brand-light/20 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <p className="text-sm text-gray-400">Email Address</p>
                            <p className="font-semibold text-white">{client.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Phone Number</p>
                            <p className="font-semibold text-white">{client.phone}</p>
                        </div>
                         <div>
                            <p className="text-sm text-gray-400">Physical Address</p>
                            <p className="font-semibold text-white">{client.address}</p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <h4 className="text-xl font-semibold text-white mb-4">Associated Cases ({clientCases.length})</h4>
                    <ul className="space-y-2">
                        {clientCases.length > 0 ? clientCases.map(c => (
                            <li key={c.id} onClick={() => setView({type: 'caseDetail', id: c.id})} className="flex justify-between items-center p-3 bg-brand-dark/50 rounded-md cursor-pointer hover:bg-brand-mid transition-colors">
                                <div className="flex items-center">
                                   <CaseDetailIcon />
                                    <span className="ml-3 font-medium">{c.title}</span>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${c.status === 'Open' ? 'bg-green-500/20 text-green-300' : c.status === 'Closed' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                   {c.status}
                                </span>
                            </li>
                        )) : <p className="text-gray-400">No cases found for this client.</p>}
                    </ul>
                </Card>
            </div>
        </>
    );
};

const ClientList: React.FC<{
    setView: (view: ViewState) => void,
    onAddClientClick: () => void
}> = ({ setView, onAddClientClick }) => {
    const [filter, setFilter] = useState('');
    const { clients } = useData();

    const filteredClients = useMemo(() =>
        clients.filter(client =>
            client.name.toLowerCase().includes(filter.toLowerCase())
        ),
        [clients, filter]
    );

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">All Clients ({filteredClients.length})</h3>
                <div className="flex items-center space-x-4">
                     <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            placeholder="Filter by name..."
                            className="bg-brand-dark border border-brand-light/20 rounded-md py-2 px-3 pl-10 text-white placeholder-gray-500 w-64 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300"
                        />
                    </div>
                    <button onClick={onAddClientClick} className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-md hover:opacity-80">
                        + Add New Client
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-brand-light/20">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-300">Client Name</th>
                            <th className="p-4 text-sm font-semibold text-gray-300">Email</th>
                            <th className="p-4 text-sm font-semibold text-gray-300">Phone</th>
                            <th className="p-4 text-sm font-semibold text-gray-300">Member Since</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.map(client => (
                            <tr key={client.id} onClick={() => setView({ type: 'clientDetail', id: client.id })} className="hover:bg-brand-light/10 cursor-pointer border-b border-brand-mid/50 transition-colors">
                                <td className="p-4 font-medium text-white">{client.name}</td>
                                <td className="p-4 text-gray-400">{client.email}</td>
                                <td className="p-4 text-gray-400">{client.phone}</td>
                                <td className="p-4 text-gray-400">{formatDate(client.joinDate)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredClients.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No clients found matching your filter.
                    </div>
                )}
            </div>
        </Card>
    );
};


export const ClientView: React.FC<ClientViewProps> = ({ selectedClient, setView }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { addClient } = useData();

  if (selectedClient) {
    return <ClientDetail client={selectedClient} setView={setView} />;
  }

  const handleSaveClient = (clientData: NewClientData) => {
    addClient(clientData);
    setIsAddModalOpen(false);
  }

  return (
    <>
        {isAddModalOpen && (
            <AddClientModal 
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSaveClient}
            />
        )}
        <ClientList setView={setView} onAddClientClick={() => setIsAddModalOpen(true)} />
    </>
    );
};