# Song of the Day

Eine Plattform zum Teilen und Entdecken von täglichen Lieblingssongs. Jeder Benutzer kann einmal pro Tag seinen aktuellen "Song of the Day" hinzufügen und die Auswahl anderer Benutzer sehen.

## Features

- 🎵 **Täglicher Song**: Füge einmal pro Tag deinen aktuellen Lieblingssong hinzu
- 🔗 **Spotify Integration**: Importiere Songs direkt über Spotify URLs
- 👥 **Community**: Siehe was andere Benutzer heute hören
- 🎨 **Modern UI**: Sauberes und intuitives Design mit Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16 mit App Router
- **Backend**: Next.js API Routes
- **Database**: MongoDB mit Mongoose
- **Styling**: Tailwind CSS
- **External API**: Spotify Web API

## Setup

### 1. Repository klonen

```bash
git clone <repository-url>
cd songoftheday
```

### 2. Dependencies installieren

```bash
npm install
# oder
yarn install
```

### 3. Environment Variables konfigurieren

Erstelle eine `.env.local` Datei im Projektroot:

```env
# Spotify API Credentials
SPOTIFY_CLIENT_ID=deine_spotify_client_id
SPOTIFY_CLIENT_SECRET=deine_spotify_client_secret

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/songoftheday

# Push Benachrichtigugnen
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=

# Vercel Cron Job Auth
CRON_SECRET=
```

### 4. Spotify Developer Setup

1. Gehe zu [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Erstelle eine neue App
3. Kopiere die **Client ID** und **Client Secret**
4. Füge sie in deine `.env.local` ein

### 5. MongoDB Verbindung

Stelle sicher dass eine MongoDB Datenbank läuft und aktualisiere die Verbindung in `lib/mongodb.ts` falls nötig.

### 6. Development Server starten

```bash
npm run dev
```

## Verwendung

Öffne [http://localhost:3000](http://localhost:3000) in deinem Browser.

## Environment Variables

| Variable | Beschreibung | Erforderlich |
|----------|-------------|-------------|
| `SPOTIFY_CLIENT_ID` | Spotify App Client ID | ✅ Ja |
| `SPOTIFY_CLIENT_SECRET` | Spotify App Client Secret | ✅ Ja |
| `MONGODB_URI` | MongoDB Verbindungs-String | ✅ Ja |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | ✅ Ja |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | ✅ Ja |
| `BETTER_AUTH_SECRET` | Better Auth Secret Key | ✅ Ja |
| `BETTER_AUTH_BASE_URL` | Better Auth Base URL | ✅ Ja |
| `CRON_SECRET` | Cron Job Secret Key | ✅ Ja |
| `VAPID_PRIVATE_KEY` | VAPID Private Key für Push-Benachrichtigungen | ✅ Ja |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | VAPID Public Key für Push-Benachrichtigungen | ✅ Ja |
| `IOS_SHORTCUT_URL` | iOS Shortcut URL für App-Integration | ❌ Nein |
| `SOUNDCLOUD_CLIENT_ID` | SoundCloud App Client ID | ✅ Ja |
| `SOUNDCLOUD_CLIENT_SECRET` | SoundCloud App Client Secret | ✅ Ja |
