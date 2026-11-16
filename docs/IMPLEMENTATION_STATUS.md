# First version

Implemented: sample match browsing, calendar/date search, live/category filters, timeline, pitch/list lineups, player comparison, team and competition pages, missing-data states, device-aware light/dark, read-only Spring API and hosted sample API.

Verified: TypeScript/production build; five Spring HTTP integration tests; four Worker-contract tests. The Spring API returns health UP and zero provider calls.

Not connected: live providers, history imports, account sign-in, stored follows, notifications, news, paid subscriptions and dedicated Supabase. No external provider calls are made. The sample feed is stationary and explicitly marked.

Native: Capacitor config/dependencies only. No signed iPhone/Android build or physical-device verification.

Browser QA: attempted shared browser; runtime reported unavailable. Browser appearance and gesture fidelity remain unverified. No alternate browser installation was attempted, per managed Sites instructions.

Production: private Sites preview has a read-only Worker API. The actual Java backend is built and locally verified but needs separate hosting. Owner-account Cloudflare settings are prepared only; not deployed.
