import React, { useState, useCallback } from 'react';
import { AuthContext } from './authContextInstance.js';
import * as demoAuth from '../utils/demoAuth.js';

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(() => demoAuth.isAuthenticated());
  const [user, setUser] = useState(() => demoAuth.getCurrentUser());

  const handleLogin = useCallback((email, password) => {
    const result = demoAuth.login(email, password);
    if (result.success) {
      setAuthenticated(true);
      setUser(result.user);
    }
    return result;
  }, []);

  const handleLogout = useCallback(() => {
    demoAuth.logout();
    setAuthenticated(false);
    setUser(null);
  }, []);

  const value = {
    isAuthenticated: authenticated,
    user,
    login: handleLogin,
    logout: handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
