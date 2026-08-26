# Peer RTC

Peer-to-peer real-time communication app. Join a room by code or link, then use the room UI for video calls.

## Stack

- [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router)
- React 19 + TypeScript
- Tailwind CSS 4 + [shadcn/ui](https://ui.shadcn.com/)
- Formisch + Valibot for lobby form validation
- pnpm + Vite Plus

## Getting started

```bash
pnpm install
cp .env.example .env
pnpm dev
```

App runs at [https://localhost:3000](https://localhost:3000).

`@vitejs/plugin-basic-ssl` is self-signed, so the browser will always show **Not Secure**. Use [mkcert](https://github.com/FiloSottile/mkcert) instead:

```bash
brew install mkcert nss
mkcert -install
mkdir -p .cert
mkcert -cert-file .cert/cert.pem -key-file .cert/key.pem localhost 127.0.0.1 ::1
```

Then restart `pnpm dev` and open a new tab. Vite+ trusts the mkcert CA through [`SSL_CERT_FILE` / `NODE_EXTRA_CA_CERTS`](https://viteplus.dev/guide/installer-env-vars#tls-ca-configuration). Do not set `VP_INSECURE_TLS` except as a local diagnostic.

### Scripts

| Command                | Description                               |
| ---------------------- | ----------------------------------------- |
| `pnpm dev`             | Start the HTTPS dev server on port 3000   |
| `pnpm build`           | Production build                          |
| `pnpm preview`         | Preview the production build              |
| `pnpm generate-routes` | Regenerate the TanStack Router route tree |

## App structure

| Route      | Module              | Purpose                                        |
| ---------- | ------------------- | ---------------------------------------------- |
| `/`        | `src/modules/lobby` | Enter a room UUID or join URL                  |
| `/$roomId` | `src/modules/room`  | Room view with media controls and joining info |

```
src/
  components/ui/   # shadcn primitives
  modules/
    lobby/         # lobby form + join actions
    room/          # room layout, footer controls, details sheet
  routes/          # file-based routes
  schemas/         # Valibot schemas
  utils/           # room id / URL helpers
```

## Adding UI components

```bash
pnpm dlx shadcn@latest add button
```

## Learn more

- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router)
- [shadcn/ui](https://ui.shadcn.com/)
