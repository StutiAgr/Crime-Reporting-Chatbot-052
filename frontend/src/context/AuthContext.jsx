import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

// Utility function to check if email is admin email
export const isAdminEmail = (email) => {
    return email === "admin@gmail.com";
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse user from localStorage", error);
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            console.log("Attempting login with email:", email);
            return fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("Login successful");
                    localStorage.setItem("authToken", data.token);
                    return true;
                })
                .catch((error) => {
                    console.error("Error logging in:", error);
                    throw error;
                });
        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    };

    const signup = async (username, email, password) => {
        try {
            return fetch("http://localhost:3000/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((data) => {
                    localStorage.setItem("authToken", data.token);
                    if (data.user) {
                        localStorage.setItem("user", JSON.stringify(data.user));
                        setUser(data.user);
                    }
                    return data.user;
                })
                .catch((error) => {
                    console.error("Error signing up:", error);
                    throw error;
                });
        } catch (error) {
            console.error("Error signing up:", error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/");
    };

    const value = {
        user,
        login,
        signup,
        logout,
    };

    return (
        <AuthContext value={value}>
            {!loading && children}
        </AuthContext>
    );
};