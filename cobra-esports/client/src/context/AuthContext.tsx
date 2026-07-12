import { useEffect, useState, ReactNode } from 'react';
import { AuthContext } from './authContextValue';
import { fetchCurrentUser, logout as logoutRequest, redirectToSteamLogin, SteamUser } from '../services/steamService';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SteamUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await fetchCurrentUser();
      setUser(data.authenticated ? data.user : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const loginWithSteam = () => {
    redirectToSteamLogin();
  };

  const logout = async () => {
    await logoutRequest();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithSteam, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
