import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Set auth token
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Load user
  const loadUser = async () => {
    try {
      setAuthToken(token);
      const res = await axios.get('http://localhost:5000/api/auth/me');
      setUser(res.data.data);
    } catch (err) {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Register user
  const register = async (formData) => {
    const res = await axios.post('http://localhost:5000/api/auth/register', formData,{
      withCredentials: true
    });
    setToken(res.data.token);
    await loadUser();
    navigate('/dashboard');
  };

  // Login user
  const login = async (formData) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', formData);
    setToken(res.data.token);
    await loadUser();
    navigate('/dashboard');
  };

  // Logout user
  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    navigate('/auth/login');
  };

  // Update user details
  const updateDetails = async (formData) => {
    const res = await axios.put('/api/auth/updatedetails', formData);
    setUser(res.data.data);
  };

  // Update password
  const updatePassword = async (formData) => {
    await axios.put('/api/auth/updatepassword', formData);
  };

  // Check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwt_decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return true;
    }
  };

  useEffect(() => {
    if (token) {
      if (isTokenExpired(token)) {
        logout();
      } else {
        loadUser();
      }
    } else {
      setIsLoading(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        register,
        login,
        logout,
        updateDetails,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};
export default AuthContext;