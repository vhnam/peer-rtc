# Peer RTC

Vite+ monorepo for peer-to-peer WebRTC rooms and an operator dashboard. Apps
share Better Auth, TanStack Query wiring, and UI primitives.

## Workspace

| Path                      | Package               | Role                                     |
| ------------------------- | --------------------- | ---------------------------------------- |
| `apps/peer-rtc`           | `@peer-rtc/app`       | Room client (dev server on port 3000)    |
| `apps/peer-rtc-dashboard` | `@peer-rtc/dashboard` | Operator dashboard (port 4000)           |
| `packages/auth`           | `@peer-rtc/auth`      | Better Auth client, schemas, and queries |
| `packages/query`          | `@peer-rtc/query`     | Shared QueryClient and router setup      |
| `packages/ui`             | `@peer-rtc/ui`        | Tailwind, tokens, and shadcn primitives  |

Requires Node `>=24.19.0` and pnpm `11.24.0`. Tooling is
[Vite+](https://viteplus.dev/guide/) (`vp`).

## Development

Install from the repo root:

```bash
vp install
```

Check, test, and build everything:

```bash
vp run ready
```

Or run pieces separately:

```bash
vp check
vp run -r test
vp run -r build
```

Run the room app:

```bash
pnpm dev
```

Run the dashboard:

```bash
pnpm dev:dashboard
```

Each app expects `VITE_PUBLIC_APP_URL` and `VITE_PUBLIC_AUTH_URL` (see the app
READMEs).

## Local HTTPS (`.cert`)

The Vite servers enable HTTPS when `cert.pem` and `key.pem` exist under that
app's `.cert/` directory. Use [mkcert](https://github.com/FiloSottile/mkcert) so
the browser trusts localhost (needed for a secure context / WebRTC):

```bash
brew install mkcert nss
mkcert -install
mkdir -p apps/peer-rtc/.cert apps/peer-rtc-dashboard/.cert
mkcert -cert-file apps/peer-rtc/.cert/cert.pem \
  -key-file apps/peer-rtc/.cert/key.pem localhost 127.0.0.1 ::1
mkcert -cert-file apps/peer-rtc-dashboard/.cert/cert.pem \
  -key-file apps/peer-rtc-dashboard/.cert/key.pem localhost 127.0.0.1 ::1
```

Restart the dev server and open a new tab. Vite+ can trust the mkcert CA through
[`SSL_CERT_FILE` / `NODE_EXTRA_CA_CERTS`](https://viteplus.dev/guide/installer-env-vars#tls-ca-configuration).
Do not set `VP_INSECURE_TLS` except as a local diagnostic.

## Versioning

Package versions use [changesets](https://github.com/changesets/changesets). Add
a file under `.changeset/` when you change a published workspace package.
