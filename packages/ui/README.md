# `@peer-rtc/ui`

Shared visual baseline for Peer RTC apps: Tailwind v4, shadcn tokens, and
primitives.

This package must not depend on Peer RTC domain concepts (rooms, peers, calls).
Compose those in `@peer-rtc/app` or `@peer-rtc/dashboard`.

## Usage

In the app root route:

```ts
import { Toaster } from "@peer-rtc/ui/components/toast";
import { TooltipProvider } from "@peer-rtc/ui/components/tooltip";
import appCss from "@peer-rtc/ui/globals.css?url";
```

Add `{ rel: 'stylesheet', href: appCss }` to the route `head().links`. Mount
`Toaster` in the document shell. Use `ThemeProvider` from
`@peer-rtc/ui/lib/theme-provider` when the app needs light/dark/system.

Do not copy this CSS into an app. App-specific styles belong next to the
feature, or as additional exports from this package when they are reused.

```ts
import { Button } from "@peer-rtc/ui/components/button";
import { cn } from "@peer-rtc/ui/lib/utils";
```

Add shadcn primitives only in this package. Apps must not run `shadcn add` or
import `shadcn` / `@base-ui/react` directly.

```bash
pnpm dlx shadcn@latest add button -c packages/ui
```

Each app applies the Tailwind Vite plugin in its own `vite.config.ts`.

## Core primitives

| Spec name           | Import                                   |
| ------------------- | ---------------------------------------- |
| button              | `@peer-rtc/ui/components/button`         |
| text input          | `@peer-rtc/ui/components/input`          |
| password input      | `@peer-rtc/ui/components/password-input` |
| textarea            | `@peer-rtc/ui/components/textarea`       |
| select              | `@peer-rtc/ui/components/select`         |
| field               | `@peer-rtc/ui/components/field`          |
| card                | `@peer-rtc/ui/components/card`           |
| badge               | `@peer-rtc/ui/components/badge`          |
| tabs                | `@peer-rtc/ui/components/tabs`           |
| dialog              | `@peer-rtc/ui/components/dialog`         |
| loading placeholder | `@peer-rtc/ui/components/skeleton`       |
| separator           | `@peer-rtc/ui/components/separator`      |
| brief notice        | `@peer-rtc/ui/components/toast`          |

Extra domain-free controls may stay here (sidebar, table, sheet, and similar).
Promote a pattern from an app only when both products need it and the name stays
generic.

Use Dialog for irreversible confirmations. Use toast for short status.

Every field and every icon-only action needs a visible label or equivalent.

## Scripts

From the repo root:

```bash
vp run @peer-rtc/ui#test
```
