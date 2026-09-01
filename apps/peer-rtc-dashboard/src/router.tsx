import { createQueryRouter } from '@peer-rtc/query';

import '#/lib/auth-client';

import { routeTree } from './routeTree.gen';

export function getRouter() {
  return createQueryRouter(routeTree);
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
