import { createContext } from 'react';
import { SteamUser } from '../services/steamService';

export interface AuthContextValue {
  user: SteamUser | null;
  loading: boolean;
  loginWithSteam: () => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
