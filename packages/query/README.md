# `@peer-rtc/query`

Shared TanStack Query client and router factory for Peer RTC apps.

`createQueryRouter(routeTree)` builds a QueryClient (60s stale time), a TanStack
Router with that client on `context`, and SSR query integration.

```ts
import { createQueryRouter } from "@peer-rtc/query";
import type { QueryRouterContext } from "@peer-rtc/query";

import { routeTree } from "./routeTree.gen";

export const getRouter = () => createQueryRouter(routeTree);
```

Root routes should use `createRootRouteWithContext<QueryRouterContext>()`.

## Scripts

From the repo root:

```bash
vp run @peer-rtc/query#build
vp run @peer-rtc/query#test
vp run @peer-rtc/query#check
```

Watch the packed library:

```bash
vp run @peer-rtc/query#dev
```
