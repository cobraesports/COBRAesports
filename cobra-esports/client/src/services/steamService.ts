import { apiUrl } from '../config/api';

export interface SteamUser {
  steamId: string;
  nickname: string;
  avatar: string;
  profileUrl: string;
  onlineState: number;
}

interface CurrentUserResponse {
  authenticated: boolean;
  user: SteamUser | null;
}

// Auth requests go through the backend Passport Steam routes; the API key never reaches the browser.
export async function fetchCurrentUser(): Promise<CurrentUserResponse> {
  const res = await fetch(apiUrl('/api/auth/me'), { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch current user');
  return res.json();
}

export function redirectToSteamLogin() {
  window.location.href = apiUrl('/api/auth/steam');
}

export async function logout(): Promise<void> {
  await fetch(apiUrl('/api/auth/logout'), { method: 'POST', credentials: 'include' });
}
