import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    api('/auth/me').then(data => { if (active) setUser(data.user); }).catch(() => {}).finally(() => { if (active) setLoading(false); });
    const expired = () => setUser(null);
    window.addEventListener('session-expired', expired);
    return () => { active = false; window.removeEventListener('session-expired', expired); };
  }, []);
  async function authenticate(mode, values) {
    const data = await api(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(values) });
    setUser(data.user);
  }
  async function signOut() { await api('/auth/signout', { method: 'POST' }); setUser(null); }
  return <AuthContext.Provider value={{ user, loading, authenticate, signOut }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
