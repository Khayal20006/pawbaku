# PawBaku

Bakıda itkin/tapılmış heyvanlar, küçə heyvanlarına kömək və övladlığa götürmə platforması.
Eyni editorial dizayn dilini paylaşan müstəqil layihədir: ayrı repo, ayrı paket (`com.example.pawbaku`),
ayrı DB (`pawbaku`) — başqa layihədən heç bir dependency yoxdur.

- **Spec:** `PAWBAKU_SPEC.md` — düzəliş edilmiş plan (status axınları, matcher, kəsimlər)
- **Arxitektura:** `ARCHITECTURE.md` — ERD, cədvəl detalları, struktur, reuse qeydləri

## Status

Pillə 1-3 tam: JWT auth/anclar (6 rol), itkin & tapılmış (feed, detal, elan vermə), övladlığa götürmə
(profil + ərizə axını), küçə heyvanına kömək (bildiriş + şəkil + status axını), profil bölməsi
(bildirişlər, ərizələr), /admin panel, sağlamlıq healthcheck, şəkil upload (JPG/PNG/WEBP ≤5 MB).

- `frontend/` — Vite + React 19 + TS + Tailwind v4, build + lint + tsc keçir.
- Backend (Spring Boot 4.1 + Java 21) — JWT auth, RBAC, Flyway `V1–V3`, `ddl-auto: validate`,
  Docker imici + nginx proxy, seed data (admin/vasif/nigar).

## İşə salma

**1) Bir əmrlə hamısı (tövsiyə olunan) — Docker:**

```bash
cp .env.example .env        # ilk dəfə; dəyərləri redaktə edə bilərsiz
docker compose up --build
```

- Frontend: http://localhost:8888
- Backend API: http://localhost:8081 (nginx arxada `backend:8080`) · health: http://localhost:8081/api/health
- PostgreSQL: `pawbaku-db` (port 5433, məlumatlar `pgdata` volume-da)
- Şəkillər: `uploads` named volume → `/uploads/**` URL-ləri nginx üzərindən xidmət olunur
- İlk admin: `.env`-dəki `BOOTSTRAP_ADMIN_PASSWORD`, istifadəçi `admin`

Demo hesablar, backup, təhlükəsizlik və publik dərc: → **`DEPLOY.md`**

**2) Yerli dev (Docker-siz):**

Backend Postgres tələb edir — əlaqə portunu `DB_PORT` ilə yola salın:

```bash
./mvnw spring-boot:run        # .env kimi: DB_PORT=5433 JWT_SECRET=... BOOTSTRAP_ADMIN_PASSWORD=...
cd frontend && npm ci && npm run dev
```

## Layihə strukturu

```
pawbaku/
├─ frontend/     # Vite + React 19 + TS + Tailwind v4 (Home, Listings, Report, Adopt, Auth, Admin, 404)
├─ src/main/java/com/example/pawbaku/   # Spring Boot 4 + Java 21 (auth, RBAC, adopsiya, report axını)
├─ src/main/resources/db/migration/     # Flyway V1–V3 (users, animals/listings, adoptions)
├─ docker-compose.yml, Dockerfile, frontend/Dockerfile + nginx.conf
└─ ARCHITECTURE.md, PAWBAKU_SPEC.md, DEPLOY.md, README.md
```

## Növbəti addımlar

- **Pillə 4:** Telegram bildirişləri, xəritədə dəqiq yer (Leaflet), matcher panel süzgəcləri
- **Pillə 5:** sığınacaq/moderator tərəfi tam admin CRUD + statistika (recharts)