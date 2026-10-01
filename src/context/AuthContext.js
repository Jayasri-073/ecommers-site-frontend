import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginApi, registerApi, getProfileApi } from '../services/api';
import { toast } from 'react-toastify';

const defaultAuthContext = {
  user: null,
  loading: false,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUserInContext: () => {},
};

export const AuthContext = createContext(defaultAuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On initial mount, restore session from localStorage and validate token
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
          // Validate token is still good by fetching fresh profile
          const res = await getProfileApi();
          setUser(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    toast.success('Logged in successfully!');
    return res.data.user;
  };

  const register = async (data) => {
    const res = await registerApi(data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    toast.success('Account created successfully!');
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.info('Logged out');
  };

  const updateUserInContext = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUserInContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Convenience hook
export const useAuth = () => useContext(AuthContext);
