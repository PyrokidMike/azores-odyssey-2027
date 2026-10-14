CREATE TABLE IF NOT EXISTS accommodation_import_backup (
  id integer PRIMARY KEY DEFAULT 1,
  payload jsonb NOT NULL,
  "importedAt" timestamp NOT NULL DEFAULT now(),
  "importedByUserId" text NOT NULL,
  "importedByName" text NOT NULL
);
