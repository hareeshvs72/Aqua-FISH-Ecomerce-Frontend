import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
    const { isLoaded, isSignedIn, userId } = useAuth();
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            setRole(null);
            setLoading(false);
        }
    }, [isLoaded, isSignedIn]);

    return (
        <RoleContext.Provider value={{ role, setRole, loading, setLoading }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRole = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error('useRole must be used within a RoleProvider');
    }
    return context;
};
