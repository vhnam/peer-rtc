# `@peer-rtc/auth`

Shared Better Auth client, Valibot schemas, session helpers, and TanStack Query
hooks for Peer RTC apps.

## Exports

| Import                  | Contents                                                               |
| ----------------------- | ---------------------------------------------------------------------- |
| `@peer-rtc/auth`        | `createPeerAuthClient`, `getAuthClient`, schemas, service, query hooks |
| `@peer-rtc/auth/server` | `auth` server instance (`betterAuth` + TanStack Start cookies)         |

Call `createPeerAuthClient(baseURL)` once per app (typically with
`env.VITE_PUBLIC_AUTH_URL`). Later code uses `getAuthClient()`.

```ts
import { createPeerAuthClient } from "@peer-rtc/auth";

export const authClient = createPeerAuthClient(env.VITE_PUBLIC_AUTH_URL);
```

Query helpers include `currentSessionQueryOptions`, `useLoginMutation`,
`useRegisterMutation`, `useForgotPasswordMutation`, and
`useResetPasswordMutation`.

## Scripts

From the repo root:

```bash
vp run @peer-rtc/auth#build
vp run @peer-rtc/auth#test
vp run @peer-rtc/auth#check
```

Watch the packed library:

```bash
vp run @peer-rtc/auth#dev
```
