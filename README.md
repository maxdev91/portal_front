# Comfortside Distributor Portal — Web

Next.js 16 front for the distributor portal: brand catalog, product pages, search, marketing library and magic-link login, in English and Spanish.

## Run locally

The API must be up first (it creates the `portal_net` network):

```bash
cd ../portal_back && make up
cd ../portal_front
cp .env.example .env
docker compose up -d
```

Open http://localhost:3100 (redirects to `/en` or `/es`).

To log in: `/en/login`, enter a demo email (see `portal_back/README.md`), open the link in Mailpit (http://localhost:8026).

## Commands

```bash
docker compose exec web npx eslint src
docker compose exec web npx prettier --write src
docker compose exec web npx next typegen && docker compose exec web npx tsc --noEmit
docker compose logs -f web
```

## Structure

```
src/
  proxy.ts                 locale redirect (replaces middleware)
  i18n/                    locales and dictionaries (en, es)
  lib/api/                 server-only API client, catalog and account calls, types
  lib/session.ts           httpOnly `portal_session` cookie with the API token
  app/[locale]/            pages: home, [brand], [brand]/[category], products/[slug],
                           search, library, login, auth/verify (route handler)
  app/api/revalidate       called by the API when the catalog changes
  app/api/download/[id]    asks the API for the download URL and redirects
  app/actions/auth.ts      server actions: request magic link, sign out
  components/              UI (brand theming through --brand-primary / --brand-accent)
```

## How it works

- **Caching** — catalog fetches use `'use cache'` + `cacheTag('catalog')`. When an admin edits the catalog, the API posts to `/api/revalidate` with `x-revalidate-secret` and the pages refresh within seconds. User-specific data (session, library) is dynamic and rendered inside `<Suspense>`.
- **Session** — the API token never reaches the browser's JavaScript: it lives in the httpOnly `portal_session` cookie and every API call is made server side.
- **Images** — plain `<img>` with URLs from the public bucket/CDN.

## Product page layouts

Each brand chooses its product page in the admin (Brands → Product page):

- **v1 (classic)** — `components/product/ProductViewV1.tsx`: compact header with gallery, then tabs.
- **v2 (immersive)** — `components/product/v2/`: dark hero with a large slider and the info card, full description, technical specifications (own background color) and downloads in vertical tabs (documents by type, accessories, videos) with a "Download all" ZIP of the documents (`/api/products/[slug]/download-all`, which streams the API's ZIP with the session token). Sections without data are skipped.

v2 colors come from the brand's `product_theme` (resolved by the API with defaults) and are exposed as `--v2-*` CSS variables by `ProductV2Theme`; components only use the `v2-*` color tokens from `globals.css`, never hard-coded brand colors.

## Troubleshooting

- A new Tailwind class or color token does not show up (stale CSS in dev): `docker compose stop web && rm -rf .next && docker compose start web`.

## Environment

| Variable | Purpose |
|---|---|
| `API_INTERNAL_URL` | API base URL from the server (`http://portal_api:8080/api/v1` in Docker) |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the site, used for redirects |
| `REVALIDATE_SECRET` | Must match `FRONTEND_REVALIDATE_SECRET` in the API |
| `SESSION_COOKIE_SECURE` | `true` in production (HTTPS) |

`next build` prerenders the catalog, so the API must be reachable during the build.
