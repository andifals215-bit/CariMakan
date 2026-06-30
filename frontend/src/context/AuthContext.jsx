import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [usersList, setUsersList] = useState(() => {
        const savedUsers = localStorage.getItem('users_list');
        if (savedUsers) {
            return JSON.parse(savedUsers);
        }
        // Default users for demonstration
        const defaultUsers = [
            { email: 'admin@carimakan.com', password: 'admin123', name: 'Super Admin', role: 'admin' },
            { email: 'user@carimakan.com', password: 'user123', name: 'Deni Prawira', role: 'customer' }
        ];
        localStorage.setItem('users_list', JSON.stringify(defaultUsers));
        return defaultUsers;
    });

    useEffect(() => {
        const loggedInUser = localStorage.getItem('current_user');
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }
    }, []);

    const login = (email, password) => {
        const foundUser = usersList.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (foundUser) {
            localStorage.setItem('current_user', JSON.stringify(foundUser));
            setUser(foundUser);
            return { success: true, user: foundUser };
        }
        return { success: false, message: 'Email atau password salah!' };
    };

    const register = (name, email, password) => {
        const exists = usersList.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
            return { success: false, message: 'Email sudah terdaftar!' };
        }
        const newUser = { name, email, password, role: 'customer' };
        const updatedList = [...usersList, newUser];
        setUsersList(updatedList);
        localStorage.setItem('users_list', JSON.stringify(updatedList));

        // Automatically log in the user after register
        localStorage.setItem('current_user', JSON.stringify(newUser));
        setUser(newUser);
        return { success: true, user: newUser };
    };

    const logout = () => {
        localStorage.removeItem('current_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, usersList }}>
            {children}
        </AuthContext.Provider>
    );
};
