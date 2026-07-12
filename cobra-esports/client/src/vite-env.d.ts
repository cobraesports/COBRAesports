/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Базовый URL backend-API. Пусто = относительные /api/* пути (локальный dev-proxy). */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
