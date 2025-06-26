# Notarization Setup for macOS

To notarize your macOS app for distribution, you need both a Developer ID certificate and proper environment variables.

## Prerequisites

### 1. Developer ID Application Certificate

You MUST have a "Developer ID Application" certificate (not just "Apple Development") to distribute your app outside the Mac App Store.

**To create one:**

1. Go to https://developer.apple.com/account
2. Navigate to "Certificates, Identifiers & Profiles"
3. Click "Certificates" → "+" to create new
4. Select "Developer ID" → "Developer ID Application"
5. Use Keychain Access to create a Certificate Signing Request (CSR):
   - Open Keychain Access
   - Menu: Keychain Access → Certificate Assistant → Request a Certificate From a Certificate Authority
   - Fill in your email and name, select "Saved to disk"
6. Upload the CSR file to Apple Developer portal
7. Download and double-click the certificate to install it

**Verify installation:**

```bash
security find-identity -v -p codesigning | grep "Developer ID Application"
```

## Required Environment Variables

Create a `.env` file in the root of your project with the following variables:

```
# Your Apple ID (email address)
APPLE_ID=your-apple-id@example.com

# App-specific password generated from https://appleid.apple.com
APPLE_APP_SPECIFIC_PASSWORD=xxxx-xxxx-xxxx-xxxx

# Your Apple Developer Team ID (REQUIRED for notarytool with password auth)
APPLE_TEAM_ID=XXXXXXXXXX

# GitHub Personal Access Token (for publishing releases)
GH_TOKEN=ghp_your_token_here
```

## How to Get These Values

### 1. APPLE_ID

This is simply your Apple ID email address that's associated with your Apple Developer account.

### 2. APPLE_APP_SPECIFIC_PASSWORD

1. Go to https://appleid.apple.com
2. Sign in with your Apple ID
3. Navigate to "Sign-In and Security"
4. Click on "App-Specific Passwords"
5. Click the "+" button to generate a new password
6. Name it something like "Tidbit Notarization"
7. Copy the generated password (format: xxxx-xxxx-xxxx-xxxx)

### 3. APPLE_TEAM_ID (Required)

1. Log in to your Apple Developer account
2. Go to Membership details
3. You'll find your Team ID there (10 character alphanumeric string, e.g., "A1B2C3D4E5")

**Note:** When using app-specific password authentication with notarytool, the Team ID is required, not optional.

### 4. GH_TOKEN (Required for Publishing)

1. Go to https://github.com/settings/tokens/new
2. Create a new personal access token with `repo` scope
3. Copy the token (starts with `ghp_`)
4. This token is used by `npm run publish` to create GitHub releases

## Building Without Notarization

If you want to build without notarization (for testing), the build will skip notarization automatically if:

- The required environment variables are not set
- You don't have a Developer ID Application certificate

However, apps built without notarization will show security warnings when distributed to other users.

## Troubleshooting

### "The binary is not signed with a valid Developer ID certificate"

- Ensure you have a "Developer ID Application" certificate, not just "Apple Development"
- Run `security find-identity -v -p codesigning` to check available certificates

### "Cannot destructure property 'appBundleId' of 'options' as it is undefined"

- This error indicates electron-builder's built-in notarization is conflicting with the custom notarization
- Ensure `"notarize": false` is set in your `package.json` build configuration

## Note

Never commit your `.env` file to version control. It's already included in `.gitignore` for security.
