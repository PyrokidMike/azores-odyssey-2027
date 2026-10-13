ALTER TABLE accommodation
ADD COLUMN IF NOT EXISTS kpis jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE accommodation
ADD COLUMN IF NOT EXISTS "kpiVerifiedAt" timestamp;

CREATE TABLE IF NOT EXISTS accommodation_bedroom_detail (
  id serial PRIMARY KEY,
  "accommodationId" integer NOT NULL
    REFERENCES accommodation(id) ON DELETE CASCADE,
  "roomName" text NOT NULL,
  "bedType" text,
  "bedQuantity" integer,
  "sleepingCapacity" integer,
  "ensuiteStatus" text,
  notes text,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS accommodation_bedroom_detail_lookup_idx
ON accommodation_bedroom_detail ("accommodationId");
