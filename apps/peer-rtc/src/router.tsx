import { createQueryRouter } from '@peer-rtc/query';

import { routeTree } from './routeTree.gen';

export function getRouter() {
  return createQueryRouter(routeTree);
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
