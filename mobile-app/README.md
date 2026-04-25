# Rudnex

Rudnex is an Android-only Expo (managed) TypeScript app designed for playing and downloading videos from various sources, with strict adherence to legal and technical requirements.

## Table of Contents

- [UI & Layout](#ui--layout)
- [Playback Behavior](#playback-behavior)
- [Download Behavior (Strict & Legal)](#download-behavior-strict--legal)
- [Technical & Quality Requirements](#technical--quality-requirements)
- [Setup Steps](#setup-steps)
- [Running on Android Device](#running-on-android-device)
- [EAS Build Commands](#eas-build-commands)
- [Scoped Storage Limitations (Android 11+)](#scoped-storage-limitations-android-11)
- [Verification Checklist](#verification-checklist)
- [UX Copy & Legal Note](#ux-copy--legal-note)
- [Figma / PNG Mockups](#figma--png-mockups)
- [Asset Placeholders](#asset-placeholders)

## UI & Layout

The app features a bottom tab bar with three tabs: Home, Premium, and Profile.

### Home Tab

- Header: "Rudnex"
- Banner Placeholder
- Large rounded input card for pasting video URLs.
- Two prominent actions: Play and Download.
- Optional Fetch Details & Clear buttons.
- Featured category chips.
- Quick access cards (e.g., My Downloads, Watch History).

### Premium Tab

- Displays premium features and an upgrade button.

### Profile Tab

- Contains general settings (language, dark mode, notifications) and about sections (version, privacy policy, terms of service).

## Playback Behavior

-   **Direct Video URLs (mp4, m3u8/HLS, DASH):** Play in-app using `expo-av Video`. Supports native controls, fullscreen, pause/resume, and preserves position on rotation.
-   **YouTube links (youtube.com or youtu.be):** Does not attempt in-app playback or downloading. Prompts user "Open in YouTube?" and opens with `Linking.openURL()` if confirmed.

## Download Behavior (Strict & Legal)

-   **Pre-download Check:** Performs a HEAD request to inspect `Content-Type` and `Content-Disposition`. Follows redirects.
-   **Allowed Downloads:** Only allows download if `Content-Type` starts with `video/` or `application/octet-stream`, or `Content-Disposition` indicates `attachment`, or the file extension is one of: `.mp4`, `.mkv`, `.webm`, `.mov`, `.ts`, `.m3u8`.
-   **Download Process:** Downloads into an app-scoped folder using `expo-file-system`. Attempts to save to gallery/media library via `expo-media-library` (requests permissions). Provides a Share action for users to move the file to public Downloads.
-   **Scoped Storage:** Informs users about scoped-storage limitations on Android 11+.
-   **Denied Downloads:**
    -   If download criteria are not met: Shows "Downloading not allowed for this source."
    -   If URL is YouTube: Shows "Downloading YouTube content is not permitted."

## Technical & Quality Requirements

-   **Language:** Entire app in TypeScript.
-   **Workflow:** Expo managed workflow.
-   **Package ID:** `com.rudnex.app`.
-   **Min SDK:** Typical for Expo (`21` for `expo-av`, usually `23` or `24` for broader Expo compatibility).
-   **Components:** `App.tsx`, screens (Home, Premium, Profile), `components/PlayerModal`, `utils` for URL detection/HEAD-check/download.
-   **Localization:** Strings are localized using `utils/localization.ts`.
-   **YouTube:** No WebView-based YouTube players; no YouTube downloading.
-   **Analytics:** No analytics or telemetry by default.
-   **Code Quality:** Inline comments and clean code structure.

## Setup Steps

1.  **Install Node.js and npm/yarn:** Ensure you have Node.js (LTS version recommended) and either npm or yarn installed.
2.  **Install Expo CLI:**
    ```bash
    npm install -g expo-cli
    # or
    yarn global add expo-cli
    ```
3.  **Navigate to Project Directory:**
    ```bash
    cd rudnex
    ```
4.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

## Running on Android Device

1.  **Start Expo Development Server:**
    ```bash
    expo start
    ```
2.  **Open on Android:**
    -   Scan the QR code displayed in your terminal with the Expo Go app on your Android device.
    -   Alternatively, press `a` in the terminal to open it directly on an Android emulator or a connected physical device with debugging enabled.

## EAS Build Commands

To produce a signed APK for Android, you will use Expo Application Services (EAS).

1.  **Login to EAS (if not already):**
    ```bash
    eas login
    ```
2.  **Configure Project for EAS (if not already):**
    ```bash
    eas project:init
    ```
    *Note: `eas.json` has already been created for you.* `eas.json` is configured with `development`, `preview`, and `production` build profiles.

3.  **Create a Production Build (Signed APK):**
    ```bash
    eas build --platform android --profile production
    ```
    Follow the prompts. EAS will guide you through keystore creation and management. For your first production build, it will generate a new keystore for you and manage it securely. You can download the AAB (Android App Bundle) or APK from the EAS build dashboard once the build is complete.

    **Important Keystore Information:** EAS automatically handles your keystore. If you need to migrate or manage it manually, refer to the [Expo documentation on Android Keystores](https://docs.expo.dev/app-signing/android-credentials/).

## Scoped Storage Limitations (Android 11+)

On Android 11 (API level 30) and above, due to scoped storage changes, files downloaded by this app are primarily saved to an app-specific directory (`FileSystem.documentDirectory`). These files are not directly visible in the public `Downloads` folder or other public media galleries unless explicitly moved or shared by the user.

**To make downloaded files publicly accessible:** After a successful download, use the provided "Share" option to move the file to a public directory (like `Downloads`) or another application.

**For advanced public download management (e.g., using Android's native DownloadManager):** You would typically need to `expo prebuild` (or eject) to the bare workflow and implement native Android code to utilize the `DownloadManager` API directly. This is beyond the scope of a managed Expo workflow and this project specification.

## Verification Checklist

To verify the app's functionality:

1.  **Paste MP4/HLS link (e.g., from `test_links.txt`):**
    -   Expect: Video plays in-app within the `PlayerModal`.
2.  **Paste YouTube link (e.g., from `test_links.txt`):**
    -   Expect: Prompt "Open in YouTube?" appears. Confirming opens the link in the YouTube app.
3.  **Download allowed MP4 link (e.g., from `test_links.txt`):**
    -   Expect: Legal disclaimer appears. After agreeing, the file downloads and is saved in the app's scoped folder and added to the "Rudnex Downloads" album in the media library. A "Share" option is offered to move the file to public Downloads.

## UX Copy & Legal Note

The following legal note appears in the download dialog and is crucial for user awareness:

**Rudnex does NOT allow downloading YouTube or DRM-protected content. Only download files from sources that explicitly permit downloads. Do not bypass content owner protections.**

## Figma / PNG Mockups

(As an AI, I cannot produce visual mockups like Figma or PNG files. The UI description in the prompt has been implemented based on the specified layout. You would need to create these mockups separately based on the provided UI description and the implemented code.)

## Asset Placeholders

Due to tool limitations, actual image files for `icon.png`, `splash.png`, and `adaptive-icon.png` could not be created directly. Please ensure you place appropriate image files in the `assets/` directory for these, and optionally for `favicon.png` if web support is needed.

-   `assets/icon.png`
-   `assets/splash.png`
-   `assets/adaptive-icon.png`
-   `assets/favicon.png` (optional, for web)
