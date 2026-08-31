import { createAuthClient } from 'better-auth/react';

import { env } from '#/env';

export const authClient = createAuthClient({
  // Dev: same-origin so the Vite HTTPS proxy forwards /api/auth to the
  // auth server (avoids Chrome ERR_SSL_PROTOCOL_ERROR on the BE self-signed cert).
  baseURL: import.meta.env.DEV ? env.VITE_PUBLIC_APP_URL : env.VITE_PUBLIC_AUTH_URL,
  fetchOptions: {
    credentials: 'include',
  },
});
