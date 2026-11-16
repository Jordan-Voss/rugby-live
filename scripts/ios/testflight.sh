#!/usr/bin/env bash
set -euo pipefail

: "${APPLE_TEAM_ID:?Set APPLE_TEAM_ID to your Apple Developer Team ID}"
: "${ASC_KEY_ID:?Set ASC_KEY_ID}"
: "${ASC_ISSUER_ID:?Set ASC_ISSUER_ID}"
: "${ASC_PRIVATE_KEY:?Set ASC_PRIVATE_KEY to the complete Apple .p8 key}"
IOS_BUNDLE_ID="${IOS_BUNDLE_ID:-dev.jordanvoss.rugbylive}"
BUILD_NUMBER="${GITHUB_RUN_NUMBER:-1}.${GITHUB_RUN_ATTEMPT:-1}"
KEY_DIR="$(mktemp -d)"
trap 'rm -rf "$KEY_DIR"' EXIT
KEY_PATH="$KEY_DIR/AuthKey_${ASC_KEY_ID}.p8"
umask 077
printf '%s' "$ASC_PRIVATE_KEY" > "$KEY_PATH"
mkdir -p build/ios

# A team API key lets Xcode manage distribution signing. Nothing is hard-coded
# into the project, and the temporary key is deleted even if the build fails.
AUTH_ARGS=(-authenticationKeyPath "$KEY_PATH" -authenticationKeyID "$ASC_KEY_ID" -authenticationKeyIssuerID "$ASC_ISSUER_ID")
xcodebuild -resolvePackageDependencies \
  -project ios/App/App.xcodeproj -scheme App
xcodebuild archive \
  -project ios/App/App.xcodeproj -scheme App \
  -configuration Release -destination 'generic/platform=iOS' \
  -archivePath build/ios/RugbyLive.xcarchive \
  -allowProvisioningUpdates "${AUTH_ARGS[@]}" \
  DEVELOPMENT_TEAM="$APPLE_TEAM_ID" \
  PRODUCT_BUNDLE_IDENTIFIER="$IOS_BUNDLE_ID" \
  CODE_SIGN_STYLE=Automatic \
  CURRENT_PROJECT_VERSION="$BUILD_NUMBER"

export APPLE_TEAM_ID
python3 - <<'PY'
import os, plistlib
with open('build/ios/ExportOptions.plist', 'wb') as file:
    plistlib.dump({
        'method': 'app-store-connect',
        'destination': 'upload',
        'teamID': os.environ['APPLE_TEAM_ID'],
        'signingStyle': 'automatic',
        'manageAppVersionAndBuildNumber': False,
        'uploadSymbols': True,
    }, file)
PY
xcodebuild -exportArchive \
  -archivePath build/ios/RugbyLive.xcarchive \
  -exportPath build/ios/export \
  -exportOptionsPlist build/ios/ExportOptions.plist \
  -allowProvisioningUpdates "${AUTH_ARGS[@]}"
