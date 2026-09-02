import type { PropsWithChildren } from 'react';

import { SidebarInset, SidebarProvider } from '@peer-rtc/ui/components/sidebar';

import { ProtectedLayoutHeader } from './protected-layout-header';
import { ProtectedLayoutSidebar } from './protected-layout-sidebar';

export default function ProtectedLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <ProtectedLayoutSidebar />
      <SidebarInset className="min-w-0">
        <ProtectedLayoutHeader />
        <div className="min-w-0 flex-1 px-4 pb-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
