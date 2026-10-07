# PawBaku

Bakıda itkin/tapılmış heyvanlar, küçə heyvanlarına kömək və övladlığa götürmə platforması.
Eyni editorial dizayn kitabxanasını paylaşan `city-service` (şikayət portalı) layihəsinin davamıdır.

- **Spec:** `PAWBAKU_SPEC.md` — düzəliş edilmiş plan (status axınları, matcher, kəsimlər)
- **Arxitektura:** `ARCHITECTURE.md` — ERD, cədvəl detalları, struktur, reuse matrisi

## Status

- `frontend/` — Vite + React 19 + TS + Tailwind v4, build keçir. Modul səhifələri Pillə 1-də
  (Home, Listings, Report, Adopt, Auth, Profile, 404).
- Backend (Spring Boot 4 + Java 21) — Pillə 1 planlaşdırılıb.

## İşə salma (frontend dev)

```bash
cd frontend
npm ci
npm run dev
```

## Backend-ə nə vaxt qoşulur

- **Pillə 1:** users + JWT auth (şikayət-portal kodundan köçürülür), listings/reports CRUD
- **Pillə 2:** matching (`MatchingScorer` + `MATCH_CONFIG`), deduplikasiya, outbox bildirişləri
- **Pillə 3:** Telegram bildirişləri, tam street-report axını