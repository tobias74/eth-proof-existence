import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context state
interface AppStateContextProps {
    walletConnectEnabled: boolean;
    setWalletConnectEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    // Add other state variables and setters here in the future
    // anotherState: AnotherType;
    // setAnotherState: React.Dispatch<React.SetStateAction<AnotherType>>;
}

// Initialize context with a null default
const AppStateContext = createContext<AppStateContextProps | null>(null);

// Define the provider's props interface
interface AppStateProviderProps {
    children: ReactNode;
}

// Create a provider component that holds the app state
export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
    const [walletConnectEnabled, setWalletConnectEnabled] = useState(false);

    // Context value containing the state and setter
    const value: AppStateContextProps = {
        walletConnectEnabled,
        setWalletConnectEnabled,
        // You can add more state variables here in the future
        // anotherState,
        // setAnotherState,
    };

    return (
        <AppStateContext.Provider value={value}>
            {children}
        </AppStateContext.Provider>
    );
};

// Create a custom hook to consume the AppState
export const useAppState = (): AppStateContextProps => {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error('useAppState must be used within an AppStateProvider');
    }
    return context;
};
