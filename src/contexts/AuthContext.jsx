import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('resq_user');
    const storedToken = localStorage.getItem('resq_token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('resq_user');
        localStorage.removeItem('resq_token');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - accept any email/password combination
    if (email && password) {
      const mockUser = {
        id: `user_${Date.now()}`,
        email,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=8bc34a&color=fff`
      };
      
      const mockToken = `mock_token_${Date.now()}_${role}`;
      
      setUser(mockUser);
      setToken(mockToken);
      
      // Persist to localStorage
      localStorage.setItem('resq_user', JSON.stringify(mockUser));
      localStorage.setItem('resq_token', mockToken);
      
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('resq_user');
    localStorage.removeItem('resq_token');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};