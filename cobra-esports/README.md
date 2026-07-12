# COBRA ESPORTS

Профессиональный сайт киберспортивной организации COBRA ESPORTS (Counter-Strike 2).

## Структура проекта

```
cobra-esports/
├── client/     # React + TypeScript + Tailwind (Vite)
└── server/     # Node.js + Express + Passport Steam
```

## Быстрый старт

### 1. Сервер (API + Steam Auth)

```bash
cd server
npm install
cp .env.example .env
# впиши свой STEAM_API_KEY и SESSION_SECRET в .env
npm run dev
```

Сервер поднимется на `http://localhost:5000`.

### 2. Клиент

```bash
cd client
npm install
npm run dev
```

Клиент поднимется на `http://localhost:5173` (Vite proxy `/api` → `http://localhost:5000`).

## Архитектура статистики CS2 (новое)

```
server/
├── config/
│   ├── env.ts              # централизованный, типизированный доступ к process.env
│   └── passport.js          # Passport Steam (авторизация, отдельно от статистики)
├── services/
│   ├── steamService.ts      # обёртка над Steam Web API (ник/аватар/статус)
│   └── cs2StatsService.ts   # внешний CS2 stats API + mock-фолбэк
├── controllers/
│   └── statsController.ts   # обрабатывает запросы, вызывает cs2StatsService
└── routes/
    └── stats.ts              # GET /api/stats/:steamId, GET /api/matches/:steamId
```

Переменные окружения (`server/.env`):

```
CS2_STATS_API_URL=
CS2_STATS_API_KEY=
```

Пока эти переменные пустые (или внешний API недоступен), `cs2StatsService` автоматически
отдаёт mock-данные — фронтенд при этом работает без изменений. Когда появится реальный
провайдер статистики, нужно будет обновить только `normalizePlayerStats` /
`normalizeMatches` / `normalizePerformance` внутри `cs2StatsService.ts` — контракт
ответа (`PlayerStatsData`, `MatchData`, `PerformancePoint`) и все контроллеры/роуты
менять не придётся.

Фронтенд (`client/src/services/cs2StatsService.ts` → `client/src/api/stats.ts`) обращается
к `/api/stats/:steamId` и `/api/matches/:steamId`, с собственным фолбэком на локальный mock
на случай, если backend недоступен. Страница **Statistics** (`/statistics`) использует эти
данные для карточек, графика рейтинга и списка последних матчей, плюс кнопку **Refresh Stats**.

## Steam API Key

Получить ключ: https://steamcommunity.com/dev/apikey

**Никогда не коммить `.env` и не хранить ключ в коде.** Ключ читается только через `process.env.STEAM_API_KEY` в `server/config/passport.js` и `server/routes/*`.

## Что уже готово

- Steam OAuth (Passport Steam + express-session)
- Профиль игрока AXO с реальными полями из Steam (после входа) + fallback на mock
- Архитектура подключения внешнего CS2 stats API (`services/cs2StatsService.ts`,
  `controllers/statsController.ts`, `routes/stats.ts`) с автоматическим mock-фолбэком
- Statistics Dashboard с mock-данными (пока провайдер не подключён), анимациями
  (Framer Motion, Recharts) и кнопкой Refresh Stats
- Тёмная (чёрный/жёлтый/неон) и светлая (белый/красный) темы с переключением лого/баннера/иконок
- Главная (Hero + частицы), Команда, Новости, Матчи, Медиа, Магазин, Admin (заглушка без авторизации)
- Разделение на `services/`, `controllers/` и `routes/` с комментариями `// TODO: Connect real API`


## Что нужно сделать вручную

1. Вписать свой Steam API key в `server/.env`.
2. Прописать прод-домены в `.env` (`STEAM_RETURN_URL`, `CLIENT_URL`).
3. Когда появится реальный провайдер CS2-статистики — вписать `CS2_STATS_API_URL` и
   `CS2_STATS_API_KEY` в `server/.env` и обновить `normalize*`-функции в
   `server/services/cs2StatsService.ts` под формат ответа этого провайдера.
4. Наполнить реальным контентом разделы News/Matches/Shop (сейчас mock-данные в `client/src/data/`).
5. При необходимости добавить авторизацию в Admin-панель (JWT/роли).

## npm install (сводка)

```bash
cd server && npm install
cd ../client && npm install
```

## npm run (сводка)

```bash
# терминал 1
cd server && npm run dev

# терминал 2
cd client && npm run dev
```

