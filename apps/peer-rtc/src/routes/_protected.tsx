import { Outlet, createFileRoute, redirect, useMatchRoute } from '@tanstack/react-router';

import { getAuthClient } from '@peer-rtc/auth';

import { ProtectedLayout } from '#/layouts/protected-layout';
import { useSocketConnection } from '#/lib/socket-client';
import { ProviderJoinedDialog } from '#/modules/consult-requests/provider-joined-dialog';

export const Route = createFileRoute('/_protected')({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await getAuthClient().getSession();
    if (!data?.user) {
      throw redirect({ to: '/auth/login' });
    }

    return { user: data.user };
  },
  component: ProtectedRoute,
});

function ProtectedRoute() {
  const matchRoute = useMatchRoute();
  const isHome = Boolean(matchRoute({ to: '/' }));
  const shouldConnectSocket = isHome || Boolean(matchRoute({ to: '/$roomId' }));

  useSocketConnection(shouldConnectSocket);

  return (
    <ProtectedLayout>
      <Outlet />
      <ProviderJoinedDialog enabled={isHome} />
    </ProtectedLayout>
  );
}
