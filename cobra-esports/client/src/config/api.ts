// Единая точка конфигурации адреса backend'а.
//
// Локально (npm run dev): VITE_API_URL можно оставить пустым — Vite proxy
// (см. vite.config.ts) сам перенаправит /api/* на http://localhost:5000.
//
// На проде (Render): frontend и backend — это два разных сервиса с разными
// доменами, никакого dev-proxy там нет. Поэтому в client/.env (или в
// Environment Variables сервиса на Render) нужно задать:
//   VITE_API_URL=https://<ваш-backend-сервис>.onrender.com
// Vite подставит это значение на этапе сборки (npm run build).
export const API_BASE_URL: string = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');

/**
 * Строит полный URL к backend-эндпоинту.
 * apiUrl('/api/player/axo') -> 'https://backend.onrender.com/api/player/axo' на проде,
 * или просто '/api/player/axo' локально (уйдёт через Vite proxy).
 */
export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
