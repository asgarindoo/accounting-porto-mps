import { createContext, useContext } from 'react';
import { useSession, signOut } from '../lib/auth-client.js';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  const logout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ session, isPending, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
