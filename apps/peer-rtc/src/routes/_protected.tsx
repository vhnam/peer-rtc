import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { getAuthClient } from '@peer-rtc/auth';

import ProtectedLayout from '#/layouts/protected-layout';

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
  return (
    <ProtectedLayout>
      <Outlet />
    </ProtectedLayout>
  );
}
