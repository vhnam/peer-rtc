# Changelog

## 0.2.0

### Minor Changes

- ab65bc3: Join a PeerJS room after local camera and microphone start. Lobby codes must match `xxxxxxxx-xxxx`. Auth routes for login, register, forgot password, and reset password are registered so typed `Link` targets resolve. In development, `/api/auth` is proxied through the Vite HTTPS origin so the browser does not hit the auth server's self-signed certificate.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Join a PeerJS room by code after local camera and microphone start
- Auth screens and routes for login, register, forgot password, and reset password
- Remote peer video in the room view

### Changed

- Lobby form validates the short room code format (`xxxxxxxx-xxxx`)
- Room media and PeerJS session live in `src/lib/video-call`

### Fixed

- Vite can resolve PeerJS (`peerjs-js-binarypack`) under pnpm
- Dev `/api/auth` is proxied through the app HTTPS origin so Chrome does not fail TLS against the auth server's self-signed certificate

## [0.1.3] - 2026-08-27

### Added

- Local camera and microphone in the room, with footer toggles
- Leave and rejoin the room, or go back to the lobby
- Room header extracted from the room view
- Favicon assets

### Changed

- New rooms use a short code (`xxxxxxxx-xxxx`) instead of a full UUID
- Room route rejects invalid codes
- Buttons use a pointer cursor
- Generated `src/routeTree.gen.ts` is ignored by Oxfmt and Oxlint

### Fixed

- Camera and microphone no longer stay off after allowing permissions (React Strict Mode leave flag)

## [0.1.2] - 2026-08-26

### Added

- t3-env (`src/env.ts`) to validate `VITE_PUBLIC_APP_URL` with Valibot
- TLS cert env (`SSL_CERT_FILE`, `SSL_KEY_FILE`) validated in `vite.config.ts`
- Oxfmt Tailwind class sorting via `src/styles/global.css` (`cn`, `clsx`, `cva`)
- Tailwind CSS VS Code extension recommendation and file association

### Changed

- Room joining info uses `VITE_PUBLIC_APP_URL` instead of a hardcoded localhost URL

### Fixed

- Client no longer bundles Vite (`loadEnv`), which caused `__vite__injectQuery` to be declared twice

## [0.1.1] - 2026-08-26

### Added

- Oxc formatter config (`fmt.config.ts`) and format-on-save via the Oxc VS Code extension
- Vite+ TLS/CA env (`SSL_CERT_FILE`, `NODE_EXTRA_CA_CERTS`) so the toolchain trusts the local HTTPS cert

### Changed

- Live clock colocated as `RoomClock` in the room module
- Format app and UI sources to Oxc style (single quotes, import groups, print width)
- Dev HTTPS uses mkcert `localhost` certs instead of `@vitejs/plugin-basic-ssl` (self-signed certs stay **Not Secure** in Chrome)

## [0.1.0] - 2026-08-26

### Added

- Initial Peer RTC app shell (TanStack Start, React 19, Tailwind CSS 4, shadcn/ui)
- Lobby to join a room by UUID or URL
- Room view with media control footer and joining details sheet
- HTTPS for local `pnpm dev` via `@vitejs/plugin-basic-ssl` (self-signed cert at `https://localhost:3000`)
- Live clock in the room header
- Create a new room from the lobby (`New` navigates to a fresh UUID room)
- PeerJS dependency for upcoming peer-to-peer calls
- Changesets for release versioning
- cspell config with a project word list

### Changed

- Lobby join form: keyboard affordance, inline Join submit, toast errors instead of `console.error`
- Room info button layout formatting
