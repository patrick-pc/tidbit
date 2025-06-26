# Tidbit AI Desktop App

A desktop application that provides faster access to Tidbit. A customizable key combination opens Tidbit from any screen on your desktop.

## Features

- Quick access to Tidbit via global shortcut
- Customizable global hotkey
- Adjustable window sizes
- Auto-updates

## Installation

Download the latest release for your macOS from the [releases](https://github.com/patrick-pc/tidbit/releases) page.

## Usage

1. Launch the application
2. Set your preferred global hotkey
3. Use the hotkey to quickly access Tidbit from anywhere on your computer

## Development

### Prerequisites

- Node.js (v14 or later recommended)
- npm or yarn

### Setup

1. Clone the repository:

   ```
   git clone https://github.com/patrick-pc/tidbit.git
   cd tidbit
   ```

2. Install dependencies:

   ```
   npm i
   ```

3. Start the development server:
   ```
   npm start
   ```

### Building

To build the application for production:

```
npm run build
```

This will create distributable files in the `dist` directory:

- `.dmg` and `.zip` files for macOS (both x64 and arm64)
- The app will be signed and notarized if you have proper certificates and credentials

#### Prerequisites for Distribution

To build a distributable app without security warnings, you need:

1. **Developer ID Application Certificate** - Required for code signing

   - Not just an "Apple Development" certificate
   - See [NOTARIZATION_SETUP.md](./NOTARIZATION_SETUP.md) for detailed instructions

2. **Apple Developer Account** - Required for notarization
   - With valid Apple ID and app-specific password

#### Building without Notarization

If you don't have Apple Developer credentials set up, the build will still complete successfully but skip the notarization step. The app will work locally but may show security warnings when distributed to other users.

### Publishing

To publish a new release:

```
npm run publish
```

This requires proper GitHub authentication and will create a new release on GitHub.

#### GitHub Token Setup

To publish releases, you need a GitHub Personal Access Token:

1. Go to https://github.com/settings/tokens/new
2. Create a token with `repo` scope
3. Add it to your `.env` file:
   ```
   GH_TOKEN=ghp_your_token_here
   ```

The publish command will automatically:

- Create a draft release on GitHub
- Upload all distributable files (.dmg, .zip)
- Generate release notes
- Configure auto-updater files

## Configuration

The application uses `electron-store` for persistent configuration. You can modify the default settings in the `schema` object within `index.js`.

## Auto-Updates

The application supports auto-updates using `electron-updater`. Updates are checked every 10 minutes when the app is running in production mode.

## Notarization

For macOS builds, the application is notarized using `@electron/notarize`. This is required for distributing the app without security warnings on macOS.

### Prerequisites

1. **Developer ID Application Certificate** installed in your Keychain
2. **Environment variables** configured in `.env` file

### Quick Setup

1. Create a `.env` file in the project root with:

   ```
   APPLE_ID=your-apple-id@example.com
   APPLE_APP_SPECIFIC_PASSWORD=xxxx-xxxx-xxxx-xxxx
   APPLE_TEAM_ID=XXXXXXXXXX  # Required for notarytool
   ```

2. Generate an app-specific password at https://appleid.apple.com

For detailed notarization setup instructions, including how to create certificates, see [NOTARIZATION_SETUP.md](./NOTARIZATION_SETUP.md).

## Contributing

Contributions are welcome! Please feel free to submit a PR.

## License

This project is licensed under the MIT License.
