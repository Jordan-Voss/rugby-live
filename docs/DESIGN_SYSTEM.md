# Original RugbyLive interface

The visual source is `RugbyLiveScoreApp`, specifically its five-tab layout, matches header/date selector/league rows, match screen, event cards, pitch view and theme definitions. The earlier emerald two-column design is no longer the app entrypoint.

- Light: background `#F5F7FA`, surface `#FFFFFF`, text `#34495E`, muted `#7F8C8D`, accent `#E74C3C`.
- Dark: background `#2E3E54`, surface `#2C3E50`, text white, borders `#34495E`, accent `#E67E22`.
- Match section indicator: `#F05340`; in-play row/time indicator: `#3498DB`.
- System typography, original RugbyLive logos/pitch/default portrait, original asymmetric XV pitch positions.
- Light/dark follows the device unless explicitly overridden; reduced-motion preferences remain respected.

`LegacyApp.tsx`, `original.css` and `OriginalMatchContent.tsx` implement the restored layout. `Profiles.tsx` adds the requested team/player details. Team and competition badges remain placeholders until source assets are chosen; no official crests are fabricated or downloaded from unapproved sources.

Verification limit: the browser runtime was unavailable, so no rendered-reference or iPhone comparison was completed. Source-based restoration is not a claim of pixel-perfect fidelity. Native safe areas, scrolling and animation still need a signed-device/simulator check.
