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

**Backend** (PostgreSQL tələb olunur; `application-local.yml` kimi local override oraya
əlavə olunur, fayl git-ignore-dır):

```bash
./mvnw spring-boot:run
# və ya: ./mvnw -DskipTests package && java -jar target/pawbaku.jar
```

**Frontend (dev):**

```bash
cd frontend
npm ci
npm run dev
```

## Növbəti addımlar

- **Pillə 2:** listings/reports CRUD + Haversine matcher + deduplikasiya + outbox bildiriş
- **Pillə 3:** Telegram bot + tam street-report axını + deploy (docker-compose)