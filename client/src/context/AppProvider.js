import { createContext, useState } from 'react';
import { UpdateDataSidebarProvider } from './UpdateDataSidebarProvider';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(localStorage.getItem('user') ?? '');
    if (user) {
        localStorage.setItem('user', user);
    }

    return (
        <AppContext.Provider value={{ user, setUser }}>
            <UpdateDataSidebarProvider>{children}</UpdateDataSidebarProvider>
        </AppContext.Provider>
    );
};
