-- =====================================================================
-- PawBaku - Animal city platform for Baku
-- Initial schema (Pill 1: users; animals + listings FKs ready for Pill 2)
-- =====================================================================

CREATE TABLE users (
    id                BIGSERIAL PRIMARY KEY,
    username          VARCHAR(50)  NOT NULL,
    email             VARCHAR(150) NOT NULL,
    password          VARCHAR(100) NOT NULL,
    full_name         VARCHAR(120),
    phone_number      VARCHAR(20),
    telegram_chat_id  VARCHAR(64),
    role              VARCHAR(30)  NOT NULL,
    active            BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at        TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uk_users_username UNIQUE (username),
    CONSTRAINT uk_users_email    UNIQUE (email),
    CONSTRAINT ck_users_role     CHECK (role IN ('CITIZEN', 'VOLUNTEER', 'SHELTER_STAFF', 'VET', 'MODERATOR', 'ADMIN'))
);

CREATE TABLE animals (
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(80),
    species       VARCHAR(30)  NOT NULL,
    breed         VARCHAR(80),
    color         VARCHAR(60),
    size          VARCHAR(20),
    gender        VARCHAR(20),
    age_months    INTEGER,
    photo_url     VARCHAR(500),
    notes         VARCHAR(1000),
    created_by    BIGINT NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_animals_created_by FOREIGN KEY (created_by) REFERENCES users (id),
    CONSTRAINT ck_animals_species CHECK (species IN ('DOG', 'CAT', 'OTHER')),
    CONSTRAINT ck_animals_size    CHECK (size    IN ('SMALL', 'MEDIUM', 'LARGE')),
    CONSTRAINT ck_animals_gender   CHECK (gender  IN ('MALE', 'FEMALE', 'UNKNOWN'))
);

CREATE INDEX idx_animals_species ON animals (species);

-- İtkin / Tapılmış elanı
CREATE TABLE listings (
    id                 BIGSERIAL PRIMARY KEY,
    kind               VARCHAR(20) NOT NULL,
    status             VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    event_time         TIMESTAMP WITH TIME ZONE,
    latitude           DOUBLE PRECISION NOT NULL,
    longitude          DOUBLE PRECISION NOT NULL,
    district           VARCHAR(80),
    address            VARCHAR(300),
    description        VARCHAR(4000),
    created_by         BIGINT NOT NULL,
    animal_id          BIGINT NOT NULL,
    matched_listing_id BIGINT,
    created_at         TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at         TIMESTAMP WITH TIME ZONE,
    version            BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_listings_created_by   FOREIGN KEY (created_by)   REFERENCES users (id),
    CONSTRAINT fk_listings_animal       FOREIGN KEY (animal_id)    REFERENCES animals (id),
    CONSTRAINT fk_listings_matched      FOREIGN KEY (matched_listing_id) REFERENCES listings (id),
    CONSTRAINT ck_listings_kind    CHECK (kind   IN ('LOST', 'FOUND')),
    CONSTRAINT ck_listings_status  CHECK (status IN ('ACTIVE', 'MATCHED', 'CLOSED', 'EXPIRED', 'REOPENED')),
    CONSTRAINT ck_listings_latitude  CHECK (latitude  BETWEEN  -90 AND  90),
    CONSTRAINT ck_listings_longitude CHECK (longitude BETWEEN -180 AND 180)
);

CREATE INDEX idx_listings_status ON listings (status);
CREATE INDEX idx_listings_kind   ON listings (kind);
CREATE INDEX idx_listings_coords ON listings (latitude, longitude);
CREATE INDEX idx_listings_created_by ON listings (created_by);