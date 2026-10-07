# PawBaku — Arxitektura, ERD və Layihə Strukturu

> `PAWBAKU_SPEC.md` spesifikasiyasının texniki qarşılığı. Frontend hazırdır (Pillə 1);
> backend bu sxem üzrə qurulur — mövcud şikayət portaldan köçürmələr qeyd edilib.

---

## 1. ERD (əsas entitilər)

```
                          ┌──────────────┐
                          │    users     │
                          └──────────────┘
   role: CITIZEN | VOLUNTEER | SHELTER_STAFF | VET | MODERATOR | ADMIN
   phone, telegram_chat_id
         │
         │ 1:N (yaradan)
         ▼
   ┌───────────────┐  1:1 ┌────────────────────┐    1:N  ┌────────────────┐
   │   animals     │◄─────│    listings        │────────►│   listings     │
   └───────────────┘      │  kind: LOST|FOUND  │  matched  (1:N uyğunluq) │
   species, breed,        │  lat/lng, district │     └────────────────┘
   color, size, gender,   │  status: ACTIVE|MATCHED|CLOSED|EXPIRED|REOPENED
   age, photo_url         └────────────────────┘
        ▲                        │
        │ 1:N                    │ 1:N
   ┌────┴─────────┐        ┌─────▼─────────────────────┐
   │  shelters    │        │  street_reports            │
   │ (milestone2) │        │  status: REPORTED→...→RESOLVED
   └──────────────┘        │  lat/lng, severity, photo
                           └───┬───────────────┬───────┘
                               │N:1           │N:1
                         volunteer(users)   vet(users)

   ┌─────────────────┐  1:N ┌──────────────────────────┐
   │ adoption_listing│─────►│ adoption_applications     │
   │ status: LISTED→…→ADOPTED│ status, message, meeting_at
   └─────────────────┘      └──────────────────────────┘

   ┌─────────────────┐      ┌──────────────────────────┐
   │ needs            │ 1:N │ pledges                  │
   │ (shelter ehtiyac)│────►│ (söz, qeyri-pul MVP)     │
   └─────────────────┘      └──────────────────────────┘

   ┌─────────────────┐
   │ notifications    │  ← outbox (outbox/job)
   │ channel: TELEGRAM|EMAIL, status: PENDING|SENT|FAILED
   └─────────────────┘

   ┌─────────────────┐   ┌───────────────┐
   │ match_results    │   │ audit_log     │
   │ (listing_pair,   │   │ actor, action,│
   │  score, matched) │   │ entity, ts    │
   └─────────────────┘   └───────────────┘
```

## 2. Cədvəl detalları (MVP kəsimi)

**users** — ümumi auth üçün; `telegram_chat_id` bildiriş üçün, `phone` (Pillə 2 OTP).
**animals** — heyvan "vərəqə"si (foto, xüsusiyyətlər); listinglərin ürəyi.
**listings** — İtkin/Tapılmış elanı: koordinat + rayon; `matched_listing_id` uyğunlaşanda doldurulur.
**street_reports** — küçə heyvanı bildirişi; `severity` (LOW/NORMAL/HIGH/URGENT).
**adoption_listing / adoption_applications** — övladlığa götürmə axını.
**needs / pledges** — sığınacağın ehtiyac siyahısı + söz (real pul yox, MVP).
**notifications** — outbox: yaz → job götür → Telegram/e-poçt göndər → xalis vəziyyət.
**match_results** — uyğunluq balı cədvələsi + `MATCH_CONFIG` (çəkilər) cache.
**audit_log** — status keçidləri (hansı istifadəçi, nə vaxt).

İndekslər: `listings(status, kind)`, `listings(lat, lng)`, `street_reports(status, lat, lng)`,
`notifications(status, created_at)`, `animals(species)`, `adoption_applications(listing_id, status)`.
Radius axtarışı MVP-də Haversine (Java tərəfdə); PostGIS milestone 2.

## 3. Status axınları (ayrı enumlar + `allowedTransitions()`)

- **StreetReport:** `REPORTED → VERIFIED → VOLUNTEER_ASSIGNED → VET_CARE → RESOLVED`; terminal `REJECTED|CANCELLED`; yenidən açıla bilər.
- **AdoptionListing:** `LISTED → APPLICATION_SUBMITTED → UNDER_REVIEW → MEETING_SCHEDULED → APPROVED → ADOPTED(+FOLLOW_UP)`; `REJECTED|CANCELLED` terminal.
- **Listing:** `ACTIVE → MATCHED → CLOSED`; `EXPIRED`, `REOPENED`.

## 4. Layihə strukturu (plan)

```
pawbaku/
├─ frontend/                 # ✅ HAZIRDIR — Vite + React 19 + TS + Tailwind v4
│  ├─ src/pages/             # Home, Listings, Report, Adopt, Login/Register/Profile, 404
│  ├─ src/components/        # ui.tsx (design kit), Layout, AuthShell, ProtectedRoute
│  ├─ src/context/ hooks/ lib/
│  └─ public/                # hero-baku.jpg, hero-paw.jpg, hero-paw-2.jpg
├─ src/main/java/com/example/pawbaku/   # ✅ Pillə 1 hazırdır — Spring Boot 4 + Java 21
│  ├─ model/                 # User (6 rol) — animals/listings Pillə 2
│  ├─ controller/ service/ repository/ dto/ mapper/
│  ├─ security/              # JWT HS256 (öz-özünə təsdiq), RBAC
│  └─ config/                # SecurityConfig, DataInitializer (bootstrap admin)
├─ src/main/resources/
│  ├─ application.yml        # env-dən: DB_*, JWT_SECRET, BOOTSTRAP_ADMIN_PASSWORD
│  └─ db/migration/V1__init_schema.sql   # users, animals, listings
├─ Dockerfile, application-local.yml (git-ignored), .env.example
└─ ARCHITECTURE.md, PAWBAKU_SPEC.md, README.md
```

## 5. Reuse matrisi (şikayət portaldan)

| Təkrar istifadə (köçürüləcək) | Yeni (PawBaku-ya xas) |
|---|---|
| JWT auth + RBAC, `AppUserDetails`, `JwtService`, SecurityConfig | `Animal`, `Listing`, `StreetReport`, matching |
| Status keçid `allowedTransitions()` nümunəsi | `MatchingScorer` + çəkilər + deduplikasiya |
| `FileController` + `/uploads` static + `UploadStorageProperties` | Outbox/notifications + Telegram |
| frontend UI kit (`ui.tsx`), Layout, grain/fontlar | PawBaku nav/hero, elan/report modulları |
| Dockerfile, docker-compose, `.env.example` | Vet/Shelter modulları (milestone 2) |

## 6. Sifariş (növbəti addımlar)

1. ✅ Backend Pillə 1: pom, users (6 rol) + JWT auth, Flyway V1 (users, animals, listings).
2. Pillə 1 çalışan yoxlama: PostgreSQL ilə run + `POST /api/auth/*` smoke test.
3. Pillə 2: Animal/Listing model + CRUD, status keçid `allowedTransitions()`, deduplikasiya.
4. Pillə 3: StreetReport axını + matcher (`MatchingScorer`) + outbox bildiriş + Telegram.
5. Pillə 4: docker-compose (db + backend + nginx) + deploy.