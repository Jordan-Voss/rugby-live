# RugbyLive

First usable match-centre foundation. React + TypeScript + Vite, Capacitor mobile packaging, Spring Boot 4 / Java 25 API. Explicit sample mode; no provider calls, account creation, subscriptions or existing-app database access.

## Try locally

```sh
npm ci
cd apps/api
./mvnw test package
cd ../..
npm run dev
```

Use Java 25 (`JAVA_HOME`), Node >=22.12. The combined dev command launches Java on loopback 8082 and Vite on 5173. Set `JAVA_HOME` normally; the managed workspace also has a Java fallback. The Vite proxy connects `/api` to Java. `RUGBY_API_URL` overrides that proxy target.

```sh
npm run build
npm test
```

In this managed environment Maven additionally uses `-s /workspace/.setup/maven-settings.xml -Dmaven.repo.local=/workspace/.cache/m2`. Those are environment settings, not production requirements.

## What works

- Men’s/women’s fixtures, calendar, team search and sample-live filtering.
- Match timeline, collapsible clickable score header, touch-swipe tabs, team/pitch lineups, team and player statistics.
- Team/player/competition pages, player comparison, season missing-data states.
- Device-following appearance with manual light/dark override, reduced-motion support.
- Following and alerts explain account requirements; they never fake a successful signup or save.
- Read-only Java REST API with validation and explicit coverage; shared fixtures power the hosted preview API.

## API

`GET /api/v1/health`, `/config`, `/bootstrap`, `/matches?date=2026-11-14&team=...&competition=...`, `/matches/{id}`, `/teams`, `/teams/{id}`, `/players/{id}`, `/competitions`, `/competitions/{id}`. Unknown entities return 404; invalid dates 400; unavailable account endpoints 503. Scores/statistics may be null, distinct from zero.

## Hosting

See `docs/HOSTING.md`. The private Sites preview packages a small read-only Worker API from the same sample fixtures because Workers cannot run a JVM. It is not the deployed Java service. Local browser development uses the real Spring Boot API. Production Java hosting is a separate deployment step; the Cloudflare Worker can forward `/api/*` to an owner-configured fixed HTTPS `RUGBY_API_ORIGIN`.

## Native

Set the browser-public `VITE_API_BASE_URL` to a reachable HTTPS API, then build, run `npx cap add ios` / `npx cap add android`, and `npx cap sync`. iOS compilation/signing requires macOS/Xcode and an Apple provisioning route. The native source projects and signed builds are not yet generated. No store release has been made.

## Next integration

Connect a dedicated RugbyLive Supabase project, real accounts and persisted favourites with ownership policies; implement provider adapters and durable quota accounting after credentials and source permissions are confirmed. Never reuse Taghetti service credentials. Sample clock/events do not advance and are not live scores.
