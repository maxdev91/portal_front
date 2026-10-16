# CLAUDE.md — portal_front

@AGENTS.md

Next.js 16 (App Router, Turbopack, `cacheComponents`) + React 19 + Tailwind 4. Read `README.md` for the structure. This Next version differs from older ones: check `node_modules/next/dist/docs/` before using an API you are unsure of.

## Rules

- Run commands in the container: `docker compose exec web ...`.
- All API access goes through `src/lib/api/*` (server-only). Never call the API from client components and never expose the session token to the browser.
- Cacheable catalog data: `'use cache'` + `cacheTag('catalog')` + `cacheLife`. Never read cookies, headers or `searchParams` inside a cached function; pass the values in as arguments.
- Anything dynamic (session, `params`, `searchParams`, cookies) is awaited inside a component wrapped in `<Suspense>`, never at the top of a page or layout.
- Use the generated types `PageProps<'/route'>`, `LayoutProps<'/route'>` and `RouteContext<'/route'>`; run `npx next typegen` after adding routes.
- `generateStaticParams` must return at least one entry.
- `notFound()` called inside a Suspense boundary responds 200 (with a noindex tag) because the shell is already streamed. This is expected with `cacheComponents`; do not try to work around it.
- Locale routing lives in `src/proxy.ts` (not `middleware.ts`). Every UI string goes in both `src/i18n/dictionaries/en.ts` and `es.ts`.
- Redirects in route handlers are built from `NEXT_PUBLIC_SITE_URL` (`publicUrl()`), never from `request.url` (inside Docker it is `0.0.0.0:3000`).
- Images: plain `<img>` with CDN URLs (the `no-img-element` rule is off on purpose).
- Brand colors: CSS variables `--brand-primary` / `--brand-accent` set by `BrandTheme`, and the product page v2 colors `--v2-*` set by `ProductV2Theme` (use the `v2-*` tokens); no hard-coded brand colors.
- The product page layout is chosen per brand (`brand.product_layout`): change v1 in `components/product/ProductViewV1.tsx`, v2 in `components/product/v2/`.
- Before finishing: `npx prettier --write` and `npx eslint` on the touched files, and `npx tsc --noEmit` — all clean, no lint-disable comments.

## Git

- Never commit, merge, push or open merge requests. Give the user an English commit message and the list of files to stage.
- Never commit on `master` or push to `origin/master`.
- New branches: ask whether it is a feature or a hotfix. Feature → `feature/CHUSA-<number>-<description>` (ask for the number); hotfix → `hotfix/<description>` (no CHUSA).
- Always start from master: `git switch master`, `git fetch`, `git pull`, then `git switch -c <branch>`. Never set a branch to track `origin/master`.
