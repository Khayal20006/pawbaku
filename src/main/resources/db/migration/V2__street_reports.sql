-- =====================================================================
-- PawBaku - Street animal help reports + audit trail (Pill 3 wire-up)
-- =====================================================================

CREATE TABLE reports (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(120) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    status      VARCHAR(30)  NOT NULL DEFAULT 'REPORTED',
    species     VARCHAR(10)  NOT NULL DEFAULT 'DOG',
    district    VARCHAR(80)  NOT NULL,
    address     VARCHAR(300),
    latitude    DOUBLE PRECISION,
    longitude   DOUBLE PRECISION,
    photo_url   VARCHAR(500),
    reporter_id BIGINT NOT NULL,
    verified_by BIGINT,
    volunteer_id BIGINT,
    vet_id      BIGINT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at  TIMESTAMP WITH TIME ZONE,
    version     BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_reports_reporter   FOREIGN KEY (reporter_id)   REFERENCES users (id),
    CONSTRAINT fk_reports_verified   FOREIGN KEY (verified_by)   REFERENCES users (id),
    CONSTRAINT fk_reports_volunteer  FOREIGN KEY (volunteer_id)  REFERENCES users (id),
    CONSTRAINT fk_reports_vet        FOREIGN KEY (vet_id)        REFERENCES users (id),
    CONSTRAINT ck_reports_status CHECK (status IN ('REPORTED', 'VERIFIED', 'VOLUNTEER_ASSIGNED', 'VET_CARE', 'RESOLVED')),
    CONSTRAINT ck_reports_species CHECK (species IN ('DOG', 'CAT', 'OTHER'))
);

CREATE INDEX idx_reports_status     ON reports (status);
CREATE INDEX idx_reports_created_at ON reports (created_at DESC);
CREATE INDEX idx_reports_district   ON reports (district);

CREATE TABLE report_events (
    id          BIGSERIAL PRIMARY KEY,
    report_id   BIGINT NOT NULL,
    from_status VARCHAR(30),
    to_status   VARCHAR(30) NOT NULL,
    actor_id    BIGINT,
    note        VARCHAR(500),
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_report_events_report FOREIGN KEY (report_id) REFERENCES reports (id) ON DELETE CASCADE,
    CONSTRAINT fk_report_events_actor  FOREIGN KEY (actor_id)  REFERENCES users (id),
    CONSTRAINT ck_report_events_from CHECK (from_status IN ('REPORTED', 'VERIFIED', 'VOLUNTEER_ASSIGNED', 'VET_CARE', 'RESOLVED')),
    CONSTRAINT ck_report_events_to   CHECK (to_status   IN ('REPORTED', 'VERIFIED', 'VOLUNTEER_ASSIGNED', 'VET_CARE', 'RESOLVED'))
);

CREATE INDEX idx_report_events_report ON report_events (report_id, created_at);