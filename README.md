# Song of the Day

Eine Web-Plattform zum täglichen Teilen und Entdecken von Lieblingssongs. Jede:r Nutzer:in kann einmal pro Tag einen aktuellen "Song of the Day" hinzufügen und sehen, was die Community gerade hört.

**Live:** [sod.lbiller.de](https://sod.lbiller.de)

---

## Inhaltsverzeichnis

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architektur](#architektur)
- [Erste Schritte](#erste-schritte)
- [Environment Variables](#environment-variables)
- [Projektstruktur](#projektstruktur)
- [Roadmap](#roadmap)
- [Lizenz](#lizenz)

---

## Features

- **Täglicher Song** – Einmal pro Tag kann jede:r Nutzer:in ihren/seinen aktuellen Lieblingssong festlegen
- **Multi-Plattform-Import** – Songs lassen sich direkt über Spotify- oder SoundCloud-URLs importieren
- **Authentifizierung** – Login via Google OAuth, umgesetzt mit Better Auth
- **Community-Feed** – Übersicht darüber, was andere Nutzer:innen aktuell hören
- **Push-Benachrichtigungen** – Web-Push-Support über VAPID-Keys
- **Automatisierte Jobs** – Tägliche Reset-/Erinnerungslogik über Vercel Cron Jobs
- **iOS-Integration** – Optionale Anbindung über iOS Shortcuts
- **Responsive UI** – Modernes, cleanes Interface mit Tailwind CSS

## Tech Stack

| Bereich | Technologie |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Sprache | TypeScript |
| Backend | Next.js API Routes |
| Datenbank | MongoDB mit Mongoose |
| Authentifizierung | Better Auth (Google OAuth) |
| Styling | Tailwind CSS |
| Externe APIs | Spotify Web API, SoundCloud API |
| Benachrichtigungen | Web Push (VAPID) |
| Hosting | Vercel |

## Architektur

```
songoftheday/
├── app/                # Next.js App Router – Seiten & API-Routen
├── components/         # Wiederverwendbare UI-Komponenten
├── lib/                # Datenbank-, Auth- und API-Clients
├── models/             # Mongoose-Schemas
└── public/             # Statische Assets
```

Das Projekt folgt einer klassischen Next.js-Full-Stack-Architektur: Server-seitige API-Routen kommunizieren mit MongoDB, während externe Musikdienste (Spotify, SoundCloud) über dedizierte Client-Module angebunden sind. Authentifizierung läuft vollständig über Better Auth, Cron Jobs übernehmen die täglich wiederkehrende Logik.

## Erste Schritte

### Voraussetzungen

- Node.js ≥ 18
- Eine laufende MongoDB-Instanz (lokal oder gehostet, z. B. MongoDB Atlas)
- Spotify Developer Account
- SoundCloud Developer Account
- Google Cloud Projekt (für OAuth)

### Installation

```bash
git clone https://github.com/kiwahll/songoftheday.git
cd songoftheday
npm install
```

### Konfiguration

Erstelle eine `.env.local` Datei im Projektroot und trage die erforderlichen Werte ein (siehe [Environment Variables](#environment-variables)).

### Entwicklungsserver starten

```bash
npm run dev
```

Die Anwendung ist anschließend unter [http://localhost:3000](http://localhost:3000) erreichbar.

## Environment Variables

| Variable | Beschreibung | Erforderlich |
|---|---|:---:|
| `SPOTIFY_CLIENT_ID` | Spotify App Client ID | ✅ |
| `SPOTIFY_CLIENT_SECRET` | Spotify App Client Secret | ✅ |
| `SOUNDCLOUD_CLIENT_ID` | SoundCloud App Client ID | ✅ |
| `SOUNDCLOUD_CLIENT_SECRET` | SoundCloud App Client Secret | ✅ |
| `MONGODB_URI` | MongoDB Verbindungs-String | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | ✅ |
| `BETTER_AUTH_SECRET` | Secret Key für Better Auth | ✅ |
| `BETTER_AUTH_BASE_URL` | Basis-URL für Better Auth | ✅ |
| `CRON_SECRET` | Auth-Secret für Vercel Cron Jobs | ✅ |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | VAPID Public Key für Push-Benachrichtigungen | ✅ |
| `VAPID_PRIVATE_KEY` | VAPID Private Key für Push-Benachrichtigungen | ✅ |
| `IOS_SHORTCUT_URL` | URL für optionale iOS-Shortcut-Integration | ❌ |

> **Hinweis:** `.env.local` niemals ins Repository committen. Für Produktionsumgebungen werden die Variablen direkt in Vercel als Environment Variables hinterlegt.

## Projektstruktur

Wichtige Dateien und Verzeichnisse im Überblick:

- `lib/mongodb.ts` – Datenbankverbindung
- `lib/auth.ts` – Better-Auth-Konfiguration
- `app/api/` – REST-Endpunkte für Songs, Auth und Cron Jobs
- `models/` – Mongoose-Modelle (User, Song)

## Roadmap

- [ ] Öffentliche User-Profile
- [ ] Wochen-/Monatsrückblick der eigenen Songs
- [ ] Playlist-Export
- [ ] Erweiterte Suche & Filter im Community-Feed

## Lizenz

Dieses Projekt steht aktuell ohne öffentliche Lizenz zur Verfügung. Bei Interesse an Nutzung oder Beitrag bitte über GitHub Kontakt aufnehmen.

---

Entwickelt von [@lbiller](https://github.com/laurenzbiller)
