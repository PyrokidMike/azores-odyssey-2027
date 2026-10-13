CREATE TABLE IF NOT EXISTS accommodation_import_backup (
  id integer PRIMARY KEY DEFAULT 1,
  payload jsonb NOT NULL,
  imported_at timestamp NOT NULL DEFAULT now(),
  imported_by_user_id text NOT NULL,
  imported_by_name text NOT NULL
);
