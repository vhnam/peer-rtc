import { createEnv } from '@t3-oss/env-core';
import * as v from 'valibot';

export const env = createEnv({
  clientPrefix: 'VITE_',
  client: {
    VITE_PUBLIC_APP_URL: v.pipe(v.string(), v.minLength(1), v.url()),
    VITE_PUBLIC_AUTH_URL: v.pipe(v.string(), v.minLength(1), v.url()),
  },
  runtimeEnv: {
    VITE_PUBLIC_APP_URL: import.meta.env.VITE_PUBLIC_APP_URL,
    VITE_PUBLIC_AUTH_URL: import.meta.env.VITE_PUBLIC_AUTH_URL,
  },
  emptyStringAsUndefined: true,
  skipValidation: process.env.SKIP_ENV_VALIDATION === '1',
});
