import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState({
        user: null,
        token: localStorage.getItem("token"),
    });

    const login = (userData, token) => {
        setAuthData({ user: userData, token });
        localStorage.setItem("token", token);
    };

    const logout = () => {
        setAuthData({ user: null, token: null });
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ authData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
