# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
