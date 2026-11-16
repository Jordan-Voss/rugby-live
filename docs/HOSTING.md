# Cloudflare hosting

Deployed: **https://rugbylive.jordanvoss.dev**, dedicated Worker **rugby-live**, in the existing jordanvoss.dev Cloudflare account/zone. The hostname was unused before this deployment. Plateful and Taghetti keep their own Workers and hostnames.

## What is deployed

The first release uses a self-contained module Worker generated at `dist/server/index.js`. It includes the built app, binary-safe copies of the original branding/pitch images, SPA fallback and the read-only sample API from `worker/api.mjs` / `shared/demo-data.json`. Its health endpoint reports sample mode and zero provider calls.

This follows the separate Worker/custom-domain setup reviewed in Taghetti and Plateful. For this small first release, assets are embedded in the Worker to permit direct deployment through the connected Cloudflare API without introducing another credential flow. Asset requests therefore count as Worker invocations. Moving assets to Workers Static Assets is the sensible next step as traffic grows; the unused `worker/index.mjs` contains the future Static Assets/Java proxy entrypoint. That entrypoint is **not** the deployed entrypoint, and setting `RUGBY_API_ORIGIN` alone does not change the current sample-only release.

No database/provider bindings, scheduled ingestion, accounts, subscriptions or paid Cloudflare products are provisioned. The website is public at the requested domain; data is illustrative. The older private Sites preview is superseded by this URL.

## Rebuild and redeploy

The Cloudflare CLI and build-output helpers are pinned to `1.0.0-rc.0` in this repository. Use the checked-in lockfile. The config is `cloudflare.config.ts`; there is no Wrangler config. The build script validates it with the installed Cloudflare schema and produces Build Output v1 with Cloudflare's official helper library.

```sh
npm ci
npm run cloudflare:build
npx cf deploy --prebuilt --mode production --dry-run
```

For deployment from your own machine, authenticate to the correct Cloudflare account:

```sh
npx cf auth login
npm run cloudflare:deploy
```

The latter rebuilds, verifies image bytes/SPA/API behavior, prepares build output and runs `cf deploy --prebuilt --mode production`. It targets only `rugby-live` and its declared `rugbylive.jordanvoss.dev` domain. The initial release was uploaded with the connected Cloudflare API; a CLI dry run was separately verified.

For automated deploys, connect the GitHub repository to this Worker using Cloudflare Workers Builds, branch `main`, repository root `/`, Node 24. Use build command `npm ci && npm run cloudflare:build` and deploy command `npx cf deploy --prebuilt --mode production`. Git integration has not been enabled automatically. Alternatively run the same deploy command in GitHub with a narrowly scoped Cloudflare API token kept in Actions secrets. Never commit credentials.

## API architecture for the next phase

The React/Capacitor app calls an HTTPS app API. The API will aggregate/cache permitted sources, map provider records to stable internal IDs, resolve priorities and enforce quota ceilings. Public browsing can use read-only endpoints; authenticated following will use ownership policies. The app must not connect directly to privileged database tables or call providers with embedded secret keys.

The Spring Boot / Java 25 API is under `apps/api` and works locally with the same sample fixtures. It has not been deployed to Java hosting. Choose its hosting and ingestion schedule after agreeing data needs. Ordinary Workers cannot host a JVM; do not silently enable paid Containers. A dedicated RugbyLive Supabase project is still to be connected. Organisation consolidation must not merge other apps' data or auth users.

Native sample builds need no network endpoint. Once a real API is ready, configure `VITE_API_BASE_URL` for native builds, allow the native origin in the API CORS policy, and issue a new TestFlight build. See [TESTFLIGHT.md](TESTFLIGHT.md).

## Initial deployment verification

Cloudflare confirmed a 100% production deployment, enabled custom hostname, managed DNS record and certificate ID. The packaged Worker checks and CLI dry run passed. Direct HTTPS requests from this workspace were blocked by its network proxy (CONNECT 403), and its browser runtime was unavailable; a browser/device visit is still needed to verify the rendered production experience.
