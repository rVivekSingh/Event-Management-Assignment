import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/api';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || null,
    user: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (auth.token) {
      fetchUser();
    }
  }, [auth.token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/users/me', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setAuth((prev) => ({ ...prev, user: response.data }));
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    }
  };

  const register = async (userData) => {
    setAuth((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await axios.post('/users/register', userData);
      setAuth((prev) => ({ ...prev, loading: false }));
      navigate('/login');
    } catch (error) {
      setAuth((prev) => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Registration failed',
      }));
    }
  };

  const login = async (credentials) => {
    setAuth((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await axios.post('/users/login', credentials);
      localStorage.setItem('token', response.data.accessToken);
      setAuth({
        token: response.data.accessToken,
        user: response.data.user, // Assuming backend returns user info
        loading: false,
        error: null,
      });
      navigate('/events');
    } catch (error) {
      setAuth((prev) => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Login failed',
      }));
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({
      token: null,
      user: null,
      loading: false,
      error: null,
    });
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ auth, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
