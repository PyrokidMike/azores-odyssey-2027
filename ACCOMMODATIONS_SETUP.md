# Accommodation setup

The four accommodation tables are created by `drizzle/0001_accommodation.sql`. The connected Neon database has already received the same non-destructive DDL.

## Local

```bash
pnpm install
pnpm db:migrate
```

## Production

From the repository checkout with the production `DATABASE_URL` loaded in the environment:

```bash
pnpm install --frozen-lockfile
pnpm db:migrate
pnpm build
```

Never commit `DATABASE_URL` or other credentials. The app does not expose a migration route.

## Agent Max import shape

The future admin import accepts a JSON array. Each row must include `sourceUrl`; other fields are optional and match the accommodation columns, for example:

```json
[{"name":"Family villa","sourceUrl":"https://example.com/listing","capacity":13,"bedrooms":5,"amenities":{"pool":true,"wifi":true,"other":["crib"]},"status":"submitted","researchStatus":"research-needed"}]
```

Imports validate URLs, match normalized source URLs, support dry-run previews, and preserve votes/comments.
