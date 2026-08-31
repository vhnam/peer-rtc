import { createPeerAuthClient } from '@peer-rtc/auth';

import { env } from '#/env';

export const authClient = createPeerAuthClient(env.VITE_PUBLIC_AUTH_URL);
