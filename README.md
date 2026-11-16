# RugbyLive

Original RugbyLive app layout restored with **Ionic React + Capacitor 8**, TypeScript/Vite and a separate Spring Boot 4 / Java 25 API foundation. This release uses clearly labelled sample data while the provider/API decisions are made.

**Web app:** https://rugbylive.jordanvoss.dev

**Get it on your iPhone:** [complete TestFlight instructions](docs/TESTFLIGHT.md). The native Xcode project and a manually triggered GitHub TestFlight workflow are included. Signing/upload requires your Apple Developer account; no signed build has been uploaded from this workspace.

## Run locally

Requires Node 24 and Java 25 for the Java-backed development server.

```sh
npm ci
cd apps/api
./mvnw test package
cd ../..
npm run dev
```

Open the local URL printed by Vite, normally http://localhost:5173. The development command starts Java on loopback 8082 and proxies `/api` to it. `PORT` overrides the frontend port; `RUGBY_API_URL` overrides the proxy target.

```sh
npm run build
npm test
node scripts/verify-build.mjs
```

In the managed workspace only, activate `/workspace/.setup/activate.sh` and give Maven `-s /workspace/.setup/maven-settings.xml -Dmaven.repo.local=/workspace/.cache/m2` if required by its network/trust configuration.

## Native iOS

```sh
npm ci
npm run ios:sync
npm run ios:open
```

Opening/building in Xcode requires macOS and Xcode 26+. Alternatively, configure the Apple variables/secrets and run **Actions → iOS TestFlight**; see [the owner guide](docs/TESTFLIGHT.md). Native builds bundle sample data and do not require any API service to run.

## Included

- Original five bottom tabs: Matches, Standings, News, Leagues, More.
- Original RugbyLive logo, colours, horizontal match rows, expandable league groups and scrolling date selector.
- Shrinking clickable match score/team badges, swipeable Events/Teams/Stats/Players/H2H tabs.
- Original pitch image and player positions, list/pitch team sheets, team-colour borders and original fallback player image.
- Original event-card layout and collapsible statistics cards; team/player pages and player comparison.
- Device-following light/dark appearance with an explicit override.
- Honest unavailable-data states; accounts/following, notifications, news, standings and live providers remain unconnected.

Team/competition badges are local placeholders until licensed source assets are selected. Sample matches do not advance in real time. The browser tool was unavailable for this restoration; a passing build and deployment do not establish pixel-exact or iPhone verification.

## API and hosting

[Cloudflare deployment and architecture](docs/HOSTING.md). The first hosted release packages the web assets and read-only sample API in a dedicated Worker. Java remains a separately runnable service; ordinary Workers cannot execute a JVM. No existing app database or provider credentials are used.

API: `GET /api/v1/health`, `/config`, `/bootstrap`, `/matches?date=2026-11-14&team=...&competition=...`, `/matches/{id}`, `/teams`, `/teams/{id}`, `/players/{id}`, `/competitions`, `/competitions/{id}`. Unknown records return 404, invalid dates 400 and unavailable account endpoints 503. Missing statistics remain distinct from zero.

Next: choose permitted sources and field priority, protect quotas server-side, connect the dedicated RugbyLive Supabase project, then enable real accounts/following and notifications. Provider keys and privileged database credentials never belong in the native bundle or browser.
