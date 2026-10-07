# PawBaku

Bakıda itkin/tapılmış heyvanlar, küçə heyvanlarına kömək və övladlığa götürmə platforması.
Eyni editorial dizayn dilini paylaşan müstəqil layihədir: ayrı repo, ayrı paket (`com.example.pawbaku`),
ayrı DB (`pawbaku`) — başqa layihədən heç bir dependency yoxdur.

- **Spec:** `PAWBAKU_SPEC.md` — düzəliş edilmiş plan (status axınları, matcher, kəsimlər)
- **Arxitektura:** `ARCHITECTURE.md` — ERD, cədvəl detalları, struktur, reuse qeydləri

## Status

- `frontend/` — Vite + React 19 + TS + Tailwind v4, build keçir (Pillə 1 səhifələri).
- Backend (Spring Boot 4.1 + Java 21) — **Pillə 1 hazır**: JWT auth (register/login/me, 6 rol),
  Flyway `V1` (users, animals, listings), builder `pawbaku.jar` keçir.

## İşə salma

**1) Bir əmrlə hamısı (tövsiyə olunan) — Docker:**

```bash
cp .env.example .env        # ilk dəfə; dəyərləri redaktə edə bilərsiz
docker compose up --build
```

- Frontend: http://localhost:8888
- Backend API: http://localhost:8081 (nginx arxada `backend:8080`)
- PostgreSQL: `pawbaku-db` (port 5433, məlumatlar `pgdata` volume-da)
- İlk admin: `.env`-dəki `BOOTSTRAP_ADMIN_PASSWORD`, istifadəçi `admin`

**2) Yerli dev (Docker-siz):**

Backend Postgres tələb edir — əlaqə portunu `DB_PORT` ilə yola salın:

```bash
./mvnw spring-boot:run        # .env kimi: DB_PORT=5433 JWT_SECRET=... BOOTSTRAP_ADMIN_PASSWORD=...
cd frontend && npm ci && npm run dev
```

## Layihə strukturu

```
pawbaku/
├─ frontend/     # Vite + React 19 + TS + Tailwind v4 (Home, Listings, Report, Adopt, Auth, 404)
├─ src/main/java/com/example/pawbaku/   # Spring Boot 4 + Java 21 (auth, RBAC, bootstrap admin)
├─ src/main/resources/db/migration/     # Flyway V1 (users, animals, listings)
├─ docker-compose.yml, Dockerfile, frontend/Dockerfile + nginx.conf
└─ ARCHITECTURE.md, PAWBAKU_SPEC.md, README.md
```

## Növbəti addımlar

- **Pillə 2:** listings/reports CRUD + Haversine matcher + deduplikasiya + outbox bildiriş
- **Pillə 3:** Telegram bot + tam street-report axını + deploy (docker-compose)