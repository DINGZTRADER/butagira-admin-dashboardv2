import React, { useState } from 'react';

interface HeaderProps {
    title: string;
    onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch(searchQuery.trim());
        }
    };

    return (
        <header className="bg-brand-mid shadow-md p-4 flex justify-between items-center flex-shrink-0 z-10">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <div className="flex items-center">
                <form onSubmit={handleSearch} className="relative mr-4">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search clients, cases..."
                        className="bg-brand-dark border border-brand-light/20 rounded-md py-2 px-3 pl-10 text-white placeholder-gray-500 w-64 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300"
                    />
                </form>

                <div className="relative mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-brand-mid"></span>
                </div>
                <div className="flex items-center">
                    <img src="https://picsum.photos/seed/partner/40/40" alt="Partner User" className="w-10 h-10 rounded-full border-2 border-brand-accent" />
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">Hon. Francis K. Butagira</p>
                        <p className="text-xs text-gray-400">Founder & Senior Consultant</p>
                    </div>
                </div>
            </div>
        </header>
    );
};