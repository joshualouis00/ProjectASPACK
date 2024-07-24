import React, { createContext, useState, useContext, ReactNode } from "react";

interface User {
    vuserid: string;
    vldap?: string;
    bloginmode?: boolean;
    vusername?: string;
    vpassword?: string;
    vaffcoid?: string;
    vrole?: string;
    bactive?: boolean;
    vcrea?: string;
    dcrea?: Date;
    vmodi?: string;
    dmodi?: Date;
}

interface UserContextProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = (): UserContextProps => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("User must be used within a UserProvider");
    }
    return context;
}