# Hosting and isolation

Patterns reviewed: Plateful's React/Vite/Capacitor single frontend, SPA fallback and environment allowlisting; Taghetti's separate Cloudflare Worker, static assets with `/api/*` routed first, runtime secrets and fail-closed backend access.

RugbyLive has its own Worker configuration, assets, app ID and future Supabase project. No resource or secret from the other apps is imported. No existing DNS, database, auth configuration or Worker has been changed.

## Private preview

`npm run build` creates `dist/client` plus a self-contained `dist/server/index.js` for Sites. The latter embeds the build assets and an explicitly sample-only API. `.openai/hosting.json` preserves the private Site identity. Java API tests run separately.

## Owner Cloudflare deployment

`cloudflare.config.ts` follows the cf CLI configuration style used in Taghetti, using Workers + Static Assets and SPA fallback. First build client assets. Validate the config with the account's pinned cf CLI before deploying; no owner-account deployment or custom domain is performed by the preview build. The checked-in file is a deployment proposal, not verified deployed infrastructure.

The normal Worker delegates assets to `ASSETS`. It serves sample API data by default, or forwards to the fixed `RUGBY_API_ORIGIN` HTTPS runtime variable when supplied. That backend needs Java hosting separately; Java cannot run inside ordinary Workers. Do not enable paid Containers implicitly.

Keep the API provider key, database password and Supabase privileged key server-only. Only a publishable Supabase key and project URL may be browser-public when accounts are implemented. Match browsing is public; following requires verified accounts. No sign-in capability is currently claimed.

## Dedicated Supabase

No new RugbyLive project was visible during this build. No SQL was applied. Set up the dedicated project independently of Taghetti; keep Plateful independent. Organisation consolidation does not merge Auth users or projects.
