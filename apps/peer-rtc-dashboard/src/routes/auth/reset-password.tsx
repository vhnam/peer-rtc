import { createFileRoute } from '@tanstack/react-router';

import ResetPassword from '#/modules/auth/reset-password';

type ResetPasswordSearch = {
  token?: string;
  error?: string;
};

export const Route = createFileRoute('/auth/reset-password')({
  validateSearch: (search: Record<string, unknown>): ResetPasswordSearch => ({
    token: typeof search.token === 'string' ? search.token : undefined,
    error: typeof search.error === 'string' ? search.error : undefined,
  }),
  component: ResetPasswordRoute,
});

function ResetPasswordRoute() {
  const { token, error } = Route.useSearch();

  return <ResetPassword token={token ?? ''} tokenError={error} />;
}
