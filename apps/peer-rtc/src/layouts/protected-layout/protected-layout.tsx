import type { PropsWithChildren } from 'react';

import { ProtectedLayoutHeader } from './protected-layout-header';

export const ProtectedLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <ProtectedLayoutHeader />
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
};
