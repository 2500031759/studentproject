import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { authenticate, clearSession, getSession, saveSession, signUp, updateProfile as persistProfile } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSession);

  const login = useCallback((email, password, role) => {
    const authenticatedUser = authenticate(email, password, role);
    saveSession(authenticatedUser);
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const register = useCallback((fields) => {
    const createdUser = signUp(fields);
    const { password: _password, ...safeUser } = createdUser;
    saveSession(safeUser);
    setUser(safeUser);
    return safeUser;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const updateProfile = useCallback((changes) => {
    const updatedUser = persistProfile(user, changes);
    setUser(updatedUser);
    return updatedUser;
  }, [user]);

  const value = useMemo(() => ({ user, login, register, logout, updateProfile }), [user, login, register, logout, updateProfile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
}
