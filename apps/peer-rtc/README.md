# `@peer-rtc/app`

TanStack Start app for joining WebRTC rooms. Auth, session queries, and UI come
from the workspace packages.

Dev server: port **3000**.

## Scripts

From the repo root:

```bash
pnpm dev
vp run @peer-rtc/app#build
```

From this package:

```bash
vp dev --port 3000
vp run generate-routes
vp build
vp preview
```

## Local HTTPS (`.cert`)

The dev server uses HTTPS when `.cert/cert.pem` and `.cert/key.pem` exist in
this package. Generate them with
[mkcert](https://github.com/FiloSottile/mkcert):

```bash
brew install mkcert nss
mkcert -install
mkdir -p .cert
mkcert -cert-file .cert/cert.pem -key-file .cert/key.pem localhost 127.0.0.1 ::1
```

From the repo root you can generate both apps at once (see the root README).
Restart `pnpm dev` and open a new tab. The app is then at
[https://localhost:3000](https://localhost:3000).

## Environment

Client vars are validated in `src/env.ts`:

| Variable               | Purpose                   |
| ---------------------- | ------------------------- |
| `VITE_PUBLIC_APP_URL`  | Public origin of this app |
| `VITE_PUBLIC_AUTH_URL` | Better Auth base URL      |

Set them in `.env.local`. Skip validation with `SKIP_ENV_VALIDATION=1` when
needed.

The auth client is created in `src/lib/auth-client.ts` via
`createPeerAuthClient` from `@peer-rtc/auth`.

## Routes

File-based routes live in `src/routes`:

- `/auth/*` — login, register, forgot/reset password (`AuthLayout`)
- `/_protected` — session required; home and `/$roomId` rooms
  (`ProtectedLayout`)

Layouts live in `src/layouts`. Shared chrome uses `@peer-rtc/ui` (global CSS,
toast, tooltip). Router context comes from `@peer-rtc/query`.

## Styling

Tailwind is applied in this app's `vite.config.ts`. Primitives and tokens live
in `@peer-rtc/ui`. Add shadcn components in that package, not here.
