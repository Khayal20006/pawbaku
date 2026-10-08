-- Adoption module: adoptable pet profiles plus adoption applications.
CREATE TABLE adoptable_pets (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(120) NOT NULL,
    species    VARCHAR(10)  NOT NULL,
    breed      VARCHAR(80),
    gender     VARCHAR(20)  NOT NULL DEFAULT 'UNKNOWN',
    age_months INT,
    size       VARCHAR(20),
    color      VARCHAR(60),
    about      VARCHAR(1200),
    photo_url  VARCHAR(500),
    status     VARCHAR(20)  NOT NULL DEFAULT 'AVAILABLE',
    created_by BIGINT       NOT NULL REFERENCES users (id),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_adoptable_pets_status ON adoptable_pets (status);

-- Applications are public-facing only: the pet owner/org replies out-of-band (email/phone).
CREATE TABLE adoption_applications (
    id           BIGSERIAL PRIMARY KEY,
    pet_id       BIGINT       NOT NULL REFERENCES adoptable_pets (id) ON DELETE CASCADE,
    applicant_id BIGINT       NOT NULL REFERENCES users (id),
    message      VARCHAR(1200),
    status       VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_adoption_applications_pet ON adoption_applications (pet_id);
CREATE INDEX idx_adoption_applications_applicant ON adoption_applications (applicant_id);