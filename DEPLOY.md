# PawBaku — Dərc (Deploy) Təlimatı

PawBaku: Bakıda itkin/tapılmış heyvanlar, küçə heyvanlarına kömək və övladlığa götürmə platforması.
Bu sənəd layihənin lokal dəvirindən publik dərcinə qədər bütün addımları izah edir.

---

## 1. Nə daxildir (hazırkı funksionallıq)

- **Auth & RBAC** — JWT (HS256), 6 rol (`CITIZEN`, `VOLUNTEER`, `SHELTER_STAFF`, `VET`, `MODERATOR`, `ADMIN`).
- **İtkin & Tapılmış** — ictimai elanlar feed'i, detal səhifəsi, **elan vermə formu**, uyğunluq balı.
- **Övladlığa götürmə** — ictimai pet profilləri, **şəkil + təsvirlə profil açma**, **ərizə göndərmə**, ərizələrin izlənməsi.
- **Küçə heyvanlarına kömək** — canlı bildirişlər, şəkil yükləmə, status axını
  (`REPORTED → VERIFIED → VOLUNTEER_ASSIGNED → VET_CARE → RESOLVED`), hər keçid rol-məhdudiyyətli.
- **Profil** — məlumat redaktəsi, "Mənim bildirişlərim", "Ərizələrim".
- **İdarəetmə paneli** (`/admin`) — moderator/admin üçün: backend sağlamlığı, həcmlər, son bildirişlər + sürətli status keçidi.
- **Şəkil yükləmə** — JPG/PNG/WEBP, ≤5 MB, MIME-whitelist, məntiqi səhvlər 400 ilə qaytarılır.
- **Sağlamlıq yoxlaması** — `GET /api/health` → `{"status":"UP"}`.

## 2. Lokal Docker-ə salma (tövsiyə olunan)

```bash
cp .env.example .env        # ilk dəfə; parolları dəyişin
docker compose up --build -d
```

| Servis | Ünvan |
|---|---|
| Frontend (nginx) | http://localhost:8888 |
| Backend API | http://localhost:8081 (`/api`, `/uploads` nginx vasitəsilə `backend:8080`-ə proxylənir) |
| PostgreSQL | `localhost:5433` (yalnız loopback), db `pawbaku`, user `postgres` |

### Demo hesablar (seed — DataInitializer, yalnız boş DB-də yaradılır)

| İstifadəçi | Parol | Rol |
|---|---|---|
| `admin` | `Admin123!` | ADMIN |
| `vasif` | `PawBakuDemo1!` | VOLUNTEER |
| `nigar` | `PawBakuDemo1!` | VET |

> Prod parollar `.env`/və ya secret menecerindən verilir; demo parollar yalnız lokal şoudur.

Seed idempotentdir: aktiv elanlar mövcuddursa təkrarlanmır; demo məlumatlara 4 elan, 3 bildiriş,
və 3 övladlıq profili daxildir.

## 3. Backup

```bash
docker compose exec db pg_dump -U postgres -d pawbaku > pawbaku-$(date +%F).sql
docker compose cp pawbaku-backend:/app/uploads ./uploads-backup
```

Volume-lar (`pgdata`, `uploads`) docker-compose tərəfindən idarə olunur; compose ilə silinənədək
qalır. Tam təmiz start üçün: `docker compose down -v` (məlumatlarla birlikdə silinir — diqqət!).

## 4. Təhlükəsizlik qeydləri

- **POST/PATCH** son nöqtələr JWT tələb edir; yalnız `GET` read əməliyyatları və
  `POST /api/auth/register|login` publikdir.
- **Şəkil upload:** yalnız JPG/PNG/WEBP MIME, 5 MB limit; fayl adı daxil deyil, UUID-generasiya;
  Spring multipart limitləri `application.yml`-də (5MB / 10MB), nginx `client_max_body_size 10m`.
- DB portu `127.0.0.1`-ə bağlıdır — internetə açıq deyil. Backend portu da loopback-dir
  (`127.0.0.1:${BACKEND_PORT}`); publik giriş yalnız nginx (frontend :8888) üzərindən olmalıdır.
- `JWT_SECRET` ən azı 32 bayt; `.env.example`-dəki dəyərlə **proda** işləməyin.

## 5. Publik dərc (sonrakı addım)

1. VPS (Ubuntu) + `domain.com` → DNS A record.
2. `docker compose pull && docker compose up -d` — eyni compose.
3. Reverse proxy (Caddy & ya nginx):
   - `domain.com` → frontend (port 8888);
   - SSL (Caddy avtomatik Let's Encrypt, nginx-certbot).
   - Frontend `nginx.conf`dakı SPA fallback publik proxy-də qorunmalıdır.
4. `CORS_ORIGINS=https://domain.com`, publika açıq portlar: yalnız 443.
5. `uploads` üçün daimi yerləşdirmə (NFS/volume snapshot) — container rebuildi faylları saxlayır,
   çünki named volume-dur.

### LinkedIn / OpenGraph

`frontend/index.html`-də `og:image` və `og:url` hazırda nisbi path-dir. Domain qoyulduqdan sonra
bunları tam URL ilə əvəz edin (`https://domain.com/hero-baku.jpg`) — LinkedIn crosdisplay üçün
tam URL tələb edir.

## 6. İdarəetmə

- **Sağlamlıq:** `curl http://localhost:8081/api/health` → `{"status":"UP"}`.
  (compose içində backend healthcheck əlavə edilmir, çünki JRE imicində `wget/curl` yoxdur;
  `restart: unless-stopped` işləyir.)
- **Log:** `docker compose logs -f backend frontend`.
- **Məlumat toxumu silmək:** DB-ni yenidən yaratmaq istəsəniz `docker compose down -v && docker compose up -d`.

## 7. Bəlli məsələlər

- `.env` olmadan compose dərhal xəta verir (`:?` required) — bu gözlənilən davranışdır.
- Bəzi xəta mesajları konsolda mojibake (kod səhifəsi) görünür — kosmetikdir, davranışa təsir etmir.
- Elanlar `ddl-auto: validate` ilə işləyir — yeni baxış şema dəyişiklikləri Flyway migrasiya tələb edir.