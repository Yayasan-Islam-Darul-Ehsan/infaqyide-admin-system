import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API } from "@/utils/api";

// Create context
const AuthContext = createContext();

// API instance with credentials
const api = axios.create({
    baseURL: "http://localhost:30001/admin/",
    withCredentials: true // allow cookies
});

export const AuthProvider = ({ children }) => {

    const [user, setUser]       = useState(null);
    const [loading, setLoading] = useState(true);

    // Check authentication from server
    const checkAuth = useCallback(async () => {
        try {
        setLoading(true);
            let api = await API("auth-token", {}, "GET", true);
            if (api.status_code === 200) {
                setUser(api.data);
            } else {
                setUser(null);
            }
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Logout function
    const logout = async () => {
        await api.post("auth/logout");
        setUser(null);
    };

    // Auto-run on mount
    useEffect(() => {
        checkAuth();
    }, [user]);

    return (
    <AuthContext.Provider value={{ user, loading, logout, checkAuth }}>
        {children}
    </AuthContext.Provider>
    );
};

// Hook to use auth
export const useAuth = () => useContext(AuthContext);
