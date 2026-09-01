import type { PropsWithChildren } from 'react';

import { SidebarInset, SidebarProvider } from '@peer-rtc/ui/components/sidebar';

import { AppSidebar } from './app-sidebar';
import { ProtectedLayoutHeader } from './protected-layout-header';

export default function ProtectedLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <ProtectedLayoutHeader />
        <div className="min-w-0 flex-1 px-4 pb-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
