import React, { createContext, useContext, ReactNode } from 'react';
import { useMockData } from '../hooks/useMockData';

// Infer the return type of useMockData to create a type for our context
type DataContextType = ReturnType<typeof useMockData>;

// Create the context with an initial undefined value
// We will ensure it's provided before use, so we can assert the type.
const DataContext = createContext<DataContextType | undefined>(undefined);

// Create a provider component
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const data = useMockData();
    return (
        <DataContext.Provider value={data}>
            {children}
        </DataContext.Provider>
    );
};

// Create a custom hook to use the context
export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
