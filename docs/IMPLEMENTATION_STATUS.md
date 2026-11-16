# Current implementation status

## Ready

- Original-app-based Ionic React interface; restored logos, theme, five bottom tabs, date strip and expandable match lists.
- Collapsing clickable score header; swipe match tabs; original pitch positions, event cards and collapsible stat cards; missing-data states; team/player/competition navigation.
- Dedicated Cloudflare Worker deployed, with its custom hostname, DNS record and certificate configuration confirmed through the Cloudflare API; reproducible pinned cf build/deploy commands.
- Generated Capacitor 8 iOS project, original 1024px RGB icon, shared Xcode scheme, bundled sample data.
- Manual GitHub macOS TestFlight archive/upload workflow and complete owner setup guide.
- Web TypeScript/Vite build, sample API tests, packaged asset/SPA/API verification, Cloudflare deployment dry run and Capacitor sync.

## Requires owner setup / verification

- Apple Developer app record, signing credentials and first TestFlight archive/upload. No signed native build or Apple review has happened here.
- Browser/device visual QA: runtime unavailable in this environment. Exact visual fidelity is unverified. Direct production HTTP checks are blocked by the workspace network proxy; Cloudflare confirms deployment and the hostname mapping.
- Optional Git-to-Cloudflare automatic deployment connection.

## Agreed later

Real provider calls, permissions/licensing, quota ceilings, data-field/source priority, dedicated RugbyLive Supabase, persistent accounts/following, notifications, standings/history, news, offline support, monetisation and sevens. No provider credentials have been requested or embedded. Sample data is not live.
