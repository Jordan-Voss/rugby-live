# RugbyLive on your iPhone

The native app uses **Ionic React + Capacitor 8**, bundle ID `dev.jordanvoss.rugbylive`, display name **RugbyLive**. The Xcode project is committed in `ios/App/App.xcodeproj`; it uses Swift Package Manager rather than CocoaPods. It includes the original RugbyLive app icon.

The first build bundles sample fixtures, so it opens immediately without any API keys, Supabase project or running Java server. Scores and statistics are illustrative, not live. Following, notifications, news and account creation remain unavailable. No live-provider requests are made.

## Use it immediately

Open https://rugbylive.jordanvoss.dev on your iPhone. In Safari, tap **Share → Add to Home Screen** (enable Open as Web App if shown). This is the quickest install while Apple signing is configured. It has no TestFlight build expiry; native distribution and native capabilities use the steps below. No offline support is promised for the website.

## Recommended: GitHub builds, no Mac required

This matches the signing/upload approach reviewed in Plateful, with RugbyLive's own app identity and a manually triggered workflow. GitHub-hosted macOS runner minutes are subject to your GitHub plan. The workflow will not run or spend runner minutes simply because you push code.

### 1. Apple account and app record — once

1. Use an active **Apple Developer Program** membership. Your testers only need the free TestFlight app, not developer memberships.
2. Find your **Team ID** in [Apple Developer Membership](https://developer.apple.com/account/). It is a ten-character ID, not an email address or App Store app ID.
3. In [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/list), register an explicit **App ID** with bundle ID `dev.jordanvoss.rugbylive`. No push, Sign in with Apple, or in-app purchase capability is needed for this sample build.
4. In [App Store Connect](https://appstoreconnect.apple.com/) → **My Apps → + → New App**, choose iOS, name **RugbyLive**, primary language **English**, that bundle ID, and SKU `rugbylive-ios`. This creates the app record; it does not publish an App Store listing.
5. Complete any pending Apple agreements. If that bundle ID is already registered on your account, reuse it. If your existing app uses another bundle ID and you want to update that app instead of creating a separate one, use that ID consistently in the GitHub variable, App Store Connect and local Xcode signing settings.

### 2. Signing key — once

In App Store Connect → **Users and Access → Integrations → App Store Connect API → Team Keys**, create a team API key. For this automatic provisioning workflow, use a role with access to Certificates, Identifiers & Profiles (typically **Admin**). You may need the Account Holder to enable API access first.

Download its `.p8` file when Apple offers it; Apple only permits one download. Keep the key private. Note the **Key ID** and **Issuer ID**. Use the complete PEM contents, including `BEGIN PRIVATE KEY` and `END PRIVATE KEY`, with actual newlines. Do not paste it into chat, source files, issues or workflow inputs.

### 3. Configure this repository — once

Open [rugby-live Actions settings](https://github.com/Jordan-Voss/rugby-live/settings/secrets/actions).

Under **Variables → New repository variable**:

| Name | Value |
| --- | --- |
| `APPLE_TEAM_ID` | Your ten-character Apple Team ID |
| `IOS_BUNDLE_ID` | `dev.jordanvoss.rugbylive` (optional; this is the default) |

Under **Secrets → New repository secret**:

| Name | Value |
| --- | --- |
| `ASC_KEY_ID` | The Apple API Key ID |
| `ASC_ISSUER_ID` | The Apple API Issuer ID |
| `ASC_PRIVATE_KEY` | Complete contents of the `.p8` file |

No database, rugby provider or Cloudflare credentials are needed by the iOS workflow. Configure the secrets specifically in this repository; they are not automatically inherited from your other apps.

### 4. Build and upload

1. Open [Actions → iOS TestFlight](https://github.com/Jordan-Voss/rugby-live/actions/workflows/ios-testflight.yml).
2. Select **Run workflow**, branch **main**, then **Run workflow**.
3. It installs dependencies, tests the sample API, builds the web app, syncs Capacitor, resolves Swift packages, archives and uploads with Xcode on a GitHub macOS 26 runner. It automatically supplies a unique build number for each run/re-run and deletes the temporary signing key afterward.
4. A successful upload still needs Apple's build processing. In App Store Connect → RugbyLive → **TestFlight**, wait for the build to appear and process. Address any compliance or signing messages Apple displays.

The initial archive/upload has not been run in this Linux workspace; a successful Capacitor sync does not verify Apple signing or device execution. If automatic provisioning reports a missing distribution certificate/profile, check the key role and Developer-account access. You can complete the first signed archive in Xcode using the alternative below, or configure an explicit distribution certificate/profile workflow if your team disallows automatic signing.

### 5. Install yourself; invite friends/family

1. In TestFlight, create an **Internal Testing** group and add your App Store Connect user. Add the processed build to it.
2. Install Apple's **TestFlight** app on your iPhone, accept the invitation and tap **Install**.
3. For friends/family, create an **External Testing** group. Fill in beta description, feedback email, contact details and review notes. Suggested note: “Rugby union match-centre UI beta. All match data is explicitly illustrative. No login or provider connection is required. Accounts, notifications and news are not yet enabled.”
4. Add the build and submit it for **TestFlight Beta App Review**. Apple must approve the first external build before the invitation/public link works. Then invite testers by email or share the group's enabled public TestFlight link.
5. External testers do not need access to App Store Connect. Do not grant them account roles merely to avoid beta review.

TestFlight distribution does not publish the app in the App Store. **Each TestFlight build expires after 90 days**; upload another build and testers update it. TestFlight cannot provide a permanently valid private install. Use the web Home Screen option for that now, or discuss App Store/unlisted distribution later.

## Alternative: local Mac and Xcode

Use this if you have a Mac and prefer to verify signing interactively. Requires Node 24 and **Xcode 26 or newer**, matching Capacitor 8.

```sh
git clone https://github.com/Jordan-Voss/rugby-live.git
cd rugby-live
npm ci
npm run ios:sync
npm run ios:open
```

1. In Xcode, select the **App** project → **App** target → **Signing & Capabilities**. Enable automatic signing, select your paid Developer team and check bundle ID `dev.jordanvoss.rugbylive`.
2. Select an iPhone Simulator and Run for a first check. For your physical iPhone, trust the Mac, enable Developer Mode if requested, select it and Run.
3. For TestFlight, choose **Any iOS Device (arm64)** / a generic iOS device destination. In General, set an unused **Build** number. Version currently defaults to `1.0`.
4. Choose **Product → Archive**. In Organizer choose **Distribute App → App Store Connect → Upload**, use automatic signing and complete the wizard. Then use the TestFlight group instructions above.
5. After any web change, run `npm run ios:sync` again before building. Website deployments alone do not update a bundled TestFlight app.

## Later: switch from bundled data to an HTTPS API

The native app currently chooses the bundled sample bootstrap when no `VITE_API_BASE_URL` is supplied. Once the real backend and CORS policy are ready, build with `VITE_API_BASE_URL=https://your-api-host/api/v1`, then sync and upload a new native build. This is a public endpoint URL, never a secret. The app must not contain provider keys, a database password, a Supabase secret/service-role key, or direct privileged database access.

## Apple references

- [TestFlight overview and build expiry](https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/)
- [Invite external testers](https://developer.apple.com/help/app-store-connect/test-a-beta-version/invite-external-testers/)
- [Capacitor environment requirements](https://capacitorjs.com/docs/getting-started/environment-setup)
