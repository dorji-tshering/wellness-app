import { createContext, useContext } from "react";
import { User } from 'firebase/auth';
import { Props } from "../model/auth-context";

const AuthContext = createContext<User | null>(null);

export const AuthContextProvider = ({ value, children }: Props) => {
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthValue = () => {
    return useContext(AuthContext);
}