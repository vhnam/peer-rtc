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
pnpm dev
```

App runs at [https://localhost:3000](https://localhost:3000) (self-signed cert; accept the browser warning once).

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
